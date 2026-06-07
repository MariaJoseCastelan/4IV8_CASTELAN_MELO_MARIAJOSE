// ============================================================
// PRÁCTICA 3 - PNT: Frontend para Sistema Brawl Stars
// ============================================================
// Este frontend maneja 4 secciones: Brawlers, Modos de Juego,
// Jugadores y Partidas.
// Cada sección tiene su propio formulario y tabla.
//
// ESTRUCTURA DEL CÓDIGO:
// 1. Utilidades compartidas (fetchAPI, notificaciones, etc.)
// 2. Módulo de Brawlers (CRUD)
// 3. Módulo de Modos de Juego (CRUD)
// 4. Módulo de Jugadores (CRUD)
// 5. Módulo de Partidas (crear, listar, eliminar)
// 6. Navegación por pestañas
// 7. Inicialización
//
// EVOLUCIÓN DESDE P2:
// - Múltiples recursos (no solo un módulo)
// - Selects dinámicos (llenar opciones desde la API)
// - Navegación por pestañas sin recargar página (SPA-like)
// ============================================================

// ============================================================
// 1. UTILIDADES COMPARTIDAS
// ============================================================

// Panel de estado de la API
const apiMetodo = document.getElementById('api-metodo');
const apiUrl    = document.getElementById('api-url');
const apiCodigo = document.getElementById('api-codigo');
const notificacionDiv = document.getElementById('notificacion');

// Fetch wrapper con logging (evolución de P2)
async function fetchAPI(url, opciones = {}) {
    const method = opciones.method || 'GET';

    apiMetodo.textContent = method;
    apiMetodo.className   = `badge badge-${method.toLowerCase()}`;
    apiUrl.textContent    = url;
    apiCodigo.textContent = '...';
    apiCodigo.className   = 'badge badge-neutral';

    try {
        const respuesta = await fetch(url, opciones);
        apiCodigo.textContent = `${respuesta.status}`;
        apiCodigo.className   = `badge ${respuesta.ok ? 'badge-success' : 'badge-error'}`;

        const datos = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(datos.message || `Error ${respuesta.status}`);
        }
        return datos;
    } catch (error) {
        if (apiCodigo.textContent === '...') {
            apiCodigo.textContent = 'ERROR';
            apiCodigo.className   = 'badge badge-error';
        }
        throw error;
    }
}

