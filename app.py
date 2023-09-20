##### Import Dependencies ################

import numpy as np
import sqlalchemy
from flask_cors import CORS
from flask import Flask, jsonify,render_template
import json
import pandas as pd

##### Database Set-up ##########

def create_engine():
    # Replace with your actual database credentials
    engine = sqlalchemy.create_engine("sqlite:///data/youtube_db.db")
    return engine

####### Flask Set-Up ##############

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data/youtube_db.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)


#################################
######## URLs SETUP#############
################################

@app.route("/")
def home():
    return render_template("index.html")

@app.route('/toplist')
def line_chart():
    return render_template("top_list.html")

@app.route('/bubblechart')
def bar_chart():
    return render_template("bubble_chart.html")

@app.route('/geomap1')
def geo_map1():
    return render_template("geo_map1.html")

@app.route('/geomap2')
def geo_map2():
    return render_template("geo_map2.html")

@app.route('/youtube-data-json',methods=['GET'])
def get_data():
    engine= create_engine()
    df = pd.read_sql_table('youtube_table', engine)
   
    response = jsonify(df.to_dict(orient='records'))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response 

if __name__ == "__main__":
    app.run()