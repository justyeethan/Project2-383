import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    """Configuration object for Flask and other extensions

    Args:
        object (_type_): Inherits from the object superclass
    """
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'base-secret-key-for-dev' # Secret key for sessions
    FLASK_ENV = 'development' # Sets the flask environment to development
