const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const port = new SerialPort('/dev/tty.usbmodem14101')
const parser = port.pipe(new Readline({ delimiter:'\n'}))

parser.on('data', data => console.log("Data:" +data));

//port.write('SERIAL PORT TEST\n');
let ID = setInterval(()=>{
    console.log("Write")
    port.write("Hello World!!\n")
},1000)

