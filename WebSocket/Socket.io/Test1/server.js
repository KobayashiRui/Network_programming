const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket)=>{
    console.log('a user connected');
    console.log(socket.request)
    //console.log(socket.handshake)
    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    })
    socket.on('chat message', (msg)=>{
        console.log('message:' + msg);
        //ブロードキャスト
        io.emit('chat message', msg)
    })
})


http.listen(3000, () => console.log('Example app listening on port 3000!'))
