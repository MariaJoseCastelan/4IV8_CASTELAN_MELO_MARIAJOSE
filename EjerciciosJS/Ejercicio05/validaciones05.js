var regexEntero = /^\d+$/;

function validarCampo(id) {
  var campo = document.getElementById(id);
  var errorMensaje = document.getElementById("error-" + id);
  var valor = campo.value.trim();

  if (valor === "") {
    errorMensaje.textContent = "Este campo no puede estar vacío.";
    campo.classList.add("input-error");
    return false;
  }

  if (!regexEntero.test(valor)) {
    errorMensaje.textContent = "Solo se permiten números enteros. Ejemplo: 15";
    campo.classList.add("input-error");
    return false;
  }

  errorMensaje.textContent = "";
  campo.classList.remove("input-error");
  return true;
}

function calcular() {
  var hombresValido = validarCampo("hombres");
  var mujeresValido = validarCampo("mujeres");

  if (!hombresValido || !mujeresValido) {
    return;
  }

  var hombres = parseInt(document.getElementById("hombres").value.trim());
  var mujeres = parseInt(document.getElementById("mujeres").value.trim());
  var total = hombres + mujeres;

  var errorTotal = document.getElementById("error-total");

  if (total === 0) {
    errorTotal.textContent = "El total de alumnos debe ser mayor a 0.";
    return;
  }

  errorTotal.textContent = "";

  var porcentajeHombres = (hombres / total) * 100;
  var porcentajeMujeres = (mujeres / total) * 100;

  porcentajeHombres = Math.round(porcentajeHombres * 100) / 100;
  porcentajeMujeres = Math.round(porcentajeMujeres * 100) / 100;

  document.getElementById("texto-total").textContent = "Total de alumnos: " + total;
  document.getElementById("texto-hombres").textContent = hombres + " alumnos — " + porcentajeHombres + "%";
  document.getElementById("texto-mujeres").textContent = mujeres + " alumnas — " + porcentajeMujeres + "%";

  document.getElementById("resultado").style.display = "block";
}

function limpiar() {
  var ids = ["hombres", "mujeres"];

  for (var i = 0; i < ids.length; i++) {
    var campo = document.getElementById(ids[i]);
    campo.value = "";
    campo.classList.remove("input-error");

    var error = document.getElementById("error-" + ids[i]);
    error.textContent = "";
  }

  document.getElementById("error-total").textContent = "";
  document.getElementById("resultado").style.display = "none";
}
