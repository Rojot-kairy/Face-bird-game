/* =====================================================
   FACE BIRD - COMPLETE GAME
===================================================== */


/* =====================================================
   SCREENS
===================================================== */

const homeScreen =
    document.getElementById("homeScreen");

const characterScreen =
    document.getElementById("characterScreen");

const gameScreen =
    document.getElementById("gameScreen");


/* =====================================================
   BUTTONS
===================================================== */

const startButton =
    document.getElementById("startButton");

const aboutButton =
    document.getElementById("aboutButton");

const closeAbout =
    document.getElementById("closeAbout");

const playButton =
    document.getElementById("playButton");

const backButton =
    document.getElementById("backButton");


/* =====================================================
   GAME OBJECTS
===================================================== */

const gameArea =
    document.querySelector(".gameArea");

const bird =
    document.getElementById("bird");

const birdImage =
    document.getElementById("birdImage");

const scoreDisplay =
    document.getElementById("score");


/* =====================================================
   CHARACTER
===================================================== */

const characterCards =
    document.querySelectorAll(".characterCard");

let selectedCharacter = "default";


/* =====================================================
   SOUNDS
===================================================== */

const characterSounds = {

    default:
        new Audio("sounds/default.mp3"),

    friend1:
        new Audio("sounds/friend1.mp3"),

    friend2:
        new Audio("sounds/friend2.mp3"),

    friend3:
        new Audio("sounds/friend3.mp3")

};


const gameStartSound =
    new Audio("sounds/game_start.mp3");


const gameOverSound =
    new Audio("sounds/game_over.mp3");


/* =====================================================
   PRELOAD SOUNDS
===================================================== */

Object.values(characterSounds).forEach(
    function (sound) {

        sound.preload = "auto";
        sound.load();

    }
);


gameStartSound.preload = "auto";
gameStartSound.load();


gameOverSound.preload = "auto";
gameOverSound.load();


/* =====================================================
   UNLOCK AUDIO
   Browser audio permission unlock
===================================================== */

function unlockSounds() {

    const allSounds = [

        characterSounds.default,
        characterSounds.friend1,
        characterSounds.friend2,
        characterSounds.friend3,
        gameStartSound,
        gameOverSound

    ];


    allSounds.forEach(
        function (sound) {

            sound.muted = true;


            const promise =
                sound.play();


            if (promise !== undefined) {

                promise
                    .then(
                        function () {

                            sound.pause();

                            sound.currentTime = 0;

                            sound.muted = false;

                        }
                    )
                    .catch(
                        function () {

                            sound.muted = false;

                        }
                    );

            }
            else {

                sound.pause();

                sound.currentTime = 0;

                sound.muted = false;

            }

        }
    );

}


/* =====================================================
   PLAY CHARACTER SOUND
===================================================== */

function playCharacterSound() {

    const sound =
        characterSounds[selectedCharacter];


    if (!sound) {

        console.log(
            "No character sound:",
            selectedCharacter
        );

        return;

    }


    sound.pause();

    sound.currentTime = 0;


    sound.play()
        .then(
            function () {

                console.log(
                    "Character sound:",
                    selectedCharacter
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "Character sound error:",
                    selectedCharacter,
                    error
                );

            }
        );

}


/* =====================================================
   GAME START SOUND
===================================================== */

function playGameStartSound() {

    gameStartSound.pause();

    gameStartSound.currentTime = 0;


    gameStartSound.play()
        .then(
            function () {

                console.log(
                    "Game start sound played"
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "Game start sound error:",
                    error
                );

            }
        );

}


/* =====================================================
   GAME OVER SOUND
===================================================== */

function playGameOverSound() {

    gameOverSound.pause();

    gameOverSound.currentTime = 0;


    gameOverSound.play()
        .then(
            function () {

                console.log(
                    "Game over sound played"
                );

            }
        )
        .catch(
            function (error) {

                console.error(
                    "Game over sound error:",
                    error
                );

            }
        );

}


/* =====================================================
   CHARACTER FACE
===================================================== */

function updateBirdFace() {

    const faceImages = {

        default:
            "images/default.png",

        friend1:
            "images/friend1.png",

        friend2:
            "images/friend2.png",

        friend3:
            "images/friend3.png"

    };


    birdImage.src =
        faceImages[selectedCharacter]
        || faceImages.default;

}


/* =====================================================
   SCREEN SYSTEM
===================================================== */

function showScreen(screen) {

    homeScreen.classList.remove("active");

    characterScreen.classList.remove("active");

    gameScreen.classList.remove("active");


    screen.classList.add("active");

}


