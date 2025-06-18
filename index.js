const express = require("express");
const router = require('./routes/index');
require('dotenv').config({path: 'variables.env'});
const path = require('path')

const app = express();

// Template engine
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta Pública
app.use(express.static("dist"));

// Configuración del Router
app.use('/', router());

// Estableciendo conexion con puerto
app.listen(process.env.PORT, () => {
    console.log('Conexión establecida, puerto ', process.env.PORT);
});