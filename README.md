# Hastebin Plus
Hastebin Plus is an open-source Pastebin software written in node.js, which is easily installable in any network.  
It bases upon [haste](https://github.com/seejohnrun/haste-server) and got enhanced in matters of **Design, Speed and Simplicity**.

## Features
* Paste code, logs and ... almost everything!
* Syntax-Highlighting
* Add static documents
* Duplicate & edit pastes
* Raw paste-view

## Installation
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/MarvinMenzerath/HastebinPlus)

1. Install Git and node.js: `sudo apt-get install git nodejs`
2. Clone this repository: `git clone https://github.com/MarvinMenzerath/HastebinPlus.git hastebin-plus`
3. Open `config.json` and change the settings (if you want to)
4. Install dependencies: `npm install`
5. Start the application: `npm start`

## Update
1. Pull changes from this repository: `git pull`
2. Install new dependencies: `npm install`

## Settings
| Key                    | Description                                     | Default value |
| ---------------------- | ----------------------------------------------- | ------------- |
| `host`                 | The host the server runs on                     | `0.0.0.0`     |
| `port`                 | The port the server runs on                     | `8080`        |
| `dataPath`             | The directory where all pastes are stored       | `./data`      |
| `keyLength`            | The length of the pastes' key                   | `10`          |
| `maxLength`            | Maximum chars in a paste                        | `500000`      |
| `createKey`            | Needs to be in front of paste to allow creation | ` `           |
| `documents`            | Static documents to serve                       | See below     |

### Default Config
```json
{
	"host": "0.0.0.0",
	"port": 8080,
	"dataPath": "./data",
	"keyLength": 10,
	"maxLength": 500000,
	"createKey": "",
	"documents": {
		"about": "./README.md",
		"javaTest": "./documents/test.java"
	}
}
```

## Authors
* [haste](https://github.com/seejohnrun/haste-server): John Crepezzi - MIT License
* [jQuery](https://github.com/jquery/jquery): MIT License
* [highlight.js](https://github.com/isagalaev/highlight.js): Ivan Sagalaev - [License](https://github.com/isagalaev/highlight.js/blob/master/LICENSE)
* [Application Icon](https://www.iconfinder.com/icons/285631/notepad_icon): [Paomedia](https://www.iconfinder.com/paomedia) - [CC BY 3.0 License](http://creativecommons.org/licenses/by/3.0/)

## License
Copyright (c) 2014-2016 Marvin Menzerath

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
