// Implements basic http server
var express = require('express');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic(__dirname + '/www'));
app.post('/upload', function(req, res){
	res.send('Upload complete');
});

app.listen(3000);
