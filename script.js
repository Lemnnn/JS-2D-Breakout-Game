const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = canvas.width / 2;
let y = canvas.height - 40;

let changeX = 2;
let changeY = -2;

const ballRadius = 10;
const paddleH = 15;
const paddleW = 150;

let paddleX = (canvas.width - paddleW) / 2;

let rPressed = false;
let lPressed = false;

const brickRowCount = 5;
const brickColCount = 17;
const brickW = 75;
const brickH = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 60;

const bricks = [];
for (let c = 0; c < brickColCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

let score = 0;
let lives = 3;

function drawBall() {
  context.beginPath();
  context.arc(x, y, ballRadius, 0, Math.PI * 2);
  context.fillStyle = "white";
  context.fill();
  context.closePath();
}

function drawPaddle() {
  context.beginPath();
  context.rect(paddleX, canvas.height - paddleH - 10, paddleW, paddleH);
  context.fillStyle = "white";
  context.fill();
  context.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickW + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickH + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, brickW, brickH);
        context.fillStyle = "white";
        context.fill();
        context.closePath();
      }
    }
  }
}

function collision() {
  for (let c = 0; c < brickColCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickW && y > b.y && y < b.y + brickH) {
          changeY = -changeY;
          b.status = 0;
          score++;
          changeX += 0.2;
          changeY += 0.2;
          if (score === brickColCount * brickRowCount) {
            alert("You Win");
            document.location.reload();
          }
        }
      }
    }
  }
}

function handleScore() {
  context.font = "16px Arial";
  context.fillStyle = "white";
  context.fillText(`Score: ${score}`, 8, 20);
}

function handleLives() {
  context.font = "16px Arial";
  context.fillStyle = "white";
  context.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  handleScore();
  handleLives();
  collision();

  if (x + changeX > canvas.width - ballRadius || x + changeX < ballRadius) {
    changeX = -changeX;
  }

  if (y + changeY < ballRadius) {
    changeY = -changeY;
  } else if (y + changeY > canvas.height - ballRadius - 23) {
    if (x > paddleX && x < paddleX + paddleW) {
      changeY = -changeY;
    } else if (y + changeY > canvas.height - ballRadius) {
      lives--;
      if (!lives) {
        alert("Game Over");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        changeX = 7;
        changeY = -7;
        paddleX = (canvas.width - paddleW) / 2;
      }
    }
  }

  x += changeX;
  y += changeY;

  if (rPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleW);
  } else if (lPressed) {
    paddleX = Math.max(paddleX - 7, 0);
  }

  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    lPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    lPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleW / 2;
  }
}

draw();
