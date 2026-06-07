// ============================================================
// BRAWL STARS - Rutas de Brawlers (Express Router)
// ============================================================
const express = require('express');
const router = express.Router();
const db = require('../DB/db'); // Adaptado al nombre de tu archivo de conexión

// ============================================================
// FUNCIÓN: Validar datos de Brawler
// ============================================================
function validarBrawler(datos) {
    const errores = [];
    if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim().length < 2) {
        errores.push('El nombre es obligatorio y debe tener al menos 2 caracteres');
    }
    if (!datos.clase || typeof datos.clase !== 'string') {
        errores.push('La clase es obligatoria');
    }
    if (!datos.rareza || typeof datos.rareza !== 'string') {
        errores.push('La rareza es obligatoria');
    }
    return errores;
}

// ============================================================
// GET /api/brawlers — Listar todos los brawlers
// ============================================================
router.get('/', async (req, res) => {
    try {
        const [brawlers] = await db.execute(
            'SELECT id, nombre, clase, rareza, created_at, updated_at FROM brawlers ORDER BY id ASC'
        );
        res.json({
            status: 'success',
            data: brawlers,
            count: brawlers.length
        });
    } catch (error) {
        console.error('Error al listar brawlers:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// GET /api/brawlers/:id — Obtener un brawler por ID
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [brawlers] = await db.execute(
            'SELECT id, nombre, clase, rareza, created_at, updated_at FROM brawlers WHERE id = ?',
            [id]
        );
        if (brawlers.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Brawler con ID ${id} no encontrado`
            });
        }
        res.json({ status: 'success', data: brawlers[0] });
    } catch (error) {
        console.error('Error al obtener brawler:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// POST /api/brawlers — Crear nuevo brawler
// ============================================================
router.post('/', async (req, res) => {
    try {
        const errores = validarBrawler(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }
        const { nombre, clase, rareza } = req.body;
        const [resultado] = await db.execute(
            'INSERT INTO brawlers (nombre, clase, rareza) VALUES (?, ?, ?)',
            [nombre.trim(), clase.trim(), rareza.trim()]
        );
        const [nuevoBrawler] = await db.execute(
            'SELECT id, nombre, clase, rareza, created_at FROM brawlers WHERE id = ?',
            [resultado.insertId]
        );
        res.status(201).json({ status: 'success', data: nuevoBrawler[0] });
    } catch (error) {
        console.error('Error al crear brawler:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// PUT /api/brawlers/:id — Actualizar brawler
// ============================================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [existente] = await db.execute('SELECT id FROM brawlers WHERE id = ?', [id]);
        if (existente.length === 0) {
            return res.status(404).json({ status: 'error', message: `Brawler con ID ${id} no encontrado` });
        }
        const errores = validarBrawler(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }
        const { nombre, clase, rareza } = req.body;
        await db.execute(
            'UPDATE brawlers SET nombre = ?, clase = ?, rareza = ? WHERE id = ?',
            [nombre.trim(), clase.trim(), rareza.trim(), id]
        );
        const [actualizado] = await db.execute(
            'SELECT id, nombre, clase, rareza, created_at, updated_at FROM brawlers WHERE id = ?',
            [id]
        );
        res.json({ status: 'success', data: actualizado[0] });
    } catch (error) {
        console.error('Error al actualizar brawler:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// DELETE /api/brawlers/:id — Eliminar brawler
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Evitar eliminación si existen partidas relacionadas
        const [refs] = await db.execute('SELECT COUNT(*) AS cnt FROM partidas WHERE brawler_id = ?', [id]);
        if (refs[0].cnt > 0) {
            return res.status(409).json({ status: 'error', message: 'No se puede eliminar: existen partidas asociadas a este brawler' });
        }

        const [brawler] = await db.execute('SELECT id, nombre FROM brawlers WHERE id = ?', [id]);
        if (brawler.length === 0) {
            return res.status(404).json({ status: 'error', message: `Brawler con ID ${id} no encontrado` });
        }
        await db.execute('DELETE FROM brawlers WHERE id = ?', [id]);
        res.json({
            status: 'success',
            data: { eliminado: brawler[0], mensaje: `Brawler "${brawler[0].nombre}" eliminado` }
        });
    } catch (error) {
        console.error('Error al eliminar brawler:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;