var express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));

const port = 3002;
const server = app.listen(port, function () {
  console.dir(server.address())
  console.log(`visit http://localhost:${server.address().port}`);
});
