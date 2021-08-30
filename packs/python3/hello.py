from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Test endpoints: /welcome & /hello</p>"

@app.route("/welcome")
def welcome():
    return "<p>Welcome!</p>"

@app.route("/hello")
def hello():
    return "<p>Hello!</p>"