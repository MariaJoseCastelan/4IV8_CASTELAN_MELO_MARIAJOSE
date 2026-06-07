// ============================================================
// BRAWL STARS - Frontend del Sistema
// ============================================================

// ============================================================
// 1. UTILIDADES COMPARTIDAS
// ============================================================
const apiMetodo = document.getElementById('api-metodo');
const apiUrl = document.getElementById('api-url');
const apiCodigo = document.getElementById('api-codigo');
const notificacionDiv = document.getElementById('notificacion');

async function fetchAPI(url, opciones = {}) {
    const method = opciones.method || 'GET';
    apiMetodo.textContent = method;
    apiMetodo.className = `badge badge-${method.toLowerCase()}`;
    apiUrl.textContent = url;
    apiCodigo.textContent = '...';
    
    try {
        const respuesta = await fetch(url, opciones);
        apiCodigo.textContent = `${respuesta.status}`;
        apiCodigo.className = `badge ${respuesta.ok ? 'badge-success' : 'badge-error'}`;

        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.message || `Error ${respuesta.status}`);
        return datos;
    } catch (error) {
        apiCodigo.textContent = 'ERROR';
        apiCodigo.className = 'badge badge-error';
        throw error;
    }
}

function mostrarNotificacion(mensaje, tipo) {
    notificacionDiv.textContent = mensaje;
    notificacionDiv.className = `notificacion ${tipo}`;
    notificacionDiv.style.display = 'block';
    setTimeout(() => { notificacionDiv.style.display = 'none'; }, 3000);
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ============================================================
// 2. CRUD BRAWLERS
// ============================================================
async function cargarBrawlers() {
    try {
        const resp = await fetchAPI('/api/brawlers');
        const tbody = document.getElementById('tbody-brawlers');
        tbody.innerHTML = '';
        resp.data.forEach(b => {
            tbody.innerHTML += `<tr>
                <td>${b.id}</td>
                <td>${escapeHtml(b.nombre)}</td>
                <td>${escapeHtml(b.clase)}</td>
                <td>${escapeHtml(b.rareza)}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarBrawler(${b.id})">Eliminar</button>
                </td>
            </tr>`;
        });
    } catch (error) { mostrarNotificacion(error.message, 'error'); }
}

async function eliminarBrawler(id) {
    if(!confirm('¿Eliminar brawler?')) return;
    await fetchAPI(`/api/brawlers/${id}`, { method: 'DELETE' });
    cargarBrawlers();
}

// ============================================================
// 3. CRUD MODOS DE JUEGO
// ============================================================
async function cargarModos() {
    try {
        const resp = await fetchAPI('/api/modos');
        const tbody = document.getElementById('tbody-modos');
        tbody.innerHTML = '';
        resp.data.forEach(m => {
            tbody.innerHTML += `<tr>
                <td>${m.id}</td>
                <td>${escapeHtml(m.nombre)}</td>
                <td>${escapeHtml(m.mapa)}</td>
                <td><button class="btn-eliminar" onclick="eliminarModo(${m.id})">Eliminar</button></td>
            </tr>`;
        });
    } catch (error) { mostrarNotificacion(error.message, 'error'); }
}

async function eliminarModo(id) {
    await fetchAPI(`/api/modos/${id}`, { method: 'DELETE' });
    cargarModos();
}

// ============================================================
// 4. CRUD JUGADORES
// ============================================================
async function cargarJugadores() {
    try {
        const resp = await fetchAPI('/api/jugadores');
        const tbody = document.getElementById('tbody-jugadores');
        tbody.innerHTML = '';
        resp.data.forEach(j => {
            tbody.innerHTML += `<tr>
                <td>${j.id}</td>
                <td>${escapeHtml(j.nombre)}</td>
                <td>${j.trofeos}</td>
                <td><button class="btn-eliminar" onclick="eliminarJugador(${j.id})">Eliminar</button></td>
            </tr>`;
        });
    } catch (error) { mostrarNotificacion(error.message, 'error'); }
}

async function eliminarJugador(id) {
    await fetchAPI(`/api/jugadores/${id}`, { method: 'DELETE' });
    cargarJugadores();
}

// ============================================================
// 5. MÓDULO DE PARTIDAS (Logica de Selects Dinámicos)
// ============================================================
async function cargarSelectsPartidas() {
    const [brawlers, jugadores, modos] = await Promise.all([
        fetchAPI('/api/brawlers'),
        fetchAPI('/api/jugadores'),
        fetchAPI('/api/modos')
    ]);

    const fillSelect = (id, data, label) => {
        const sel = document.getElementById(id);
        sel.innerHTML = `<option value="">Seleccionar ${label}</option>`;
        data.forEach(item => {
            sel.innerHTML += `<option value="${item.id}">${item.nombre}</option>`;
        });
    };

    fillSelect('sel-jugador', jugadores.data, 'jugador');
    fillSelect('sel-brawler', brawlers.data, 'brawler');
    fillSelect('sel-modo', modos.data, 'modo');
}

async function cargarPartidas() {
    try {
        const resp = await fetchAPI('/api/partidas');
        const tbody = document.getElementById('tbody-partidas');
        tbody.innerHTML = '';
        resp.data.forEach(p => {
            tbody.innerHTML += `<tr>
                <td>${p.jugador}</td>
                <td>${p.brawler}</td>
                <td>${p.modo}</td>
                <td>${p.resultado}</td>
            </tr>`;
        });
    } catch (error) { mostrarNotificacion(error.message, 'error'); }
}

// ============================================================
// 6. NAVEGACIÓN
// ============================================================
function cambiarSeccion(seccion) {
    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
    document.getElementById(`seccion-${seccion}`).style.display = 'block';

    if (seccion === 'partidas') {
        cargarSelectsPartidas();
        cargarPartidas();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarBrawlers();
    cargarModos();
    cargarJugadores();
    cargarPartidas();
});