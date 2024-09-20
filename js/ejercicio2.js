function calcularFibonacci() {
  const num = parseInt(document.getElementById('fibonacciInput').value);
  if (isNaN(num) || num < 0) {
    document.getElementById('fibonacciResultado').textContent = "Ingresa un número válido.";
    return;
  }
  const resultado = [];
  for (let i = 0; i <= num; i++) {
    resultado.push(fibonacci(i));
  }
  document.getElementById('fibonacciResultado').textContent = resultado.join(", ");
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
