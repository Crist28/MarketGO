'use strict';

const { Router } = require('express');

const carritoController = require('../controllers/CarritoController');
const auth = require('../auth/authenticate.js');

const router = Router();

router.post('/agregar_carrito_cliente', auth.auth, carritoController.agregar_carrito_cliente);
router.get('/obtener_carrito_cliente/:id', auth.auth, carritoController.obtener_carrito_cliente);
router.delete('/eliminar_carrito_cliente/:id', auth.auth, carritoController.eliminar_carrito_cliente);

module.exports = router;