function mostrarNotificacion(mensaje, tipo) {
    notificacionDiv.textContent = mensaje;
    notificacionDiv.className   = `notificacion ${tipo}`;
    notificacionDiv.style.display = 'block';
    setTimeout(() => { notificacionDiv.style.display = 'none'; }, 3000);
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function formatearFechaHora(fechaISO) {
    if (!fechaISO) return '-';
    return new Date(fechaISO).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// ============================================================
// 2. MÓDULO DE BRAWLERS
// ============================================================
const formBrawler       = document.getElementById('form-brawler');
const inputBrawlerId    = document.getElementById('brawler-id');
const inputBrawlerNombre = document.getElementById('brawler-nombre');
const inputBrawlerClase  = document.getElementById('brawler-clase');
const inputBrawlerRareza = document.getElementById('brawler-rareza');
const formTituloBrawler  = document.getElementById('form-titulo-brawler');
const btnGuardarBrawler  = document.getElementById('btn-guardar-brawler');
const btnCancelarBrawler = document.getElementById('btn-cancelar-brawler');
const tbodyBrawlers      = document.getElementById('tbody-brawlers');
const tablaBrawlers      = document.getElementById('tabla-brawlers');
const cargaBrawlers      = document.getElementById('carga-brawlers');
const contadorBrawlers   = document.getElementById('contador-brawlers');
const errorBrawlerNombre = document.getElementById('error-brawler-nombre');
const errorBrawlerClase  = document.getElementById('error-brawler-clase');
const errorBrawlerRareza = document.getElementById('error-brawler-rareza');

async function cargarBrawlers() {
    try {
        const resp = await fetchAPI('/api/brawlers');
        cargaBrawlers.style.display = 'none';

        if (resp.data.length === 0) {
            tablaBrawlers.style.display = 'none';
            cargaBrawlers.textContent   = 'No hay brawlers registrados.';
            cargaBrawlers.style.display = 'block';
        } else {
            tablaBrawlers.style.display = 'table';
            tbodyBrawlers.innerHTML     = '';
            resp.data.forEach(b => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${b.id}</td>
                    <td>${escapeHtml(b.nombre)}</td>
                    <td>${escapeHtml(b.clase)}</td>
                    <td>${escapeHtml(b.rareza)}</td>
                    <td>
                        <button class="btn-editar"   onclick="editarBrawler(${b.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarBrawler(${b.id}, '${escapeHtml(b.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyBrawlers.appendChild(fila);
            });
        }
        contadorBrawlers.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar brawlers: ' + error.message, 'error');
    }
}

function validarFormBrawler() {
    let ok = true;
    const nombre = inputBrawlerNombre.value.trim();
    const clase  = inputBrawlerClase.value.trim();
    const rareza = inputBrawlerRareza.value.trim();

    if (!nombre || nombre.length < 2) {
        errorBrawlerNombre.textContent = 'Mínimo 2 caracteres';
        inputBrawlerNombre.classList.add('input-error');
        ok = false;
    } else {
        errorBrawlerNombre.textContent = '';
        inputBrawlerNombre.classList.remove('input-error');
    }

    if (!clase || clase.length < 2) {
        errorBrawlerClase.textContent = 'Mínimo 2 caracteres';
        inputBrawlerClase.classList.add('input-error');
        ok = false;
    } else {
        errorBrawlerClase.textContent = '';
        inputBrawlerClase.classList.remove('input-error');
    }

    if (!rareza || rareza.length < 2) {
        errorBrawlerRareza.textContent = 'Mínimo 2 caracteres';
        inputBrawlerRareza.classList.add('input-error');
        ok = false;
    } else {
        errorBrawlerRareza.textContent = '';
        inputBrawlerRareza.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormBrawler() {
    formBrawler.reset();
    inputBrawlerId.value         = '';
    formTituloBrawler.textContent = 'Agregar Brawler';
    btnGuardarBrawler.textContent = 'Guardar';
    btnCancelarBrawler.style.display = 'none';
    errorBrawlerNombre.textContent = '';
    errorBrawlerClase.textContent  = '';
    errorBrawlerRareza.textContent = '';
    inputBrawlerNombre.classList.remove('input-error');
    inputBrawlerClase.classList.remove('input-error');
    inputBrawlerRareza.classList.remove('input-error');
}

formBrawler.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormBrawler()) return;

    const datos = {
        nombre: inputBrawlerNombre.value.trim(),
        clase:  inputBrawlerClase.value.trim(),
        rareza: inputBrawlerRareza.value.trim()
    };
    const id = inputBrawlerId.value;

    try {
        if (id) {
            await fetchAPI(`/api/brawlers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Brawler actualizado', 'exito');
        } else {
            await fetchAPI('/api/brawlers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Brawler creado', 'exito');
        }
        limpiarFormBrawler();
        cargarBrawlers();
        cargarSelectBrawlers(); // Actualizar select de partidas
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarBrawler(id) {
    try {
        const resp = await fetchAPI(`/api/brawlers/${id}`);
        inputBrawlerId.value    = resp.data.id;
        inputBrawlerNombre.value = resp.data.nombre;
        inputBrawlerClase.value  = resp.data.clase;
        inputBrawlerRareza.value = resp.data.rareza;
        formTituloBrawler.textContent = 'Editar Brawler';
        btnGuardarBrawler.textContent = 'Actualizar';
        btnCancelarBrawler.style.display = 'inline-block';
        cambiarSeccion('brawlers');
        formBrawler.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarBrawler(id, nombre) {
    if (confirm(`¿Eliminar a "${nombre}"?\nSi tiene partidas asociadas, no se podrá eliminar.`)) {
        eliminarBrawler(id);
    }
}

async function eliminarBrawler(id) {
    try {
        await fetchAPI(`/api/brawlers/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Brawler eliminado', 'exito');
        if (inputBrawlerId.value === String(id)) limpiarFormBrawler();
        cargarBrawlers();
        cargarSelectBrawlers();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarBrawler.addEventListener('click', limpiarFormBrawler);

// ============================================================
// 3. MÓDULO DE MODOS DE JUEGO
// ============================================================
const formModo       = document.getElementById('form-modo');
const inputModoId    = document.getElementById('modo-id');
const inputModoNombre = document.getElementById('modo-nombre');
const inputModoMapa   = document.getElementById('modo-mapa');
const formTituloModo  = document.getElementById('form-titulo-modo');
const btnGuardarModo  = document.getElementById('btn-guardar-modo');
const btnCancelarModo = document.getElementById('btn-cancelar-modo');
const tbodyModos      = document.getElementById('tbody-modos');
const tablaModos      = document.getElementById('tabla-modos');
const cargaModos      = document.getElementById('carga-modos');
const contadorModos   = document.getElementById('contador-modos');
const errorModoNombre = document.getElementById('error-modo-nombre');
const errorModoMapa   = document.getElementById('error-modo-mapa');

async function cargarModos() {
    try {
        const resp = await fetchAPI('/api/modos_juego');
        cargaModos.style.display = 'none';

        if (resp.data.length === 0) {
            tablaModos.style.display = 'none';
            cargaModos.textContent   = 'No hay modos de juego registrados.';
            cargaModos.style.display = 'block';
        } else {
            tablaModos.style.display = 'table';
            tbodyModos.innerHTML     = '';
            resp.data.forEach(m => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${m.id}</td>
                    <td>${escapeHtml(m.nombre_modo)}</td>
                    <td>${escapeHtml(m.mapa_principal)}</td>
                    <td>
                        <button class="btn-editar"   onclick="editarModo(${m.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarModo(${m.id}, '${escapeHtml(m.nombre_modo)}')">Eliminar</button>
                    </td>
                `;
                tbodyModos.appendChild(fila);
            });
        }
        contadorModos.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar modos de juego: ' + error.message, 'error');
    }
}

function validarFormModo() {
    let ok = true;
    const nombre = inputModoNombre.value.trim();
    const mapa   = inputModoMapa.value.trim();

    if (!nombre || nombre.length < 2) {
        errorModoNombre.textContent = 'Mínimo 2 caracteres';
        inputModoNombre.classList.add('input-error');
        ok = false;
    } else {
        errorModoNombre.textContent = '';
        inputModoNombre.classList.remove('input-error');
    }

    if (!mapa || mapa.length < 2) {
        errorModoMapa.textContent = 'Mínimo 2 caracteres';
        inputModoMapa.classList.add('input-error');
        ok = false;
    } else {
        errorModoMapa.textContent = '';
        inputModoMapa.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormModo() {
    formModo.reset();
    inputModoId.value            = '';
    formTituloModo.textContent   = 'Agregar Modo de Juego';
    btnGuardarModo.textContent   = 'Guardar';
    btnCancelarModo.style.display = 'none';
    errorModoNombre.textContent  = '';
    errorModoMapa.textContent    = '';
    inputModoNombre.classList.remove('input-error');
    inputModoMapa.classList.remove('input-error');
}

formModo.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormModo()) return;

    // Nota: los nombres de campo coinciden exactamente con la BD
    // (nombre_modo y mapa_principal según la tabla modos_juego)
    const datos = {
        nombre_modo:    inputModoNombre.value.trim(),
        mapa_principal: inputModoMapa.value.trim()
    };
    const id = inputModoId.value;

    try {
        if (id) {
            await fetchAPI(`/api/modos_juego/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Modo de juego actualizado', 'exito');
        } else {
            await fetchAPI('/api/modos_juego', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Modo de juego creado', 'exito');
        }
        limpiarFormModo();
        cargarModos();
        cargarSelectModos(); // Actualizar select de partidas
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarModo(id) {
    try {
        const resp = await fetchAPI(`/api/modos_juego/${id}`);
        inputModoId.value    = resp.data.id;
        inputModoNombre.value = resp.data.nombre_modo;
        inputModoMapa.value   = resp.data.mapa_principal;
        formTituloModo.textContent   = 'Editar Modo de Juego';
        btnGuardarModo.textContent   = 'Actualizar';
        btnCancelarModo.style.display = 'inline-block';
        cambiarSeccion('modos_juego');
        formModo.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarModo(id, nombre) {
    if (confirm(`¿Eliminar el modo "${nombre}"?\nSi tiene partidas asociadas, no se podrá eliminar.`)) {
        eliminarModo(id);
    }
}

async function eliminarModo(id) {
    try {
        await fetchAPI(`/api/modos_juego/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Modo de juego eliminado', 'exito');
        if (inputModoId.value === String(id)) limpiarFormModo();
        cargarModos();
        cargarSelectModos();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarModo.addEventListener('click', limpiarFormModo);

// ============================================================
// 4. MÓDULO DE JUGADORES
// ============================================================
const formJugador        = document.getElementById('form-jugador');
const inputJugadorId     = document.getElementById('jugador-id');
const inputJugadorNombre  = document.getElementById('jugador-nombre');
const inputJugadorTrofeos = document.getElementById('jugador-trofeos');
const formTituloJugador   = document.getElementById('form-titulo-jugador');
const btnGuardarJugador   = document.getElementById('btn-guardar-jugador');
const btnCancelarJugador  = document.getElementById('btn-cancelar-jugador');
const tbodyJugadores      = document.getElementById('tbody-jugadores');
const tablaJugadores      = document.getElementById('tabla-jugadores');
const cargaJugadores      = document.getElementById('carga-jugadores');
const contadorJugadores   = document.getElementById('contador-jugadores');
const errorJugadorNombre   = document.getElementById('error-jugador-nombre');
const errorJugadorTrofeos  = document.getElementById('error-jugador-trofeos');

async function cargarJugadores() {
    try {
        const resp = await fetchAPI('/api/jugadores');
        cargaJugadores.style.display = 'none';

        if (resp.data.length === 0) {
            tablaJugadores.style.display = 'none';
            cargaJugadores.textContent   = 'No hay jugadores registrados.';
            cargaJugadores.style.display = 'block';
        } else {
            tablaJugadores.style.display = 'table';
            tbodyJugadores.innerHTML     = '';
            resp.data.forEach(j => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${j.id}</td>
                    <td>${escapeHtml(j.nombre_jugador)}</td>
                    <td>${j.rango_trofeos}</td>
                    <td>
                        <button class="btn-ver"      onclick="verPartidasJugador(${j.id})">Partidas</button>
                        <button class="btn-editar"   onclick="editarJugador(${j.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarJugador(${j.id}, '${escapeHtml(j.nombre_jugador)}')">Eliminar</button>
                    </td>
                `;
                tbodyJugadores.appendChild(fila);
            });
        }
        contadorJugadores.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar jugadores: ' + error.message, 'error');
    }
}

function validarFormJugador() {
    let ok = true;
    const nombre  = inputJugadorNombre.value.trim();
    const trofeos = inputJugadorTrofeos.value;

    if (!nombre || nombre.length < 2) {
        errorJugadorNombre.textContent = 'Mínimo 2 caracteres';
        inputJugadorNombre.classList.add('input-error');
        ok = false;
    } else {
        errorJugadorNombre.textContent = '';
        inputJugadorNombre.classList.remove('input-error');
    }

    if (trofeos === '' || parseInt(trofeos) < 0) {
        errorJugadorTrofeos.textContent = 'Debe ser un número mayor o igual a 0';
        inputJugadorTrofeos.classList.add('input-error');
        ok = false;
    } else {
        errorJugadorTrofeos.textContent = '';
        inputJugadorTrofeos.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormJugador() {
    formJugador.reset();
    inputJugadorId.value             = '';
    formTituloJugador.textContent    = 'Agregar Jugador';
    btnGuardarJugador.textContent    = 'Guardar';
    btnCancelarJugador.style.display = 'none';
    errorJugadorNombre.textContent   = '';
    errorJugadorTrofeos.textContent  = '';
    inputJugadorNombre.classList.remove('input-error');
    inputJugadorTrofeos.classList.remove('input-error');
}

formJugador.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormJugador()) return;

    // nombre_jugador y rango_trofeos coinciden con los campos de la BD
    const datos = {
        nombre_jugador: inputJugadorNombre.value.trim(),
        rango_trofeos:  parseInt(inputJugadorTrofeos.value)
    };
    const id = inputJugadorId.value;

    try {
        if (id) {
            await fetchAPI(`/api/jugadores/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Jugador actualizado', 'exito');
        } else {
            await fetchAPI('/api/jugadores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Jugador creado', 'exito');
        }
        limpiarFormJugador();
        cargarJugadores();
        cargarSelectJugadores(); // Actualizar select de partidas
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarJugador(id) {
    try {
        const resp = await fetchAPI(`/api/jugadores/${id}`);
        inputJugadorId.value     = resp.data.id;
        inputJugadorNombre.value  = resp.data.nombre_jugador;
        inputJugadorTrofeos.value = resp.data.rango_trofeos;
        formTituloJugador.textContent    = 'Editar Jugador';
        btnGuardarJugador.textContent    = 'Actualizar';
        btnCancelarJugador.style.display = 'inline-block';
        cambiarSeccion('jugadores');
        formJugador.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarJugador(id, nombre) {
    if (confirm(`¿Eliminar a "${nombre}" y todas sus partidas?`)) {
        eliminarJugador(id);
    }
}

async function eliminarJugador(id) {
    try {
        await fetchAPI(`/api/jugadores/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Jugador eliminado', 'exito');
        if (inputJugadorId.value === String(id)) limpiarFormJugador();
        cargarJugadores();
        cargarSelectJugadores();
        cargarPartidas();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

// Ver partidas de un jugador específico (equivalente a verComprasUsuario)
async function verPartidasJugador(id) {
    try {
        const resp = await fetchAPI(`/api/partidas/jugador/${id}`);
        const { jugador, partidas, total_partidas } = resp.data;

        let mensaje = `${jugador.nombre_jugador} tiene ${total_partidas} partida(s).\n\n`;
        partidas.forEach(p => {
            mensaje += `- Brawler: ${p.brawler_nombre} | Modo: ${p.modo_nombre} | Resultado: ${p.resultado}\n`;
        });

        alert(mensaje);
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarJugador.addEventListener('click', limpiarFormJugador);

// ============================================================
// 5. MÓDULO DE PARTIDAS
// ============================================================
const formPartida        = document.getElementById('form-partida');
const selectJugador      = document.getElementById('partida-jugador');
const selectBrawler      = document.getElementById('partida-brawler');
const selectModo         = document.getElementById('partida-modo');
const selectResultado    = document.getElementById('partida-resultado');
const tbodyPartidas      = document.getElementById('tbody-partidas');
const tablaPartidas      = document.getElementById('tabla-partidas');
const cargaPartidas      = document.getElementById('carga-partidas');
const contadorPartidas   = document.getElementById('contador-partidas');
const errorPartidaJugador  = document.getElementById('error-partida-jugador');
const errorPartidaBrawler  = document.getElementById('error-partida-brawler');
const errorPartidaModo     = document.getElementById('error-partida-modo');
const errorPartidaResultado = document.getElementById('error-partida-resultado');

// Llenar el <select> de jugadores con datos de la API.
// Los <select> se llenan dinámicamente cada vez que cambian
// los datos, para mantenerlos sincronizados con la BD.
async function cargarSelectJugadores() {
    try {
        const resp = await fetchAPI('/api/jugadores');
        selectJugador.innerHTML = '<option value="">-- Seleccionar Jugador --</option>';
        resp.data.forEach(j => {
            // createElement es más seguro que innerHTML para datos dinámicos
            const option = document.createElement('option');
            option.value       = j.id;
            option.textContent = `${j.nombre_jugador} (${j.rango_trofeos} trofeos)`;
            selectJugador.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select jugadores:', error);
    }
}

async function cargarSelectBrawlers() {
    try {
        const resp = await fetchAPI('/api/brawlers');
        selectBrawler.innerHTML = '<option value="">-- Seleccionar Brawler --</option>';
        resp.data.forEach(b => {
            const option = document.createElement('option');
            option.value       = b.id;
            option.textContent = `${b.nombre} (${b.clase} — ${b.rareza})`;
            selectBrawler.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select brawlers:', error);
    }
}

async function cargarSelectModos() {
    try {
        const resp = await fetchAPI('/api/modos_juego');
        selectModo.innerHTML = '<option value="">-- Seleccionar Modo --</option>';
        resp.data.forEach(m => {
            const option = document.createElement('option');
            option.value       = m.id;
            option.textContent = `${m.nombre_modo} — ${m.mapa_principal}`;
            selectModo.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select modos:', error);
    }
}

async function cargarPartidas() {
    try {
        const resp = await fetchAPI('/api/partidas');
        cargaPartidas.style.display = 'none';

        if (resp.data.length === 0) {
            tablaPartidas.style.display = 'none';
            cargaPartidas.textContent   = 'No hay partidas registradas.';
            cargaPartidas.style.display = 'block';
        } else {
            tablaPartidas.style.display = 'table';
            tbodyPartidas.innerHTML     = '';
            resp.data.forEach(p => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${p.id}</td>
                    <td>${escapeHtml(p.jugador_nombre)}</td>
                    <td>${escapeHtml(p.brawler_nombre)}</td>
                    <td>${escapeHtml(p.modo_nombre)}</td>
                    <td>${escapeHtml(p.resultado)}</td>
                    <td>${formatearFechaHora(p.created_at)}</td>
                    <td>
                        <button class="btn-eliminar" onclick="confirmarEliminarPartida(${p.id})">Eliminar</button>
                    </td>
                `;
                tbodyPartidas.appendChild(fila);
            });
        }
        contadorPartidas.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar partidas: ' + error.message, 'error');
    }
}

function validarFormPartida() {
    let ok = true;

    if (!selectJugador.value) {
        errorPartidaJugador.textContent = 'Selecciona un jugador';
        selectJugador.classList.add('input-error');
        ok = false;
    } else {
        errorPartidaJugador.textContent = '';
        selectJugador.classList.remove('input-error');
    }

    if (!selectBrawler.value) {
        errorPartidaBrawler.textContent = 'Selecciona un brawler';
        selectBrawler.classList.add('input-error');
        ok = false;
    } else {
        errorPartidaBrawler.textContent = '';
        selectBrawler.classList.remove('input-error');
    }

    if (!selectModo.value) {
        errorPartidaModo.textContent = 'Selecciona un modo de juego';
        selectModo.classList.add('input-error');
        ok = false;
    } else {
        errorPartidaModo.textContent = '';
        selectModo.classList.remove('input-error');
    }

    if (!selectResultado.value) {
        errorPartidaResultado.textContent = 'Selecciona un resultado';
        selectResultado.classList.add('input-error');
        ok = false;
    } else {
        errorPartidaResultado.textContent = '';
        selectResultado.classList.remove('input-error');
    }

    return ok;
}

formPartida.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormPartida()) return;

    try {
        const resp = await fetchAPI('/api/partidas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jugador_id: parseInt(selectJugador.value),
                brawler_id: parseInt(selectBrawler.value),
                modo_id:    parseInt(selectModo.value),
                resultado:  selectResultado.value
            })
        });

        mostrarNotificacion(
            `Partida registrada: ${resp.data.jugador} jugó con ${resp.data.brawler} en ${resp.data.modo} — ${resp.data.resultado}`,
            'exito'
        );
        formPartida.reset();
        cargarPartidas();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

function confirmarEliminarPartida(id) {
    if (confirm('¿Eliminar esta partida?')) {
        eliminarPartida(id);
    }
}

async function eliminarPartida(id) {
    try {
        await fetchAPI(`/api/partidas/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Partida eliminada', 'exito');
        cargarPartidas();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

// ============================================================
// 6. NAVEGACIÓN POR PESTAÑAS
// ============================================================
// Esta función muestra una sección y oculta las demás.
// También actualiza la pestaña activa visualmente.
// Es un patrón básico de SPA (Single Page Application):
// cambiar contenido sin recargar la página.
function cambiarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(s => {
        s.style.display = 'none';
    });

    // Desactivar todas las pestañas
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    document.getElementById(`seccion-${seccion}`).style.display = 'block';

    // Activar la pestaña correspondiente.
    // Se busca por el atributo onclick porque el texto de la pestaña
    // ("Modos de Juego") no siempre coincide con el id de sección
    // ('modos_juego'), a diferencia del proyecto de compras.
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const tabActiva = tabs.find(t => t.getAttribute('onclick').includes(`'${seccion}'`));
    if (tabActiva) tabActiva.classList.add('active');

    // Si cambiamos a partidas, recargar los tres selects con datos actuales
    if (seccion === 'partidas') {
        cargarSelectJugadores();
        cargarSelectBrawlers();
        cargarSelectModos();
        cargarPartidas();
    }
}

// ============================================================
// 7. INICIALIZACIÓN
// ============================================================
// Al cargar la página, cargamos todos los datos iniciales.
document.addEventListener('DOMContentLoaded', () => {
    cargarBrawlers();
    cargarModos();
    cargarJugadores();
    cargarPartidas();
    cargarSelectJugadores();
    cargarSelectBrawlers();
    cargarSelectModos();
});