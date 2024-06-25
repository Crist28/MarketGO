const { Schema, model } = require('mongoose');

const AdminSchema = Schema({

    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    perfil: { type: String, default: 'perfil.png', required: true },
    telefono: { type: String, required: true },
    rol: {type: String, required: true},
    dni: { type: String, required: true }

});

module.exports = model( 'admin', AdminSchema );