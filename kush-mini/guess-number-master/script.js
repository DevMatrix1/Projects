' use strict';

const bodyElement = document.querySelector('body');
const labelMessage = document.querySelector('.message');
const labelScore = document.querySelector('.score');
const labelNumber = document.querySelector('.number');
const labelHighScore = document.querySelector('.highscore');
const inputNumber = document.querySelector('.guess');
const reset = document.querySelector('.again');
const checkBtn = document.querySelector('.check');

let score = 20;
let highScore = 0;

// Generate Random Number
let guessingNumber = 0;
const generateRandomNumber = () => {
  guessingNumber = Math.floor(Math.random() * 20 + 1);
};
generateRandomNumber();

// Display Message
const displayMessage = message => {
  labelMessage.textContent = message;
};

// Checking The Guess Number
checkBtn.addEventListener('click', () => {
  const numberEntered = Number(inputNumber.value);

  //   When We Have No Input
  if (!numberEntered) {
    displayMessage('No number !');
  }
  //   When Player Wins
  else if (numberEntered === guessingNumber) {
    bodyElement.style.backgroundColor = '#60b347';
    labelNumber.textContent = guessingNumber;
    labelNumber.style.width = '30rem';
    displayMessage('🥳 Correct Number !');

    if (score > highScore) {
      highScore = score;
      labelHighScore.textContent = highScore;
    }
  }
  // When Number Dose't Match
  else if (numberEntered !== guessingNumber) {
    if (score > 1) {
      --score;
      displayMessage(
        numberEntered > guessingNumber ? 'Too High !' : 'Too Low !'
      );

      labelScore.textContent = score;
    } else {
      displayMessage('You lost the game!');
      labelScore.textContent = 0;
    }
  }
});

// Reset
reset.addEventListener('click', () => {
  bodyElement.style.backgroundColor = '#222';
  generateRandomNumber();
  labelNumber.textContent = '?';
  displayMessage('Start guessing...');
  labelScore.textContent = '20';
  inputNumber.value = undefined;
});
