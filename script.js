const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const missEl = document.getElementById("miss");

let score = 0;
let miss = 0;
let gameOver = false;

const cup = {
  x: canvas.width / 2 - 45,
  y: canvas.height - 50,
  width: 90,
  height: 20,
  speed: 7,
};

let spinners = [];

function generateSpinners() {
  spinners = [
    {
      x: 120,
      y: 235,
      radius: 30,
      angle: 0,
      rotationSpeed: 0,
      friction: 0.90,
    },
    {
      x: 280,
      y: 310,
      radius: 30,
      angle: 0,
      rotationSpeed: 0,
      friction: 0.90,
    },
    {
      x: 165,
      y: 400,
      radius: 30,
      angle: 0,
      rotationSpeed: 0,
      friction: 0.90,
    },
  ];
}

let animalBumpers = [];

function generateAnimalBumpers() {
  animalBumpers = [
    {
      x: 300,
      y: 430,
      radius: 26,
      angle: 0,
      rotationSpeed: 0,
      friction: 0.92,
      type: "cat",
    },
  ];
}

let pegs = [];

function generatePegs() {
  pegs = [];

    const layout = [
    [90, 180, 270],
    [60, 140, 220, 300],
    [100, 200, 300],
    [70, 150, 230, 310],
    [110, 190, 270],
    [60, 140, 220, 300],
    [100, 200, 300],
    ];

  const startY = 115;
  const rowGap = 55;

  for (let row = 0; row < layout.length; row++) {
    const y = startY + row * rowGap;

    for (const baseX of layout[row]) {
      const peg = {
        x: baseX + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 12,
        radius: 8,
      };

      let tooCloseToSpinner = false;

    for (const spinner of spinners) {
        const dx = peg.x - spinner.x;
        const dy = peg.y - spinner.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < spinner.radius + 50) {
          tooCloseToSpinner = true;
          break;
        }
      }

    for (const animal of animalBumpers) {
        const dx = peg.x - animal.x;
        const dy = peg.y - animal.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < animal.radius + 45) {
            tooCloseToSpinner = true;
            break;
        }
        }

      if (!tooCloseToSpinner) {
        pegs.push(peg);
      }
    }
  }
}

const marbleColors = [
  "#4f7cac",
  "#d95d39",
  "#6a994e",
  "#f2c14e",
  "#9b5de5",
  "#00bbf9",
  "#f15bb5",
];

const marble = {
  x: Math.random() * (canvas.width - 30) + 15,
  y: 0,
  radius: 12,
  speed: 3,
  vx: 0,
  vy: 0.4,
  gravity: 0.08,
  color: marbleColors[0],
};

const keys = {
  left: false,
  right: false,
};

const ballXEl = document.getElementById("ballX");
const ballYEl = document.getElementById("ballY");
const ballVxEl = document.getElementById("ballVx");
const ballVyEl = document.getElementById("ballVy");
const ballGravityEl = document.getElementById("ballGravity");
const catAngleEl = document.getElementById("catAngle");
const cupXEl = document.getElementById("cupX");
const cupYEl = document.getElementById("cupY");

function updateDebugConsole() {
  ballXEl.textContent = marble.x.toFixed(1);
  ballYEl.textContent = marble.y.toFixed(1);
  ballVxEl.textContent = marble.vx.toFixed(2);
  ballVyEl.textContent = marble.vy.toFixed(2);
  ballGravityEl.textContent = marble.gravity.toFixed(3);
  const catAngle = animalBumpers[0] ? animalBumpers[0].angle : 0;
  catAngleEl.textContent = catAngle.toFixed(3);
  cupXEl.textContent = cup.x.toFixed(1);
  cupYEl.textContent = cup.y.toFixed(1);
}

function resetMarble() {
  marble.x = Math.random() * (canvas.width - marble.radius * 2) + marble.radius;
  marble.y = 0;
  marble.speed = 3 + score * 0.08;
  marble.vx = (Math.random() - 0.5) * 1.2;
  marble.vy = 1.5 + score * 0.03;
  marble.gravity = 0.08 + score * 0.002;
  marble.color = marbleColors[Math.floor(Math.random() * marbleColors.length)];
}

