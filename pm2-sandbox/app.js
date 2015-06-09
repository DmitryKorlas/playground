var express = require('express');

var app = express();
function getPID() {
	return process.pid;
}

app
	.get('/stopme', function(req, res) {
		res.write('stopping...');
		res.write('\npid:'+ getPID());
		res.end();
		setTimeout(function(){
			process.exit(0);
		}, 1000);

	})

	.get('/crashme', function(req, res) {
		res.write('crashing...');
		res.write('\npid:'+ getPID());
		res.end();
		setTimeout(function(){
			var x = app.force.exception;
		});
	})

	.get('/memoryleak', function(req, res) {

		var str;
		//str = 'a';
		str = repeatString("abcdsefghijklmnopqrstuvwxyz ", 10);

		var chunkCount = Math.pow(2, 32);
		var current = 0;
		var buffer;
		var overflow = [];
		var prevMessage;
		var message;

		res.write(new Buffer('Congrats, you just started a memoryleak...'));
		res.write(new Buffer('\npid:'+ getPID()+ '\n\n'));

		function repeatString(sample, count) {
			var str = sample;
			for(var i=0; i<count; i++) {
				str += str;
			}
			return str;
		}

		function tick() {
			process.nextTick(writeChunk);
		}

		function writeChunk() {
			if (current++ < chunkCount) {

				message = overflow.length % 1000 == 0 ? ('length: '+ overflow.length+ '\n') : '';
				if (prevMessage == message) {
					message = '';
				}
				else {
					prevMessage = message;
				}

				if (current % 10 == 0) {
					overflow.push( overflow.length + ' ' + str);
				}

				buffer = new Buffer(message);

				if (res.write(buffer)) {
					setImmediate(tick);
				} else {
					res.once('drain', tick);
				}
			} else {
				res.end();
			}
		}

		writeChunk();
	})

	.get('/', function(req, res) {
		res.writeHead('200', {'Content-Type': 'text/html'});
		res.write('Hey! My process id is: ' + getPID() + '<br/>');

		res.write(getLinkHTML('/stopme', '/stopme', 'correctly stop server'));
		res.write(getLinkHTML('/crashme', '/crashme', 'crash server via exception'));
		res.write(getLinkHTML('/memoryleak', '/memoryleak', 'start memoryleak on server'));
		res.end();

		function getLinkHTML(url, linkName, descripction) {
			var tpl = 'Follow <a href="%URL%">%NAME%</a> to %DESCRIPTION%<br/>';
			return tpl
				.replace('%URL%', url)
				.replace('%NAME%', linkName)
				.replace('%DESCRIPTION%', descripction);
		}
	});

app.listen(3001);
