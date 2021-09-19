// Conection with database
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_VERSION } = require("./config");

// Load routings
const authRoutes = require("./routers/auth");
const userRoutes = require("./routers/user");
const menuRoutes = require("./routers/menu");
const newsletterRoutes = require("./routers/newsletter");
const courseRoutes = require("./routers/course");
const postRoutes = require("./routers/post");
const path = require('path');


// Config body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Config Header HTTP
// https://developer.mozilla.org/es/docs/Web/HTTP/Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); //Indica si la respuesta puede ser compartida.
    res.header(
        "Access-Control-Allow-Headers", //Utilizado como respuesta a una solicitud de validación para indicár qué cabeceras HTTP pueden utilizarse a la hora de lanzar la petición.
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"); //Especifica el método (o métodos) permitido al acceder al recurso, en respuesta a una petición de validación.
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE"); //Lista el rango de métodos de peticiones HTTP aceptadas por un servidor.
    next();
});

// Router basic
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, newsletterRoutes);
app.use(`/api/${API_VERSION}`, courseRoutes);
app.use(`/api/${API_VERSION}`, postRoutes);

module.exports = app;
