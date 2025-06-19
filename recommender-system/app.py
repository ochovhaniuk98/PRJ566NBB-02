from __future__ import annotations

import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify, abort
from flask_cors import CORS, cross_origin

# ----------------------------------------------------------------------
# 1.  Synthetic “historical” data to pre-train the item embeddings
# ----------------------------------------------------------------------
#  15 restaurants,  5 historical users, 50 ratings  (user_id, item_id, rating)
_ratings = np.array([
    # user 0
    [0, 0, 4], [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5],
    [0, 5, 3], [0, 6, 2], [0, 7, 4], [0, 8, 3], [0, 9, 4],
    # user 1
    [1, 0, 3], [1, 1, 4], [1, 2, 2], [1, 3, 3], [1, 4, 2],
    [1, 5, 4], [1, 6, 5], [1, 7, 3], [1, 8, 4], [1, 9, 2],
    # user 2
    [2,10, 5], [2,11, 4], [2,12, 5], [2,13, 3], [2,14, 4],
    [2, 0, 2], [2, 2, 4], [2, 5, 3], [2, 8, 4], [2, 6, 3],
    # user 3
    [3, 1, 5], [3, 3, 4], [3, 4, 4], [3, 6, 2], [3, 7, 5],
    [3,10, 3], [3,11, 3], [3,12, 4], [3,13, 2], [3,14, 3],
    # user 4
    [4, 0, 1], [4, 2, 2], [4, 3, 2], [4, 5, 2], [4, 6, 1],
    [4,10, 4], [4,11, 5], [4,12, 4], [4,13, 5], [4,14, 4],
], dtype=np.int32)

# Our restaurant catalogue (index ⇒ name).  Add / remove freely — just keep the
# length in sync with num_items below.
_RESTAURANTS = [
    "Kung Fu Tea (Broadview)",
    "Burger's Priest (Yonge & Eglinton)",
    "Sushi Zone",
    "TAQUERIA EL PASTORCITO",
    "Kinka Izakaya",
    "Planta Queen",
    "Fresh on Spadina",
    "Pizza Nova",
    "Paramount Fine Foods",
    "Pizzeria Libretto",
    "Pho Tien Thanh",
    "The Keg",
    "Dim Sum King",
    "Banh Mi Boys",
    "Khao San Road",
]
_NAME_TO_ID = {name: idx for idx, name in enumerate(_RESTAURANTS)}

num_users:  int = _ratings[:, 0].max() + 1          # 5
num_items:  int = len(_RESTAURANTS)                  # 15
latent_dim: int = 8                                  # embedding size
global_mean: float = _ratings[:, 2].mean()           # ~3.3

# ----------------------------------------------------------------------
# 2.  Prepare tf.data.Dataset
# ----------------------------------------------------------------------
x_train = _ratings[:, :2]                            # user_id, item_id
y_train = _ratings[:, 2].astype(np.float32)

train_ds = (tf.data.Dataset
              .from_tensor_slices((x_train, y_train))
              .shuffle(buffer_size=len(_ratings))
              .batch(16))

# ----------------------------------------------------------------------
# 3.  Matrix-factorisation model
# ----------------------------------------------------------------------
class MF(tf.keras.Model):
    def __init__(self, n_users: int, n_items: int, k: int):
        super().__init__()
        self.user_emb  = tf.keras.layers.Embedding(n_users, k,
                            embeddings_initializer="he_normal")
        self.item_emb  = tf.keras.layers.Embedding(n_items, k,
                            embeddings_initializer="he_normal")
        self.user_bias = tf.keras.layers.Embedding(n_users, 1,
                            embeddings_initializer="zeros")
        self.item_bias = tf.keras.layers.Embedding(n_items, 1,
                            embeddings_initializer="zeros")

    def call(self, inputs: tf.Tensor) -> tf.Tensor:
        """inputs: shape (batch, 2) with columns [user_id, item_id]."""
        u, i = inputs[:, 0], inputs[:, 1]
        dot   = tf.reduce_sum(self.user_emb(u) * self.item_emb(i), axis=1)
        b_u   = tf.squeeze(self.user_bias(u), axis=1)
        b_i   = tf.squeeze(self.item_bias(i), axis=1)
        return dot + b_u + b_i + global_mean               # final prediction


