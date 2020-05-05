var io = require('socket.io-client');
const fs = require('fs');
var socket = io.connect('http://localhost:3000');
const SerialPort = require('@serialport/stream')
const MockBinding = require('@serialport/binding-mock')
const Readline = require('@serialport/parser-readline')

SerialPort.Binding = MockBinding

MockBinding.createPort('/dev/ROBOT', { echo: true, record: false })
const port = new SerialPort('/dev/ROBOT')
const parser = port.pipe(new Readline())

var ID = null;

parser.on('data', (serial_data)=> {
    console.log('Data:', serial_data)
})

socket.on('connect',function(){
    console.log('connected');
    //socket.emit('chat message', "Hello!!");

    socket.on('chat message',(msg)=>{
        console.log("message:" + msg)
    })

    socket.on('get data',(data)=>{
        console.log("get data")
        console.log(data)
        let file_name_len = data.slice(0,2).readUInt16BE(0);
        let file_name = data.slice(2,file_name_len+2);
        console.log("file len: " + file_name_len)
        console.log("file name: " + file_name);
        let save_data = data.slice(file_name_len+2,data.length)
        console.log(save_data)

        fs.writeFileSync("./" + file_name, save_data)
    })


    socket.on('stop print', (data)=>{
        console.log(data)
        clearInterval(ID);
        console.log("stop print")
    })

    socket.on('start print', (data)=>{
        console.log(data)
        print_flag = true;
        console.log("start print")
        ID = setInterval(()=>{
            console.log("Serial write")
            //parser.write('SERIAL PORT TEST\n')
            port.write('SERIAL PORT TEST\n')
        },1000)

    })
    //socket.disconnect();
    //process.exit(0);
});