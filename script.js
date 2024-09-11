const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const snake = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    dx: 0,
    dy: 0,
    tail: [],
    maxTail: 1
};

const bots = [];
const botSize = 20;
const botSpeed = 6; // Velocidade dos bots
const snakeSpeed = 7; // Velocidade da cobra (ajuste para desacelerar a cobra)
let score = 0;

// Cria bots com movimento aleatório
function createBots(numBots) {
    for (let i = 0; i < numBots; i++) {
        bots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * botSpeed,
            dy: (Math.random() - 0.5) * botSpeed
        });
    }
}

// Desenha a cobra
function drawSnake() {
    ctx.fillStyle = 'lime';
    ctx.fillRect(snake.x, snake.y, snake.size, snake.size);

    for (const segment of snake.tail) {
        ctx.fillStyle = 'lime';
        ctx.fillRect(segment.x, segment.y, snake.size, snake.size);
    }
}

// Desenha os bots
function drawBots() {
    ctx.fillStyle = 'red';
    for (const bot of bots) {
        ctx.fillRect(bot.x, bot.y, botSize, botSize);
    }
}

// Move a cobra
function moveSnake() {
    snake.x += snake.dx;
    snake.y += snake.dy;

    snake.tail.unshift({ x: snake.x, y: snake.y });
    if (snake.tail.length > snake.maxTail) {
        snake.tail.pop();
    }
}

// Move os bots
function moveBots() {
    for (const bot of bots) {
        bot.x += bot.dx;
        bot.y += bot.dy;

        // Muda a direção se o bot atingir as bordas do canvas
        if (bot.x < 0 || bot.x + botSize > canvas.width) {
            bot.dx = -bot.dx;
        }
        if (bot.y < 0 || bot.y + botSize > canvas.height) {
            bot.dy = -bot.dy;
        }
    }
}

// Verifica a colisão com os bots
function checkCollision() {
    for (let i = 0; i < bots.length; i++) {
        const bot = bots[i];
        if (
            snake.x < bot.x + botSize &&
            snake.x + snake.size > bot.x &&
            snake.y < bot.y + botSize &&
            snake.y + snake.size > bot.y
        ) {
            bots.splice(i, 1);
            score++;
            snake.maxTail++;
            document.getElementById('score').textContent = `Score: ${score}`;
            break;
        }
    }
}

// Atualiza o estado do jogo
function update() {
    moveSnake();
    moveBots();
    checkCollision();
}

// Renderiza o jogo
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawBots();
}

// Loop do jogo
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Configura os controles
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            snake.dx = 0;
            snake.dy = -snakeSpeed;
            break;
        case 'ArrowDown':
            snake.dx = 0;
            snake.dy = snakeSpeed;
            break;
        case 'ArrowLeft':
            snake.dx = -snakeSpeed;
            snake.dy = 0;
            break;
        case 'ArrowRight':
            snake.dx = snakeSpeed;
            snake.dy = 0;
            break;
    }
});

// Inicializa o jogo
createBots(500);
gameLoop();
