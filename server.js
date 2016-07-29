// Require useful stuff
var http = require('http');
var url = require('url');
var fs = require('fs');

var express = require('express');
var logger = require('winston');

var DocumentHandler = require('./lib/document_handler.js');

// Load the configuration and set some defaults
var config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
config.port = process.env.PORT || config.port || 8080;
config.host = process.env.HOST || config.host || 'localhost';

// Set up the logger
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {colorize: true, level: 'verbose'});
logger.info('Welcome to Hastebin Plus!');

// build the store from the config on-demand - so that we don't load it for statics
var Store = require('./lib/store_file.js');
var preferredStore = new Store(config.dataPath);
logger.info('Path to data: ' + config.dataPath);

// Compress the static assets
if (config.compressStaticAssets) {
	var list = fs.readdirSync('./static');
	var i, item, sourceFile, dest;

	// First compress CSS
	var CleanCSS = require('clean-css');
	for (i = 0; i < list.length; i++) {
		item = list[i];
		if ((item.indexOf('.css') === item.length - 4) && (item.indexOf('.min.css') === -1)) {
			dest = item.substring(0, item.length - 4) + '.min' + item.substring(item.length - 4);
			sourceFile = fs.readFileSync('./static/' + item, 'utf8');
			fs.writeFileSync('./static/' + dest, new CleanCSS().minify(sourceFile).styles, 'utf8');
			logger.info('Compressed: ' + item + ' ==> ' + dest);
		}
	}

	// Compress JavaScript
	var UglifyJS = require('uglify-js');
	for (i = 0; i < list.length; i++) {
		item = list[i];
		if ((item.indexOf('.js') === item.length - 3) && (item.indexOf('.min.js') === -1)) {
			dest = item.substring(0, item.length - 3) + '.min' + item.substring(item.length - 3);
			fs.writeFileSync('./static/' + dest, UglifyJS.minify('./static/' + item).code, 'utf8');
			logger.info('Compressed: ' + item + ' ==> ' + dest);
		}
	}
}

// Send the static documents into the preferred store, skipping expirations
var path, data;
for (var name in config.documents) {
	if (config.documents.hasOwnProperty(name)) {
		path = config.documents[name];
		data = fs.readFileSync(path, 'utf8');
		logger.info('Loading static document: ' + name + " ==> " + path);
		if (data) {
			preferredStore.set(name, data, function (cb) {
			}, true);
		} else {
			logger.warn('Failed to load static document: ' + name + " ==> " + path);
		}
	}
}

// Pick up a key generator
var gen = require('./lib/key_generator.js');
var keyGenerator = new gen();

// Configure the document handler
var documentHandler = new DocumentHandler({
	store: preferredStore,
	maxLength: config.maxLength,
	keyLength: config.keyLength,
	keyGenerator: keyGenerator
});

var app = express();

app.get('/raw/:id', function (req, res) {
	return documentHandler.handleRawGet(req.params.id, res, !!config.documents[req.params.id]);
});
app.post('/documents', function (req, res) {
	return documentHandler.handlePost(req, res);
});
app.get('/documents/:id', function (req, res) {
	return documentHandler.handleGet(req.params.id, res, !!config.documents[req.params.id]);
});
app.use(express.static('static'));
app.get('/:id', function (req, res, next) {
	req.url = req.originalUrl = '/index.html';
	next();
});
app.use(express.static('static'));
app.listen(config.port, config.host);

logger.info('Done! Listening on ' + config.host + ':' + config.port);
