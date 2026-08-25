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
const candleInstruction = document.getElementById('candle-instruction');
const mainHbdTitle = document.getElementById('main-hbd-title');
const galleryWrap = document.getElementById('gallery-wrap');

const modal = document.getElementById('photo-modal');
const modalImg = document.getElementById('modal-img');
const modalMsg = document.getElementById('modal-msg');
const closeBtn = document.querySelector('.close-btn');

const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');

// ===================== COUNTDOWN =====================
function updateCountdown() {
  const now = new Date();
  const diff = BIRTHDAY_DATE - now;

  if (diff <= 0) {
    preView.classList.add('hidden');
    postView.classList.remove('hidden');
    clearInterval(countdownTimer);
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
const countdownTimer = setInterval(updateCountdown, 1000);

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
      candleInstruction.textContent = 'Wish made. Happy Birthday!';
      setTimeout(celebrate, 250);
    }
  });
});

function celebrate() {
  mainHbdTitle.classList.remove('hidden');
  galleryWrap.classList.remove('hidden');
  burstConfettiAndPetals();
  // A second smaller burst for extra sparkle
  setTimeout(burstConfettiAndPetals, 700);
}

// ===================== PHOTO MODAL =====================
document.querySelectorAll('.pixel-frame').forEach((frame) => {
  frame.addEventListener('click', () => {
    const img = frame.querySelector('img');
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalMsg.textContent = frame.getAttribute('data-message') || '';
    modal.classList.remove('hidden');
  });
});

closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

// ===================== CONFETTI + FLOWER PETAL PARTICLE SYSTEM =====================
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const CONFETTI_COLORS = ['#ff6fb0', '#6ff0ff', '#ffe15a', '#9b5de5', '#ff3b9a', '#ffffff'];
const PETAL_COLORS = ['#ff8fa3', '#ff6fb0', '#ffd6e0', '#ff3b9a', '#ffffff'];

let particles = [];
let animating = false;

class Particle {
  constructor(type) {
    this.type = type; // 'confetti' or 'petal'
    this.x = canvas.width / 2 + (Math.random() - 0.5) * 60;
    this.y = canvas.height * 0.4 + (Math.random() - 0.5) * 40;

    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 4;

    this.size = type === 'confetti' ? 5 + Math.random() * 5 : 8 + Math.random() * 6;
    this.color = type === 'confetti'
      ? CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
      : PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];

    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 12;
    this.gravity = type === 'confetti' ? 0.22 : 0.09;
    this.drag = type === 'confetti' ? 0.995 : 0.98;
    this.life = 1;
    this.decay = 0.004 + Math.random() * 0.004;
    this.wobble = Math.random() * Math.PI * 2;
  }

  update() {
    this.vx *= this.drag;
    this.vy = this.vy * this.drag + this.gravity;
    if (this.type === 'petal') {
      this.wobble += 0.08;
      this.x += Math.sin(this.wobble) * 0.6;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.life -= this.decay;
  }

  draw() {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(this.life, 0);
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;

    if (this.type === 'confetti') {
      // pixel-style square
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      // simple pixelated petal (small rounded-ish rect pair to fake a petal)
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      ctx.fillRect(-this.size / 4, -this.size / 2, this.size / 2, this.size);
    }
    ctx.restore();
  }
}

function burstConfettiAndPetals() {
  for (let i = 0; i < 90; i++) particles.push(new Particle('confetti'));
  for (let i = 0; i < 50; i++) particles.push(new Particle('petal'));
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
  particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 50);

  if (particles.length > 0) {
    requestAnimationFrame(animateParticles);
  } else {
    animating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}