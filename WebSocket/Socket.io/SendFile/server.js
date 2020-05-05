const express = require('express');
const fs = require('fs');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.raw({limit:"100mb"}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/file-upload', (req, res) => {
    console.log("get data")
    //console.log(req.body)
    //console.log(req.body.toString())
    //fs.writeFileSync("./test.gcode", req.body);
    io.emit('chat message', "get data")
    io.emit('get data', req.body)
    res.send("ok");
});

app.post('/stop-print', (req, res) => {
    io.emit('stop print', "STOP")
    res.send("ok");
});

app.post('/start-print', (req, res) => {
    io.emit('start print', "START")
    res.send("ok");
});


io.on('connection', (socket)=>{
    console.log('a user connected');
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
