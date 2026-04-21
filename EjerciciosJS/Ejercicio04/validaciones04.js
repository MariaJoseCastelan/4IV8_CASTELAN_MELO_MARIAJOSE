var regexCalificacion = /^\d+(\.\d{1,2})?$/;

function validarCampo(id) {
  var campo = document.getElementById(id);
  var errorMensaje = document.getElementById("error-" + id);
  var valor = campo.value.trim();

  if (valor === "") {
    errorMensaje.textContent = "Este campo no puede estar vacío.";
    campo.classList.add("input-error");
    return false;
  }

  if (!regexCalificacion.test(valor)) {
    errorMensaje.textContent = "Solo se permiten números. Ejemplo: 8 o 7.5";
    campo.classList.add("input-error");
    return false;
  }

  var numero = parseFloat(valor);

  if (numero < 0 || numero > 10) {
    errorMensaje.textContent = "La calificación debe estar entre 0 y 10.";
    campo.classList.add("input-error");
    return false;
  }

  errorMensaje.textContent = "";
  campo.classList.remove("input-error");
  return true;
}

function calcular() {
  var p1Valido      = validarCampo("parcial1");
  var p2Valido      = validarCampo("parcial2");
  var p3Valido      = validarCampo("parcial3");
  var examenValido  = validarCampo("examenFinal");
  var trabajoValido = validarCampo("trabajoFinal");

  if (!p1Valido || !p2Valido || !p3Valido || !examenValido || !trabajoValido) {
    return;
  }

  var parcial1     = parseFloat(document.getElementById("parcial1").value.trim());
  var parcial2     = parseFloat(document.getElementById("parcial2").value.trim());
  var parcial3     = parseFloat(document.getElementById("parcial3").value.trim());
  var examenFinal  = parseFloat(document.getElementById("examenFinal").value.trim());
  var trabajoFinal = parseFloat(document.getElementById("trabajoFinal").value.trim());

  var promedioParciales = (parcial1 + parcial2 + parcial3) / 3;
  var calificacionFinal = (promedioParciales * 0.55) + (examenFinal * 0.30) + (trabajoFinal * 0.15);
  calificacionFinal = Math.round(calificacionFinal * 100) / 100;

  var divResultado   = document.getElementById("resultado");
  var textoResultado = document.getElementById("texto-resultado");
  var textoNota      = document.getElementById("texto-nota");

  textoResultado.textContent = "Tu calificación final es: " + calificacionFinal;

  if (calificacionFinal >= 6) {
    textoNota.textContent = "✔ Aprobado";
    textoNota.className = "nota aprobado";
  } else {
    textoNota.textContent = "✘ Reprobado";
    textoNota.className = "nota reprobado";
  }

  divResultado.style.display = "block";
}

function limpiar() {
  var ids = ["parcial1", "parcial2", "parcial3", "examenFinal", "trabajoFinal"];

  for (var i = 0; i < ids.length; i++) {
    var campo = document.getElementById(ids[i]);
    campo.value = "";
    campo.classList.remove("input-error");

    var error = document.getElementById("error-" + ids[i]);
    error.textContent = "";
  }

  document.getElementById("resultado").style.display = "none";
}
