// represents the haste-application
var haste = function() {
	this.appName = "Hastebin Plus";
	this.$textarea = $('textarea');
	this.$box = $('#code');
	this.$code = $('#code code');
	this.configureShortcuts();
	this.configureButtons();
};

// set title (browser window)
haste.prototype.setTitle = function(ext) {
	var title = ext ? this.appName + ' - ' + ext : this.appName;
	document.title = title;
};

// show the light key
haste.prototype.lightKey = function() {
	this.configureKey(['new', 'save']);
};

// show the full key
haste.prototype.fullKey = function() {
	this.configureKey(['new', 'duplicate', 'raw']);
};

// enable certain keys
haste.prototype.configureKey = function(enable) {
	$('#tools .function').each(function() {
		var $this = $(this);
		for (var i = 0; i < enable.length; i++) {
			if ($this.hasClass(enable[i])) {
				$this.addClass('enabled');
				return true;
			}
		}
		$this.removeClass('enabled');
	});
};

// setup a new, blank document
haste.prototype.newDocument = function(hideHistory) {
	this.$box.hide();
	this.doc = new haste_document();
	if (!hideHistory) {
		window.history.pushState(null, this.appName, '/');
	}
	this.setTitle();
	this.lightKey();
	this.$textarea.val('').show('fast', function() {
		this.focus();
	});
};

// load an existing document
haste.prototype.loadDocument = function(key) {
	var _this = this;
	_this.doc = new haste_document();
	_this.doc.load(key, function(ret) {
		if (ret) {
			_this.$code.html(ret.value);
			_this.setTitle(ret.key);
			window.history.pushState(null, _this.appName + '-' + ret.key, '/' + ret.key);
			_this.fullKey();
			_this.$textarea.val('').hide();
			_this.$box.show();
		} else {
			_this.newDocument();
		}
	});
};

// duplicate the current document
haste.prototype.duplicateDocument = function() {
	if (this.doc.locked) {
		var currentData = this.doc.data;
		this.newDocument();
		this.$textarea.val(currentData);
	}
};

// lock the current document
haste.prototype.lockDocument = function() {
	var _this = this;
	this.doc.save(this.$textarea.val(), function(err, ret) {
		if (!err && ret) {
			_this.$code.html(ret.value.trim().replace(/.+/g, "<span class=\"line\">$&</span>").replace(/^\s*[\r\n]/gm, "<span class=\"line\"></span>\n"));
			_this.setTitle(ret.key);
			window.history.pushState(null, _this.appName + '-' + ret.key, '/' + ret.key);
			_this.fullKey();
			_this.$textarea.val('').hide();
			_this.$box.show();
		}
	});
};

// configure buttons and their shortcuts
haste.prototype.configureButtons = function() {
	var _this = this;
	this.buttons = [
		{
			$where: $('#tools .save'),
			shortcut: function(evt) {
				return evt.ctrlKey && evt.keyCode === 83;
			},
			action: function() {
				if (_this.$textarea.val().replace(/^\s+|\s+$/g, '') !== '') {
					_this.lockDocument();
				}
			}
		},
		{
			$where: $('#tools .new'),
			shortcut: function(evt) {
				return evt.ctrlKey && evt.keyCode === 32;
			},
			action: function() {
				_this.newDocument(!_this.doc.key);
			}
		},
		{
			$where: $('#tools .duplicate'),
			shortcut: function(evt) {
				return _this.doc.locked && evt.ctrlKey && evt.keyCode === 68;
			},
			action: function() {
				_this.duplicateDocument();
			}
		},
		{
			$where: $('#tools .raw'),
			shortcut: function(evt) {
				return evt.ctrlKey && evt.shiftKey && evt.keyCode === 82;
			},
			action: function() {
				window.location.href = '/raw/' + _this.doc.key;
			}
		}
	];
	for (var i = 0; i < this.buttons.length; i++) {
		this.configureButton(this.buttons[i]);
	}
};

// handles the button-click
haste.prototype.configureButton = function(options) {
	options.$where.click(function(evt) {
		evt.preventDefault();
		if (!options.clickDisabled && $(this).hasClass('enabled')) {
			options.action();
		}
	});
};

// enables the configured shortcuts
haste.prototype.configureShortcuts = function() {
	var _this = this;
	$(document.body).keydown(function(evt) {
		var button;
		for (var i = 0; i < _this.buttons.length; i++) {
			button = _this.buttons[i];
			if (button.shortcut && button.shortcut(evt)) {
				evt.preventDefault();
				button.action();
				return;
			}
		}
	});
};

// represents a single document
var haste_document = function() {
	this.locked = false;
};

// escape HTML-characters
haste_document.prototype.htmlEscape = function(s) {
	return s
	.replace(/&/g, '&amp;')
	.replace(/>/g, '&gt;')
	.replace(/</g, '&lt;')
	.replace(/"/g, '&quot;');
};

// load a document from the server
haste_document.prototype.load = function(key, callback) {
	var _this = this;
	$.ajax('/documents/' + key, {
		type: 'get',
		dataType: 'json',
		success: function(res) {
			_this.locked = true;
			_this.key = key;
			_this.data = res.data;
			high = hljs.highlightAuto(res.data).value;
			callback({
				value: high.replace(/.+/g, "<span class=\"line\">$&</span>").replace(/^\s*[\r\n]/gm, "<span class=\"line\"></span>\n"),
				key: key,
			});
		},
		error: function(err) {
			callback(false);
		}
	});
};

// sends the document to the server
haste_document.prototype.save = function(data, callback) {
	if (this.locked) return false;

	this.data = data;
	var _this = this;
	$.ajax('/documents', {
		type: 'post',
		data: data.trim(),
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		success: function(res) {
			new haste().loadDocument(res.key);
		},
		error: function(res) {
			try {
				callback($.parseJSON(res.responseText));
			} catch (e) {
				callback({message: 'Something went wrong!'});
			}
		}
	});
};

// after page is loaded
$(function() {
	$('textarea').keydown(function(evt) {
		// allow usage of tabs
		if (evt.keyCode === 9) {
			evt.preventDefault();
			var myValue = '    ';
			if (document.selection) {
				this.focus();
				sel = document.selection.createRange();
				sel.text = myValue;
				this.focus();
			} else if (this.selectionStart || this.selectionStart == '0') {
				var startPos = this.selectionStart;
				var endPos = this.selectionEnd;
				var scrollTop = this.scrollTop;
				this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
				this.focus();
				this.selectionStart = startPos + myValue.length;
				this.selectionEnd = startPos + myValue.length;
				this.scrollTop = scrollTop;
			} else {
				this.value += myValue;
				this.focus();
			}
		}
	});

	var app = new haste();
	var path = window.location.pathname;
	if (path === '/') {
		app.newDocument(true);
	} else {
		app.loadDocument(path.substring(1, path.length));
	}
});

hljs.initHighlightingOnLoad();
