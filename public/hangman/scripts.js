const letterContainer = document.querySelector(".letter-container");
const used = document.querySelector(".used-letters");
const start = document.querySelector(".start");

let playing = false;
let id = "";
let letterSlots = [];
let usedLetters = [];
const charList = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

function letterFiller() {
  letterContainer.innerText = `${letterSlots.join(" ")}`;
}

function letterTrash() {
  used.innerText = `${usedLetters.join(" ")}`;
}

function startGame() {
  id = "";
  letterSlots = [];
  usedLetters = [];
  letterTrash();
  letterFiller();
  fetch("/hangman/words")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      for (let index = 0; index < data.letterCount; index++) {
        letterSlots.push("_");
      }
      id = data.id;
      console.log("letterSlots: ", letterSlots);
      letterFiller();
      playing = true;
    });
}

function getLetter(letter) {
  fetch(`/hangman/guess/${id}/${letter}`)
    .then(response => response.json())
    .then(data => {
      console.log("get letter: ", data);
      data.forEach((vraiment, index) => {
        if (vraiment) {
          letterSlots.splice(index, 1, letter);
        }
      });
      console.log(letterSlots);

      let isComplete = true;
      letterSlots.forEach(letter => {
        if (letter === "_") {
          isComplete = false;
        }
      });
      letterFiller();
      letterTrash();
      if (isComplete == true) {
        // start.addEventListener('click', restart);
        restart();
      }
    });
}

// Checking for keys pressed on the keyboard
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  document.addEventListener("keydown", event => {
    if (!playing) {
      return;
    }
    const key = event.key.toLowerCase();
    // Makes sure only letter keys are accepted
    if (charList.indexOf(key) === -1 || usedLetters.includes(`${key}`)) return;
    usedLetters.push(key);
    console.log(usedLetters);
    getLetter(key);
    letterFiller();
    letterTrash();
  });
});

function startIt() {
  start.style.display = "none";
  letterContainer.style.display = "block";
  used.style.display = "block";
  //   start.removeEventListener("click", startIt);

  startGame();
}

function restart() {
    used.innerText = '🎉CONGRATULATIONS🎉'
  setTimeout(() => {
    start.innerText = "Restart";
    start.style.display = "block";
    letterContainer.style.display = "none";
    used.style.display = "none";
    //   start.removeEventListener("click", restart);

    startGame();
  }, 3000);
}

start.addEventListener("click", startIt);
