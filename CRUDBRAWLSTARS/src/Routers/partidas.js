// ============================================================
// BRAWL STARS - Rutas de Partidas (Express Router)
// ============================================================
const express = require('express');
const router = express.Router();
const db = require('../DB/db');

function validarPartida(datos) {
    const errores = [];
    if (!datos.jugador_id || isNaN(datos.jugador_id)) errores.push('El ID del jugador es obligatorio');
    if (!datos.brawler_id || isNaN(datos.brawler_id)) errores.push('El ID del brawler es obligatorio');
    if (!datos.modo_id || isNaN(datos.modo_id)) errores.push('El ID del modo es obligatorio');
    if (!['Victoria', 'Derrota', 'Empate'].includes(datos.resultado)) {
        errores.push('El resultado debe ser Victoria, Derrota o Empate');
    }
    return errores;
}

router.get('/', async (req, res) => {
    try {
        // Usamos JOIN para traer los nombres en lugar de solo los IDs numéricos
        const query = `
            SELECT p.id, p.resultado, p.created_at,
                   j.nombre_jugador AS jugador_nombre,
                   b.nombre AS brawler_nombre,
                   m.nombre_modo AS modo_nombre
            FROM partidas p
            JOIN jugadores j ON p.jugador_id = j.id
            JOIN brawlers b ON p.brawler_id = b.id
            JOIN modos_juego m ON p.modo_id = m.id
            ORDER BY p.id DESC
        `;
        const [partidas] = await db.execute(query);
        res.json({ status: 'success', data: partidas, count: partidas.length });
    } catch (error) {
        console.error('Error al listar partidas:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/jugador/:jugador_id', async (req, res) => {
    try {
        const { jugador_id } = req.params;
        const [jugadores] = await db.execute('SELECT id, nombre_jugador FROM jugadores WHERE id = ?', [jugador_id]);
        if (jugadores.length === 0) return res.status(404).json({ status: 'error', message: `Jugador no encontrado` });

        const query = `
            SELECT p.id, p.resultado, p.created_at,
                   b.nombre AS brawler_nombre,
                   m.nombre_modo AS modo_nombre
            FROM partidas p
            JOIN brawlers b ON p.brawler_id = b.id
            JOIN modos_juego m ON p.modo_id = m.id
            WHERE p.jugador_id = ?
            ORDER BY p.id DESC
        `;
        const [partidas] = await db.execute(query, [jugador_id]);
        res.json({ status: 'success', data: { jugador: jugadores[0], partidas: partidas, total_partidas: partidas.length } });
    } catch (error) {
        console.error('Error al obtener partidas del jugador:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT p.id, p.resultado, p.created_at,
                   j.nombre_jugador AS jugador,
                   b.nombre AS brawler,
                   m.nombre_modo AS modo
            FROM partidas p
            JOIN jugadores j ON p.jugador_id = j.id
            JOIN brawlers b ON p.brawler_id = b.id
            JOIN modos_juego m ON p.modo_id = m.id
            WHERE p.id = ?
        `;
        const [partidas] = await db.execute(query, [id]);
        if (partidas.length === 0) return res.status(404).json({ status: 'error', message: `Partida no encontrada` });
        res.json({ status: 'success', data: partidas[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const errores = validarPartida(req.body);
        if (errores.length > 0) return res.status(400).json({ status: 'error', message: errores.join('; ') });

        const { jugador_id, brawler_id, modo_id, resultado } = req.body;
        const [result] = await db.execute(
            'INSERT INTO partidas (jugador_id, brawler_id, modo_id, resultado) VALUES (?, ?, ?, ?)',
            [jugador_id, brawler_id, modo_id, resultado]
        );
        const query = `
            SELECT p.id, p.resultado, p.created_at,
                   j.nombre_jugador AS jugador,
                   b.nombre AS brawler,
                   m.nombre_modo AS modo
            FROM partidas p
            JOIN jugadores j ON p.jugador_id = j.id
            JOIN brawlers b ON p.brawler_id = b.id
            JOIN modos_juego m ON p.modo_id = m.id
            WHERE p.id = ?
        `;
        const [nuevaPartida] = await db.execute(query, [result.insertId]);
        res.status(201).json({ status: 'success', data: nuevaPartida[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor al registrar partida' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [existente] = await db.execute('SELECT id FROM partidas WHERE id = ?', [id]);
        if (existente.length === 0) return res.status(404).json({ status: 'error', message: `Partida no encontrada` });

        const errores = validarPartida(req.body);
        if (errores.length > 0) return res.status(400).json({ status: 'error', message: errores.join('; ') });

        const { jugador_id, brawler_id, modo_id, resultado } = req.body;
        await db.execute(
            'UPDATE partidas SET jugador_id = ?, brawler_id = ?, modo_id = ?, resultado = ? WHERE id = ?',
            [jugador_id, brawler_id, modo_id, resultado, id]
        );
        const query = `
            SELECT p.id, p.resultado, p.created_at,
                   j.nombre_jugador AS jugador,
                   b.nombre AS brawler,
                   m.nombre_modo AS modo
            FROM partidas p
            JOIN jugadores j ON p.jugador_id = j.id
            JOIN brawlers b ON p.brawler_id = b.id
            JOIN modos_juego m ON p.modo_id = m.id
            WHERE p.id = ?
        `;
        const [actualizado] = await db.execute(query, [id]);
        res.json({ status: 'success', data: actualizado[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [partida] = await db.execute('SELECT id FROM partidas WHERE id = ?', [id]);
        if (partida.length === 0) return res.status(404).json({ status: 'error', message: `Partida no encontrada` });

        await db.execute('DELETE FROM partidas WHERE id = ?', [id]);
        res.json({ status: 'success', data: { eliminado: partida[0], mensaje: `Registro de partida eliminado` } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;