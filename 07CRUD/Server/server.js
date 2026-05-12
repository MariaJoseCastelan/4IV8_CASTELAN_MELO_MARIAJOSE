//Primero necesitamos crear un servidor para la aplicacion y ahi mismo montar nuestra red
//este es el modulo nativo para cualquier servidor
const http = require('http');
//el modulo para leer los archivos del sistema
const fs = require('fs');
//el modulo para la ruta e identificar el archivo
const path = require('path');
//el modulo nativo para extraer parametros
const url = require('url');

//este modulo lo tenemos que descargar con el comando npm install mysql2
const mysql = require('mysql2'); 

//configurar el servidor
const PORT = process.env.PORT || 3000;

//vamos a conectarnos a la bd
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'pnt_practica1' ,
    waitForConnections: true, //esperar si no hay conexiones disponibles
    connectionLimit: 10, //limite de conexiones simultaneas
    queueLimit: 0 //sin limite de espera
});

//debemos configurar los tipos de archivos que son aceptados
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
};

function servirArchivoEstatico(req, res){

    //si la url es '/' servimos a index.html
    let filePath = req.url === '/'? '/index.html':req.url;

    //construimos las rutas de los archivos
    const fullPath = path.join(__dirname, 'public', filePath);

    //obtenemos la extension del archivo para determinar el tipo de archivo
    const ext = path.extname(fullPath);
    const mimeType = MIME_TYPES[ext];

    if(!mimeType){
        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('Archivo no encontrado');
        return;
    }


    //leemos el archivo cuando si existe
    fs.readFile(fullPath, (error, contenido) => {
        if(error){
            res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
            res.end('Archivo no encontrado');
        }else{
            res.writeHead(200, {'Content-Type': mimeType});
            res.end(contenido);
        }
    });

}

//debo de crear una promesa de conexion
const db = pool.promise();
//esto nos permite escribir codigo asincrono que tendra un tiempo de espera para conectarse, procesarse y dar una respuesta

//debemos de antender cada una de las peticiones que vengan por parte de la carpeta de public
function leerBody(req){
    return new Promise((resolve, reject) => {
        let body = '';
        //nosotros vamos a tener un evento que se dispara cada vez que llega un pedazo de los datos
        req.on('data', chunk => {
            body += chunk.toString();
            //debemos verificar el tamaño del body
            if(body.length > 1e6){ 
                req.destroy();
                reject(new Error('Body demasiado grande'));
            }
        });
        //el evento end se dispara cuando todos los datos han llegado
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(new Error('JSON invalido'));
            }
        });
        req.on('error', reject);
            reject(err);
        });
    
    }
    //este elemento nos sirve para dar respuestas
    function enviarJSON(res, statusCode, data){
        res.writeHead(statusCode, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(data));
    }
    //recibir todas las peticiones por parte del servidor, get, post, put, delate

    const server = http.createServer(async (req, res) => {
        //tenemos que parsear la url
        const parseUrl = url.parse(req.url, true);
        const parthname = parseUrl.pathname;
        const method = req.method;

        //imprimir en el log cada peticion

        console.log('[${new Date().toLocaleTimeString()}] ${metod} ${parthname}');

        //aqui tenemos que programar cada peticion que se vaya a realizar por parte del usuario
        
        //si la url no coincide con ninguna de las rutas de la api, intentar servir un archivo estatico
        servirArchivoEstatico(req, res);
    }
    );

    //inicializamos el servidor
    server.listen(PORT, () =>{
        console.log('Servidor inicializado en el puerto: ' + PORT);
        console.log('Para salir presiona crtl + c');
    })

