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
from blogposts import app

# Load environment variables.
load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["test"]
review_collection = db["internalreviews"]
restaurant_collection = db["restaurants"]
user_collection = db["users"]
config = {}

data = review_collection.find({"user_id": {"$exists": True}, "restaurant_id": {"$exists": True}, "rating": {"$exists": True}}, 
                              {"_id": 0, "user_id": 1, "restaurant_id": 1, "rating": 1}).to_list()
df = pd.DataFrame(data)                      # data is the list you showed
df['user_id'] = df['user_id'].astype(str)    # ObjectId → string
df['restaurant_id'] = df['restaurant_id'].astype(str)

def _listdict_to_df(data: List[dict]) -> pd.DataFrame:
    """Convert list‑of‑dict ratings into a validated DataFrame."""
    if not isinstance(data, list):
        raise TypeError("`data` must be a list of dicts.")
    df = pd.DataFrame(data)
    required = {"user_id", "restaurant_id", "rating"}
    if not required.issubset(df.columns):
        missing = required - set(df.columns)
        raise ValueError(f"data missing required keys: {missing}")
    return df


def _encode_ids(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict, Dict]:
    """Encode raw user/restaurant IDs as contiguous ints starting at 0."""
    user_ids = df["user_id"].unique().tolist()
    item_ids = df["restaurant_id"].unique().tolist()

    user2idx = {u: i for i, u in enumerate(user_ids)}
    item2idx = {i: j for j, i in enumerate(item_ids)}

    df = df.assign(
        user_idx=df["user_id"].map(user2idx).astype(np.int32),
        item_idx=df["restaurant_id"].map(item2idx).astype(np.int32),
    )
    return df, user2idx, item2idx


