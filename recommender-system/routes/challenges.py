from __future__ import annotations

from together import Together
from pymongo import MongoClient
from dotenv import load_dotenv
# import tensorflow as tf
import numpy as np
import os
from bson import ObjectId, json_util
import pandas as pd
from flask import Blueprint
from flask_cors import cross_origin
import json
# Load environment variables.
load_dotenv()


togetherClient = Together()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["test"]
restaurant_collection = db["restaurants"]

all_cuisines = restaurant_collection.distinct("cuisines")
print(all_cuisines)
messages = [
    {"role": "system", "content": 'Return ONLY JSON like {"selections": [<4 exact items from the list>]}.'},
    {"role": "user", "content": f'Pick the one which the user should try out.\nitems = {all_cuisines}'},
]

    
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


challenges_bp = Blueprint('challenges', __name__)
@challenges_bp.route("/challenges/recommend", methods=["POST"])
@cross_origin()
def recommend_endpoint():
    print("On")
    resp = togetherClient.chat.completions.create (
    model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
    messages=messages)
    selections = json.loads(resp.choices[0].message.content)["selections"]
# )
    
#     supabase_id = request.json["supabaseId"]
#     user_id = str(user_collection.find_one({"supabaseId": supabase_id})["_id"])
#     print(user_id)
#     recs = recommend(config['model'], user_id, config['user2idx'], config['item2idx'], df, top_k=config['top_k'])
#     print()
#     recs = restaurant_collection.find({"_id": {"$in": [ObjectId(rec[0]) for rec in recs]}}).to_list()
#     print(recs[0])
#     for i in range(len(recs)):
#         recs[i]["_id"] = str(recs[i]["_id"])
    recommendations = {}
    for selection in selections:
        cursor = restaurant_collection.find(
        {"cuisines": selection},
        {"_id": 1}
        ).limit(5)
        recommendations[selection] = [doc["_id"] for doc in cursor]
   
    return json_util.dumps(recommendations)