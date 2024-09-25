const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

// Raquetes
const paddleWidth = 10;
const paddleHeight = 80;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;  // Posição da raquete esquerda
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;  // Posição da raquete direita
const paddleSpeed = 6;

// Bola
const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;

// Placar
let player1Score = 0;
let player2Score = 0;
const maxScore = 10;

// Flags para detectar teclas
let keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false
};

// Atualiza a posição da raquete esquerda com base nas teclas "w" e "s"
function updateLeftPaddle() {
    if (keysPressed.w && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;  // Movimenta a raquete esquerda para cima
    }
    if (keysPressed.s && leftPaddleY < canvas.height - paddleHeight) {
        leftPaddleY += paddleSpeed;  // Movimenta a raquete esquerda para baixo
    }
}

// Atualiza a posição da raquete direita com base nas teclas de seta para cima/baixo
function updateRightPaddle() {
    if (keysPressed.ArrowUp && rightPaddleY > 0) {
        rightPaddleY -= paddleSpeed;  // Movimenta a raquete direita para cima
    }
    if (keysPressed.ArrowDown && rightPaddleY < canvas.height - paddleHeight) {
        rightPaddleY += paddleSpeed;  // Movimenta a raquete direita para baixo
    }
}

// Verifica se a bola colidiu com uma raquete e inverte a direção
function checkPaddleCollision() {
    // Colisão com a raquete esquerda
    if (ballX - ballRadius <= paddleWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;  // Inverte a direção da bola
    }

    // Colisão com a raquete direita
    if (ballX + ballRadius >= canvas.width - paddleWidth && ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;  // Inverte a direção da bola
    }
}

// Verifica se a bola passou das extremidades do campo e ajusta o placar
function checkScore() {
    if (ballX + ballRadius < 0) {
        // Jogador 2 marca ponto
        player2Score++;
        resetBall();
    }

    if (ballX - ballRadius > canvas.width) {
        // Jogador 1 marca ponto
        player1Score++;
        resetBall();
    }

    // Verifica se algum jogador atingiu o placar máximo
    if (player1Score === maxScore || player2Score === maxScore) {
        alert(`Fim do jogo! O vencedor é o jogador ${player1Score === maxScore ? 1 : 2}`);
        player1Score = 0;
        player2Score = 0;
        resetBall();
    }
}

// Reinicia a bola no centro com uma nova direção aleatória
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = ballSpeedX > 0 ? 4 : -4;  // Reverte a direção inicial
    ballSpeedY = Math.random() > 0.5 ? 4 : -4;  // Define uma nova direção aleatória para o eixo Y
}

// Atualiza a posição da bola e verifica colisões
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Colisão com a parte superior e inferior da tela
    if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
        ballSpeedY = -ballSpeedY;  // Inverte a direção da bola no eixo Y
    }

    checkPaddleCollision();
    checkScore();
}

// Desenha as raquetes, a bola e o placar no canvas
function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a raquete esquerda
    context.fillStyle = 'white';
    context.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

    // Desenha a raquete direita
    context.fillStyle = 'white';
    context.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Desenha a bola
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
    context.closePath();

    // Desenha o placar
    context.font = '24px Arial';
    context.fillText(`${player1Score} : ${player2Score}`, canvas.width / 2 - 25, 50);
}

// Captura as teclas pressionadas
window.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});

// Captura as teclas liberadas
window.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});

// Loop principal do jogo
function gameLoop() {
    updateLeftPaddle();
    updateRightPaddle();
    updateBall();
    drawGame();
    requestAnimationFrame(gameLoop);  // Chama o próximo quadro
}

// Inicia o loop do jogo
gameLoop();
