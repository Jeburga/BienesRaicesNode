const express = require("express");
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const db = require('./config/db');

require('dotenv').config({path: 'variables.env'});

const app = express();

// Habilitar lectura de datos del formulario
app.use( express.urlencoded({ extended: true }) );

// Habilitar cookie-parser y csrf
app.use( cookieParser() )
app.use( csrf({cookie: true}))

// Conexión a DB
const connectarDB = async () => {
    try {
        await db.authenticate();
        db.sync();
        console.log('Conexión correcta la BD');
        
    } catch (error) {
        console.log(error);
        
    }
}

connectarDB()

// Template engine
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta Pública
app.use(express.static("dist"));

// Configuración del Router
app.use('/', router());

// Estableciendo conexion con puerto
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Conexión establecida, puerto ', process.env.PORT);
});