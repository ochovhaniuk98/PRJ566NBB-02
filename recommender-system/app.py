from routes.restaurants import restaurants_bp
from routes.challenges import challenges_bp
from routes.blogposts import blogposts_bp
from flask import Flask
import os

app = Flask(__name__)
app.register_blueprint(restaurants_bp)
app.register_blueprint(challenges_bp)
app.register_blueprint(blogposts_bp)
app.run('0.0.0.0', os.environ.get("PORT"), debug=True)