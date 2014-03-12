# Hastebin Plus
Hastebin Plus is an open-source Pastebin software written in node.js, which is easily installable in any network.  
It bases upon [haste](https://github.com/seejohnrun/haste-server) and got enhanced in matters of **Design, Speed and Simplicity**.

## Features
* Paste code, logs and ... almost everything!
* Syntax-Highlighting
* Add static documents
* Duplicate & Tweet pastes
* Raw paste-view

## Demo
For a Hastebin Plus Demo click here: http://hastebin-plus.herokuapp.com/.

## Installation
1. Install Git and node.js: `sudo apt-get install git nodejs`
2. Clone this repository: `git clone https://github.com/MarvinMenzerath/HastebinPlus.git hastebin-plus`
3. Open `config.js` and change the settings (if you want to)
4. Install dependencies: `npm install`
5. Start the application: `npm start`

## Update
1. Pull changes from this repository: `git pull`
2. Install new dependencies: `npm install`

## Settings
| Key                    | Description                                  | Default value |
| ---------------------- | -------------------------------------------- | ------------- |
| `host`                 | The host the server runs on                  | `localhost`   |
| `port`                 | The port the server runs on                  | `8080`        |
| `dataPath`             | The directory where all pastes are stored    | `./data`      |
| `keyLength`            | The length of the pastes' key                | `10`          |
| `maxLength`            | Maximum chars in a paste                     | `500000`      |
| `staticMaxAge`         | Max age for static assets                    | `86400`       |
| `compressStaticAssets` | Whether or not to compile static js assets   | `true`        |
| `documents`            | Static documents to serve; will never expire | See below     |

### Default Config
```json
{
    "host": "0.0.0.0",
    "port": 8080,
    "dataPath": "./data",
    "keyLength": 10,
    "maxLength": 500000,
    "staticMaxAge": 86400,
    "compressStaticAssets": true,
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

## License
Copyright (C) 2014 Marvin Menzerath

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses/.
