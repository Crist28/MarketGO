'use strict';

const { Schema, model } = require('mongoose');

const InventarioSchema = Schema({

    producto: { type: Schema.ObjectId, ref: 'producto', required: true },
    cantidad: { type: Number, required: true },
    admin: { type: Schema.ObjectId, ref: 'admin', required: true },
    proveedor: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, require: true }
});

module.exports = model( 'inventario', InventarioSchema );