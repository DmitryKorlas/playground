// Implements basic http server
var express = require('express');
var serveStatic = require('serve-static');
var multer  = require('multer');


var app = express();

var FAKE_DELAY = 2000;

app.use(serveStatic(__dirname + '/www'));
app.use(multer({ dest: './uploads/'}));

app.post('/upload', function(req, res){

	//console.log(req.files);
	//console.log('body');
	//console.log(req.body);

	var fieldName = 'files[]';
	setTimeout(function(){
		var file = req.files[fieldName];
		var msg = "Upload complete.\n";
		msg += "originalName:"+ file.originalname + ', size:'+ file.size;

		res.send(msg);

	}, FAKE_DELAY);

});

app.listen(3001);
