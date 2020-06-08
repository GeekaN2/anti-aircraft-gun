var express = require('express');
const path = require('path');
var app = express();

app.use(express.static('./static')); //This ensures local references to cs and js files work

app.get('/', function (req, res) {
  console.log(__dirname);
  res.sendFile(__dirname + '/static/main/index.html');
});

app.listen(3001, function () {
  console.log('Listen 3001 port!');
});

