'use strict';

const { Schema, model } = require('mongoose');

const ClienteSchema = Schema({

    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    pais: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    perfil: { type: String, default: 'perfil.png', required: true },
    telefono: { type: String, required: false },
    genero: { type: String, required: false },
    f_nacimiento: { type: String, required: false },
    dni: { type: String, required: false }

});

module.exports = model( 'cliente', ClienteSchema );