let wordList = [
  "javascript",
  "recursion",
  "ahorcado",
  "desarrollo",
  "programacion",
];
let selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
let attemptsLeft = 6;
let guessedLetters = [];
let correctLetters = Array(selectedWord.length).fill("_");

// Función para actualizar la palabra mostrada
function updateWordDisplay() {
  document.getElementById("word").innerText = correctLetters.join(" ");
}

// Función para manejar los intentos de adivinanza
function checkGuess(letter) {
  if (selectedWord.includes(letter)) {
    // Actualiza las letras correctas
    selectedWord.split("").forEach((char, index) => {
      if (char === letter) correctLetters[index] = char;
    });
    updateWordDisplay();

    // Verificar si el jugador ha ganado
    if (!correctLetters.includes("_")) {
      document.getElementById("message").innerText = "¡Ganaste!";
      document.getElementById("guessInput").disabled = true;
      return;
    }
  } else {
    // Letra incorrecta, reducir intentos
    attemptsLeft--;
    document.getElementById("message").innerText = "Letra incorrecta.";
    document.getElementById("attemptsLeft").innerText = attemptsLeft;

    // Verificar si el jugador ha perdido
    if (attemptsLeft <= 0) {
      document.getElementById("message").innerText =
        "¡Perdiste! La palabra era: " + selectedWord;
      document.getElementById("guessInput").disabled = true;
      return;
    }
  }
}

// Manejador para la adivinanza
function handleGuess() {
  let input = document.getElementById("guessInput");
  let guess = input.value.toLowerCase();

  // Validar la entrada
  if (guess === "" || guessedLetters.includes(guess)) {
    document.getElementById("message").innerText =
      "Letra inválida o ya adivinada.";
    input.value = "";
    return;
  }

  guessedLetters.push(guess);
  document.getElementById("message").innerText = ""; // Limpiar el mensaje de error
  input.value = "";

  // Llamada a la función para verificar la letra
  checkGuess(guess);
}

// Inicializar juego
document.getElementById("attemptsLeft").innerText = attemptsLeft;
updateWordDisplay();
