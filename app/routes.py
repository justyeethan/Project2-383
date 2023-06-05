from app import app
from flask import render_template, request, jsonify, json
from app.nw import main as nw_main
from app.sw import main as sw_main


@app.route('/')
@app.route('/index')
def index():
    """Route handling in Python

    Returns:
        template: html file to be rendered
    """
    return render_template('index.html')


# API Routes for backend
@app.route('/api/v1/smith-waterman/<seq1>/<seq2>')
def smith_waterman(seq1, seq2):
    """ Route to handle the API call for Smith Waterman

    Returns:
        JSON: Requested data
    """
    gap = request.args.get('gap', default=-2)
    match = request.args.get('match', default=1)
    mismatch = request.args.get('mismatch', default=-1)
    data = sw_main(str(seq1), str(seq2), int(gap), int(match), int(mismatch))
    res = jsonify(data)

    return res


@app.route('/api/v1/needleman-wunsch/<seq1>/<seq2>')
def needleman_wunsch(seq1, seq2):
    gap = request.args.get('gap', default=-2)
    match = request.args.get('match', default=1)
    mismatch = request.args.get('mismatch', default=-1)
    data = nw_main(str(seq1), str(seq2), int(gap), int(match), int(mismatch))
    res = jsonify(data)

    return res
