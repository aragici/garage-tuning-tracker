const express = require('express');
const router = express.Router();
const partC = require('../controllers/partC');
const auth = require('../middleware/auth');

router.post('/', auth, partC.addPart);
router.get('/:carId', auth, partC.getParts);

module.exports = router;