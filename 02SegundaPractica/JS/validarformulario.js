function validarformulario(Formulario) {

    // =====================
    // VALIDAR NOMBRE
    // =====================

    // Mínimo 3 caracteres
    if (Formulario.Nombre.value.length < 3) {
        alert("Por favor ingresa un nombre de mínimo 3 caracteres");
        Formulario.Nombre.focus();
        return false;
    }

    // Solo letras y espacios (sin números ni caracteres especiales)
    var abcOK = "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ ";
    var texto = Formulario.Nombre.value;
    var nombreValido = true;

    for (var i = 0; i < texto.length; i++) {
        var letra = texto.charAt(i);
        var existe = false;

        for (var j = 0; j < abcOK.length; j++) {
            if (letra == abcOK.charAt(j)) {
                existe = true;
                break;
            }
        }

        if (!existe) {
            nombreValido = false;
            break;
        }
    }

    if (!nombreValido) {
        alert("El nombre solo puede contener letras, sin números ni caracteres especiales");
        Formulario.Nombre.focus();
        return false;
    }

    // =====================
    // VALIDAR EDAD
    // =====================

    var edad = Formulario.edad.value;

    // No debe estar vacía
    if (edad == "") {
        alert("Por favor ingresa tu edad");
        Formulario.edad.focus();
        return false;
    }

    // No debe contener letras ni caracteres especiales (solo números)
    var edadValida = true;
    var numeros = "0123456789";

    for (var i = 0; i < edad.length; i++) {
        var caracter = edad.charAt(i);
        var esNumero = false;

        for (var j = 0; j < numeros.length; j++) {
            if (caracter == numeros.charAt(j)) {
                esNumero = true;
                break;
            }
        }

        if (!esNumero) {
            edadValida = false;
            break;
        }
    }

    if (!edadValida) {
        alert("La edad solo puede contener números, sin letras ni caracteres especiales");
        Formulario.edad.focus();
        return false;
    }

    // Debe estar entre 15 y 80
    var edadNumero = parseInt(edad);

    if (edadNumero < 15 || edadNumero > 80) {
        alert("La edad debe estar entre 15 y 80 años");
        Formulario.edad.focus();
        return false;
    }

    // =====================
    // VALIDAR EMAIL
    // =====================

    var correo = Formulario.gmail.value;

    // No debe estar vacío
    if (correo == "") {
        alert("Por favor ingresa tu correo electrónico");
        Formulario.gmail.focus();
        return false;
    }

    // Debe contener @
    var arrobaPos = correo.indexOf("@");

    if (arrobaPos <= 0) {
        alert("El correo debe contener el símbolo @  (ejemplo: usuario@gmail.com)");
        Formulario.gmail.focus();
        return false;
    }

    // Debe tener algo antes del @
    var antesArroba = correo.substring(0, arrobaPos);

    if (antesArroba.length < 1) {
        alert("El correo debe tener un nombre antes del @  (ejemplo: usuario@gmail.com)");
        Formulario.gmail.focus();
        return false;
    }

    // Debe tener dominio después del @
    var dominio = correo.substring(arrobaPos + 1);

    if (dominio.length < 5) {
        alert("El correo debe tener un dominio válido después del @  (ejemplo: gmail.com)");
        Formulario.gmail.focus();
        return false;
    }

    // El dominio debe contener .com
    if (dominio.indexOf(".com") == -1) {
        alert("El correo debe tener un dominio con .com  (ejemplo: usuario@gmail.com)");
        Formulario.gmail.focus();
        return false;
    }

    // =====================
    // TODO CORRECTO
    // =====================

    alert("¡Formulario enviado correctamente!");
    return true;
}