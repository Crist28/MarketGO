'use strict';

const { Router } = require('express');

const variedadController = require('../controllers/VariedadController');
const auth = require('../auth/authenticate.js');

const router = Router();

router.put('/actualizar_producto_variedades_admin/:id', auth.auth, variedadController.actualizar_producto_variedades_admin);

module.exports = router;