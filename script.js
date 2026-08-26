/* =========================
   GAME DATA
========================= */

const emojis = [

    "🍎", "🍌", "🍇", "🍊",
    "🍉", "🍓", "🥝", "🍍",
    "🥭", "🍒", "🥑", "🌽"

];


const levels = {

    easy: {
        pairs: 4,
        lives: 3
    },

    medium: {
        pairs: 8,
        lives: 5
    },

    hard: {
        pairs: 12,
        lives: 7
    }

};


/* =========================
   SOUNDS
========================= */

const sounds = {

    flip:
        new Audio("sounds/flip.mp3"),

    match:
        new Audio("sounds/match.mp3"),

    wrong:
        new Audio("sounds/wrong.mp3"),

    win:
        new Audio("sounds/win.mp3"),

    gameover:
        new Audio("sounds/gameover.mp3")

};


/* =========================
   VARIABLES
========================= */

let currentLevel = "easy";

let currentPlayer = "";

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

let lives = 3;

let startingLives = 3;

let combo = 0;

let bestCombo = 0;

let wrongMatches = 0;

let soundEnabled = true;


/* =========================
   DAILY CHALLENGE
========================= */

let dailyMode = false;

let dailyChallenge = null;


/*
   These challenges rotate
   automatically according
   to the day.
*/

const dailyChallenges = [

    {
        id: "speed",
        title: "⚡ Speed Challenge",
        description:
            "Complete Easy mode in under 45 seconds.",
        reward: 500
    },

    {
        id: "perfect",
        title: "🎯 Perfect Challenge",
        description:
            "Complete a game without making a wrong match.",
        reward: 500
    },

    {
        id: "combo",
        title: "🔥 Combo Challenge",
        description:
            "Reach a 5× combo during a game.",
        reward: 500
    },

    {
        id: "hard",
        title: "💎 Hard Challenge",
        description:
            "Complete Hard difficulty.",
        reward: 750
    },

    {
        id: "lives",
        title: "❤️ Survivor Challenge",
        description:
            "Complete a game without losing any life.",
        reward: 500
    }

];


/* =========================
   ACHIEVEMENTS
========================= */

const achievements = [

    {
        id: "speedMaster",

        icon: "⚡",

        name: "Speed Master",

        description:
            "Finish a game in under 30 seconds."
    },

    {
        id: "perfectMemory",

        icon: "🎯",

        name: "Perfect Memory",

        description:
            "Win a game without making a wrong match."
    },

    {
        id: "comboKing",

        icon: "🔥",

        name: "Combo King",

        description:
            "Reach a 5× combo."
    },

    {
        id: "survivor",

        icon: "❤️",

        name: "Survivor",

        description:
            "Win a game without losing a life."
    },

    {
        id: "hardMaster",

        icon: "💎",

        name: "Hard Master",

        description:
            "Complete Hard difficulty."
    },

    {
        id: "memoryLegend",

        icon: "🏆",

        name: "Memory Legend",

        description:
            "Complete 5 games."
    }

];


/* =========================
   HIDE SCREENS
========================= */

function hideAllScreens() {

    document
        .getElementById("homeScreen")
        .classList.add("hidden");

    document
        .getElementById("dailyScreen")
        .classList.add("hidden");

    document
        .getElementById("instructionScreen")
        .classList.add("hidden");

    document
        .getElementById("leaderboardScreen")
        .classList.add("hidden");

    document
        .getElementById("achievementScreen")
        .classList.add("hidden");

    document
        .getElementById("gameScreen")
        .classList.add("hidden");

}


/* =========================
   HOME
========================= */

function showHome() {

    clearInterval(timerInterval);

    dailyMode = false;

    hideAllScreens();


    document
        .getElementById("homeScreen")
        .classList.remove("hidden");


    document
        .getElementById("winScreen")
        .classList.remove("show");


    document
        .getElementById("gameOverScreen")
        .classList.remove("show");


    document
        .getElementById("dailyGameBox")
        .classList.add("hidden");

}


/* =========================
   PLAYER NAME
========================= */

function updatePlayerName() {

    document.getElementById(
        "currentPlayer"
    ).textContent =
        currentPlayer;


    document.getElementById(
        "gamePlayerName"
    ).textContent =
        currentPlayer;

}


