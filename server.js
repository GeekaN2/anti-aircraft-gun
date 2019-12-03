var express = require('express');
const path = require('path');
var app = express();

app.use(express.static('./static')); //This ensures local references to cs and js files work



app.get('/anti-aircraft-gun', (req, res) => {
  res.sendFile(__dirname + '/static/anti-aircraft-gun/index.html');
});

app.get('/heat-ditribution-in-the-road', function (req, res) {
  res.sendFile(__dirname + '/static/heat-ditribution-in-the-road/index.html');
});

app.get('/', function (req, res) {
  console.log(__dirname);
  res.sendFile(__dirname + '/static/main/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

