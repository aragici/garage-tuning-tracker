const express = require('express');
const router = express.Router();
const carC = require('../controllers/carC');
const auth = require('../middleware/auth');

router.post('/', auth, carC.addCar);          
router.get('/', auth, carC.getMyCars);        
router.put('/:id', auth, carC.updateCar);     
router.delete('/:id', auth, carC.deleteCar);  

module.exports = router;    