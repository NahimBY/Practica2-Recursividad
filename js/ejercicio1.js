function Factorial(Tomar) {
    if (Tomar === 1 || Tomar === 0) {
        return 1;
    } else {
        return Tomar * Factorial(Tomar - 1);
    }
}

function AgregarFactorial() {
    const Facto = document.getElementById("Factor");
        Facto.addEventListener("click", function () {
            const boton = document.getElementById("resultado"); 
            boton.style.display = "block"; 
            const resultado = parseInt(document.getElementById("Factos").value);
            if (isNaN(resultado) || resultado < 0) {
                document.getElementById("resultado").innerHTML = "Por favor, ingrese un valor válido";
                setTimeout(function () {
                    boton.style.display = "none";
                }, 1000);
            } else {
                const Respuesta = Factorial(resultado);
                document.getElementById("resultado").innerHTML = `El Factorial es ${Respuesta}`;

                setTimeout(function () {
                    boton.style.display = "none";
                }, 2000);
            }
        });
    };

AgregarFactorial();