/* =====================================================
   HOME → CHARACTER
===================================================== */

startButton.addEventListener(
    "click",
    function () {

        showScreen(characterScreen);

    }
);


/* =====================================================
   ABOUT
===================================================== */

aboutButton.addEventListener(
    "click",
    function () {

        document
            .getElementById("aboutPopup")
            .classList.add("show");

    }
);


closeAbout.addEventListener(
    "click",
    function () {

        document
            .getElementById("aboutPopup")
            .classList.remove("show");

    }
);


/* =====================================================
   CHARACTER SELECT
===================================================== */

characterCards.forEach(
    function (card) {

        const selectButton =
            card.querySelector(".selectButton");


        selectButton.addEventListener(
            "click",
            function () {

                characterCards.forEach(
                    function (otherCard) {

                        otherCard.classList.remove(
                            "selected"
                        );

                    }
                );


                card.classList.add(
                    "selected"
                );


                selectedCharacter =
                    card.dataset.character;


                console.log(
                    "Selected character:",
                    selectedCharacter
                );


                updateBirdFace();

            }
        );

    }
);


/* =====================================================
   GAME VARIABLES
===================================================== */

let birdY = 0;

let birdVelocity = 0;

const gravity = 0.32;

const jumpPower = -7.5;

let gameRunning = false;

let score = 0;

let obstacles = [];

let obstacleTimer = 0;

let gapTop = true;


/* =====================================================
   GAME SETTINGS
===================================================== */

const normalSpeed = 2.8;

const mediumSpeed = 3.0;

const hardSpeed = 3.2;


const blockWidth = 52;

const blockHeight = 46;


const normalGap = 220;

const mediumGap = 212;

const hardGap = 204;


/* =====================================================
   PLAY BUTTON
===================================================== */

playButton.addEventListener(
    "click",
    function () {

        showScreen(gameScreen);

        startGame();

    }
);


/* =====================================================
   BACK BUTTON
===================================================== */

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            showScreen(homeScreen);

        }
    );

}


/* =====================================================
   START GAME
===================================================== */

function startGame() {

    /* ================= RESET SCORE ================= */

    score = 0;

    scoreDisplay.textContent =
        "SCORE: 0";


    /* ================= RESET BIRD ================= */

    birdVelocity = 0;


    birdY =
        gameArea.clientHeight * 0.45;


    bird.style.top =
        birdY + "px";


    bird.style.transform =
        "rotate(0deg)";


    /* ================= STOP GAME ================= */

    gameRunning = false;


    /* ================= RESET OBSTACLES ================= */

    obstacleTimer = 0;

    gapTop = true;


    obstacles.forEach(
        function (obstacle) {

            obstacle.element.remove();

        }
    );


    obstacles = [];


    /* ================= REMOVE OLD GAME OVER ================= */

    const oldGameOver =
        document.getElementById("gameOver");


    if (oldGameOver) {

        oldGameOver.remove();

    }


    /* ================= REMOVE OLD COUNTDOWN ================= */

    const oldCountdown =
        document.getElementById("countdown");


    if (oldCountdown) {

        oldCountdown.remove();

    }


    /*
       Make sure selected face is shown
    */

    updateBirdFace();


    /* ================= GAME START SOUND ================= */

    playGameStartSound();


    /* ================= COUNTDOWN ================= */

    const countdown =
        document.createElement("div");


    countdown.id =
        "countdown";


    gameArea.appendChild(
        countdown
    );


    /* ================= 1 ================= */

    countdown.innerHTML = `
        <div class="countdownText">
            1
        </div>
    `;


    /* ================= 2 ================= */

    setTimeout(
        function () {

            if (!gameRunning) {

                countdown.innerHTML = `
                    <div class="countdownText">
                        2
                    </div>
                `;

            }

        },
        700
    );


    /* ================= GO ================= */

    setTimeout(
        function () {

            countdown.innerHTML = `
                <div class="countdownText go">
                    GO!
                </div>
            `;

        },
        1400
    );


    /* ================= ACTUAL GAME ================= */

    setTimeout(
        function () {

            if (
                countdown &&
                countdown.parentNode
            ) {

                countdown.remove();

            }


            gameRunning = true;


            requestAnimationFrame(
                gameLoop
            );

        },
        2050
    );

}


/* =====================================================
   TAP / CLICK
===================================================== */

