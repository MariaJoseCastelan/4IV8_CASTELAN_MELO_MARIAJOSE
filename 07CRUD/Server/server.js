const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'pnt_practica1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

app.use(express.static('public'));  // ← reemplaza MIME_TYPES + servirArchivoEstatico
app.use(express.json());            // ← reemplaza leerBody



app.listen(PORT, () => {
    console.log('Servidor en puerto: ' + PORT);
});

