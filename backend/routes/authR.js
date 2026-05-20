const express = require('express');
const router = express.Router();
const authC = require('../controllers/authC');

router.post('/register', authC.register);
router.post('/login', authC.login);

module.exports = router;