gameArea.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();


        /*
           Countdown চলাকালীন tap করলে
           কিছু হবে না।
        */

        if (!gameRunning) {

            return;

        }


        /* ================= JUMP ================= */

        birdVelocity =
            jumpPower;


        /* ================= CHARACTER SOUND ================= */

        playCharacterSound();

    }
);


/* =====================================================
   CREATE OBSTACLE
===================================================== */

function createObstacle() {

    const obstacle =
        document.createElement("div");


    obstacle.classList.add(
        "obstacle"
    );


    /* ================= DIFFICULTY ================= */

    let currentSpeed =
        normalSpeed;


    let currentGap =
        normalGap;


    /*
       0–15:
       Normal
    */

    if (score > 15) {

        currentSpeed =
            mediumSpeed;

        currentGap =
            mediumGap;

    }


    /*
       31+:
       Slightly harder
    */

    if (score > 30) {

        currentSpeed =
            hardSpeed;

        currentGap =
            hardGap;

    }


    /* ================= GAP POSITION ================= */

    let gapCenter;


    if (gapTop) {

        gapCenter =
            gameArea.clientHeight *
            0.35;

    }
    else {

        gapCenter =
            gameArea.clientHeight *
            0.60;

    }


    const gapStart =
        gapCenter -
        currentGap / 2;


    const gapEnd =
        gapCenter +
        currentGap / 2;


    /* ================= TOP BLOCKS ================= */

    const topStack =
        document.createElement("div");


    topStack.classList.add(
        "topStack"
    );


    const topBlocks =
        Math.ceil(
            Math.max(
                0,
                gapStart
            ) /
            blockHeight
        );


    for (
        let i = 0;
        i < topBlocks;
        i++
    ) {

        const block =
            document.createElement("div");


        block.classList.add(
            "stoneBlock"
        );


        block.style.width =
            blockWidth + "px";


        block.style.height =
            blockHeight + "px";


        topStack.appendChild(
            block
        );

    }


    /* ================= BOTTOM BLOCKS ================= */

    const bottomStack =
        document.createElement("div");


    bottomStack.classList.add(
        "bottomStack"
    );


    const bottomBlocks =
        Math.ceil(
            Math.max(
                0,
                gameArea.clientHeight -
                gapEnd
            ) /
            blockHeight
        );


    for (
        let i = 0;
        i < bottomBlocks;
        i++
    ) {

        const block =
            document.createElement("div");


        block.classList.add(
            "stoneBlock"
        );


        block.style.width =
            blockWidth + "px";


        block.style.height =
            blockHeight + "px";


        bottomStack.appendChild(
            block
        );

    }


    /* ================= ADD STACKS ================= */

    obstacle.appendChild(
        topStack
    );


    obstacle.appendChild(
        bottomStack
    );


    bottomStack.style.top =
        gapEnd + "px";


    /* ================= POSITION ================= */

    obstacle.style.left =
        gameArea.clientWidth + "px";


    obstacle.style.top =
        "0px";


    obstacle.style.width =
        blockWidth + "px";


    gameArea.appendChild(
        obstacle
    );


    /* ================= SAVE DATA ================= */

    obstacles.push({

        element:
            obstacle,

        x:
            gameArea.clientWidth,

        width:
            blockWidth,

        gapStart:
            gapStart,

        gapEnd:
            gapEnd,

        speed:
            currentSpeed,

        scored:
            false

    });


    /* ================= NEXT GAP ================= */

    gapTop =
        !gapTop;

}


/* =====================================================
   COLLISION
===================================================== */

