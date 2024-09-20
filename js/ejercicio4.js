function Voraz() {
  const calcularBtn = document.getElementById("calcular");
  calcularBtn.addEventListener("click", function () {
    const Aparecer = document.getElementById("cambio");
    Aparecer.style.display = "block";
    const Total = parseFloat(document.getElementById("costo").value);
    const Pagar = parseFloat(document.getElementById("pago").value);

    if (
      isNaN(Total) ||
      Total < 0 ||
      Total > Pagar ||
      isNaN(Pagar) ||
      Pagar < 0
    ) {
      document.getElementById("cambio").innerHTML =
        "No se puede hacer esta transacción";
      setTimeout(function () {
        Aparecer.style.display = "none";
      }, 1000);
    } else {
      let Cambio = Pagar - Total;
      Cambio = Math.round(Cambio * 100) / 100;

      const denominaciones = [
        { valor: 100.0, nombre: "100 pesos" },
        { valor: 50.0, nombre: "50 pesos" },
        { valor: 20.0, nombre: "20 pesos" },
        { valor: 10.0, nombre: "10 pesos" },
        { valor: 5.0, nombre: "5 pesos" },
        { valor: 1.0, nombre: "1 peso" },
        { valor: 0.5, nombre: "50 centavos" },
        { valor: 0.2, nombre: "20 centavos" },
        { valor: 0.01, nombre: "1 centavo" },
      ];

      function calcularVuelto(cambio, indice) {
        if (cambio === 0 || indice >= denominaciones.length) {
          return ""; // Caso base: no más cambio que devolver
        }

        const denominacion = denominaciones[indice];
        const cantidad = Math.floor(cambio / denominacion.valor);
        const nuevoCambio =
          Math.round((cambio - cantidad * denominacion.valor) * 100) / 100;

        let resultado = "";
        if (cantidad > 0) {
          resultado = `<li>
              ${cantidad} x ${denominacion.nombre}
            </li>`;
        }

        // Llamada recursiva con el nuevo cambio y el siguiente índice
        return resultado + calcularVuelto(nuevoCambio, indice + 1);
      }

      const resultadoFinal =
        `<p>Su cambio es de $${Cambio.toFixed(2)} Pesos</p><ul>` +
        calcularVuelto(Cambio, 0) +
        `</ul>`;
      document.getElementById("cambio").innerHTML = resultadoFinal;

      setTimeout(function () {
        Aparecer.style.display = "none";
      }, 5000);
    }
  });
}
Voraz();