/* =========================
   START NORMAL GAME
========================= */

function showGame() {

    const nameInput =
        document.getElementById(
            "playerName"
        );


    const error =
        document.getElementById(
            "nameError"
        );


    const name =
        nameInput.value.trim();


    if (name === "") {

        error.textContent =
            "⚠️ Please enter your name.";

        nameInput.focus();

        return;

    }


    currentPlayer = name;


    localStorage.setItem(
        "memoryPlayerName",
        currentPlayer
    );


    error.textContent = "";


    dailyMode = false;


    hideAllScreens();


    document
        .getElementById("gameScreen")
        .classList.remove("hidden");


    document
        .getElementById("dailyGameBox")
        .classList.add("hidden");


    updatePlayerName();


    startGame();

}


/* =========================
   INSTRUCTIONS
========================= */

function showInstructions() {

    hideAllScreens();

    document
        .getElementById(
            "instructionScreen"
        )
        .classList.remove("hidden");

}


/* =========================
   LEADERBOARD
========================= */

function showLeaderboard() {

    hideAllScreens();

    document
        .getElementById(
            "leaderboardScreen"
        )
        .classList.remove("hidden");

    displayLeaderboard();

}


/* =========================
   ACHIEVEMENTS
========================= */

function showAchievements() {

    hideAllScreens();

    document
        .getElementById(
            "achievementScreen"
        )
        .classList.remove("hidden");

    displayAchievements();

}


/* =========================
   DAILY SCREEN
========================= */

function showDailyChallenge() {

    hideAllScreens();


    document
        .getElementById(
            "dailyScreen"
        )
        .classList.remove("hidden");


    prepareDailyChallenge();

    displayDailyChallenge();

}


/* =========================
   DATE KEY
========================= */

function getTodayKey() {

    const date =
        new Date();


    return (

        date.getFullYear()
        + "-"
        + String(
            date.getMonth() + 1
        ).padStart(2, "0")
        + "-"
        + String(
            date.getDate()
        ).padStart(2, "0")

    );

}


/* =========================
   PREPARE DAILY CHALLENGE
========================= */

function prepareDailyChallenge() {

    const today =
        getTodayKey();


    /*
       Use the date to select
       the same challenge for
       everyone using the
       same game version.
    */

    let number = 0;


    for (
        let i = 0;
        i < today.length;
        i++
    ) {

        number +=
            today.charCodeAt(i);

    }


    const index =
        number %
        dailyChallenges.length;


    dailyChallenge =
        dailyChallenges[index];

}


/* =========================
   DISPLAY DAILY CHALLENGE
========================= */

function displayDailyChallenge() {

    prepareDailyChallenge();


    const completed =
        isDailyCompleted();


    document.getElementById(
        "dailyDate"
    ).textContent =
        "📅 " + getTodayKey();


    document.getElementById(
        "streakCount"
    ).textContent =
        getStreak();


    document.getElementById(
        "challengeTitle"
    ).textContent =
        dailyChallenge.title;


    document.getElementById(
        "challengeDescription"
    ).textContent =
        dailyChallenge.description;


    document.getElementById(
        "challengeReward"
    ).textContent =
        "+" +
        dailyChallenge.reward;


    const status =
        document.getElementById(
            "challengeStatus"
        );


    if (completed) {

        status.textContent =
            "✅ Completed Today!";

        status.classList.add(
            "completed"
        );

    } else {

        status.textContent =
            "🔒 Not Completed";

        status.classList.remove(
            "completed"
        );

    }

}


/* =========================
   START DAILY CHALLENGE
========================= */

function startDailyChallenge() {

    if (
        isDailyCompleted()
    ) {

        alert(
            "🎉 You already completed today's challenge!"
        );

        return;

    }


    const nameInput =
        document.getElementById(
            "playerName"
        );


    const name =
        nameInput.value.trim();


    if (name === "") {

        alert(
            "⚠️ Please enter your name on the home screen first."
        );

        showHome();

        return;

    }


    currentPlayer =
        name;


    dailyMode = true;


    hideAllScreens();


    document
        .getElementById(
            "gameScreen"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "dailyGameBox"
        )
        .classList.remove(
            "hidden"
        );


    updatePlayerName();


    /*
       Choose difficulty
       depending on challenge.
    */

    if (
        dailyChallenge.id ===
        "hard"
    ) {

        currentLevel =
            "hard";

    } else {

        currentLevel =
            "easy";

    }


    updateLevelButtons();


    startGame();


    updateDailyProgress();

}


