'use strict';

const { Router } = require('express');

const direccionController = require('../controllers/DireccionController.js');
const auth = require('../auth/authenticate.js');

const router = Router();

router.post('/registro_direccion_cliente', auth.auth, direccionController.registro_direccion_cliente);
router.get('/obtener_direccion_todos_cliente/:id', auth.auth, direccionController.obtener_direccion_todos_cliente);
router.put('/cambiar_direccion_principal_cliente/:id/:cliente', auth.auth, direccionController.cambiar_direccion_principal_cliente);

module.exports = router;