def _train_test_split(
    df: pd.DataFrame, test_fraction: float = 0.2, seed: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Random row‑level split (reproducible via `seed`)."""
    rng = np.random.default_rng(seed)
    mask = rng.random(len(df)) >= test_fraction
    return df[mask], df[~mask]


def _make_dataset(
    df: pd.DataFrame, batch_size: int = 1024, shuffle: bool = True
) -> tf.data.Dataset:
    """Convert DataFrame to `(features, label)` batches for tf.data."""
    X = df[["user_idx", "item_idx"]].to_numpy(dtype=np.int32)
    y = df["rating"].to_numpy(dtype=np.float32)

    ds = tf.data.Dataset.from_tensor_slices((X, y))
    if shuffle:
        ds = ds.shuffle(buffer_size=len(df), reshuffle_each_iteration=True)
    return ds.batch(batch_size).prefetch(tf.data.AUTOTUNE)


# -----------------------------------------------------------------------------
# Model definition
# -----------------------------------------------------------------------------

class MFRecommender(tf.keras.Model):
    """Matrix‑factorisation with per‑user & per‑item bias."""

    def __init__(self, num_users: int, num_items: int, embedding_dim: int = 64):
        super().__init__()
        reg = tf.keras.regularizers.l2(1e-6)
        self.user_emb = tf.keras.layers.Embedding(
            num_users, embedding_dim, embeddings_initializer="he_normal", embeddings_regularizer=reg
        )
        self.item_emb = tf.keras.layers.Embedding(
            num_items, embedding_dim, embeddings_initializer="he_normal", embeddings_regularizer=reg
        )
        self.user_bias = tf.keras.layers.Embedding(num_users, 1)
        self.item_bias = tf.keras.layers.Embedding(num_items, 1)

    def call(self, x: tf.Tensor) -> tf.Tensor:  # x.shape == (batch, 2)
        u = self.user_emb(x[:, 0])
        i = self.item_emb(x[:, 1])
        dot = tf.reduce_sum(u * i, axis=1, keepdims=True)
        b_u = self.user_bias(x[:, 0])
        b_i = self.item_bias(x[:, 1])
        return tf.squeeze(dot + b_u + b_i, axis=1)


# -----------------------------------------------------------------------------
# Training / inference helpers
# -----------------------------------------------------------------------------

def train_model(
    df: pd.DataFrame,
    embedding_dim: int = 64,
    epochs: int = 10,
    batch_size: int = 1024,
    lr: float = 1e-3,
) -> Tuple[MFRecommender, Dict, Dict, float]:
    """Train and validate the model; return test RMSE."""

    df, user2idx, item2idx = _encode_ids(df)
    train_df, test_df = _train_test_split(df)

    train_ds = _make_dataset(train_df, batch_size, shuffle=True)
    test_ds = _make_dataset(test_df, batch_size, shuffle=False)

    model = MFRecommender(len(user2idx), len(item2idx), embedding_dim)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(lr),
        loss=tf.keras.losses.MeanSquaredError(),
        metrics=[tf.keras.metrics.RootMeanSquaredError(name="rmse")],
    )
    model.fit(train_ds, validation_data=test_ds, epochs=epochs, verbose=2)

    _, rmse = model.evaluate(test_ds, verbose=0)
    print(f"Test RMSE: {rmse:.4f}")
    return model, user2idx, item2idx, rmse


def recommend(
    model: MFRecommender,
    user_id_raw: str | int,
    user2idx: Dict,
    item2idx: Dict,
    df_full: pd.DataFrame,
    top_k: int = 10,
) -> List[Tuple[str | int, float]]:
    """Return Top‑K *(restaurant_id, predicted_rating)* for **unseen** restaurants."""

    if user_id_raw not in user2idx:
        raise ValueError(f"Unknown user_id: {user_id_raw}")

    user_idx = user2idx[user_id_raw]
    seen_items = set(df_full[df_full["user_id"] == user_id_raw]["restaurant_id"])
    unseen_items = [iid for iid in item2idx.keys() if iid not in seen_items]

    user_vec = np.full(len(unseen_items), user_idx, dtype=np.int32)
    item_vec = np.array([item2idx[i] for i in unseen_items], dtype=np.int32)

    preds = model.predict(np.stack([user_vec, item_vec], axis=1), batch_size=4096, verbose=0)
    best = np.argsort(preds)[-top_k:][::-1]
    return [(unseen_items[i], float(preds[i])) for i in best]


# -----------------------------------------------------------------------------
# Public convenience entry point
# -----------------------------------------------------------------------------

def demo(
    df: any,
    *,
    embedding_dim: int = 64,
    epochs: int = 10,
    batch_size: int = 1024,
    lr: float = 1e-3,
    top_k: int = 10,
    seed: int = 42,
) -> Tuple[MFRecommender, Dict[str, Dict]]:
    """Train on `data` and print sample recommendations for a random user.

    Returns
    -------
    model : MFRecommender
    encode : dict with keys `user2idx`, `item2idx`
    """

    model, user2idx, item2idx, _ = train_model(
        df,
        embedding_dim=embedding_dim,
        epochs=epochs,
        batch_size=batch_size,
        lr=lr,
    )

    random.seed(seed)
    config["model"] = model
    config["user2idx"] = user2idx
    config["item2idx"] = item2idx
    config["top_k"] = top_k
    # random_user = random.choice(df["user_id"].unique().tolist())
    # recs = recommend(model, random_user, user2idx, item2idx, df, top_k=top_k)

    # print(f"\nTop‑{top_k} recommendations for user {random_user}:")
    # for rank, (rest_id, score) in enumerate(recs, start=1):
    #     print(f"  {rank:2d}. Restaurant {rest_id}  (predicted rating = {score:.2f})")

    return model, {"user2idx": user2idx, "item2idx": item2idx}

@app.route("/restaurants/recommend", methods=["POST"])
@cross_origin()
def restaurant_recommend_endpoint():
    supabase_id = request.json["supabaseId"]
    user_id = str(user_collection.find_one({"supabaseId": supabase_id})["_id"])
    print(user_id)
    recs = recommend(config['model'], user_id, config['user2idx'], config['item2idx'], df, top_k=config['top_k'])
    print()
    recs = restaurant_collection.find({"_id": {"$in": [ObjectId(rec[0]) for rec in recs]}}).to_list()
    print(recs[0])
    for i in range(len(recs)):
        recs[i]["_id"] = str(recs[i]["_id"])
    return json_util.dumps({'recommendations':recs})

# -----------------------------------------------------------------------------
# Self‑test with synthetic data if executed directly (optional)
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    demo(df, epochs=3, top_k=5)
    app.run(host="0.0.0.0", port=5000, debug=True)
    
