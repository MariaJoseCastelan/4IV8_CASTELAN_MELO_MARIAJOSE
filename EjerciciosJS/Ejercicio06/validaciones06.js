var regexEntero = /^\d+$/;

function validarDia(dia) {
  var campo = document.getElementById("dia");
  var error = document.getElementById("error-dia");

  if (dia === "") {
    error.textContent = "El día no puede estar vacío.";
    campo.classList.add("input-error");
    return false;
  }
  if (!regexEntero.test(dia)) {
    error.textContent = "Solo se permiten números enteros.";
    campo.classList.add("input-error");
    return false;
  }
  var num = parseInt(dia);
  if (num < 1 || num > 31) {
    error.textContent = "El día debe estar entre 1 y 31.";
    campo.classList.add("input-error");
    return false;
  }
  error.textContent = "";
  campo.classList.remove("input-error");
  return true;
}

function validarMes(mes) {
  var campo = document.getElementById("mes");
  var error = document.getElementById("error-mes");

  if (mes === "") {
    error.textContent = "El mes no puede estar vacío.";
    campo.classList.add("input-error");
    return false;
  }
  if (!regexEntero.test(mes)) {
    error.textContent = "Solo se permiten números enteros.";
    campo.classList.add("input-error");
    return false;
  }
  var num = parseInt(mes);
  if (num < 1 || num > 12) {
    error.textContent = "El mes debe estar entre 1 y 12.";
    campo.classList.add("input-error");
    return false;
  }
  error.textContent = "";
  campo.classList.remove("input-error");
  return true;
}

function validarAnio(anio) {
  var campo = document.getElementById("anio");
  var error = document.getElementById("error-anio");
  var anioActual = new Date().getFullYear();

  if (anio === "") {
    error.textContent = "El año no puede estar vacío.";
    campo.classList.add("input-error");
    return false;
  }
  if (!regexEntero.test(anio)) {
    error.textContent = "Solo se permiten números enteros.";
    campo.classList.add("input-error");
    return false;
  }
  var num = parseInt(anio);
  if (num < 1900 || num > anioActual) {
    error.textContent = "El año debe estar entre 1900 y " + anioActual + ".";
    campo.classList.add("input-error");
    return false;
  }
  error.textContent = "";
  campo.classList.remove("input-error");
  return true;
}

function calcular() {
  var dia  = document.getElementById("dia").value.trim();
  var mes  = document.getElementById("mes").value.trim();
  var anio = document.getElementById("anio").value.trim();

  var diaValido  = validarDia(dia);
  var mesValido  = validarMes(mes);
  var anioValido = validarAnio(anio);

  if (!diaValido || !mesValido || !anioValido) {
    return;
  }

  var errorFecha = document.getElementById("error-fecha");

  var fechaNac = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
  var hoy = new Date();

  if (fechaNac > hoy) {
    errorFecha.textContent = "La fecha de nacimiento no puede ser una fecha futura.";
    return;
  }

  if (fechaNac.getDate() !== parseInt(dia)) {
    errorFecha.textContent = "El día no es válido para ese mes.";
    return;
  }

  errorFecha.textContent = "";

  var edad = hoy.getFullYear() - fechaNac.getFullYear();
  var difMes = hoy.getMonth() - fechaNac.getMonth();

  if (difMes < 0 || (difMes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }

  var textoEdad = document.getElementById("texto-edad");

  textoEdad.textContent = "Tienes " + edad + " años";

  document.getElementById("resultado").style.display = "block";
}

function limpiar() {
  var ids = ["dia", "mes", "anio"];

  for (var i = 0; i < ids.length; i++) {
    var campo = document.getElementById(ids[i]);
    campo.value = "";
    campo.classList.remove("input-error");

    var error = document.getElementById("error-" + ids[i]);
    error.textContent = "";
  }

  document.getElementById("error-fecha").textContent = "";
  document.getElementById("resultado").style.display = "none";
}
