var express = require('express');
const path = require('path');
var app = express();

app.use(express.static('./static')); //This ensures local references to cs and js files work

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});


app.get('/', function (req, res) {
  res.render('index');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