# ----------------------------------------------------------------------
# 4.  Train once on start-up
# ----------------------------------------------------------------------
model = MF(num_users, num_items, latent_dim)
model.compile(optimizer=tf.keras.optimizers.Adam(2e-2),
              loss="mse",
              metrics=[tf.keras.metrics.RootMeanSquaredError()])

model.fit(train_ds, epochs=30, verbose=0)   # quick, just to set item factors

# Extract trained item factors & biases for fast numpy math in each request
_item_vecs:   np.ndarray = model.item_emb.get_weights()[0]        # (num_items, k)
_item_bias:   np.ndarray = model.item_bias.get_weights()[0].ravel()  # (num_items,)

# ----------------------------------------------------------------------
# 5.  Cold-start user-vector constructor
# ----------------------------------------------------------------------
def _build_user_vector(rated: list[tuple[int, float]]) -> np.ndarray:
    """
    Simple heuristic: centre ratings at global_mean, weight each item vector by
    (rating - global_mean), then L2-normalise.  Handles empty input gracefully.
    """
    if not rated:
        return np.zeros(latent_dim, dtype=np.float32)

    numer = np.zeros(latent_dim, dtype=np.float32)
    denom = 1e-6
    for item_id, rating in rated:
        weight = float(rating) - global_mean
        numer += weight * _item_vecs[item_id]
        denom += abs(weight)
    return numer / denom


def _predict_scores(user_vec: np.ndarray,
                    rated_items: set[int],
                    top_n: int = 5) -> list[str]:
    """
    Compute score = global_mean + user_vec·item_vec + item_bias
    for all items not yet rated, return the top N names.
    """
    all_ids = np.arange(num_items, dtype=np.int32)
    mask    = np.isin(all_ids, list(rated_items), invert=True)
    candidates = all_ids[mask]

    if candidates.size == 0:
        return []

    dots = _item_vecs[candidates] @ user_vec
    preds = global_mean + dots + _item_bias[candidates]
    top_indices = np.argsort(-preds)[:top_n]   # descending
    return [_RESTAURANTS[candidates[i]] for i in top_indices]

# ----------------------------------------------------------------------
# 6.  Flask app
# ----------------------------------------------------------------------
app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
@cross_origin()
def recommend_endpoint():
    data = request.get_json(silent=True)
    if data is None:
        abort(400, "'application/json' body required")

    # ------------------------------------------------------------------
    # 6a.  Parse ratings — mandatory
    # ------------------------------------------------------------------
    if "ratings" not in data or not isinstance(data["ratings"], list):
        abort(400, "Provide a 'ratings' list: "
                   "[{'restaurant': name, 'rating': 1-5}, ...]")

    rated_pairs: list[tuple[int, float]] = []
    already_rated: set[int] = set()

    for entry in data["ratings"]:
        if (not isinstance(entry, dict)
                or "restaurant" not in entry
                or "rating"     not in entry):
            abort(400, "Each rating must have 'restaurant' & 'rating' fields.")

        name   = entry["restaurant"]
        if name not in _NAME_TO_ID:
            abort(400, f"Unknown restaurant: {name!r}")

        rating = entry["rating"]
        try:
            rating = float(rating)
        except (ValueError, TypeError):
            abort(400, f"Rating for {name!r} must be numeric")

        if not 1.0 <= rating <= 5.0:
            abort(400, f"Rating for {name!r} must be between 1 and 5")

        item_id = _NAME_TO_ID[name]
        rated_pairs.append((item_id, rating))
        already_rated.add(item_id)

    # ------------------------------------------------------------------
    # 6b.  Build cold-start user vector
    # ------------------------------------------------------------------
    user_vec = _build_user_vector(rated_pairs)

    # ------------------------------------------------------------------
    # 6c.  Produce recommendations
    # ------------------------------------------------------------------
    recs = _predict_scores(user_vec, already_rated, top_n=5)
    return jsonify(recommendations=recs)

# ----------------------------------------------------------------------
if __name__ == "__main__":
    # Flask’s default reloader can create duplicate trainers; disable it.
    app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)

