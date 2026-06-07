// ============================================================
// BRAWL STARS - Rutas de Jugadores (Express Router)
// ============================================================
const express = require('express');
const router = express.Router();
const db = require('../DB/db');

function validarJugador(datos) {
    const errores = [];
    if (!datos.nombre_jugador || typeof datos.nombre_jugador !== 'string' || datos.nombre_jugador.trim().length < 2) {
        errores.push('El nombre del jugador (Tag) es obligatorio');
    }
    if (datos.rango_trofeos === undefined || isNaN(datos.rango_trofeos) || Number(datos.rango_trofeos) < 0) {
        errores.push('Los trofeos deben ser un número válido mayor o igual a cero');
    }
    return errores;
}

router.get('/', async (req, res) => {
    try {
        const [jugadores] = await db.execute('SELECT id, nombre_jugador, rango_trofeos, created_at, updated_at FROM jugadores ORDER BY id ASC');
        res.json({ status: 'success', data: jugadores, count: jugadores.length });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [jugadores] = await db.execute('SELECT id, nombre_jugador, rango_trofeos, created_at, updated_at FROM jugadores WHERE id = ?', [id]);
        if (jugadores.length === 0) return res.status(404).json({ status: 'error', message: `Jugador no encontrado` });
        res.json({ status: 'success', data: jugadores[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const errores = validarJugador(req.body);
        if (errores.length > 0) return res.status(400).json({ status: 'error', message: errores.join('; ') });

        const { nombre_jugador, rango_trofeos } = req.body;
        const [resultado] = await db.execute(
            'INSERT INTO jugadores (nombre_jugador, rango_trofeos) VALUES (?, ?)',
            [nombre_jugador.trim(), Number(rango_trofeos)]
        );
        const [nuevoJugador] = await db.execute('SELECT id, nombre_jugador, rango_trofeos, created_at FROM jugadores WHERE id = ?', [resultado.insertId]);
        res.status(201).json({ status: 'success', data: nuevoJugador[0] });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ status: 'error', message: 'Ya existe un jugador con ese nombre (Tag)' });
        }
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [existente] = await db.execute('SELECT id FROM jugadores WHERE id = ?', [id]);
        if (existente.length === 0) return res.status(404).json({ status: 'error', message: `Jugador no encontrado` });

        const errores = validarJugador(req.body);
        if (errores.length > 0) return res.status(400).json({ status: 'error', message: errores.join('; ') });

        const { nombre_jugador, rango_trofeos } = req.body;
        await db.execute('UPDATE jugadores SET nombre_jugador = ?, rango_trofeos = ? WHERE id = ?', [nombre_jugador.trim(), Number(rango_trofeos), id]);
        const [actualizado] = await db.execute('SELECT id, nombre_jugador, rango_trofeos, created_at, updated_at FROM jugadores WHERE id = ?', [id]);
        res.json({ status: 'success', data: actualizado[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Evitar eliminación si existen partidas relacionadas
        const [refs] = await db.execute('SELECT COUNT(*) AS cnt FROM partidas WHERE jugador_id = ?', [id]);
        if (refs[0].cnt > 0) {
            return res.status(409).json({ status: 'error', message: 'No se puede eliminar: existen partidas asociadas a este jugador' });
        }

        const [jugador] = await db.execute('SELECT id, nombre_jugador FROM jugadores WHERE id = ?', [id]);
        if (jugador.length === 0) return res.status(404).json({ status: 'error', message: `Jugador no encontrado` });

        await db.execute('DELETE FROM jugadores WHERE id = ?', [id]);
        res.json({ status: 'success', data: { eliminado: jugador[0], mensaje: `Jugador "${jugador[0].nombre_jugador}" eliminado` } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;