function checkCollision(
    obstacleData
) {

    /*
       Bird-এর position
    */

    const birdLeft =
        gameArea.clientWidth *
        0.22;


    const birdTop =
        birdY;


    /*
       Small hitbox
       যাতে চোখে না লাগলে
       অযথা Game Over না হয়।
    */

    const hitboxWidth =
        34;


    const hitboxHeight =
        34;


    const offsetX =
        13;


    const offsetY =
        13;


    const birdLeftHit =
        birdLeft +
        offsetX;


    const birdRightHit =
        birdLeft +
        offsetX +
        hitboxWidth;


    const birdTopHit =
        birdTop +
        offsetY;


    const birdBottomHit =
        birdTop +
        offsetY +
        hitboxHeight;


    /* ================= ACTUAL BLOCKS ================= */

    const blocks =
        obstacleData.element.querySelectorAll(
            ".stoneBlock"
        );


    for (
        const block of blocks
    ) {

        const blockRect =
            block.getBoundingClientRect();


        const gameRect =
            gameArea.getBoundingClientRect();


        /*
           Screen position → gameArea position
        */

        const blockLeft =
            blockRect.left -
            gameRect.left;


        const blockTop =
            blockRect.top -
            gameRect.top;


        const blockRight =
            blockRect.right -
            gameRect.left;


        const blockBottom =
            blockRect.bottom -
            gameRect.top;


        /* ================= HORIZONTAL ================= */

        const horizontalHit =
            birdRightHit >
            blockLeft &&
            birdLeftHit <
            blockRight;


        /* ================= VERTICAL ================= */

        const verticalHit =
            birdBottomHit >
            blockTop &&
            birdTopHit <
            blockBottom;


        /*
           সত্যি দুই দিকেই overlap হলে
           collision।
        */

        if (
            horizontalHit &&
            verticalHit
        ) {

            return true;

        }

    }


    return false;

}


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    /* ================= BIRD PHYSICS ================= */

    birdVelocity +=
        gravity;


    birdY +=
        birdVelocity;


    bird.style.top =
        birdY + "px";


    /* ================= ROTATION ================= */

    let rotation =
        birdVelocity * 4;


    rotation =
        Math.max(
            -25,
            Math.min(
                90,
                rotation
            )
        );


    bird.style.transform =
        `rotate(${rotation}deg)`;


    /* ================= CREATE BLOCK ================= */

    obstacleTimer++;


    if (
        obstacleTimer > 105
    ) {

        createObstacle();

        obstacleTimer = 0;

    }


    /* ================= MOVE BLOCKS ================= */

    obstacles.forEach(
        function (obstacleData) {

            obstacleData.x -=
                obstacleData.speed;


            obstacleData.element.style.left =
                obstacleData.x + "px";


            /* ================= SCORE ================= */

            if (
                !obstacleData.scored &&
                obstacleData.x +
                obstacleData.width <
                gameArea.clientWidth *
                0.22
            ) {

                obstacleData.scored =
                    true;


                score++;


                scoreDisplay.textContent =
                    "SCORE: " +
                    score;

            }


            /* ================= COLLISION ================= */

            if (
                checkCollision(
                    obstacleData
                )
            ) {

                endGame();

            }

        }
    );


    if (!gameRunning) {

        return;

    }


    /* ================= REMOVE OLD BLOCKS ================= */

    obstacles =
        obstacles.filter(
            function (obstacleData) {

                if (
                    obstacleData.x +
                    obstacleData.width <
                    -100
                ) {

                    obstacleData.element.remove();

                    return false;

                }


                return true;

            }
        );


    /* ================= GROUND COLLISION ================= */

    const groundHeight =
        45;


    const birdBottom =
        birdY + 60;


    const groundTop =
        gameArea.clientHeight -
        groundHeight;


    if (
        birdBottom >=
        groundTop
    ) {

        endGame();

        return;

    }


    /* ================= TOP ================= */

    if (
        birdY <= 0
    ) {

        birdY = 0;

        birdVelocity = 0;

    }


    /* ================= NEXT FRAME ================= */

    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   GAME OVER
===================================================== */

function endGame() {

    if (!gameRunning) {

        return;

    }


    gameRunning = false;


    /* ================= GAME OVER SOUND ================= */

    playGameOverSound();


    /* ================= STOP BIRD ================= */

    birdVelocity = 0;


    /* ================= GAME OVER SCREEN ================= */

    const gameOver =
        document.createElement("div");


    gameOver.id =
        "gameOver";


    gameOver.style.display =
        "flex";


    gameOver.innerHTML = `

        <div class="gameOverBox">

            <h2>
                GAME OVER
            </h2>

            <div class="finalScore">
                SCORE: ${score}
            </div>

            <button id="restartButton">
                PLAY AGAIN
            </button>

            <button id="homeButton">
                HOME
            </button>

        </div>

    `;


    gameArea.appendChild(
        gameOver
    );


    /* ================= PLAY AGAIN ================= */

    document
        .getElementById(
            "restartButton"
        )
        .addEventListener(
            "click",
            function () {

                /*
                   User click আবার audio unlock করবে
                */

                unlockSounds();


                startGame();

            }
        );


    /* ================= HOME ================= */

    document
        .getElementById(
            "homeButton"
        )
        .addEventListener(
            "click",
            function () {

                const overlay =
                    gameArea.querySelector(
                        "#gameOver"
                    );


                if (overlay) {

                    overlay.remove();

                }


                showScreen(
                    homeScreen
                );

            }
        );

}