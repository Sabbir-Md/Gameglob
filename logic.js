document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const statusText = document.querySelector(".status");
    const restartButton = document.getElementById("restart");
    const changeModeButton = document.getElementById("change-mode");
    const singlePlayerButton = document.getElementById("single-player");
    const multiPlayerButton = document.getElementById("multi-player");
    const difficultyButtons = document.querySelectorAll(".difficulty-selection button");
    const gameBoard = document.querySelector(".game-board");
    const gameInfo = document.querySelector(".game-info");
    const modeSelection = document.querySelector(".mode-selection");
    const difficultySelection = document.querySelector(".difficulty-selection");

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let options = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let running = false;
    let isSinglePlayer = false;
    let difficulty = "hard";

    singlePlayerButton.addEventListener("click", () => showDifficultyOptions());
    multiPlayerButton.addEventListener("click", () => startGame(false));
    difficultyButtons.forEach(button => button.addEventListener("click", () => selectDifficulty(button)));
    restartButton.addEventListener("click", restartGame);
    changeModeButton.addEventListener("click", changeMode);

    function showDifficultyOptions() {
        modeSelection.style.display = "none";
        difficultySelection.style.display = "block";
    }

    function selectDifficulty(button) {
        difficulty = button.getAttribute("data-difficulty");
        startGame(true);
    }

    function startGame(singlePlayerMode) {
        isSinglePlayer = singlePlayerMode;
        difficultySelection.style.display = "none";
        gameBoard.style.display = "grid";
        gameBoard.style.opacity = 1;
        gameInfo.style.display = "block";
        gameInfo.style.opacity = 1;
        changeModeButton.style.display = "none"; 
        initializeGame();
    }

    function initializeGame() {
        cells.forEach(cell => cell.addEventListener("click", cellClicked));
        statusText.textContent = `${currentPlayer}'s turn`;
        statusText.classList.add('player-turn');
        statusText.classList.remove('computer-turn');
        running = true;
    }

    function cellClicked() {
        const cellIndex = this.getAttribute("data-index");

        if (options[cellIndex] !== "" || !running) {
            return;
        }

        updateCell(this, cellIndex);
        checkWinner();

        if (isSinglePlayer && running) {
            statusText.textContent = "Computer's turn...";
            statusText.classList.add('computer-turn');
            statusText.classList.remove('player-turn');
            setTimeout(() => {
                computerMove();
                checkWinner();
                if (running) {
                    statusText.textContent = `${currentPlayer}'s turn`;
                    statusText.classList.add('player-turn');
                    statusText.classList.remove('computer-turn');
                }
            }, 300); 
        }
    }

    function updateCell(cell, index) {
        options[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add('marked'); 
    }

    function changePlayer() {
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
        statusText.textContent = `${currentPlayer}'s turn`;
    }

    function checkWinner() {
        let roundWon = false;
        let winningCombo;

        for (let i = 0; i < winningConditions.length; i++) {
            const condition = winningConditions[i];
            const cellA = options[condition[0]];
            const cellB = options[condition[1]];
            const cellC = options[condition[2]];

            if (cellA === "" || cellB === "" || cellC === "") {
                continue;
            }
            if (cellA === cellB && cellB === cellC) {
                roundWon = true;
                winningCombo = condition;
                break;
            }
        }

        if (roundWon) {
            statusText.textContent = `${currentPlayer} wins!`;
            running = false;
            highlightWinningCombo(winningCombo);
            changeModeButton.style.display = "inline-block"; 
            setTimeout(() => clearBoard(), 1500); 
        } else if (!options.includes("")) {
            statusText.textContent = `Draw!`;
            running = false;
            changeModeButton.style.display = "inline-block"; 
            setTimeout(() => clearBoard(), 1500); 
        } else {
            changePlayer();
        }
    }

    function highlightWinningCombo(winningCombo) {
        winningCombo.forEach(index => {
            const cell = cells[index];
            cell.style.animation = "pulse 1s infinite";
        });
    }

    function computerMove() {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < options.length; i++) {
            if (options[i] === "") {
                options[i] = "O";
                let score = minimax(options, 0, false);
                options[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        if (bestMove !== undefined) {
            const cell = cells[bestMove];
            updateCell(cell, bestMove);
        }
    }

    function minimax(board, depth, isMaximizing) {
        let scores = {
            X: -10,
            O: 10,
            draw: 0
        };

        let result = checkForWinner(board);
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkForWinner(board) {
        for (let i = 0; i < winningConditions.length; i++) {
            const condition = winningConditions[i];
            const a = board[condition[0]];
            const b = board[condition[1]];
            const c = board[condition[2]];

            if (a === b && b === c && a !== "") {
                return a;
            }
        }

        if (!board.includes("")) {
            return "draw";
        }

        return null;
    }

    function clearBoard() {
        options = ["", "", "", "", "", "", "", "", ""];
        cells.forEach(cell => {
            cell.textContent = "";
            cell.style.animation = "";
        });
        currentPlayer = "X";
        running = true;
    }

    function restartGame() {
        clearBoard();
        statusText.textContent = `${currentPlayer}'s turn`;
        statusText.classList.add('player-turn');
        statusText.classList.remove('computer-turn');
        running = true;
        changeModeButton.style.display = "none"; 
    }

    function changeMode() {
        clearBoard();
        gameBoard.style.display = "none";
        gameInfo.style.display = "none";
        modeSelection.style.display = "block";
    }
});
