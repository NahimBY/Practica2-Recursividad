function Voraz() {
        const calcularBtn = document.getElementById("calcular");
        calcularBtn.addEventListener("click", function() {
            const Aparecer = document.getElementById("cambio")
            Aparecer.style.display ="block"; 
            const Total = parseFloat(document.getElementById("costo").value);
            const Pagar = parseFloat(document.getElementById("pago").value);

            if (isNaN(Total) || Total < 0 || Total > Pagar || isNaN(Pagar) || Pagar < 0) {
                document.getElementById("cambio").innerHTML = "No se puede hacer esta transacción";
                setTimeout(function() {
                    Aparecer.style.display = "none";
                }, 1000);
            } else {
                let Cambio = Pagar - Total;
                Cambio = Math.round(Cambio * 100) / 100;

                const denominaciones = [
                    { valor: 100.00, nombre: "100 pesos" },
                    { valor: 50.00, nombre: "50 pesos" },
                    { valor: 20.00, nombre: "20 pesos" },
                    { valor: 10.00, nombre: "10 pesos" },
                    { valor: 5.00, nombre: "5 pesos" },
                    { valor: 1.00, nombre: "1 peso" },
                    { valor: 0.50, nombre: "50 centavos" },
                    { valor: 0.20, nombre: "20 centavos" },
                    { valor: 0.01, nombre: "1 centavo" }
                ];

                let Vuelto = `<p>Su cambio es de $${Cambio.toFixed(2)} Pesos</p>`;
                Vuelto += `<ul>`;
                denominaciones.forEach(function(denominacion) {
                    if (Cambio >= denominacion.valor) {
                        const Monedas = Math.floor(Cambio / denominacion.valor);
                        Cambio -= (Monedas * denominacion.valor);
                        Cambio = Math.round(Cambio * 100) / 100;
                        if (Monedas > 0) {
                            Vuelto += `<li>${Monedas} x ${denominacion.nombre}</li>`;
                        }
                    }
                });
                Vuelto += `</ul>`;
                document.getElementById("cambio").innerHTML = Vuelto;

                setTimeout(function() {
                    Aparecer.style.display = "none";
                }, 5000);
            }
        });
    };
Voraz();


