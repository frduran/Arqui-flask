from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import time
import datetime
import requests
import json


app = Flask(__name__)

app.config['SECRET_KEY'] = 'dejwgdjhwegdhjwe'
socketio = SocketIO(app, cors_allowed_origins="*")
users = {}


@app.route('/')
def index():
    return render_template('./index.html')


@socketio.on('connection')
def handle_connection(msg):
    print(str(msg))
    socketio.emit('response', 'ok')
    #url = "https://api.chucknorris.io/jokes/random"
    #response = requests.request("GET", url)
    #text = json.loads(response.text)
    #value = text['value']
    # print(value)
    # socketio.emit('response',value)


@socketio.on('response')
def response(value):
    print(value)


@socketio.on('tell-joke')
def joke():
    url = "https://n2sst0bbr8.execute-api.us-east-1.amazonaws.com/default/MyTestFunction"
    response = requests.request("GET", url)
    joke = response.text[1:-1]
    print(joke)
    socketio.emit('joke', joke)


@socketio.on('get-name')
def name():
    url = "https://n2sst0bbr8.execute-api.us-east-1.amazonaws.com/default/testFunction"
    response = requests.request("GET", url)
    name = response.text[1:-1]
    print(name)
    socketio.emit("name", name)


@socketio.on('send-message')
def send_message(msg):
    print(msg)
    # url = "https://n2sst0bbr8.execute-api.us-east-1.amazonaws.com/default/lastFunction"
    # response = requests.request('PUT', url, data=json.dumps({"message": msg}))
    # print(response.text)
    # msg = response.text[1:-1]
    print("request", request.sid)
    time1 = time.localtime()
    format_time = str(time1.tm_hour) + ':' + str(time1.tm_min) + ' ' + \
        str(time1.tm_mday) + '-' + str(time1.tm_mon) + '-' + str(time1.tm_year)
    #format_time = datetime.datetime.fromtimestamp(time1).strftime('%Y-%m-%d %H:%M:%S')
    print(format_time)
    data = {'msg': msg, 'sender': users[request.sid], 'time': format_time}
    print("message {}".format(msg))
    socketio.emit("receive-message", data)


@socketio.on('receive-message')
def receive_message(json):
    print("json", str(json))


@socketio.on('user')
def user(username):
    print(username)
    users[request.sid] = username
    print(users)
    socketio.emit("response-username", [username, users])


@socketio.on('response-username')
def response_username(lista):
    print(lista)


@socketio.on('disconnect')
def test_disconnect():
    print(request.sid, 'Client disconnected')
    username = users[request.sid]

    socketio.emit("disconnect-username", username)
    del users[request.sid]


if __name__ == '__main__':

    socketio.run(app, debug=True)
