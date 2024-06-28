'use strict';

const { Schema, model } = require('mongoose');

const CuponSchema = Schema({
    codigo: { type: String, required: true },
    tipo: { type: String, required: true },
    valor: { type: Number, required: true },
    limite: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, require: true }
});

module.exports = model( 'cupon', CuponSchema );