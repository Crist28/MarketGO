'use strict';

const { Router } = require('express');

const clienteController = require('../controllers/ClienteController.js');
const auth = require('../auth/authenticate.js');

const router = Router();

router.post('/registro_cliente', clienteController.registro_cliente);
router.post('/login_cliente', clienteController.login_cliente);
router.get('/listar_cliente_filtro_admin/:tipo/:filtro?',auth.auth, clienteController.listar_cliente_filtro_admin);
router.post('/registro_cliente_admin',auth.auth, clienteController.registro_cliente_admin);

module.exports = router;