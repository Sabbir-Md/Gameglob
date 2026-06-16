const computerChoiceDisplay = document.getElementById('computer-choice');
const userChoiceDisplay = document.getElementById('user-choice');
const resultDisplay = document.getElementById('result');

const possibleChoices = document.querySelectorAll('.choice-button');
const winsDisplay = document.getElementById('wins');
const lossesDisplay = document.getElementById('losses');
const drawsDisplay = document.getElementById('draws');
const resetButton = document.getElementById('reset');
const playAgainButton = document.getElementById('play-again');

const clickSound = document.getElementById('click-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const drawSound = document.getElementById('draw-sound');
// const backGround= document.getElementById('background-sound');

let userChoice;
let computerChoice;
let result;
let wins = 0;
let losses = 0;
let draws = 0;

const emojis = {
  rock: '✊',     
  paper: '✋',    
  scissors: '✌', 
  win: '🎉',
  lose: '😢',
  draw: '🤝'
};

possibleChoices.forEach(possibleChoice => 
  possibleChoice.addEventListener('click', (e) => {
    userChoice = e.currentTarget.id;

    
    userChoiceDisplay.innerHTML = emojis[userChoice] || 'Invalid choice';
    
    playSound('click');
    countdown(() => {
      generateComputerChoice();
      displayChoices();
      getResult();
      updateScoreboard();
      showPlayAgainButton();
    });
  })
);

function countdown(callback) {
  let countdownNumber = 1;
  resultDisplay.innerHTML = `Starting in ${countdownNumber}...`;
  const interval = setInterval(() => {
    countdownNumber--;
    resultDisplay.innerHTML = `Starting in ${countdownNumber}...`;
    if (countdownNumber <= 0) {
      clearInterval(interval);
      callback();
    }
  }, 1000);
}

function generateComputerChoice() {
  const randomNumber = Math.floor(Math.random() * 3) + 1;

  if (randomNumber === 1) {
    computerChoice = 'rock';
  } else if (randomNumber === 2) {
    computerChoice = 'scissors';
  } else if (randomNumber === 3) {
    computerChoice = 'paper';
  }

  
  computerChoiceDisplay.innerHTML = emojis[computerChoice];
}

function displayChoices() {
  userChoiceDisplay.innerHTML = emojis[userChoice];
  computerChoiceDisplay.innerHTML = emojis[computerChoice];
}

function getResult() {
  if (computerChoice === userChoice) {
    result = `It's a draw! ${emojis.draw}`;
    draws++;
    playSound('draw');
  } else if (
    (computerChoice === 'rock' && userChoice === 'paper') ||
    (computerChoice === 'paper' && userChoice === 'scissors') ||
    (computerChoice === 'scissors' && userChoice === 'rock')
  ) {
    result = `You win! ${emojis.win}`;
    wins++;
    playSound('win');
  } else {
    result = `You lose! ${emojis.lose}`;
    losses++;
    playSound('lose');
  }
  resultDisplay.innerHTML = result;
}

function updateScoreboard() {
  winsDisplay.innerText = `Wins: ${wins}`;
  lossesDisplay.innerText = `Losses: ${losses}`;
  drawsDisplay.innerText = `Draws: ${draws}`;
}

function showPlayAgainButton() {
  playAgainButton.style.display = 'block';
}

function hidePlayAgainButton() {
  playAgainButton.style.display = 'none';
}

function playSound(sound) {
  switch (sound) {
    case 'click':
      clickSound.play();
      break;
    case 'win':
      winSound.play();
      break;
    case 'lose':
      loseSound.play();
      break;
    case 'draw':
      drawSound.play();
      break;
    default:
      break;
  }
}

resetButton.addEventListener('click', resetGame);
playAgainButton.addEventListener('click', startGame);

function resetGame() {
  wins = 0;
  losses = 0;
  draws = 0;
  updateScoreboard();
  userChoiceDisplay.innerHTML = '';
  computerChoiceDisplay.innerHTML = '';
  resultDisplay.innerHTML = '';
  hidePlayAgainButton();
}


function startGame() {
  hidePlayAgainButton(); 
  userChoiceDisplay.innerHTML = ''; 
  computerChoiceDisplay.innerHTML = ''; 
  resultDisplay.innerHTML = 'Make your choice!'; 
}


