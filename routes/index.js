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
    router.post('/auth/login', usuarioController.autenticar);
    router.get('/auth/olvide-password', usuarioController.formularioOlvidePassword);
    router.post('/auth/olvide-password', usuarioController.resetPassword);
    router.get('/auth/olvide-password/:token', usuarioController.comprobarToken);
    router.post('auth/olvide-password/:token', usuarioController.nuevoPassword);

    
    // rutas sin prefijo para compatibilidad
    router.get('/registro', usuarioController.formularioRegistro);
    router.post('/registro', usuarioController.registrar);
    router.get('/confirmar/:token', usuarioController.confirmar);
    router.get('/login', usuarioController.formularioLogin);
    router.post('/login', usuarioController.autenticar);
    router.get('/olvide-password', usuarioController.formularioOlvidePassword);
    router.post('/olvide-password', usuarioController.resetPassword);
    router.get('/olvide-password/:token', usuarioController.comprobarToken);
    router.post('olvide-password/:token', usuarioController.nuevoPassword);

    
    return router;
}