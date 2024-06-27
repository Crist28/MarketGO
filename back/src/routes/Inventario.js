'use strict';

const { Router } = require('express');

const inventarioController = require('../controllers/InventarioController.js');
const auth = require('../auth/authenticate.js');

const router = Router();

router.get('/listar_inventario_producto_admin/:id', [auth.auth], inventarioController.listar_inventario_producto_admin);
router.delete('/eliminar_inventario_producto_admin/:id', [auth.auth], inventarioController.eliminar_inventario_producto_admin);
router.post('/registro_inventario_producto_admin', [auth.auth], inventarioController.registro_inventario_producto_admin);


module.exports = router;