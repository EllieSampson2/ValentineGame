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
let previousJokes = [];

// Generate hearts at random positions
function createHeart() {
  hearts.push({
    x: Math.random() * (canvas.width - 30),
    y: 0,
    size: 30,
    speed: 2 + Math.random() * 2
  });
}

// Handle keyboard input
const keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Fetch a random dad joke
async function fetchDadJoke() {
  try {
    let joke;
    do {
      const res = await fetch("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" }
      });
      const data = await res.json();
      joke = data.joke;
    } while (previousJokes.includes(joke));
    previousJokes.push(joke);
    return joke;
  } catch {
    return "You're amazing! ❤️";
  }
}

// Show joke at milestone
async function showMilestoneMessage() {
  const joke = await fetchDadJoke();
  alert(`Milestone reached! 💫\n\n${joke}`);
}

// Update game state
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

      // Confetti effect
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.6 } });

      // Show dad joke at milestones (every 5 hearts)
      if (score % 5 === 0) showMilestoneMessage();
    }

    // Remove hearts that fall off screen
    else if (hearts[i].y > canvas.height) {
      hearts.splice(i, 1);
    }
  }
}

// Draw basket and hearts
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw basket
  ctx.fillStyle = "darkred";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

  // Draw hearts as emojis
  hearts.forEach(h => {
    ctx.font = `${h.size}px Arial`;
    ctx.fillText("❤️", h.x, h.y + h.size);
  });
}

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Spawn hearts every 1 second
setInterval(createHeart, 1000);

// Start the game
loop();
