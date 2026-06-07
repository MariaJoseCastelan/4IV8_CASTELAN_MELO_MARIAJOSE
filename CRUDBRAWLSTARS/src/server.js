const express = require('express');
const cors = require('cors'); 
const path = require('path');

const app = express();
//servidor para inicializar con express

const PORT = process.env.PORT || 3000;
//para poder aplicar el MVC necesitamos un intermediario que se va a encargar de ser un mesero (middleware), el cual para cada peticion que pasa por la ruta de la vista, obtiene una peticion y la envia a un controlador.

app.use(cors());

//las peticiones las debemos de atender en un formato JSON, lo que permite poder detectar los elementos bajo los criterios clave, valor.
app.use(express.json());

//que se debe de tener una ruta personalizada por cada tipo de petición
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

//debemos definir las rutas para los archivos
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// === RUTAS DEL CATÁLOGO DE BRAWL STARS ===
// Importamos los 4 controladores
const brawlersRouter = require('./Routers/brawlers');
const modosRouter = require('./Routers/modos_juego');
const jugadoresRouter = require('./Routers/jugadores');
const partidasRouter = require('./Routers/partidas');

// Asignamos las rutas a cada controlador
app.use('/api/brawlers', brawlersRouter);
app.use('/api/modos_juego', modosRouter);
app.use('/api/jugadores', jugadoresRouter);
app.use('/api/partidas', partidasRouter);

// === DOCUMENTACIÓN DE LA API ===
app.get('/api', (req, res) => {
    res.json({
        status: 'success',
        message: 'API REST BRAWL STARS',
        endpoint : {
            brawlers: {
                listar : 'GET /api/brawlers',
                obtener: 'GET /api/brawlers/:id',
                crear : 'POST /api/brawlers',
                actualizar : 'PUT /api/brawlers/:id',
                eliminar : 'DELETE /api/brawlers/:id',
            },
            modos_juego: {
                listar : 'GET /api/modos_juego',
                obtener: 'GET /api/modos_juego/:id',
                crear : 'POST /api/modos_juego',
                actualizar : 'PUT /api/modos_juego/:id',
                eliminar : 'DELETE /api/modos_juego/:id',
            },
            jugadores: {
                listar : 'GET /api/jugadores',
                obtener: 'GET /api/jugadores/:id',
                crear : 'POST /api/jugadores',
                actualizar : 'PUT /api/jugadores/:id',
                eliminar : 'DELETE /api/jugadores/:id',
            },
            partidas: {
                listar : 'GET /api/partidas',
                obtener: 'GET /api/partidas/:id',
                crear : 'POST /api/partidas',
                actualizar : 'PUT /api/partidas/:id',
                eliminar : 'DELETE /api/partidas/:id',
            }
        }
     });
});

//vamos a crear una funcion para las rutas inexistentes
app.use('/api/', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada'
    });
});

//necesitamos un manejador de errores
app.use((err, req, res, next) => {
    console.error('error no manejado:', err.message);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto ${PORT}`);
});