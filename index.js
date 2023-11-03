document.addEventListener('DOMContentLoaded', (event) => {
    const gameContainer = document.getElementById('game-container');
    const paddleA = document.getElementById('paddleA');
    const paddleB = document.getElementById('paddleB');
    const puck = document.getElementById('puck');
    const playerScoreEl = document.getElementById('player-score');
    const opponentScoreEl = document.getElementById('opponent-score');
    let puckDirection = { x: 3, y: 2 };
    let playerScore = 0;
    let opponentScore = 0;
    const opponentSpeed = 2.5;
    const opponentMissRate = 0.3; // Chance for the opponent to "miss"
    const winningScore = 8;

    gameContainer.addEventListener('mousemove', (e) => {
        const gameRect = gameContainer.getBoundingClientRect();
        let mouseY = e.clientY - gameRect.top - (paddleA.offsetHeight / 2);
        mouseY = Math.max(mouseY, 0);
        mouseY = Math.min(mouseY, gameContainer.offsetHeight - paddleA.offsetHeight);
        paddleA.style.top = `${mouseY}px`;
    });

    function moveOpponentPaddle() {
        if (Math.random() > opponentMissRate) {
            const puckCenterY = puck.offsetTop + (puck.offsetHeight / 2);
            const paddleBCenterY = paddleB.offsetTop + (paddleB.offsetHeight / 2);
            if (puckCenterY < paddleBCenterY) {
                paddleB.style.top = `${Math.max(paddleB.offsetTop - opponentSpeed, 0)}px`;
            } else if (puckCenterY > paddleBCenterY) {
                paddleB.style.top = `${Math.min(paddleB.offsetTop + opponentSpeed, gameContainer.offsetHeight - paddleB.offsetHeight)}px`;
            }
        }
    }

    function movePuck() {
        puck.style.left = `${puck.offsetLeft + puckDirection.x}px`;
        puck.style.top = `${puck.offsetTop + puckDirection.y}px`;

        // Bounce off the top and bottom
        if (puck.offsetTop <= 0 || puck.offsetTop + puck.offsetHeight >= gameContainer.offsetHeight) {
            puckDirection.y *= -1;
        }

        // Bounce off the paddles
        if ((puck.offsetLeft <= paddleA.offsetWidth && puck.offsetTop >= paddleA.offsetTop && puck.offsetTop <= paddleA.offsetTop + paddleA.offsetHeight) ||
            (puck.offsetLeft + puck.offsetWidth >= gameContainer.offsetWidth - paddleB.offsetWidth && puck.offsetTop >= paddleB.offsetTop && puck.offsetTop <= paddleB.offsetTop + paddleB.offsetHeight)) {
            puckDirection.x *= -1;
        }

        // Scoring
        if (puck.offsetLeft <= 0) {
            opponentScore++;
            updateScoreDisplay();
            resetPuck();
        } else if (puck.offsetLeft + puck.offsetWidth >= gameContainer.offsetWidth) {
            playerScore++;
            updateScoreDisplay();
            resetPuck();
        }
    }

    function updateScoreDisplay() {
        playerScoreEl.textContent = `Player: ${playerScore}`;
        opponentScoreEl.textContent = `Opponent: ${opponentScore}`;
    }

    function resetPuck() {
        puck.style.left = `${gameContainer.offsetWidth / 2 - puck.offsetWidth / 2}px`;
        puck.style.top = `${gameContainer.offsetHeight / 2 - puck.offsetHeight / 2}px`;
        puckDirection = { x: (Math.random() < 0.5 ? -3 : 3), y: (Math.random() < 0.5 ? -2 : 2) };
    }

    function checkWinner() {
        if (playerScore >= winningScore) {
            setTimeout(() => { alert('Player wins!'); resetGame(); }, 100);
        } else if (opponentScore >= winningScore) {
            setTimeout(() => { alert('Opponent wins!'); resetGame(); }, 100);
        }
    }

    function resetGame() {
        playerScore = 0;
        opponentScore = 0;
        updateScoreDisplay();
        resetPuck();
    }

    function gameLoop() {
        moveOpponentPaddle();
        movePuck();
        checkWinner();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
