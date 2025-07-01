const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' })

const generarJWT = datos => jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, {expiresIn: '1d'})


const generarId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

module.exports = {
    generarJWT,
    generarId
};