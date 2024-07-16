'use strict';

const express = require('express');
const cors = require('cors');
const http = require('http');
const { dbConnection } = require('./database/conexiondb');

class Server {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = require('socket.io')(this.server, {
            cors: { origin: '*' }
        });

        this.port = process.env.PORT || 3000;

        this.routesCliente = '/api';
        this.routesAdmin = '/api';
        this.routesProducto = '/api';
        this.routesInventario = '/api';
        this.routesCupon = '/api';
        this.routesConfig = '/api';
        this.routesVariedad = '/api';
        this.routesGaleria = '/api';
        this.routesCarrito = '/api';

        this.conectarDB();
        this.middleware();
        this.routes();
        this.socketio();
    }

    async conectarDB() {
        try {
            await dbConnection();
            console.log('Base de datos conectada');
        } catch (error) {
            console.error('Error conectando a la base de datos:', error);
        }
    }

    middleware() {
        this.app.use(express.json());
        this.app.use(cors());
    }

    routes() {
        this.app.use(this.routesCliente, require("./routes/Cliente"));
        this.app.use(this.routesAdmin, require("./routes/Admin"));
        this.app.use(this.routesProducto, require("./routes/Producto"));
        this.app.use(this.routesInventario, require("./routes/Inventario"));
        this.app.use(this.routesCupon, require("./routes/Cupon"));
        this.app.use(this.routesConfig, require("./routes/Config"));
        this.app.use(this.routesVariedad, require("./routes/variedad"));
        this.app.use(this.routesGaleria, require("./routes/Galeria"));
        this.app.use(this.routesCarrito, require("./routes/Carrito"));
    }

    socketio() {
        this.io.on('connection', (socket) => {
            console.log('Cliente conectado');
            socket.on('delete-carrito', (data) => {
                this.io.emit('new-carrito', data);
                console.log('Evento delete-carrito recibido:', data);
            });
        });
    }

    listen() {
        this.server.listen(this.port, '0.0.0.0', () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;