/* =========================
   UPDATE LEVEL BUTTONS
========================= */

function updateLevelButtons() {

    document
        .querySelectorAll(
            ".level"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    const buttons =
        document
            .querySelectorAll(
                ".level"
            );


    if (
        currentLevel ===
        "easy"
    ) {

        buttons[0]
            .classList.add(
                "active"
            );

    }


    if (
        currentLevel ===
        "medium"
    ) {

        buttons[1]
            .classList.add(
                "active"
            );

    }


    if (
        currentLevel ===
        "hard"
    ) {

        buttons[2]
            .classList.add(
                "active"
            );

    }

}


/* =========================
   START GAME
========================= */

function startGame() {

    clearInterval(
        timerInterval
    );


    timer = 0;

    moves = 0;

    score = 1000;

    matchedPairs = 0;


    startingLives =
        levels[currentLevel].lives;


    lives =
        startingLives;


    combo = 0;

    bestCombo = 0;

    wrongMatches = 0;


    firstCard = null;

    secondCard = null;

    lockBoard = false;

    gameStarted = false;


    totalPairs =
        levels[currentLevel].pairs;


    let selectedEmojis =
        emojis.slice(
            0,
            totalPairs
        );


    cards = [

        ...selectedEmojis,

        ...selectedEmojis

    ];


    cards.sort(
        () => Math.random() - 0.5
    );


    const gameBoard =
        document.getElementById(
            "gameBoard"
        );


    gameBoard.innerHTML = "";


    cards.forEach(
        emoji => {

            const card =
                document.createElement(
                    "div"
                );


            card.classList.add(
                "card"
            );


            card.innerHTML = `

                <div class="card-front">
                    ${emoji}
                </div>

                <div class="card-back">
                    ❓
                </div>

            `;


            card.dataset.emoji =
                emoji;


            card.addEventListener(
                "click",
                () => {

                    flipCard(card);

                }
            );


            gameBoard.appendChild(
                card
            );

        }
    );


    updateDifficultyDisplay();

    updateDisplay();

}


/* =========================
   DIFFICULTY NAME
========================= */

function getDifficultyName() {

    if (
        currentLevel ===
        "easy"
    ) {

        return "Easy";

    }


    if (
        currentLevel ===
        "medium"
    ) {

        return "Medium";

    }


    return "Hard";

}


/* =========================
   DIFFICULTY DISPLAY
========================= */

function updateDifficultyDisplay() {

    document.getElementById(
        "gameDifficulty"
    ).textContent =
        getDifficultyName();

}


/* =========================
   CHANGE LEVEL
========================= */

function changeLevel(
    level,
    button
) {

    /*
       Do not allow changing
       difficulty during daily
       challenge.
    */

    if (dailyMode) {

        alert(
            "📅 Difficulty is fixed for the Daily Challenge."
        );

        return;

    }


    currentLevel =
        level;


    document
        .querySelectorAll(
            ".level"
        )
        .forEach(
            btn => {

                btn.classList.remove(
                    "active"
                );

            }
        );


    button.classList.add(
        "active"
    );


    startGame();

}


/* =========================
   FLIP CARD
========================= */

function flipCard(card) {

    if (lockBoard)
        return;


    if (card === firstCard)
        return;


    if (
        card.classList.contains(
            "matched"
        )
    )
        return;


    if (
        card.classList.contains(
            "flipped"
        )
    )
        return;


    if (!gameStarted) {

        gameStarted = true;

        startTimer();

    }


    playSound("flip");


    card.classList.add(
        "flipped"
    );


    if (!firstCard) {

        firstCard = card;

        return;

    }


    secondCard = card;

    moves++;


    checkMatch();

}


/* =========================
   CHECK MATCH
========================= */

function checkMatch() {

    const isMatch =
        firstCard.dataset.emoji ===
        secondCard.dataset.emoji;


    if (isMatch) {

        handleMatch();

    } else {

        handleWrongMatch();

    }

}


/* =========================
   MATCH
========================= */

function handleMatch() {

    firstCard.classList.add(
        "matched"
    );


    secondCard.classList.add(
        "matched"
    );


    matchedPairs++;


    combo++;


    if (
        combo >
        bestCombo
    ) {

        bestCombo =
            combo;

    }


    score +=
        50 +
        combo * 10;


    playSound("match");


    showCombo();


    updateDisplay();


    updateDailyProgress();


    firstCard = null;

    secondCard = null;


    if (
        matchedPairs ===
        totalPairs
    ) {

        setTimeout(
            gameWon,
            500
        );

    }

}


/* =========================
   WRONG MATCH
========================= */

function handleWrongMatch() {

    lockBoard = true;


    lives--;

    wrongMatches++;

    combo = 0;


    score -= 30;


    if (
        score < 0
    ) {

        score = 0;

    }


    playSound("wrong");


    updateDisplay();


    setTimeout(
        () => {

            if (firstCard) {

                firstCard
                    .classList
                    .remove(
                        "flipped"
                    );

            }


            if (secondCard) {

                secondCard
                    .classList
                    .remove(
                        "flipped"
                    );

            }


            firstCard = null;

            secondCard = null;

            lockBoard = false;


            if (
                lives <= 0
            ) {

                gameOver();

            }

        },
        900
    );

}


/* =========================
   COMBO
========================= */

function showCombo() {

    const display =
        document.getElementById(
            "comboDisplay"
        );


    display.textContent =
        `🔥 Combo ×${combo}`;


    display.classList.add(
        "combo-active"
    );


    setTimeout(
        () => {

            display.classList.remove(
                "combo-active"
            );

        },
        250
    );

}


/* =========================
   TIMER
========================= */

function startTimer() {

    timerInterval =
        setInterval(
            () => {

                timer++;

                updateDisplay();

                updateDailyProgress();

            },
            1000
        );

}


/* =========================
   FORMAT TIME
========================= */

function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        seconds % 60;


    return (

        String(minutes)
            .padStart(
                2,
                "0"
            )

        +

        ":"

        +

        String(secs)
            .padStart(
                2,
                "0"
            )

    );

}


