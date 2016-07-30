var http = require('http');
var url = require('url');
var fs = require('fs');

var express = require('express');
var logger = require('winston');

var DocumentHandler = require('./lib/document_handler.js');
var FileStorage = require('./lib/file_storage.js');

// load configuration
var config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
config.port = process.env.PORT || config.port || 8080;
config.host = process.env.HOST || config.host || 'localhost';

// logger-setup
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {colorize: true, level: 'verbose'});
logger.info('Welcome to Hastebin Plus!');

// init file-storage
var fileStorage = new FileStorage(config.dataPath);

// load static documents into file-storage
for (var name in config.documents) {
	var path = config.documents[name];
	var data = fs.readFileSync(path, 'utf8');
	if (data) {
		fileStorage.set(name, data, function(success) {});
		logger.verbose('Created document: ' + name + " ==> " + path);
	} else {
		logger.warn('Unable to find document: ' + name + " ==> " + path);
	}
}

// configure the document handler
var documentHandler = new DocumentHandler({
	store: fileStorage,
	maxLength: config.maxLength,
	keyLength: config.keyLength,
	createKey: config.createKey
});

// compress static assets
var cssCompressor = require('clean-css');
var jsCompressor = require('uglify-js');

var files = fs.readdirSync(__dirname + '/static');
for (var i = 0; i < files.length; i++) {
	var item = files[i];
	var dest = "";
	if ((item.indexOf('.css') === item.length - 4) && (item.indexOf('.min.css') === -1)) {
		dest = item.substring(0, item.length - 4) + '.min.css';
		fs.writeFileSync(__dirname + '/static/' + dest, new cssCompressor().minify(fs.readFileSync(__dirname + '/static/' + item, 'utf8')).styles, 'utf8');
		logger.verbose('Compressed: ' + item + ' ==> ' + dest);
	} else if ((item.indexOf('.js') === item.length - 3) && (item.indexOf('.min.js') === -1)) {
		dest = item.substring(0, item.length - 3) + '.min.js';
		fs.writeFileSync(__dirname + '/static/' + dest, jsCompressor.minify(__dirname + '/static/' + item).code, 'utf8');
		logger.verbose('Compressed: ' + item + ' ==> ' + dest);
	}
}

// setup routes and request-handling
var app = express();

app.get('/raw/:id', function(req, res) {
	return documentHandler.handleRawGet(req.params.id, res);
});
app.post('/documents', function(req, res) {
	return documentHandler.handlePost(req, res);
});
app.get('/documents/:id', function(req, res) {
	return documentHandler.handleGet(req.params.id, res);
});
app.use(express.static('static'));
app.get('/:id', function(req, res, next) {
	res.sendFile(__dirname + '/static/index.html');
});

app.listen(config.port, config.host);
logger.info('Listening on ' + config.host + ':' + config.port);
