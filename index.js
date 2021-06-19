const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
});

var connections = {};
io.on('connection', (socket) => {
    var id = socket.id;
    connections[id] = id;
    socket.broadcast.emit('chat message','new user joined default name : '+connections[id]);
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message',connections[id] +' : '+ msg);
    });
    socket.on('change name',(msg)=>{
        io.emit('chat message',connections[id]+" changed name to "+msg);
        connections[id]=msg;
    });
    socket.on('disconnect',function(){
        io.emit('chat message', connections[id]+' disconnected ');
        delete connections[id];
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});