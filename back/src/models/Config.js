const { Schema, model } = require('mongoose');

const ConfigSchema = Schema({

    categorias: [{ type: Object, required: true }],
    titulo: { type: String, required: true },
    logo: { type: String, required: true },
    serie: { type: Number, required: true },
    correlativo: { type: Number, required: true }

});

module.exports = model( 'config', ConfigSchema );