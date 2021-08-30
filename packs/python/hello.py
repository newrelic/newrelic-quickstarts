from flask import Flask 

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/welcome')
def cloudenablers():
    return 'Welcome route!'

@app.route('/hello')
def hello():
    return 'Hello route!'

if __name__ == "__main__":
    app.run()
