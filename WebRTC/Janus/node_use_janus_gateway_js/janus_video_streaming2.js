const Janus = require("janus-gateway-js")
const express = require("express")
const app = express()

app.use(express.json())

var janus = new Janus.Client('ws://localhost:8188', {
  token: 'token',
  apisecret: 'apisecret',
  keepalive: 'true'
});

var plugin;
app.get('/',(req,res) => {
  res.sendFile('./janus_front/test2.html', { root: __dirname })
})

//janusからoffer sdpを受け取る
app.post('/get_offer_sdp', (req, res)=>{
  let data = req.body;
  plugin.send({
      janus:"message", 
      transaction:"hogehoge",
      body:{
        request:"watch",
        id:1,
        offer_audio:true,
        offer_video:true,
        offer_data:false,
    }}).then(function(response){
  res.send("ok")
  })
})

//janusにanswer sdpを渡す
app.post('/set_answer_sdp', (req, res)=>{
  let data = req.body;
  console.log(data.sdp)
  plugin.send({
      janus:"message", 
      transaction:"hogehoge",
      body:{
        request:"start",
      },
      jsep:{
        type:"answer",
        sdp: data.sdp
      }
  }).then(function(response){
  res.send("ok")
  })


})

async function setup(){
  let connection = await janus.createConnection('id');
  let session = await connection.createSession()
  plugin = await session.attachPlugin('janus.plugin.streaming')
  plugin.on('message', function(message) {
    console.log("get message")
    console.log(message)
    if(message._plainMessage.plugindata.data != undefined){
      console.log(message._plainMessage.plugindata.data)
    }
    if(message._plainMessage.jsep.sdp != undefined){
      console.log(message._plainMessage.jsep.sdp)
    }
  });

  app.listen(3000, ()=> console.log('Server Start'))

}

setup()