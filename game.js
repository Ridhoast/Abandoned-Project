const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playButton = document.getElementById("playButton");
const greetingCardButton = document.getElementById("greetingCardButton");
const menu = document.getElementById("menu");
const controls = document.getElementById("controls");
const backButton = document.getElementById("backButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const jumpButton = document.getElementById("jumpButton");

// Game variables
const player = {
  x: 50,
  y: 370 - 30, // Posisi awal untuk menyentuh ground
  width: 30,
  height: 30,
  speed: 5,
  dx: 0,
  dy: 0,
  gravity: 0.5,
  jumpPower: -15, // Tinggi lompatan
  isJumping: false,
  groundLevel: 370, // Level ground
};

const platforms = [];

// Load images for ground and platforms
const groundImg = new Image();
const platformImg = new Image();
groundImg.src = "assets/tanah.png";
platformImg.src = "assets/platform.png";

// Preload the player image
const playerImg = new Image();
playerImg.src = "assets/char.png"; // Ganti dengan path gambar karakter Anda
let imgLoaded = false;

playerImg.onload = function () {
  imgLoaded = true;
};

// Function to add platforms
function addPlatform(x, y, width, height) {
  platforms.push({ x, y, width, height });
}

// Adding platforms with custom sizes
addPlatform(100, 250, 80, 60); // Sesuaikan tinggi platform
addPlatform(300, 200, 80, 60);
addPlatform(500, 150, 80, 60);

// Function to draw ground
function drawGround() {
  ctx.drawImage(groundImg, 0, player.groundLevel - 40, canvas.width, 100); // Menggambar ground
}

// Function to draw player
function drawPlayer() {
  if (imgLoaded) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
}

// Function to draw platforms
function drawPlatforms() {
  platforms.forEach((platform) => {
    ctx.drawImage(
      platformImg,
      platform.x,
      platform.y,
      platform.width,
      platform.height
    ); // Menggambar platform
  });
}

// Update player position
function updatePlayer() {
  player.y += player.dy;
  player.x += player.dx;

  // Horizontal boundaries
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) {
    showBirthdayMessage();
  }

  // Apply gravity
  if (player.y + player.height < player.groundLevel) {
    player.dy += player.gravity;
  } else {
    player.y = player.groundLevel - player.height; // Align character with ground
    player.dy = 0;
    player.isJumping = false;
  }

  // Collision detection with platforms
  let isOnPlatform = false;
  platforms.forEach((platform) => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height < platform.y + platform.height &&
      player.y + player.height + player.dy >= platform.y
    ) {
      if (player.dy > 0) {
        player.dy = 0;
        player.y = platform.y - player.height; // Snap to platform
        player.isJumping = false;
        isOnPlatform = true; // Set status to true
      }
    }
  });

  // If not on platform, apply gravity
  if (!isOnPlatform && player.y + player.height < player.groundLevel) {
    player.dy += player.gravity;
  }
}

// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Game loop
function gameLoop() {
  clearCanvas();
  drawGround(); // Draw ground
  drawPlayer();
  drawPlatforms();
  updatePlayer();
  requestAnimationFrame(gameLoop);
}

// Back to menu
function backToMenu() {
  // Reset player properties
  player.x = 50;
  player.y = player.groundLevel - player.height; // Reset position on the ground
  player.dx = 0;
  player.dy = 0;
  player.isJumping = false;

  canvas.style.display = "none";
  controls.style.display = "none";
  backButton.style.display = "none";
  menu.style.display = "block";
  menu.style.opacity = "1";
}

// Event handlers
playButton.addEventListener("click", function () {
  menu.style.opacity = "0";
  setTimeout(() => {
    menu.style.display = "none";
    canvas.style.display = "flex";
    controls.style.display = "flex";
    backButton.style.display = "block";
    gameLoop();
  }, 500);
});

// Initial setup to draw everything
drawGround();
drawPlayer();
drawPlatforms();

// Touch controls for movement
leftButton.addEventListener("touchstart", function () {
  player.dx = -player.speed;
});
leftButton.addEventListener("touchend", function () {
  player.dx = 0;
});

rightButton.addEventListener("touchstart", function () {
  player.dx = player.speed;
});
rightButton.addEventListener("touchend", function () {
  player.dx = 0;
});

jumpButton.addEventListener("touchstart", function () {
  if (!player.isJumping) {
    player.dy = player.jumpPower; // Adjust jump height
    player.isJumping = true;
  }
});

// Back to menu button
backButton.addEventListener("click", backToMenu);

// Keyboard controls
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") {
    player.dx = player.speed;
  }
  if (e.key === "ArrowLeft") {
    player.dx = -player.speed;
  }
  if (e.key === "ArrowUp" && !player.isJumping) {
    player.dy = player.jumpPower; // Use jumpPower for jumping
    player.isJumping = true;
  }
});

document.addEventListener("keyup", function (e) {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    player.dx = 0;
  }
});

function openForm() {
  const googleFormURL =
    "https://docs.google.com/forms/d/1TQ9G2A-Z0jdamESgBKZHsjRQSsyIXMifwIDDxi6oxyA/edit?chromeless=1";
  window.open(googleFormURL, "_blank"); // Membuka Google Form di tab baru
}

// Fungsi untuk menampilkan modal ucapan ulang tahun
function showBirthdayMessage() {
  const modal = document.getElementById("birthdayModal");
  modal.style.display = "block";

  // Event listener untuk tombol Enter
  document.addEventListener("keydown", function enterHandler(e) {
    if (e.key === "Enter") {
      closeBirthdayModal();
      document.removeEventListener("keydown", enterHandler);
    }
  });
}

// Fungsi untuk menutup modal dan kembali ke permainan
function closeBirthdayModal() {
  const modal = document.getElementById("birthdayModal");
  modal.style.display = "none";
  backToMenu();
}
