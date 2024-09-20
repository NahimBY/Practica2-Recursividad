function calcularMCD() {
  const num1 = parseInt(document.getElementById('mcdNum1').value);
  const num2 = parseInt(document.getElementById('mcdNum2').value);
  if (isNaN(num1) || isNaN(num2)) {
    document.getElementById('mcdResultado').textContent = "Ingresa números válidos.";
    return;
  }
  const resultado = mcd(num1, num2);
  document.getElementById('mcdResultado').textContent = `El MCD de ${num1} y ${num2} es ${resultado}.`;
}

function mcd(a, b) {
  if (b === 0) return a;
  return mcd(b, a % b);
}
