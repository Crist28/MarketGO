'use strict';

const { Router } = require('express');

const cuponController = require('../controllers/CuponController.js');
const auth = require('../auth/authenticate.js');

const router = Router();

router.post('/registro_cupon_admin',auth.auth, cuponController.registro_cupon_admin);
router.get('/listar_cupones_filtro_admin/:tipo/:filtro?',auth.auth, cuponController.listar_cupones_filtro_admin);
router.get('/obtener_cupon_admin/:id',auth.auth, cuponController.obtener_cupon_admin);
router.put('/actualizar_cupon_admin/:id',auth.auth, cuponController.actualizar_cupon_admin);
router.delete('/eliminar_cupon_admin/:id',auth.auth, cuponController.eliminar_cupon_admin);

module.exports = router;