'use strict';

const { Router } = require('express');
const multiparty = require('connect-multiparty');
const path = require('path');

const multipartyMiddleware = multiparty({ uploadDir: path.resolve(__dirname, '../uploads/galeria') });

const galeriaController = require('../controllers/GaleriaController.js');
const auth = require('../auth/authenticate.js');

const router = Router();

router.put('/agregar_imagen_galeria_admin/:id',[auth.auth, multipartyMiddleware], galeriaController.agregar_imagen_galeria_admin);
router.get('/obtener_galeria/:img', galeriaController.obtener_galeria);
router.put('/eliminar_imagen_galeria_admin/:id', [auth.auth], galeriaController.eliminar_imagen_galeria_admin);

module.exports = router;