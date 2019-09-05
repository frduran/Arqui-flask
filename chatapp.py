from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import time, datetime
import requests, json


app = Flask(__name__)

app.config['SECRET_KEY'] = 'dejwgdjhwegdhjwe'
socketio = SocketIO(app)
users={}

@app.route('/')
def index():
    return render_template('./index.html')

@socketio.on('connection')
def handle_connection(msg):
    print(str(msg)) 
    url = "https://api.chucknorris.io/jokes/random"
    response = requests.request("GET", url)
    text = json.loads(response.text) 
    value = text['value']
    print(value)
    socketio.emit('response',value)   

@socketio.on('response')
def response(value):
    print(value)
    


@socketio.on('send-message')
def send_message(msg):
    print("request",request.sid)
    time1 = time.time()
    format_time = datetime.datetime.fromtimestamp(time1).strftime('%Y-%m-%d %H:%M:%S')
    print(format_time)
    data = {'msg':msg, 'sender':users[request.sid], 'time':format_time}
    print("message {}".format(msg))
    socketio.emit("receive-message",data)


@socketio.on('receive-message')
def receive_message(json):
    print("json",str(json))


@socketio.on('user')
def user(username):
    print(username)
    users[request.sid] = username
    print(users)
    socketio.emit("response-username",[username, users])
    #socketio.send(json['user'], broadcast=True)


@socketio.on('response-username')
def response_username(lista):    
    print(lista)
    #socketio.send(json['user'], broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)

