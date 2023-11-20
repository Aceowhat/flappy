const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");


let birdX = 50;
let birdY = canvas.height / 2;
let gravity = 1.5;
let jump = -30;
let score = 0;
let highScore = 0; // Variable for high score

const floorHeight = 20;
const pipeWidth = 50;
const pipeGap = 150;
let pipes = [];

function drawFloor() {
  ctx.fillStyle = "#8B4513"; // Brown color for floor
  ctx.fillRect(0, canvas.height - floorHeight, canvas.width, floorHeight);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawBird() {
  const birdImage = new Image();
  birdImage.src = 'flappy.png'; // Replace with your bird image
  ctx.drawImage(birdImage, birdX, birdY, 40, 30);
}

function updateBird() {
  birdY += gravity;
}

function flap() {
  birdY += jump;
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    flap();
  }
});

canvas.addEventListener("touchstart", function(event) {
  flap();
});

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    const pipeHeight = canvas.height - pipes[i].bottom;
    const pipeImage = new Image();
    pipeImage.src = 'green.png'; // Replace with your pipe image
    ctx.drawImage(pipeImage, pipes[i].x, 0, pipeWidth, pipes[i].top);
    ctx.drawImage(pipeImage, pipes[i].x, pipes[i].bottom, pipeWidth, pipeHeight);
  }
}

function movePipes() {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 2; // Adjust pipe speed here
  }
  if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
    pipes.shift();
    score++;
    if (score > highScore) {
      highScore = score;
    }
  }
}

function generatePipes() {
  const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - floorHeight - 100)) + 50;
  const bottomHeight = canvas.height - topHeight - pipeGap;
  pipes.push({ x: canvas.width, top: topHeight, bottom: canvas.height - bottomHeight });
}

function collisionDetection() {
  for (let i = 0; i < pipes.length; i++) {
    if (
      birdX + 40 >= pipes[i].x &&
      birdX <= pipes[i].x + pipeWidth &&
      (birdY <= pipes[i].top || birdY + 30 >= pipes[i].bottom)
    ) {
      return true;
    }
  }
  return birdY + 30 >= canvas.height - floorHeight;
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  ctx.fillText("High Score: " + highScore, 10, 60);
}

function restartGame() {
  birdY = canvas.height / 2;
  pipes = [];
  score = 0;
  restartButton.style.display = "none";
  draw();
}

function endGame() {
  console.log("Game Over! Score: " + score);
  if (score > highScore) {
    highScore = score;
  }
  restartButton.style.display = "block";
}

restartButton.addEventListener("click", function () {
  restartGame();
});


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawFloor();
  drawPipes();
  drawScore();
  updateBird();
  movePipes();
  if (collisionDetection()) {
    endGame();
    return;
  }
  requestAnimationFrame(draw);
}

setInterval(generatePipes, 2000);
draw();