/* =========================
   UPDATE DISPLAY
========================= */

function updateDisplay() {

    document.getElementById(
        "timer"
    ).textContent =
        formatTime(timer);


    document.getElementById(
        "moves"
    ).textContent =
        moves;


    document.getElementById(
        "score"
    ).textContent =
        score;


    document.getElementById(
        "lives"
    ).textContent =
        getLivesText();


    document.getElementById(
        "comboDisplay"
    ).textContent =
        `🔥 Combo ×${combo}`;

}


/* =========================
   LIVES
========================= */

function getLivesText() {

    let maxLives =
        levels[currentLevel].lives;


    let result = "";


    for (
        let i = 0;
        i < maxLives;
        i++
    ) {

        if (
            i < lives
        ) {

            result +=
                "❤️";

        } else {

            result +=
                "🖤";

        }

    }


    return result;

}


/* =========================
   GAME WON
========================= */

function gameWon() {

    clearInterval(
        timerInterval
    );


    gameStarted = false;


    const timeBonus =
        Math.max(
            0,
            500 -
            timer * 5
        );


    score +=
        timeBonus;


    /*
       DAILY CHALLENGE
    */

    let dailyCompleted =
        false;


    if (dailyMode) {

        dailyCompleted =
            checkDailyChallenge();


        if (
            dailyCompleted
        ) {

            score +=
                dailyChallenge.reward;

            completeDailyChallenge();

        }

    }


    /*
       NORMAL ACHIEVEMENTS
    */

    checkAchievements();


    /*
       SAVE SCORE
    */

    saveScore();


    const oldBest =
        Number(
            localStorage.getItem(
                "memoryBestScore"
            ) || 0
        );


    const isNewRecord =
        score >
        oldBest;


    if (isNewRecord) {

        localStorage.setItem(
            "memoryBestScore",
            score
        );

    }


    /*
       WIN SCREEN
    */

    document.getElementById(
        "winnerName"
    ).textContent =
        currentPlayer;


    document.getElementById(
        "finalPlayer"
    ).textContent =
        currentPlayer;


    document.getElementById(
        "finalDifficulty"
    ).textContent =
        getDifficultyName();


    document.getElementById(
        "finalTime"
    ).textContent =
        formatTime(timer);


    document.getElementById(
        "finalMoves"
    ).textContent =
        moves;


    document.getElementById(
        "finalScore"
    ).textContent =
        score;


    document.getElementById(
        "finalCombo"
    ).textContent =
        bestCombo;


    const newRecord =
        document.getElementById(
            "newRecord"
        );


    if (isNewRecord) {

        newRecord.classList.add(
            "show"
        );

    } else {

        newRecord.classList.remove(
            "show"
        );

    }


    const rewardBox =
        document.getElementById(
            "dailyReward"
        );


    if (
        dailyCompleted
    ) {

        rewardBox.classList.remove(
            "hidden"
        );

    } else {

        rewardBox.classList.add(
            "hidden"
        );

    }


    playSound("win");


    document
        .getElementById(
            "winScreen"
        )
        .classList.add(
            "show"
        );

}


