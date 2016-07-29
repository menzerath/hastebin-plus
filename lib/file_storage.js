var fs = require('fs');
var crypto = require('crypto');

var logger = require('winston');

// handles saving and retrieving all documents
var FileDocumentStore = function(options) {
	this.basePath = options.path || './data';
	logger.info('Path to data: ' + this.basePath);
};

// saves a new file to the filesystem
FileDocumentStore.prototype.set = function(key, data, callback) {
	var _this = this;
	fs.mkdir(this.basePath, '700', function(err) {
		fs.writeFile(_this.basePath + '/' + key, data, 'utf8', function(err) {
			if (err) {
				callback(false);
			} else {
				callback(true);
			}
		});
	});
};

// gets an exisiting file from the filesystem
FileDocumentStore.prototype.get = function(key, callback) {
	var _this = this;
	fs.readFile(this.basePath + '/' + key, 'utf8', function(err, data) {
		if (err) {
			callback(false);
		} else {
			callback(data);
		}
	});
};

module.exports = FileDocumentStore;