function update() {
  if (gameOver) return;

  if (keys.left) {
    cup.x -= cup.speed;
  }

  if (keys.right) {
    cup.x += cup.speed;
  }

  if (cup.x < 0) {
    cup.x = 0;
  }

  if (cup.x + cup.width > canvas.width) {
    cup.x = canvas.width - cup.width;
  }

    marble.vy += marble.gravity;

    if (marble.vy > 8) {
    marble.vy = 8;
    }

    marble.x += marble.vx;
    marble.y += marble.vy;

    // side wall bounce
    if (marble.x - marble.radius < 0) {
    marble.x = marble.radius;
    marble.vx *= -0.7;
    }

    if (marble.x + marble.radius > canvas.width) {
    marble.x = canvas.width - marble.radius;
    marble.vx *= -0.7;
    }

    // peg collision
    for (const peg of pegs) {
    const dx = marble.x - peg.x;
    const dy = marble.y - peg.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = marble.radius + peg.radius;

    if (distance < minDistance) {
        const angle = Math.atan2(dy, dx);

        marble.x = peg.x + Math.cos(angle) * minDistance;
        marble.y = peg.y + Math.sin(angle) * minDistance;

        marble.vx += Math.cos(angle) * 2.0;
        marble.vy *= 0.75;
    }
    }

    for (const spinner of spinners) {
    spinner.angle += spinner.rotationSpeed;
    spinner.rotationSpeed *= spinner.friction;

    if (Math.abs(spinner.rotationSpeed) < 0.001) {
        spinner.rotationSpeed = 0;
    }
    }

    // animal bumper rotation
    for (const animal of animalBumpers) {
    animal.angle += animal.rotationSpeed;
    animal.rotationSpeed *= animal.friction;

    if (Math.abs(animal.rotationSpeed) < 0.001) {
        animal.rotationSpeed = 0;
    }
    }

    // spinner collision
    for (const spinner of spinners) {
    const dx = marble.x - spinner.x;
    const dy = marble.y - spinner.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = marble.radius + spinner.radius;

    if (distance < minDistance) {
        const angle = Math.atan2(dy, dx);

        marble.x = spinner.x + Math.cos(angle) * (minDistance + 2);
        marble.y = spinner.y + Math.sin(angle) * (minDistance + 2);

        const hitDirection = dx > 0 ? 1 : -1;
        const impactPower = Math.min(
        0.045,
        Math.abs(marble.vx) * 0.01 + Math.abs(marble.vy) * 0.008
        );

        spinner.rotationSpeed += hitDirection * impactPower;

        if (spinner.rotationSpeed > 0.08) {
        spinner.rotationSpeed = 0.08;
        }

        if (spinner.rotationSpeed < -0.08) {
        spinner.rotationSpeed = -0.08;
        }

        marble.vx += Math.cos(angle) * 0.8;
        marble.vy *= 0.82;
        marble.vx += spinner.rotationSpeed * 3;
    }
    }

    // air resistance
    marble.vx *= 0.99;

    // animal bumper collision
    for (const animal of animalBumpers) {
    const dx = marble.x - animal.x;
    const dy = marble.y - animal.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = marble.radius + animal.radius;

    if (distance < minDistance) {
        const angle = Math.atan2(dy, dx);

        // めり込み防止
        marble.x = animal.x + Math.cos(angle) * (minDistance + 2);
        marble.y = animal.y + Math.sin(angle) * (minDistance + 2);

        // 当たった方向に応じて顔が少し回る
        const hitDirection = dx > 0 ? 1 : -1;
        const impactPower = Math.min(
        0.06,
        Math.abs(marble.vx) * 0.012 + Math.abs(marble.vy) * 0.01
        );

        animal.rotationSpeed += hitDirection * impactPower;

        if (animal.rotationSpeed > 0.09) {
        animal.rotationSpeed = 0.09;
        }

        if (animal.rotationSpeed < -0.09) {
        animal.rotationSpeed = -0.09;
        }

        // 猫バンパーは少しやわらかく跳ね返す
        marble.vx += Math.cos(angle) * 1.0;
        marble.vy *= 0.78;
        marble.vx += animal.rotationSpeed * 2.5;
    }
    }

  const marbleBottom = marble.y + marble.radius;
  const marbleInCupX =
    marble.x > cup.x && marble.x < cup.x + cup.width;

  const marbleHitsCup =
    marbleBottom >= cup.y && marbleBottom <= cup.y + cup.height + 18;

  if (marbleInCupX && marbleHitsCup) {
    score += 1;
    scoreEl.textContent = score;
    resetMarble();
  }

  if (marble.y - marble.radius > canvas.height) {
    miss += 1;
    missEl.textContent = miss;
    resetMarble();

    if (miss >= 3) {
      gameOver = true;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  // pegs
for (const peg of pegs) {
  ctx.beginPath();
  ctx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#6b5b4b";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#2f2a24";
  ctx.stroke();
  ctx.closePath();
}

    // spinners
    for (const spinner of spinners) {
    ctx.save();

    ctx.translate(spinner.x, spinner.y);
    ctx.rotate(spinner.angle);

    // center
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#8d6e63";
    ctx.fill();
    ctx.strokeStyle = "#2f2a24";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    // blades
    for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(30, -10);
        ctx.lineTo(40, 0);
        ctx.lineTo(30, 10);
        ctx.closePath();

        ctx.fillStyle = "#f2c14e";
        ctx.fill();
        ctx.strokeStyle = "#2f2a24";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    ctx.restore();
    }

// animal bumpers
for (const animal of animalBumpers) {
  ctx.save();

  ctx.translate(animal.x, animal.y);
  ctx.rotate(animal.angle);

  // left ear
  ctx.beginPath();
  ctx.moveTo(-24, -14);
  ctx.lineTo(-28, -28);
  ctx.lineTo(-12, -18);
  ctx.closePath();
  ctx.fillStyle = "#f0b07a";
  ctx.fill();
  ctx.strokeStyle = "#2f2a24";
  ctx.lineWidth = 3;
  ctx.stroke();

  // right ear
  ctx.beginPath();
  ctx.moveTo(24, -14);
  ctx.lineTo(28, -28);
  ctx.lineTo(12, -18);
  ctx.closePath();
  ctx.fillStyle = "#f0b07a";
  ctx.fill();
  ctx.strokeStyle = "#2f2a24";
  ctx.lineWidth = 3;
  ctx.stroke();

  // face
  ctx.beginPath();
  ctx.arc(0, 0, animal.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#f3c18a";
  ctx.fill();
  ctx.strokeStyle = "#2f2a24";
  ctx.lineWidth = 3;
  ctx.stroke();

  // eyes
  ctx.beginPath();
  ctx.arc(-9, -4, 3, 0, Math.PI * 2);
  ctx.arc(9, -4, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#2f2a24";
  ctx.fill();

  // nose
  ctx.beginPath();
  ctx.arc(0, 5, 3, 0, Math.PI * 2);
  ctx.fill();

  // whiskers
  ctx.beginPath();
  ctx.moveTo(-5, 8);
  ctx.lineTo(-20, 6);
  ctx.moveTo(-5, 12);
  ctx.lineTo(-20, 14);
  ctx.moveTo(5, 8);
  ctx.lineTo(20, 6);
  ctx.moveTo(5, 12);
  ctx.lineTo(20, 14);
  ctx.strokeStyle = "#2f2a24";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}


// marble
ctx.beginPath();
ctx.arc(marble.x, marble.y, marble.radius, 0, Math.PI * 2);
ctx.fillStyle = marble.color;
ctx.fill();
ctx.closePath();

// marble highlight
ctx.beginPath();
ctx.arc(marble.x - 4, marble.y - 4, 3, 0, Math.PI * 2);
ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
ctx.fill();
ctx.closePath();

    // cup body
    ctx.beginPath();
    ctx.moveTo(cup.x, cup.y);
    ctx.lineTo(cup.x + cup.width, cup.y);
    ctx.lineTo(cup.x + cup.width - 15, cup.y + cup.height + 18);
    ctx.lineTo(cup.x + 15, cup.y + cup.height + 18);
    ctx.closePath();

    ctx.fillStyle = "#c97b5a";
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#2f2a24";
    ctx.stroke();

    // cup rim
    ctx.beginPath();
    ctx.ellipse(
    cup.x + cup.width / 2,
    cup.y,
    cup.width / 2,
    8,
    0,
    0,
    Math.PI * 2
    );
    ctx.fillStyle = "#e8a07a";
    ctx.fill();
    ctx.strokeStyle = "#2f2a24";
    ctx.stroke();
    ctx.closePath();

  // game over
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "36px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    ctx.font = "18px system-ui";
    ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 40);
  }
}

function gameLoop() {
  update();
  updateDebugConsole();
  draw();
  requestAnimationFrame(gameLoop);
}

function restartGame() {
  score = 0;
  miss = 0;
  gameOver = false;

  scoreEl.textContent = score;
  missEl.textContent = miss;

  cup.x = canvas.width / 2 - cup.width / 2;

    generateSpinners();
    generateAnimalBumpers();
    generatePegs();
    resetMarble();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    keys.left = true;
  }

  if (event.key === "ArrowRight") {
    keys.right = true;
  }

  if (event.code === "Space" && gameOver) {
    restartGame();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") {
    keys.left = false;
  }

  if (event.key === "ArrowRight") {
    keys.right = false;
  }
});

generateSpinners();
generateAnimalBumpers();
generatePegs();
resetMarble();
gameLoop();