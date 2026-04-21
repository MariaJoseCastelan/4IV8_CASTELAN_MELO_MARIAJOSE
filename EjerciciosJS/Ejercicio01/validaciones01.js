var regexSoloNumeros = /^\d+(\.\d{1,2})?$/;

function calcular() {
  var capital = document.getElementById("capital").value;
  var errorCapital = document.getElementById("error-capital");
  var resultado = document.getElementById("resultado");

  if (capital.trim() == "") {
    errorCapital.innerHTML = "Este campo no puede estar vacío.";
    resultado.style.display = "none";
    return;
  }

  if (!regexSoloNumeros.test(capital.trim())) {
    errorCapital.innerHTML = "Solo se permiten números positivos. Ejemplo: 5000 o 1500.50";
    resultado.style.display = "none";
    return;
  }

  var capitalNum = parseFloat(capital);

  if (capitalNum < 1) {
    errorCapital.innerHTML = "El capital mínimo a invertir es $1.";
    resultado.style.display = "none";
    return;
  }

  if (capitalNum > 100000) {
    errorCapital.innerHTML = "El capital máximo a invertir es $100,000.";
    resultado.style.display = "none";
    return;
  }

  errorCapital.innerHTML = "";

  var ganancia = capitalNum * 0.02;
  var total    = capitalNum + ganancia;

  document.getElementById("res-capital").innerHTML  = "$" + capitalNum.toFixed(2);
  document.getElementById("res-ganancia").innerHTML = "$" + ganancia.toFixed(2);
  document.getElementById("res-total").innerHTML    = "$" + total.toFixed(2);

  resultado.style.display = "block";
}

function limpiar() {
  document.getElementById("capital").value           = "";
  document.getElementById("error-capital").innerHTML = "";
  document.getElementById("resultado").style.display = "none";
}