/* =========================
   GAME OVER
========================= */

function gameOver() {

    clearInterval(
        timerInterval
    );


    gameStarted = false;


    document.getElementById(
        "gameOverPlayer"
    ).textContent =
        currentPlayer;


    document.getElementById(
        "gameOverScore"
    ).textContent =
        score;


    playSound("gameover");


    document
        .getElementById(
            "gameOverScreen"
        )
        .classList.add(
            "show"
        );

}


/* =========================
   RESTART
========================= */

function restartGame() {

    document
        .getElementById(
            "winScreen"
        )
        .classList.remove(
            "show"
        );


    document
        .getElementById(
            "gameOverScreen"
        )
        .classList.remove(
            "show"
        );


    startGame();

}


/* =========================
   SAVE SCORE
========================= */

function saveScore() {

    let scores =
        JSON.parse(
            localStorage.getItem(
                "memoryLeaderboard"
            )
        ) || [];


    scores.push({

        name:
            currentPlayer,

        score:
            score,

        difficulty:
            getDifficultyName(),

        time:
            formatTime(timer),

        moves:
            moves,

        date:
            new Date()
                .toLocaleDateString()

    });


    scores.sort(
        (a, b) =>
            b.score -
            a.score
    );


    scores =
        scores.slice(
            0,
            5
        );


    localStorage.setItem(
        "memoryLeaderboard",
        JSON.stringify(
            scores
        )
    );

}


/* =========================
   LEADERBOARD
========================= */

function displayLeaderboard() {

    const list =
        document.getElementById(
            "leaderboardList"
        );


    let scores =
        JSON.parse(
            localStorage.getItem(
                "memoryLeaderboard"
            )
        ) || [];


    list.innerHTML = "";


    if (
        scores.length === 0
    ) {

        list.innerHTML = `

            <p>

                🎮 No scores yet!

                <br><br>

                Play a game to enter
                the leaderboard.

            </p>

        `;

        return;

    }


    const medals = [

        "🥇",
        "🥈",
        "🥉",
        "🏅",
        "🏅"

    ];


    scores.forEach(
        (player, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.classList.add(
                "leaderboard-row"
            );


            row.innerHTML = `

                <span class="rank">

                    ${medals[index]}

                </span>

                <span>

                    ${escapeHTML(
                        player.name
                    )}

                </span>

                <span class="score-value">

                    ⭐ ${player.score}

                </span>

                <span class="difficulty-value">

                    ${player.difficulty}

                </span>

            `;


            list.appendChild(
                row
            );

        }
    );

}


/* =========================
   CLEAR LEADERBOARD
========================= */

