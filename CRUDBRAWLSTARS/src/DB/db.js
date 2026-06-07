const mysql = require('mysql2');

//creamos la conexion

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Rockoteamodemasiado1107@',
    database: 'brawl_stars_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//la exportamos para poder usarla
module.exports = pool.promise();