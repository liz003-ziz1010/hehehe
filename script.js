// SETTINGS
const forceTest = false; // Set to TRUE to preview Sept 6th birthday reveal immediately!

const targetDate = new Date("September 6, 2026 00:00:00").getTime();

document.addEventListener("DOMContentLoaded", () => {
    checkDateAndInit();
    setupPhotoModals();
});

function checkDateAndInit() {
    const now = new Date().getTime();
    const isBirthday = (now >= targetDate) || forceTest;

    const preView = document.getElementById("pre-birthday-view");
    const postView = document.getElementById("post-birthday-view");

    if (isBirthday) {
        preView.classList.add("hidden");
        postView.classList.remove("hidden");
        triggerPetalsAndConfetti();
    } else {
        preView.classList.remove("hidden");
        postView.classList.add("hidden");
        updateCandleCountdown();
        setInterval(updateCandleCountdown, 60000);
    }
}

// COUNTDOWN FUNCTION
function updateCandleCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        checkDateAndInit();
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    const timeString = `${days.toString().padStart(2, '0')}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;

    const countdownHTML = timeString.split('').map(digit => {
        return `<img src="./assets/candle-${digit}.png" alt="${digit}" class="candle-digit">`;
    }).join('');

    document.getElementById("candle-countdown").innerHTML = countdownHTML;
}

// PHOTO POPUP MODAL LOGIC
function setupPhotoModals() {
    const modal = document.getElementById("photo-modal");
    const modalImg = document.getElementById("modal-img");
    const modalMsg = document.getElementById("modal-msg");
    const closeBtn = document.querySelector(".close-btn");

    document.querySelectorAll(".pixel-frame").forEach(frame => {
        frame.addEventListener("click", () => {
            const img = frame.querySelector("img");
            const msg = frame.getAttribute("data-message");

            modalImg.src = img.src;
            modalMsg.textContent = msg;
            modal.classList.remove("hidden");
        });
    });

    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });
}

// PETALS + CONFETTI EXPLOSION
function triggerPetalsAndConfetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'petal-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#00ced1', '#ffd166', '#06d6a0'];
    const particles = [];
    const total = 160;

    for (let i = 0; i < total; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 14 + 4;
        particles.push({
            x: width / 2,
            y: height / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 4,
            size: Math.floor(Math.random() * 6) + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 0.1,
            gravity: 0.15,
            drag: 0.97,
            opacity: 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        let active = 0;

        particles.forEach(p => {
            if (p.opacity <= 0) return;
            active++;

            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity;
            p.x += p.vx + Math.sin(p.y * 0.02);
            p.y += p.vy;
            p.rotation += p.vRot;

            if (p.y > height * 0.7) p.opacity -= 0.008;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        if (active > 0) requestAnimationFrame(animate);
        else canvas.remove();
    }

    animate();
}