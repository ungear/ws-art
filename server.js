const express = require('express');
const WebSocketServer = new require('ws');
const app = express();
app.use(express.static(__dirname + '/public'));

// http stuff
const httpPort = 3002;
const server = app.listen(httpPort, function () {
  console.log(`visit http://localhost:${server.address().port}`);
});

// web sockets stuff
var clients = {};
const wsPort = 8081;
var webSocketServer = new WebSocketServer.Server({
  port: wsPort
});

webSocketServer.on('connection', function(ws) {
  var id = Math.random();
  ws.id = id;
  clients[id] = ws;
  console.log("a new connection has been established: " + id);

  ws.on('message', function(message) {
    console.log('message received: ' + message);

    for (let cId in clients) {
      if(cId != ws.id) clients[cId].send(message);
    }
  });

  ws.on('close', function() {
    console.log('the connection has been closed: ' + id);
    delete clients[id];
  });
  
});