from __future__ import annotations

import random
from typing import Dict, List, Tuple

from pymongo import MongoClient
from dotenv import load_dotenv
import tensorflow as tf
import numpy as np
import os
from bson import ObjectId, json_util
import pandas as pd
from flask import Flask, request, jsonify, abort
from flask_cors import cross_origin


# Load environment variables.
load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["test"]
blogpost_collection = db["blogposts"]
user_collection = db["users"]

data = blogpost_collection.find({"user_id": {"$exists": True}, "likes": {"$exists": True}, "dislikes": {"$exists": True}, "date_posted": {"$exists": True}}, 
                              {"_id": 1, "user_id": 1, "date_posted": 1, "likes": 1, "dislikes": 1}).to_list()
print(data[0])
for i in range(len(data)):
    if "68368e225d48ed86e960faf0" == str(data[i]["user_id"]):
        print("Found biteclub504")
    data[i]["likes"] = data[i]["likes"]["count"] if "count" in data[i]["likes"] else 0
    data[i]["dislikes"] = data[i]["dislikes"]["count"] if "count" in data[i]["dislikes"] else 0



# -----------------------------------------------------------------------------
# -------- Load / preprocess interaction data ----------------------------------
# -----------------------------------------------------------------------------

def _listdict_to_df(raw: List[dict]) -> pd.DataFrame:
    """Validate & convert list‑of‑dict interactions into DataFrame."""
    required = {"user_id", "_id", "likes", "dislikes", "date_posted"}
    df = pd.DataFrame(raw)
    if not required.issubset(df.columns):
        raise ValueError(f"data missing columns: {required - set(df.columns)}")
    df["user_id"] = df["user_id"].astype(str)
    # Compute smoothed rating in [0,1]
    df = df.assign(
        rating=(df["likes"] + 1) / (df["likes"] + df["dislikes"] + 2)
    )
    df["date_posted"] = pd.to_datetime(df["date_posted"], errors="coerce")
    return df


def _encode_ids(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict, Dict]:
    """Map raw user/post IDs to contiguous ints."""
    user_ids = df["user_id"].unique().tolist()
    _ids = df["_id"].unique().tolist()
    user2idx = {u: i for i, u in enumerate(user_ids)}
    post2idx = {p: j for j, p in enumerate(_ids)}
    df = df.assign(
        user_idx=df["user_id"].map(user2idx).astype(np.int32),
        item_idx=df["_id"].map(post2idx).astype(np.int32),
    )
    return df, user2idx, post2idx


def _train_test_split(df: pd.DataFrame, test_frac: float = 0.2, seed: int = 42):
    rng = np.random.default_rng(seed)
    mask = rng.random(len(df)) >= test_frac
    return df[mask], df[~mask]


def _make_ds(df: pd.DataFrame, batch: int = 1024, shuffle: bool = True):
    X = df[["user_idx", "item_idx"]].to_numpy(np.int32)
    y = df["rating"].to_numpy(np.float32)
    ds = tf.data.Dataset.from_tensor_slices((X, y))
    if shuffle:
        ds = ds.shuffle(len(df), reshuffle_each_iteration=True)
    return ds.batch(batch).prefetch(tf.data.AUTOTUNE)

# -----------------------------------------------------------------------------
# -------- Model ----------------------------------------------------------------
# -----------------------------------------------------------------------------

class MFRecommender(tf.keras.Model):
    def __init__(self, n_users: int, n_items: int, d: int = 64):
        super().__init__()
        reg = tf.keras.regularizers.l2(1e-6)
        self.u_emb = tf.keras.layers.Embedding(n_users, d, embeddings_initializer="he_normal", embeddings_regularizer=reg)
        self.i_emb = tf.keras.layers.Embedding(n_items, d, embeddings_initializer="he_normal", embeddings_regularizer=reg)
        self.u_bias = tf.keras.layers.Embedding(n_users, 1)
        self.i_bias = tf.keras.layers.Embedding(n_items, 1)

    def call(self, x):
        u = self.u_emb(x[:, 0])
        i = self.i_emb(x[:, 1])
        dot = tf.reduce_sum(u * i, axis=1, keepdims=True)
        return tf.squeeze(dot + self.u_bias(x[:, 0]) + self.i_bias(x[:, 1]), axis=1)

# -----------------------------------------------------------------------------
# -------- Training -------------------------------------------------------------
# -----------------------------------------------------------------------------

def _train_model(df: pd.DataFrame, d: int = 64, epochs: int = 10, lr: float = 1e-3):
    df, user2idx, post2idx = _encode_ids(df)
    tr, te = _train_test_split(df)
    tr_ds = _make_ds(tr, shuffle=True)
    te_ds = _make_ds(te, shuffle=False)
    model = MFRecommender(len(user2idx), len(post2idx), d)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(lr),
        loss=tf.keras.losses.MeanSquaredError(),
        metrics=[tf.keras.metrics.RootMeanSquaredError(name="rmse")],
    )
    model.fit(tr_ds, validation_data=te_ds, epochs=epochs, verbose=0)
    _, rmse = model.evaluate(te_ds, verbose=0)
    print(f"[Recommender] Trained – Test RMSE = {rmse:.4f}")
    return model, user2idx, post2idx, df


