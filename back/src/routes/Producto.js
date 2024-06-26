'use strict';

const { Router } = require('express');
const multiparty = require('connect-multiparty');
const path = require('path');

const multipartyMiddleware = multiparty({ uploadDir: path.resolve(__dirname, '../uploads/productos') });

const productoController = require('../controllers/ProductoController.js');
const auth = require('../auth/authenticate.js');

const router = Router();

router.post('/registro_producto_admin', [auth.auth, multipartyMiddleware], productoController.registro_producto_admin);

router.get('/listar_productos_admin/:tipo/:filtro?', [auth.auth], productoController.listar_productos_admin);
router.get('/obtener_portada/:img', productoController.obtener_portada);

module.exports = router;