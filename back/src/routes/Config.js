'use strict';

const { Router } = require('express');

const configController = require('../controllers/ConfigController');
const auth = require('../auth/authenticate.js');

const multiparty = require('connect-multiparty');
const path = require('path');

const multipartyMiddleware = multiparty({ uploadDir: path.resolve(__dirname, '../uploads/configuraciones') });

const router = Router();

router.put('/actualizar_config_admin/:id',[auth.auth,multipartyMiddleware],configController.actualizar_config_admin);
router.get('/obtener_config_admin',[auth.auth],configController.obtener_config_admin);

router.get('/obtener_logo/:img',configController.obtener_logo);
router.get('/obtener_config_publico', configController.obtener_config_publico);

module.exports = router;