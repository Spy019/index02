const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // ขนาดของเซลล์
let score = 0;
let direction = "RIGHT";

let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// วาดงู
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    const segment = snake[i];
    const radius = box / 2 - (i * 1); // ปล้องเล็กลงเรื่อยๆ

    if (i === 0) {
      // หัวงู (วงกลมใหญ่ขึ้น)
      ctx.fillStyle = "darkgreen";
      ctx.beginPath();
      ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // ตา (จุดขาว)
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(segment.x + box / 3, segment.y + box / 3, 3, 0, Math.PI * 2);
      ctx.arc(segment.x + box / 1.5, segment.y + box / 3, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (i === snake.length - 1) {
      // หางงู
      ctx.fillStyle = "forestgreen";
      ctx.beginPath();
      ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 3, 0, Math.PI * 2); // หางจะเล็กลง
      ctx.fill();
    } else {
      // ลำตัว
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 3, 0, Math.PI * 2); // ลำตัว
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

  // ชนขอบ
  if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height) {
    alert("เกมจบแล้ว! คะแนน: " + score);
    resetGame();
    return;
  }

  // ชนตัวเอง
  for (let i = 1; i < snake.length; i++) {
    if (headX === snake[i].x && headY === snake[i].y) {
      alert("คุณชนตัวเอง! คะแนน: " + score);
      resetGame();
      return;
    }
  }

  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
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
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}

// ==== 60 FPS + เคลื่อนที่ด้วย delay ====
let lastTime = 0;
let delay = 100; // ความเร็วงู: 100ms ต่อหนึ่งก้าว
let accumulator = 0;

function gameLoop(timestamp) {
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

requestAnimationFrame(gameLoop);
