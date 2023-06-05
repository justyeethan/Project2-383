from flask import Flask
from app.config import Config

app = Flask(__name__) # Init the flask app
app.config.from_object(Config) # Sets config object from config.py
app.debug = True # Debug is live

from app import routes # Initializes all files from app DO NOT MOVE TO TOP OF FILE