function clearLeaderboard() {

    if (
        !confirm(
            "Are you sure you want to clear all scores?"
        )
    ) {

        return;

    }


    localStorage.removeItem(
        "memoryLeaderboard"
    );


    localStorage.removeItem(
        "memoryBestScore"
    );


    displayLeaderboard();

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================
   ACHIEVEMENT FUNCTIONS
========================= */

function getAchievements() {

    return JSON.parse(
        localStorage.getItem(
            "memoryAchievements"
        )
    ) || {};

}


function unlockAchievement(id) {

    let unlocked =
        getAchievements();


    if (
        unlocked[id]
    ) {

        return;

    }


    unlocked[id] = true;


    localStorage.setItem(
        "memoryAchievements",
        JSON.stringify(
            unlocked
        )
    );


    showAchievementMessage(id);

}


function showAchievementMessage(id) {

    const achievement =
        achievements.find(
            item =>
                item.id === id
        );


    if (!achievement)
        return;


    alert(

        `${achievement.icon} Achievement Unlocked!\n\n` +

        `${achievement.name}\n\n` +

        `${achievement.description}`

    );

}


function checkAchievements() {

    /*
       SPEED MASTER
    */

    if (
        timer < 30
    ) {

        unlockAchievement(
            "speedMaster"
        );

    }


    /*
       PERFECT MEMORY
    */

    if (
        wrongMatches === 0
    ) {

        unlockAchievement(
            "perfectMemory"
        );

    }


    /*
       COMBO KING
    */

    if (
        bestCombo >= 5
    ) {

        unlockAchievement(
            "comboKing"
        );

    }


    /*
       SURVIVOR
    */

    if (
        lives === startingLives
    ) {

        unlockAchievement(
            "survivor"
        );

    }


    /*
       HARD MASTER
    */

    if (
        currentLevel ===
        "hard"
    ) {

        unlockAchievement(
            "hardMaster"
        );

    }


    /*
       MEMORY LEGEND
    */

    let completedGames =
        Number(
            localStorage.getItem(
                "memoryCompletedGames"
            ) || 0
        );


    completedGames++;


    localStorage.setItem(
        "memoryCompletedGames",
        completedGames
    );


    if (
        completedGames >= 5
    ) {

        unlockAchievement(
            "memoryLegend"
        );

    }

}


function displayAchievements() {

    const list =
        document.getElementById(
            "achievementList"
        );


    const unlocked =
        getAchievements();


    list.innerHTML = "";


    achievements.forEach(
        achievement => {

            const isUnlocked =
                unlocked[
                    achievement.id
                ];


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "achievement-item";


            if (
                isUnlocked
            ) {

                item.classList.add(
                    "unlocked"
                );

            }


            item.innerHTML = `

                <div class="achievement-icon">

                    ${achievement.icon}

                </div>


                <div class="achievement-info">

                    <h3>

                        ${achievement.name}

                    </h3>


                    <p>

                        ${achievement.description}

                    </p>

                </div>


                <div class="achievement-status">

                    ${
                        isUnlocked
                        ? "✅"
                        : "🔒"
                    }

                </div>

            `;


            list.appendChild(
                item
            );

        }
    );

}


/* =========================
   DAILY STORAGE
========================= */

function getDailyData() {

    return JSON.parse(
        localStorage.getItem(
            "memoryDailyData"
        )
    ) || {

        lastCompleted:
            null,

        streak:
            0

    };

}


function saveDailyData(data) {

    localStorage.setItem(
        "memoryDailyData",
        JSON.stringify(data)
    );

}


/* =========================
   DAILY COMPLETED?
========================= */

function isDailyCompleted() {

    const data =
        getDailyData();


    return (
        data.lastCompleted ===
        getTodayKey()
    );

}


/* =========================
   GET STREAK
========================= */

function getStreak() {

    const data =
        getDailyData();


    return data.streak || 0;

}


/* =========================
   COMPLETE DAILY
========================= */

function completeDailyChallenge() {

    const data =
        getDailyData();


    const today =
        getTodayKey();


    if (
        data.lastCompleted ===
        today
    ) {

        return;

    }


    /*
       Check whether yesterday
       was completed.
    */

    const yesterday =
        new Date();


    yesterday.setDate(
        yesterday.getDate() - 1
    );


    const yesterdayKey =

        yesterday
            .getFullYear()

        +

        "-"

        +

        String(
            yesterday.getMonth() + 1
        ).padStart(
            2,
            "0"
        )

        +

        "-"

        +

        String(
            yesterday.getDate()
        ).padStart(
            2,
            "0"
        );


    if (
        data.lastCompleted ===
        yesterdayKey
    ) {

        data.streak++;

    } else {

        data.streak = 1;

    }


    data.lastCompleted =
        today;


    saveDailyData(
        data
    );

}


/* =========================
   CHECK DAILY CHALLENGE
========================= */

function checkDailyChallenge() {

    if (
        !dailyChallenge
    ) {

        return false;

    }


    switch (
        dailyChallenge.id
    ) {


        case "speed":

            return (
                currentLevel ===
                "easy"
                &&
                timer <= 45
            );


        case "perfect":

            return (
                wrongMatches === 0
            );


        case "combo":

            return (
                bestCombo >= 5
            );


        case "hard":

            return (
                currentLevel ===
                "hard"
            );


        case "lives":

            return (
                lives ===
                startingLives
            );


        default:

            return false;

    }

}


/* =========================
   DAILY PROGRESS
========================= */

function updateDailyProgress() {

    if (
        !dailyMode
    ) {

        return;

    }


    let progress = 0;


    switch (
        dailyChallenge.id
    ) {


        case "speed":

            if (
                timer <= 45
            ) {

                progress =
                    Math.min(
                        100,
                        Math.floor(
                            (
                                matchedPairs /
                                totalPairs
                            ) * 100
                        )
                    );

            } else {

                progress = 0;

            }

            break;


        case "perfect":

            progress =
                wrongMatches === 0
                ? Math.floor(
                    (
                        matchedPairs /
                        totalPairs
                    ) * 100
                )
                : 0;

            break;


        case "combo":

            progress =
                Math.min(
                    100,
                    bestCombo * 20
                );

            break;


        case "hard":

            progress =
                Math.floor(
                    (
                        matchedPairs /
                        totalPairs
                    ) * 100
                );

            break;


        case "lives":

            progress =
                lives ===
                startingLives
                ? Math.floor(
                    (
                        matchedPairs /
                        totalPairs
                    ) * 100
                )
                : 0;

            break;

    }


    document.getElementById(
        "dailyProgress"
    ).textContent =
        progress + "%";

}


/* =========================
   DARK MODE
========================= */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "memoryTheme",
        isDark
            ? "dark"
            : "light"
    );


    updateThemeButtons();

}


