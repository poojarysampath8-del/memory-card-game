const emojis = [
    "🍎", "🍌", "🍇", "🍊",
    "🍉", "🍓", "🥝", "🍍",
    "🥭", "🍒", "🥑", "🌽"
];

const levels = {
    easy: 4,
    medium: 8,
    hard: 12
};

let currentLevel = "easy";
let cards = [];

let firstCard = null;
let secondCard = null;

let lockBoard = false;
let moves = 0;
let score = 1000;

let matchedPairs = 0;
let totalPairs = 0;

let timer = 0;
let timerInterval = null;
let gameStarted = false;


/* Start Game */

function startGame() {

    clearInterval(timerInterval);

    timer = 0;
    moves = 0;
    score = 1000;

    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    gameStarted = false;

    updateDisplay();

    const pairCount = levels[currentLevel];

    totalPairs = pairCount;

    let selectedEmojis = emojis.slice(0, pairCount);

    cards = [...selectedEmojis, ...selectedEmojis];

    cards.sort(() => Math.random() - 0.5);

    const gameBoard = document.getElementById("gameBoard");

    gameBoard.innerHTML = "";

    cards.forEach((emoji) => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <div class="card-front">
                ${emoji}
            </div>

            <div class="card-back">
                ❓
            </div>
        `;

        card.dataset.emoji = emoji;

        card.addEventListener("click", () => {

            flipCard(card);

        });

        gameBoard.appendChild(card);
    });
}


/* Flip Card */

function flipCard(card) {

    if (lockBoard) return;

    if (card === firstCard) return;

    if (card.classList.contains("matched")) return;

    if (!gameStarted) {

        gameStarted = true;

        startTimer();

    }

    card.classList.add("flipped");

    if (!firstCard) {

        firstCard = card;

        return;
    }

    secondCard = card;

    moves++;

    score -= 10;

    if (score < 0) {
        score = 0;
    }

    updateDisplay();

    checkMatch();
}


/* Check Match */

function checkMatch() {

    const match =
        firstCard.dataset.emoji ===
        secondCard.dataset.emoji;

    if (match) {

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");

        matchedPairs++;

        firstCard = null;
        secondCard = null;

        if (matchedPairs === totalPairs) {

            gameWon();
        }

    } else {

        lockBoard = true;

        setTimeout(() => {

            firstCard.classList.remove("flipped");

            secondCard.classList.remove("flipped");

            firstCard = null;
            secondCard = null;

            lockBoard = false;

        }, 900);
    }
}


/* Timer */

function startTimer() {

    timerInterval = setInterval(() => {

        timer++;

        updateDisplay();

    }, 1000);
}


/* Update Display */

function updateDisplay() {

    document.getElementById("moves").textContent = moves;

    document.getElementById("score").textContent = score;

    document.getElementById("timer").textContent =
        formatTime(timer);

    const bestScore =
        localStorage.getItem("memoryBestScore") || 0;

    document.getElementById("bestScore").textContent =
        bestScore;
}


/* Format Time */

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );
}


/* Game Won */

function gameWon() {

    clearInterval(timerInterval);

    gameStarted = false;

    /* Bonus for finishing quickly */

    const timeBonus =
        Math.max(0, 500 - timer * 5);

    score += timeBonus;

    updateDisplay();

    const oldBest =
        Number(
            localStorage.getItem("memoryBestScore") || 0
        );

    if (score > oldBest) {

        localStorage.setItem(
            "memoryBestScore",
            score
        );
    }

    document.getElementById("finalTime").textContent =
        formatTime(timer);

    document.getElementById("finalMoves").textContent =
        moves;

    document.getElementById("finalScore").textContent =
        score;

    document
        .getElementById("winScreen")
        .classList.add("show");

    updateDisplay();
}


/* Restart */

function restartGame() {

    document
        .getElementById("winScreen")
        .classList.remove("show");

    startGame();
}


/* Change Difficulty */

function changeLevel(level, button) {

    currentLevel = level;

    document
        .querySelectorAll(".level")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    button.classList.add("active");

    startGame();
}


/* Start */

startGame();
