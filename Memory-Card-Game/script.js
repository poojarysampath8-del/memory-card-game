const emojis = ["🍎", "🍌", "🍇", "🍊", "🍎", "🍌", "🍇", "🍊"];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;

function startGame() {

    cards = [...emojis].sort(() => Math.random() - 0.5);

    const gameBoard = document.getElementById("gameBoard");

    gameBoard.innerHTML = "";

    cards.forEach((emoji, index) => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = "❓";

        card.dataset.emoji = emoji;

        card.onclick = function () {
            flipCard(card);
        };

        gameBoard.appendChild(card);
    });

    moves = 0;
    document.getElementById("moves").textContent = moves;
}

function flipCard(card) {

    if (lockBoard) return;

    if (card === firstCard) return;

    card.innerHTML = card.dataset.emoji;
    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;

    moves++;
    document.getElementById("moves").textContent = moves;

    checkMatch();
}

function checkMatch() {

    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {

        firstCard = null;
        secondCard = null;

        checkWin();

    } else {

        lockBoard = true;

        setTimeout(() => {

            firstCard.innerHTML = "❓";
            secondCard.innerHTML = "❓";

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard = null;
            secondCard = null;

            lockBoard = false;

        }, 1000);
    }
}

function checkWin() {

    const flippedCards = document.querySelectorAll(".flipped");

    if (flippedCards.length === cards.length) {
        setTimeout(() => {
            alert("🎉 Congratulations! You won!");
        }, 300);
    }
}

function restartGame() {
    startGame();
}

startGame();