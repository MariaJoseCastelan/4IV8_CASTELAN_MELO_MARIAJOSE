var regexSoloNumeros = /^\d+(\.\d{1,2})?$/;

function validarCampo(id, errorId, min, max) {
  var valor = document.getElementById(id).value;
  var error = document.getElementById(errorId);

  if (valor.trim() == "") {
    error.innerHTML = "ste campo no puede estar vacío.";
    return false;
  }

  if (!regexSoloNumeros.test(valor.trim())) {
    error.innerHTML = "Solo se permiten números positivos.";
    return false;
  }

  var num = parseFloat(valor);

  if (num < min) {
    error.innerHTML = "El valor mínimo es $" + min + ".";
    return false;
  }

  if (num > max) {
    error.innerHTML = "El valor máximo es $" + max + ".";
    return false;
  }

  error.innerHTML = "";
  return true;
}

function calcular() {
  var resultado = document.getElementById("resultado");

  var sueldoValido  = validarCampo("sueldo", "error-sueldo", 315, 50000);
  var venta1Valido  = validarCampo("venta1", "error-venta1", 1, 50000);
  var venta2Valido  = validarCampo("venta2", "error-venta2", 1, 50000);
  var venta3Valido  = validarCampo("venta3", "error-venta3", 1, 50000);

  if (!sueldoValido || !venta1Valido || !venta2Valido || !venta3Valido) {
    resultado.style.display = "none";
    return;
  }

  var sueldo = parseFloat(document.getElementById("sueldo").value);
  var venta1 = parseFloat(document.getElementById("venta1").value);
  var venta2 = parseFloat(document.getElementById("venta2").value);
  var venta3 = parseFloat(document.getElementById("venta3").value);

  var comision1 = venta1 * 0.10;
  var comision2 = venta2 * 0.10;
  var comision3 = venta3 * 0.10;

  var totalComisiones = comision1 + comision2 + comision3;
  var totalMes        = sueldo + totalComisiones;

  document.getElementById("res-sueldo").innerHTML           = "$" + sueldo.toFixed(2);
  document.getElementById("res-comision1").innerHTML        = "$" + comision1.toFixed(2);
  document.getElementById("res-comision2").innerHTML        = "$" + comision2.toFixed(2);
  document.getElementById("res-comision3").innerHTML        = "$" + comision3.toFixed(2);
  document.getElementById("res-total-comisiones").innerHTML = "$" + totalComisiones.toFixed(2);
  document.getElementById("res-total").innerHTML            = "$" + totalMes.toFixed(2);

  resultado.style.display = "block";
}

function limpiar() {
  document.getElementById("sueldo").value          = "";
  document.getElementById("venta1").value          = "";
  document.getElementById("venta2").value          = "";
  document.getElementById("venta3").value          = "";
  document.getElementById("error-sueldo").innerHTML  = "";
  document.getElementById("error-venta1").innerHTML  = "";
  document.getElementById("error-venta2").innerHTML  = "";
  document.getElementById("error-venta3").innerHTML  = "";
  document.getElementById("resultado").style.display = "none";
}
