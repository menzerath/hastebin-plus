var logger = require('winston');

var KeyGenerator = require('./key_generator.js');

// handles creating new and requesting existing documents
var DocumentHandler = function(options) {
	if (!options) {
		options = {};
	}
	this.store = options.store;
	this.maxLength = options.maxLength || 50000;
	this.keyLength = options.keyLength || 10;
	this.createKey = options.createKey || '';
	this.keyGenerator = new KeyGenerator();

	if (this.createKey !== '') {
		logger.info("Creation-Key:", this.createKey);
	}
};

// handles existing documents
DocumentHandler.prototype.handleGet = function(key, res) {
	this.store.get(key, function(ret) {
		if (ret) {
			logger.verbose('Open paste:', key);
			res.writeHead(200, {'content-type': 'application/json'});
			res.end(JSON.stringify({key: key, data: ret.replace(/\t/g, '    ')}));
		} else {
			logger.verbose('Paste not found:', key);
			res.writeHead(404, {'content-type': 'application/json'});
			res.end(JSON.stringify({message: 'Paste not found.'}));
		}
	});
};

// handles exisiting documents (raw)
DocumentHandler.prototype.handleRawGet = function(key, res) {
	this.store.get(key, function(ret) {
		if (ret) {
			logger.verbose('Open paste:', key);
			res.writeHead(200, {'content-type': 'text/plain'});
			res.end(ret);
		} else {
			logger.verbose('Paste not found:', key);
			res.writeHead(404, {'content-type': 'application/json'});
			res.end(JSON.stringify({message: 'Paste not found.'}));
		}
	});
};

// handles creating new documents
DocumentHandler.prototype.handlePost = function(req, res) {
	var _this = this;
	var buffer = '';
	var cancelled = false;
	req.on('data', function(data) {
		if (cancelled) return;
		buffer += data.toString();
		if (_this.maxLength && buffer.length > _this.maxLength) {
			cancelled = true;
			logger.warn('Paste exeeds maximum length.');
			res.writeHead(400, {'content-type': 'application/json'});
			res.end(JSON.stringify({message: 'Paste exceeds maximum length.'}));
		}
	});
	req.on('end', function() {
		if (cancelled) return;

		if (_this.createKey !== '') {
			if (!buffer.startsWith(_this.createKey)) {
				logger.warn('Error adding new paste: wrong key');
				res.writeHead(400, {'content-type': 'application/json'});
				res.end(JSON.stringify({message: 'Error adding new paste: wrong key'}));
				return;
			}
			buffer = buffer.substring(_this.createKey.length);
		}

		_this.chooseKey(function(key) {
			_this.store.set(key, buffer, function(success) {
				if (success) {
					logger.verbose('New paste:', key);
					res.writeHead(200, {'content-type': 'application/json'});
					res.end(JSON.stringify({key: key}));
				} else {
					logger.warn('Error adding new paste.');
					res.writeHead(500, {'content-type': 'application/json'});
					res.end(JSON.stringify({message: 'Error adding new paste.'}));
				}
			});
		});
	});
	req.on('error', function(error) {
		logger.error('Connection error: ' + error.message);
		res.writeHead(500, {'content-type': 'application/json'});
		res.end(JSON.stringify({message: 'Connection error.'}));
	});
};

// creates new keys until one is not taken
DocumentHandler.prototype.chooseKey = function(callback) {
	var key = this.acceptableKey();
	var _this = this;
	this.store.get(key, function(success) {
		if (success) {
			_this.chooseKey(callback);
		} else {
			callback(key);
		}
	});
};

// creates a new key using the key-generator
DocumentHandler.prototype.acceptableKey = function() {
	return this.keyGenerator.createKey(this.keyLength);
};

module.exports = DocumentHandler;
