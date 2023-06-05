from app import app
from flask import render_template


@app.route('/')
@app.route('/index')
def index():
    """Route handling in Python

    Returns:
        template: html file to be rendered
    """
    return render_template('index.html')


# @app.route('smith-waterman')
# def smith_waterman():
#     """Route handling in Python

#     Returns:
#         template: html file to be rendered
#     """
#     return render_template('smith-waterman.html')