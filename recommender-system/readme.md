# Starting the server locally
- Create a .env file with the following variables.  
MONGO_URI = [YOUR MONGO URI]  
TOGETHER_API_KEY = [YOUR TOGETHER API KEY]  
- Navigate to the recommender_system in the terminal.
- Create a virtual environment: python -m venv .venv
- Activate the virtual environment: .venv/scipts/activate
- Install the requirements: pip install -r requirements.txt
- Start the application: python3 app.py

# Deploying the server to Heroku
This assumes that the the application has already been created on heroku. If not, see https://devcenter.heroku.com/articles/build-docker-images-heroku-yml#setup-define-your-app-s-environment  
- Navigate to recommender-system
- Commit any changes that have been made
- Push the updates to heroku using: git push heroku master
- Heroku will attempt to build the docker container and push it to heroku.
