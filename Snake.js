let canvas = document.getElementById("snake");
let context = canvas.getContext("2d");
let box = 32;
let snake = [{ x: 8 * box, y: 8 * box }];
let direction = "right";
let food = spawnFood();
let score = 0;
let highScore = 0;
let level = 1;
let speed = 300;
let gameInterval;

function startGame(difficulty) {
    if (difficulty === 'easy') {
        speed = 300;
    } else if (difficulty === 'medium') {
        speed = 200;
    } else if (difficulty === 'hard') {
        speed = 100;
    }

    document.getElementById("modeButtons").style.display = "none";
    document.getElementById("scoreboard").style.display = "block";
    document.getElementById("snake").style.display = "block";
    
    gameInterval = setInterval(iniciarJogo, speed);
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * 15 + 1) * box,
        y: Math.floor(Math.random() * 15 + 1) * box,
        type: Math.random() > 0.8 ? "power-up" : "normal",
    };
}

function criarBG() {
    context.fillStyle = "white"; 
    context.fillRect(0, 0, 16 * box, 16 * box);
}

function criarCobrinha() {
    for (let i = 0; i < snake.length; i++) {
        let segmentSize = box; 

        context.fillStyle = i === 0 ? "darkgreen" : "green";

        context.beginPath();
        context.arc(
            snake[i].x + box / 2, 
            snake[i].y + box / 2, 
            segmentSize / 2, 
            0, 
            Math.PI * 2
        );
        context.fill();
        context.closePath();
    }
}


function drawFood() {
    let foodRadius = box / 3;

    context.fillStyle = food.type === "power-up" ? "blue" : "red";

    context.beginPath();
    context.arc(food.x + box / 2, food.y + box / 2, foodRadius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}



document.addEventListener('keydown', update);

function update(event) {
    if (event.keyCode == 37 && direction != 'right') direction = 'left';
    if (event.keyCode == 38 && direction != 'down') direction = 'up';
    if (event.keyCode == 39 && direction != 'left') direction = 'right';
    if (event.keyCode == 40 && direction != 'up') direction = 'down';
}

function iniciarJogo() {
    if (snake[0].x > 15 * box && direction == "right") snake[0].x = 0;
    if (snake[0].x < 0 && direction == 'left') snake[0].x = 16 * box;
    if (snake[0].y > 15 * box && direction == "down") snake[0].y = 0;
    if (snake[0].y < 0 && direction == 'up') snake[0].y = 16 * box;

    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            endGame();
            return;
        }
    }

    criarBG();
    criarCobrinha();
    drawFood();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "right") snakeX += box;
    if (direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if (direction == "down") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
   
        document.getElementById("eatSound").play();

        if (food.type === "power-up") {
            speed -= 20;
            level++;
            document.getElementById("level").innerText = "Level: " + level;
        }
        food = spawnFood();
        score++;
        document.getElementById("score").innerText = score;
        if (score > highScore) {
            highScore = score;
            document.getElementById("highScore").innerText = highScore;
        }
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    snake.unshift(newHead);
}

function endGame() {
    clearInterval(gameInterval);
    document.getElementById("scoreboard").style.display = "none";
    document.getElementById("snake").style.display = "none";

   
    document.getElementById("gameOverSound").play();
    
    const gameOverMessage = document.createElement("div");
    gameOverMessage.id = "gameOverMessage";
    gameOverMessage.innerHTML = `
        <h2>Game Over :(</h2>
        <p>Your final score was: ${score}</p>
    `;
    document.body.appendChild(gameOverMessage);

    document.getElementById("restartButton").style.display = "inline-block";
}


function resetGame() {
    document.getElementById("restartButton").style.display = "none";
    document.getElementById("gameOverMessage").remove();
    document.getElementById("modeButtons").style.display = "block";
    
    snake = [{ x: 8 * box, y: 8 * box }];
    direction = "right";
    score = 0;
    level = 1;
    speed = 300;
    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = "Level: " + level;
}
