const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const basket = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 40,
  width: 60,
  height: 20,
  speed: 7
};

const hearts = [];
let score = 0;

// Generate hearts at random positions
function createHeart() {
  hearts.push({
    x: Math.random() * (canvas.width - 20),
    y: 0,
    size: 20,
    speed: 2 + Math.random() * 2
  });
}

// Handle keyboard input
const keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Game loop
function update() {
  // Move basket
  if (keys["ArrowLeft"] && basket.x > 0) basket.x -= basket.speed;
  if (keys["ArrowRight"] && basket.x < canvas.width - basket.width) basket.x += basket.speed;

  // Move hearts
  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].y += hearts[i].speed;

    // Check collision
    if (
      hearts[i].y + hearts[i].size > basket.y &&
      hearts[i].x + hearts[i].size > basket.x &&
      hearts[i].x < basket.x + basket.width
    ) {
      hearts.splice(i, 1);
      score++;
      document.getElementById("score").innerText = "Score: " + score;
    }
    // Remove hearts that fall off screen
    else if (hearts[i].y > canvas.height) {
      hearts.splice(i, 1);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw basket
  ctx.fillStyle = "darkred";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

  // Draw hearts
  hearts.forEach(h => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(h.x + h.size/2, h.y + h.size/4);
    ctx.bezierCurveTo(h.x + h.size/2 + h.size/4, h.y, h.x + h.size, h.y + h.size/2, h.x + h.size/2, h.y + h.size);
    ctx.bezierCurveTo(h.x, h.y + h.size/2, h.x + h.size/2 - h.size/4, h.y, h.x + h.size/2, h.y + h.size/4);
    ctx.fill();
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Spawn hearts every 1 second
setInterval(createHeart, 1000);

// Start the game
loop();
