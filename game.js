const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const teamName = document.querySelector('#team-name');
const winnerMessage = document.querySelector('#winner-message');
const moles = document.querySelectorAll('.mole');
const startButton = document.getElementById('start-button');
const quitButton = document.getElementById('quit-button');

let lastHole;
let timeUp = false;
let score = 0;
let gameStarted = false;
let isTeam1 = true;
let timer;
let currentLevel = 1; 
let team1Score = 0, team2Score = 0; 
let quitOccurred = { team1: false, team2: false }; 
let misses = 0; 
const maxMisses = 5; 

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];

    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(500 / currentLevel, 1000 / currentLevel);
    const hole = randomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) {
            peep();
        }
    }, time);
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    scoreBoard.textContent = 0;
    score = 0;
    timeUp = false;
    misses = 0; 
    currentLevel = parseInt(prompt("Choose difficulty level:\n1: Easy\n2: Medium\n3: Hard"), 10) || 1;
    peep();
    quitOccurred = { team1: false, team2: false }; 
    timer = setTimeout(() => {
        endTurn(); 
    }, 60000); 
}

function wack(e) {
    if (!gameStarted || !e.isTrusted) return;

    
    if (currentLevel === 1) {
        score += 1; 
    } else if (currentLevel === 2) {
        score += 2; 
    } else if (currentLevel === 3) {
        score += 3; 
    }

    this.parentNode.classList.remove('up');
    scoreBoard.textContent = score;
    misses = 0; 

    if (!isTeam1 && score > team1Score) {
        
        team2Score = score;
        determineWinner(); 
    }
}

function handleMiss() {
    misses++;
    if (misses >= maxMisses) {
        
        endTurn(true); 
    }
}

function endTurn(forceQuit = false) {
    if (!gameStarted) return;
    timeUp = true;
    gameStarted = false;
    clearTimeout(timer);

    if (isTeam1) {
       
        team1Score = score;
        if (quitOccurred.team1 || forceQuit) {
           
            quitOccurred.team1 = true; 
            teamName.textContent = 'Team 2';
            isTeam1 = false;
            startGame(); 
        } else {
            
            teamName.textContent = 'Team 2';
            isTeam1 = false;
            score = 0; 
            misses = 0; 
            setTimeout(() => {
                peep(); 
                timer = setTimeout(() => {
                    endTurn(); 
                }, 60000); 
            }, 1000);
        }
    } else {
       
        team2Score = score;
        if (quitOccurred.team2 || forceQuit) {
            quitOccurred.team2 = true; 
        }
        determineWinner(); 
    }
}

function quitGame() {
    if (!gameStarted) return;
    clearTimeout(timer);
    timeUp = true;
    gameStarted = false;

    if (isTeam1) {
        team1Score = score; 
        quitOccurred.team1 = true; 
       
        teamName.textContent = 'Team 2';
        isTeam1 = false;
        startGame(); 
    } else {
        team2Score = score; 
        quitOccurred.team2 = true; 
        determineWinner(); 
    }
}

function determineWinner() {
    
    if (team2Score > team1Score) {
        winnerMessage.textContent = `Team 2 wins with a score of ${team2Score} to ${team1Score}`;
    } else if (team1Score > team2Score) {
        winnerMessage.textContent = `Team 1 wins with a score of ${team1Score} to ${team2Score}`;
    } else {
        winnerMessage.textContent = `It's a tie with both teams scoring ${team1Score}`;
    }
    winnerMessage.style.display = 'block';
    quitButton.style.display = 'none';
    startButton.style.display = 'none'; 
}

moles.forEach(mole => mole.addEventListener('click', wack));
holes.forEach(hole => hole.addEventListener('click', handleMiss)); 
startButton.addEventListener('click', startGame);
quitButton.addEventListener('click', quitGame);