# -----------------------------------------------------------------------------
# -------- Inference ------------------------------------------------------------
# -----------------------------------------------------------------------------

def _recommend(model: MFRecommender, user_id, user2idx, post2idx, df_full, top_k: int = 10):
    if user_id not in user2idx:
        raise KeyError(f"Unknown user_id {user_id}")
    u_idx = user2idx[user_id]
    seen = set(df_full[df_full["user_id"] == user_id]["_id"])
    unseen_posts = [pid for pid in post2idx if pid not in seen]
    u_vec = np.full(len(unseen_posts), u_idx, np.int32)
    i_vec = np.array([post2idx[p] for p in unseen_posts], np.int32)
    preds = model.predict(np.stack([u_vec, i_vec], axis=1), batch_size=4096, verbose=0)
    best = np.argsort(preds)[-top_k:][::-1]
    return [{"_id": unseen_posts[i], "score": float(preds[i])} for i in best]

# -----------------------------------------------------------------------------
# -------- Globals: train once at import ---------------------------------------
# -----------------------------------------------------------------------------

_df_interactions = _listdict_to_df(data)
_model, _u2i, _p2i, _df_interactions = _train_model(_df_interactions, epochs=5)

# Build unique posts DataFrame for /posts endpoint
_posts_df = (
    _df_interactions[["_id", "date_posted"]]
    .drop_duplicates(subset="_id")
    .sort_values("date_posted", ascending=False)
    .reset_index(drop=True)
)

# -----------------------------------------------------------------------------
# -------- Flask app -----------------------------------------------------------
# -----------------------------------------------------------------------------

app = Flask(__name__)

@app.route("/blogposts/recommend", methods=["POST"])
@cross_origin()
def blogpost_recommend_endpoint():
    supabase_id = request.json["supabaseId"]
    user_id = str(user_collection.find_one({"supabaseId": supabase_id})["_id"])
    print(user_id)
    print(user_id)
    # Cast to int if possible; else leave as str
    try:
        user_id_cast = int(user_id)
    except ValueError:
        user_id_cast = user_id
    top_k = int(request.args.get("top_k", 10))
    try:
        recs = _recommend(_model, user_id_cast, _u2i, _p2i, _df_interactions, top_k)
    except KeyError:
        return jsonify({"error": "unknown user"}), 404
    
    out = blogpost_collection.find({"_id": {"$in": [ObjectId(rec["_id"]) for rec in recs]}}).to_list()
    return json_util.dumps(out)


@app.route("/blogposts/posts")
@cross_origin()
def posts_endpoint():
    limit = int(request.args.get("limit", 20))
    offset = int(request.args.get("offset", 0))
    slice_ = _posts_df.iloc[offset : offset + limit]
    # Convert date to ISO string
    recs = slice_.assign(date_posted=slice_["date_posted"].dt.strftime("%Y-%m-%d")).to_dict("records")
    recs = blogpost_collection.find({"_id": {"$in": [ObjectId(rec["_id"]) for rec in recs]}}).to_list()
    for i in range(len(recs)):
        recs[i]["_id"] = str(recs[i]["_id"])
    return json_util.dumps({"posts": recs, "totalCount": blogpost_collection.count_documents({})})


# -----------------------------------------------------------------------------
# -------- Helper for hot‑reloading new data -----------------------------------
# -----------------------------------------------------------------------------

def reload_data(new_data: List[dict], *, epochs: int = 5):
    """Replace global `data` and retrain model – useful in notebooks/tests."""
    global data, _model, _u2i, _p2i, _df_interactions, _posts_df
    data = new_data
    _df_interactions = _listdict_to_df(data)
    _model, _u2i, _p2i, _df_interactions = _train_model(_df_interactions, epochs=epochs)
    _posts_df = (
        _df_interactions[["_id", "date_posted"]]
        .drop_duplicates("_id")
        .sort_values("date_posted", ascending=False)
        .reset_index(drop=True)
    )
    print("[Recommender] Data reloaded & model retrained")


# -----------------------------------------------------------------------------
# -------- Main guard ----------------------------------------------------------
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    # Run Flask dev server
    app.run(debug=True)


# app = Flask(__name__)
# @app.route("/recommend", methods=["POST"])
# @cross_origin()
# def recommend_endpoint():
#     supabase_id = request.json["supabaseId"]
#     user_id = str(user_collection.find_one({"supabaseId": supabase_id})["_id"])
#     print(user_id)
#     recs = recommend(config['model'], user_id, config['user2idx'], config['item2idx'], df, top_k=config['top_k'])
#     print()
#     recs = restaurant_collection.find({"_id": {"$in": [ObjectId(rec[0]) for rec in recs]}}).to_list()
#     print(recs[0])
#     for i in range(len(recs)):
#         recs[i]["_id"] = str(recs[i]["_id"])
#     return json_util.dumps({'recommendations':recs})

# # -----------------------------------------------------------------------------
# # Self‑test with synthetic data if executed directly (optional)
# # -----------------------------------------------------------------------------
# if __name__ == "__main__":
#     demo(df, epochs=3, top_k=5)
#     app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)
    
