// ===================== CONFIG =====================
// Birthday target date — change the year if needed.
const BIRTHDAY_DATE = new Date('2026-09-06T00:00:00');

// ===================== ELEMENTS =====================
const preView = document.getElementById('pre-birthday-view');
const postView = document.getElementById('post-birthday-view');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minsEl = document.getElementById('mins');
const secsEl = document.getElementById('secs');

const candles = Array.from(document.querySelectorAll('.candle'));
const cakeContainer = document.querySelector('.cake-container');
const candleInstruction = document.getElementById('candle-instruction');
const mainHbdTitle = document.getElementById('main-hbd-title');
const bouquet = document.getElementById('bouquet');
const galleryWrap = document.getElementById('gallery-wrap');
const screenFlash = document.getElementById('screen-flash');

const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');

// ===================== COUNTDOWN =====================
let countdownTimer;

function updateCountdown() {
  const now = new Date();
  const diff = BIRTHDAY_DATE - now;

  if (diff <= 0) {
    preView.classList.add('hidden');
    postView.classList.remove('hidden');
    if (countdownTimer) clearInterval(countdownTimer);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minsEl.textContent = String(mins).padStart(2, '0');
  secsEl.textContent = String(secs).padStart(2, '0');
}

updateCountdown();
countdownTimer = setInterval(updateCountdown, 1000);

// If we're already past the birthday on load, jump straight to reveal view.
if (new Date() >= BIRTHDAY_DATE) {
  preView.classList.add('hidden');
  postView.classList.remove('hidden');
}

// ===================== CANDLE BLOW-OUT =====================
let blownCount = 0;
let celebrated = false;

candles.forEach((candle) => {
  candle.addEventListener('click', () => {
    if (candle.classList.contains('blown')) return;
    candle.classList.add('blown');
    blownCount++;

    if (blownCount === candles.length && !celebrated) {
      celebrated = true;
      candleInstruction.textContent = 'Wish made...';
      setTimeout(startDramaticReveal, 350);
    }
  });
});

// ===================== DRAMATIC REVEAL SEQUENCE =====================
function startDramaticReveal() {
  // 1. Build-up: shake the cake, then flash the whole screen
  cakeContainer.classList.add('shake');
  setTimeout(() => cakeContainer.classList.remove('shake'), 550);

  setTimeout(() => {
    screenFlash.classList.add('active');
    setTimeout(() => screenFlash.classList.remove('active'), 650);
  }, 250);

  // 2. Reveal title, bouquet and galleries just after the flash peaks
  setTimeout(() => {
    candleInstruction.textContent = 'Happy Birthday!';
    mainHbdTitle.classList.remove('hidden');
    bouquet.classList.remove('hidden');
    bouquet.classList.add('show');
    galleryWrap.classList.remove('hidden');

    // 3. Multiple staggered explosion waves for a bigger, longer celebration
    burstFX(true);
    setTimeout(() => burstFX(false), 450);
    setTimeout(() => burstFX(false), 950);
    setTimeout(() => burstFX(false), 1550);
    setTimeout(() => burstFX(false), 2300);
  }, 500);
}

// ===================== PHOTO FLIP CARDS =====================
document.querySelectorAll('.flip-inner').forEach((inner) => {
  inner.parentElement.addEventListener('click', () => {
    inner.classList.toggle('flipped');
  });
});

// ===================== CONFETTI + PETAL + SPARKLE PARTICLE SYSTEM =====================
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const CONFETTI_COLORS = ['#ff6fb0', '#6ff0ff', '#ffe15a', '#9b5de5', '#ff3b9a', '#ffffff'];
const PETAL_COLORS = ['#ff8fa3', '#ff6fb0', '#ffd6e0', '#ff3b9a', '#ffffff'];
const SPARK_COLORS = ['#ffffff', '#ffe15a', '#6ff0ff'];

let particles = [];
let animating = false;

class Particle {
  constructor(type, big) {
    this.type = type; // 'confetti' | 'petal' | 'spark'
    const originX = canvas.width / 2 + (Math.random() - 0.5) * (big ? 140 : 70);
    const originY = canvas.height * 0.42 + (Math.random() - 0.5) * 60;
    this.x = originX;
    this.y = originY;

    const angle = Math.random() * Math.PI * 2;
    const baseSpeed = type === 'spark' ? 3 : 5;
    const speed = baseSpeed + Math.random() * (big ? 13 : 9);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - (big ? 6 : 4);

    if (type === 'confetti') this.size = 5 + Math.random() * 6;
    else if (type === 'petal') this.size = 8 + Math.random() * 7;
    else this.size = 3 + Math.random() * 3;

    const palette = type === 'confetti' ? CONFETTI_COLORS : type === 'petal' ? PETAL_COLORS : SPARK_COLORS;
    this.color = palette[Math.floor(Math.random() * palette.length)];

    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 14;
    this.gravity = type === 'confetti' ? 0.24 : type === 'petal' ? 0.09 : 0.05;
    this.drag = type === 'confetti' ? 0.994 : type === 'petal' ? 0.98 : 0.985;
    this.life = 1;
    this.decay = type === 'spark' ? 0.012 + Math.random() * 0.01 : 0.0035 + Math.random() * 0.0035;
    this.wobble = Math.random() * Math.PI * 2;
    this.twinkle = Math.random() * Math.PI * 2;
  }

  update() {
    this.vx *= this.drag;
    this.vy = this.vy * this.drag + this.gravity;
    if (this.type === 'petal') {
      this.wobble += 0.08;
      this.x += Math.sin(this.wobble) * 0.7;
    }
    if (this.type === 'spark') {
      this.twinkle += 0.3;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.life -= this.decay;
  }

  draw() {
    if (this.life <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;

    if (this.type === 'confetti') {
      ctx.globalAlpha = Math.max(this.life, 0);
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else if (this.type === 'petal') {
      ctx.globalAlpha = Math.max(this.life, 0);
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      ctx.fillRect(-this.size / 4, -this.size / 2, this.size / 2, this.size);
    } else {
      ctx.globalAlpha = Math.max(this.life * (0.5 + 0.5 * Math.sin(this.twinkle)), 0);
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }
    ctx.restore();
  }
}

function burstFX(big) {
  const confettiCount = big ? 160 : 60;
  const petalCount = big ? 90 : 34;
  const sparkCount = big ? 70 : 26;

  for (let i = 0; i < confettiCount; i++) particles.push(new Particle('confetti', big));
  for (let i = 0; i < petalCount; i++) particles.push(new Particle('petal', big));
  for (let i = 0; i < sparkCount; i++) particles.push(new Particle('spark', big));

  if (!animating) {
    animating = true;
    requestAnimationFrame(animateParticles);
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 60);

  if (particles.length > 0) {
    requestAnimationFrame(animateParticles);
  } else {
    animating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}