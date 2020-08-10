const Janus = require("janus-gateway-js")
var janus = new Janus.Client('ws://localhost:8188', {
  token: 'token',
  apisecret: 'apisecret',
  keepalive: 'true'
});

janus.createConnection('id').then(function(connection) {
  connection.createSession().then(function(session) {
    session.attachPlugin('janus.plugin.streaming').then(function(plugin) {
      //plugin.send({janus:"message", transaction:"hogehoge", body:{request:"list"}}).then(function(response){
      //  console.log("response")
      //});
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
            console.log("send")
      })
      plugin.on('message', function(message) {
        console.log("get message")
        console.log(message)
        console.log(message._plainMessage.plugindata.data)
      });
      //plugin.detach();
    });
  });
});