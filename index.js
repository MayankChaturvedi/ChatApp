const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

const upload = require('express-fileupload');

app.use(upload());
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
});

app.post('/', function(req, res) {
    if(req.files){
        var file = req.files.file;
        var filename = file.name;
        file.mv('/Users/mayankchaturvedi/Development/ChatApp/ChatApp/uploads/'+filename,function(err){
            if(err){
                res.send("Upload failed, you might not have the required permission");
            }else{
                res.send("Upload Successful");
            }
        });
    }
    else{
        res.send("No file received");
    }
});

var connections = {};
io.on('connection', (socket) => {
    var id = Object.keys(connections).length;
    connections[id] = 'User'+id;
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