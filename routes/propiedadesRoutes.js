const express = require('express');
const router = express.Router();

const propiedadController = require('../controllers/propiedadController');

module.exports = () => {
    
    router.get('/mis-propiedades', propiedadController.admin);
    
    return router;
}