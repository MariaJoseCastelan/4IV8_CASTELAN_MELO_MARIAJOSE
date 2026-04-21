var regexSoloNumeros = /^\d+(\.\d{1,2})?$/;

function calcular() {
  var total    = document.getElementById("total").value;
  var error    = document.getElementById("error-total");
  var resultado = document.getElementById("resultado");

  if (total.trim() == "") {
    error.innerHTML = "Este campo no puede estar vacío.";
    resultado.style.display = "none";
    return;
  }

  if (!regexSoloNumeros.test(total.trim())) {
    error.innerHTML = "Solo se permiten números positivos. Ejemplo: 1200 o 999.99";
    resultado.style.display = "none";
    return;
  }

  var totalNum = parseFloat(total);

  if (totalNum < 1) {
    error.innerHTML = "El monto mínimo de compra es $1.";
    resultado.style.display = "none";
    return;
  }

  if (totalNum > 50000) {
    error.innerHTML = "El monto máximo de compra es $50,000.";
    resultado.style.display = "none";
    return;
  }

  error.innerHTML = "";

  var descuento = totalNum * 0.15;
  var totalPagar = totalNum - descuento;

  document.getElementById("res-total").innerHTML    = "$" + totalNum.toFixed(2);
  document.getElementById("res-descuento").innerHTML = "$" + descuento.toFixed(2);
  document.getElementById("res-pagar").innerHTML    = "$" + totalPagar.toFixed(2);

  resultado.style.display = "block";
}

function limpiar() {
  document.getElementById("total").value            = "";
  document.getElementById("error-total").innerHTML  = "";
  document.getElementById("resultado").style.display = "none";
}
