'use strict';

require('dotenv').config();

const Server = require('./src/server');

const server = new Server();

server.listen();
