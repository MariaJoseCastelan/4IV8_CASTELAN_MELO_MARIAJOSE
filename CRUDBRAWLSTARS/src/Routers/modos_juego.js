// ============================================================
// BRAWL STARS - Rutas de Modos de Juego (Express Router)
// ============================================================
const express = require('express');
const router = express.Router();
const db = require('../DB/db');

function validarModo(datos) {
    const errores = [];
    if (!datos.nombre_modo || typeof datos.nombre_modo !== 'string' || datos.nombre_modo.trim().length < 2) {
        errores.push('El nombre del modo es obligatorio y debe tener al menos 2 caracteres');
    }
    if (!datos.mapa_principal || typeof datos.mapa_principal !== 'string') {
        errores.push('El nombre del mapa es obligatorio');
    }
    return errores;
}

router.get('/', async (req, res) => {
    try {
        const [modos] = await db.execute('SELECT id, nombre_modo, mapa_principal, created_at, updated_at FROM modos_juego ORDER BY id ASC');
        res.json({ status: 'success', data: modos, count: modos.length });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [modos] = await db.execute('SELECT id, nombre_modo, mapa_principal, created_at, updated_at FROM modos_juego WHERE id = ?', [id]);
        if (modos.length === 0) {
            return res.status(404).json({ status: 'error', message: `Modo con ID ${id} no encontrado` });
        }
        res.json({ status: 'success', data: modos[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const errores = validarModo(req.body);
        if (errores.length > 0) return res.status(400).json({ status: 'error', message: errores.join('; ') });

        const { nombre_modo, mapa_principal } = req.body;
        const [resultado] = await db.execute(
            'INSERT INTO modos_juego (nombre_modo, mapa_principal) VALUES (?, ?)',
            [nombre_modo.trim(), mapa_principal.trim()]
        );
        const [nuevoModo] = await db.execute('SELECT id, nombre_modo, mapa_principal, created_at FROM modos_juego WHERE id = ?', [resultado.insertId]);
        res.status(201).json({ status: 'success', data: nuevoModo[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [existente] = await db.execute('SELECT id FROM modos_juego WHERE id = ?', [id]);
        if (existente.length === 0) return res.status(404).json({ status: 'error', message: `Modo no encontrado` });

        const errores = validarModo(req.body);
        if (errores.length > 0) return res.status(400).json({ status: 'error', message: errores.join('; ') });

        const { nombre_modo, mapa_principal } = req.body;
        await db.execute('UPDATE modos_juego SET nombre_modo = ?, mapa_principal = ? WHERE id = ?', [nombre_modo.trim(), mapa_principal.trim(), id]);
        const [actualizado] = await db.execute('SELECT id, nombre_modo, mapa_principal, created_at, updated_at FROM modos_juego WHERE id = ?', [id]);
        res.json({ status: 'success', data: actualizado[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Evitar eliminación si existen partidas relacionadas
        const [refs] = await db.execute('SELECT COUNT(*) AS cnt FROM partidas WHERE modo_id = ?', [id]);
        if (refs[0].cnt > 0) {
            return res.status(409).json({ status: 'error', message: 'No se puede eliminar: existen partidas asociadas a este modo' });
        }

        const [modo] = await db.execute('SELECT id, nombre_modo FROM modos_juego WHERE id = ?', [id]);
        if (modo.length === 0) return res.status(404).json({ status: 'error', message: `Modo no encontrado` });

        await db.execute('DELETE FROM modos_juego WHERE id = ?', [id]);
        res.json({ status: 'success', data: { eliminado: modo[0], mensaje: `Modo "${modo[0].nombre_modo}" eliminado` } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;