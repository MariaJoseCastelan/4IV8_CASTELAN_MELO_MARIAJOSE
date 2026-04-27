function problema1(){
    var input  = document.querySelector("#p1-input").value;
    var output = document.querySelector("#p1-output");

    
    if (input.trim() === "") {
        output.textContent = "El campo está vacío. Ingresa al menos una palabra.";
        return;
    }

    var regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]{2,}(\s+[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]{2,})*$/;
    if (!regex.test(input.trim())) {
        output.textContent = "Solo se permiten letras (mínimo 2 por palabra), separadas por espacios.No se aceptan números, comas ni caracteres especiales. Ejemplo: hola mundo bonito";
        return;
    }

    var palabras = input.trim().split(/\s+/);

    var invertidas = palabras.reverse();

    output.textContent = "Resultado: " + invertidas.join(" ");

}

function problema2(){
    //Primero necesito obtener los valores de la tabla
    var p2_x1 = document.querySelector("#p2_x1").value;
    var p2_x2 = document.querySelector("#p2_x2").value;
    var p2_x3 = document.querySelector("#p2_x3").value;
    var p2_x4 = document.querySelector("#p2_x4").value;
    var p2_x5 = document.querySelector("#p2_x5").value;

    var p2_y1 = document.querySelector("#p2_y1").value;
    var p2_y2 = document.querySelector("#p2_y2").value;
    var p2_y3 = document.querySelector("#p2_y3").value;
    var p2_y4 = document.querySelector("#p2_y4").value;
    var p2_y5 = document.querySelector("#p2_y5").value;

    //creamos los vectores
    var v1 = [p2_x1, p2_x2, p2_x3, p2_x4, p2_x5]
    var v2 = [p2_y1, p2_y2, p2_y3, p2_y4, p2_y5]

    //primero vamos a ordenar los elementos para permutarlos
    v1 = v1.sort(function(a, b){return b - a});
    v2 = v2.sort(function(a, b){return b - a});

    //para hacer la permutación
    v2 = v2.reverse(); 

    //para multiplicar necesitamos un for
    var p2_producto = 0;
    for(var i = 0; i < v1.length; i++){
        p2_producto += v1[i] * v2[i];
    }
    document.querySelector('#p2_output').textContent = "El producto escalar minimo es de: " + p2_producto;
 


}

function problema3(){

     var input  = document.querySelector("#p3-input").value;
    var output = document.querySelector("#p3-output");

   
    if (input.trim() === "") {
        output.textContent = "El campo está vacío. Ingresa al menos una palabra.";
        return;
    }

   
    var regex = /^[A-Z]{2,}(,[A-Z]{2,})*$/;
    if (!regex.test(input)) {
        output.textContent = "Solo se aceptan letras A-Z en mayúsculas (mínimo 2 por palabra), separadas por comas, sin espacios ni números.Ejemplo: CASA,PERRO,SOL";
        return;
    }

    var palabras = input.split(",");

    var maxUnicos   = 0;
    var palabraGanadora = "";

    for (var i = 0; i < palabras.length; i++) {
        var palabra = palabras[i];
        var letrasUnicas = [];

        for (var j = 0; j < palabra.length; j++) {
            var letra = palabra[j];
            if (letrasUnicas.indexOf(letra) === -1) {
                letrasUnicas.push(letra);
            }
        }

        if (letrasUnicas.length > maxUnicos) {
            maxUnicos       = letrasUnicas.length;
            palabraGanadora = palabra;
        }
    }

    output.textContent =
        'La palabra con más caracteres únicos es: "' + palabraGanadora + '" ' +
        "Cantidad de caracteres únicos: " + maxUnicos;
}


