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

function updateWordDisplay() {
  document.getElementById("word").innerText = correctLetters.join(" ");
}

function checkGuess(letter) {
  if (selectedWord.includes(letter)) {
    selectedWord.split("").forEach((char, index) => {
      if (char === letter) correctLetters[index] = char;
    });
    updateWordDisplay();

    if (!correctLetters.includes("_")) {
      document.getElementById("message").innerText = "¡Ganaste!";
      document.getElementById("guessInput").disabled = true;
      return;
    }
  } else {
    attemptsLeft--;
    document.getElementById("message").innerText = "Letra incorrecta.";
    document.getElementById("attemptsLeft").innerText = attemptsLeft;

    if (attemptsLeft <= 0) {
      document.getElementById("message").innerText =
        "¡Perdiste! La palabra era: " + selectedWord;
      document.getElementById("guessInput").disabled = true;
      return;
    }
  }
}

function handleGuess() {
  let input = document.getElementById("guessInput");
  let guess = input.value.toLowerCase();

  if (guess === "" || guessedLetters.includes(guess)) {
    document.getElementById("message").innerText =
      "Letra inválida o ya adivinada.";
    input.value = "";
    return;
  }

  guessedLetters.push(guess);
  document.getElementById("message").innerText = "";
  input.value = "";

  checkGuess(guess);
}

document.getElementById("attemptsLeft").innerText = attemptsLeft;
updateWordDisplay();
