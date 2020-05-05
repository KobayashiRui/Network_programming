var janus = new Janus.Client('ws://localhost:8188', {
  token: 'token',
  apisecret: 'apisecret',
  keepalive: 'true'
});

janus.createConnection('id').then(function(connection) {
  connection.createSession().then(function(session) {
    session.attachPlugin('bla').then(function(plugin) {
      plugin.send({}).then(function(response){});
      plugin.on('message', function(message) {});
      plugin.detach();
    });
  });
});