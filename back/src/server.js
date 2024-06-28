'use strict';

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/conexiondb');

class Server {
    constructor() {
        this.app = express();

        this.port = process.env.PORT || 3000;

        this.routersCliente = '/api';
        this.routersAdmin = '/api';
        this.routersProducto = '/api';
        this.routersInventario = '/api';
        this.routersCupon = '/api';

        this.conectarDB();
        this.middleware();
        this.routes();
    }

    async conectarDB(){
        await dbConnection()
    }

    middleware(){
        this.app.use(express.json());
        this.app.use(cors());

    }

    routes() {
        this.app.use(this.routersCliente, require("./routes/Cliente"));
        this.app.use(this.routersAdmin, require("./routes/Admin"));
        this.app.use(this.routersProducto, require("./routes/Producto"));
        this.app.use(this.routersInventario, require("./routes/Inventario"));
        this.app.use(this.routersCupon, require("./routes/Cupon"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;