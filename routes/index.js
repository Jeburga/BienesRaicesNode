const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');

module.exports = () => {

    router.get('/', (req, res)=> {
        res.send('Perro')
    })

    router.get('/registro', usuarioController.formularioRegistro);
    
    return router;
}