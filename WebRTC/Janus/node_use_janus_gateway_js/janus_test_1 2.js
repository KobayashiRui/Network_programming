const Janus = require("janus-gateway-js")
var janus = new Janus.Client('ws://localhost:8188', {
  token: 'token',
  apisecret: 'apisecret',
  keepalive: 'true'
});

janus.createConnection('id').then(function(connection) {
  connection.send({janus:"info", transaction:"hogehoge"}).then(function(response) {
    console.log("response")
    console.log(response)
  })
  connection.on("message", function(message) {
    console.log("get info")
    console.log(message)
  })
  connection.createSession().then(function(session) {
    //session.attachPlugin('janus.plugin.echotest').then(function(plugin) {
    session.attachPlugin('janus.plugin.echotest').then(function(plugin) {
      //plugin.send({janus:"message", transaction:"hogehoge", body:{audio:false}}).then(function(response){
      //  console.log("response")
      //  console.log(response)
      //});
      //plugin.send({janus:"info", transaction:"hogehoge"}).then(function(response){
      //  console.log("send")
      //})
      plugin.on('message', function(message) {
        console.log("get message")
        console.log(message)
      });
      plugin.detach();
    });
  });
});