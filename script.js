const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

const box = 20;
let score = 0;
let direction = "RIGHT";
let gameRunning = false;

let snake = [];
let food = {};

let lastTime = 0;
let delay = 100;
let accumulator = 0;

document.addEventListener("keydown", event => {
  if (!gameRunning) return;

  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

startButton.addEventListener("click", () => {
  resetGame();
  gameRunning = true;
  lastTime = 0;
  accumulator = 0;
  requestAnimationFrame(gameLoop);
});

// === วาดงูแบบสมจริง ===
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    const segment = snake[i];

    if (i === 0) {
      // หัว
      ctx.fillStyle = "darkgreen";
      ctx.beginPath();
      ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 2, 0, Math.PI * 2);
      ctx.fill();

      // ตา
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(segment.x + box / 3, segment.y + box / 3, 3, 0, Math.PI * 2);
      ctx.arc(segment.x + box / 1.5, segment.y + box / 3, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (i === snake.length - 1) {
      // หาง
      ctx.fillStyle = "forestgreen";
      ctx.beginPath();
      ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // ลำตัว
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
}

function updateGame() {
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;

  if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height) {
    endGame("ชนขอบสนาม!");
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (headX === snake[i].x && headY === snake[i].y) {
      endGame("คุณชนตัวเอง!");
      return;
    }
  }

  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    spawnFood();
  } else {
    snake.pop();
  }

  snake.unshift({ x: headX, y: headY });
}

function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").textContent = score;
  spawnFood();
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}

function endGame(message) {
  alert(message + " คะแนน: " + score);
  gameRunning = false;
}

function gameLoop(timestamp) {
  if (!gameRunning) return;

  if (!lastTime) lastTime = timestamp;
  let delta = timestamp - lastTime;
  lastTime = timestamp;
  accumulator += delta;

  if (accumulator >= delay) {
    updateGame();
    accumulator = 0;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();

  requestAnimationFrame(gameLoop);
}