function updateThemeButtons() {

    const isDark =
        document.body.classList.contains(
            "dark"
        );


    document.getElementById(
        "themeButton"
    ).textContent =

        isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

}


function loadTheme() {

    const theme =
        localStorage.getItem(
            "memoryTheme"
        );


    if (
        theme === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

    }


    updateThemeButtons();

}


/* =========================
   SOUND
========================= */

function toggleSound() {

    soundEnabled =
        !soundEnabled;


    localStorage.setItem(
        "memorySound",
        soundEnabled
            ? "on"
            : "off"
    );


    updateSoundButtons();

}


function updateSoundButtons() {

    document.getElementById(
        "soundButton"
    ).textContent =

        soundEnabled
        ? "🔊 Sound On"
        : "🔇 Sound Off";


    document.getElementById(
        "gameSoundButton"
    ).textContent =

        soundEnabled
        ? "🔊"
        : "🔇";

}


function loadSound() {

    const saved =
        localStorage.getItem(
            "memorySound"
        );


    if (
        saved === "off"
    ) {

        soundEnabled =
            false;

    }


    updateSoundButtons();

}


function playSound(type) {

    if (
        !soundEnabled
    )
        return;


    const sound =
        sounds[type];


    if (!sound)
        return;


    sound.currentTime = 0;


    sound.play().catch(
        error => {

            console.log(
                "Sound could not play:",
                error
            );

        }
    );

}


function preloadSounds() {

    Object.values(
        sounds
    ).forEach(
        sound => {

            sound.preload =
                "auto";

        }
    );

}


/* =========================
   LOAD PLAYER NAME
========================= */

function loadPlayerName() {

    const savedName =
        localStorage.getItem(
            "memoryPlayerName"
        );


    if (
        !savedName
    )
        return;


    currentPlayer =
        savedName;


    document.getElementById(
        "playerName"
    ).value =
        savedName;

}


/* =========================
   INITIALIZE
========================= */

loadTheme();

loadSound();

preloadSounds();

loadPlayerName();

prepareDailyChallenge();
