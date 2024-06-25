'use strict';

const { Router } = require('express');

const adminController = require('../controllers/AdminController.js');

const router = Router();

router.post('/registro_admin', adminController.registro_admin);
router.post('/login_admin', adminController.login_admin );

module.exports = router;