const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

module.exports = () => {
    // Ruta principal
    router.get('/', (req, res) => { res.send('inicio') });
    
    // Rutas de autenticación
    router.get('/auth/registro', usuarioController.formularioRegistro);
    router.post('/auth/registro', usuarioController.registrar);
    router.get('/auth/confirmar/:token', usuarioController.confirmar);
    router.get('/auth/login', usuarioController.formularioLogin);
    router.get('/auth/olvide-password', usuarioController.formularioOlvidePassword);
    
    // También puedes mantener las rutas sin prefijo para compatibilidad
    router.get('/registro', usuarioController.formularioRegistro);
    router.post('/registro', usuarioController.registrar);
    router.get('/confirmar/:token', usuarioController.confirmar);
    router.get('/login', usuarioController.formularioLogin);
    router.get('/olvide-password', usuarioController.formularioOlvidePassword);
    
    return router;
}