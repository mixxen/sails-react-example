// Start sails and pass it command line arguments
require('sails').lift(require('optimist').argv);


// var fs = require('fs');

// var express = require('express');
// var connect = require('connect');

// var app = express();

// var comments = [{author: 'Pete Hunt', text: 'Hey there!'}];

// app.use('/', express.static(__dirname));
// app.use(connect.bodyParser());

// app.get('/comments.json', function(req, res) {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify(comments));
// });

// app.post('/comments.json', function(req, res) {
//   comments.push(req.body);
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify(comments));
// });

// app.listen(1337);