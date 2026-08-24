// Target date: September 6, 2026
const targetDate = new Date("September 6, 2026 00:00:00").getTime();

function updateCandleCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        document.getElementById("candle-countdown").innerHTML = "<h2>Happy Birthday!</h2>";
        return;
    }

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    // Format as a single string of numbers (e.g., "051230" for 5 days, 12 hours, 30 mins)
    const timeString = `${days.toString().padStart(2, '0')}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;

    // Convert string to HTML img tags
    const countdownHTML = timeString.split('').map(digit => {
        // Assumes you have images named candle-0.png through candle-9.png
        return `<img src="assets/candle-${digit}.png" alt="${digit}" class="candle-digit">`;
    }).join('');

    document.getElementById("candle-countdown").innerHTML = countdownHTML;
}

// Update every minute since we aren't showing seconds
setInterval(updateCandleCountdown, 60000);
updateCandleCountdown(); // Initial call
// Petal Explosion Logic
function checkAndTriggerPetals() {
    const today = new Date();
    // September is month index 8 (0-indexed: Jan=0, Sep=8)
    const isSeptember6th = (today.getMonth() === 8 && today.getDate() === 6);

    // Tip: Set this to 'true' if you want to test the explosion right now!
    const forceTest = false; 

    if (isSeptember6th || forceTest) {
        createPetalExplosion();
    }
}

function createPetalExplosion() {
    // Dynamically create overlay canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'petal-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const petalColors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#c9184a', '#800f2f'];
    const petals = [];
    const totalPetals = 120;

    // Spawn petals bursting from center screen
    for (let i = 0; i < totalPetals; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        petals.push({
            x: width / 2,
            y: height / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3, // Initial upward pop
            size: Math.floor(Math.random() * 4) + 4, // Pixel scale
            color: petalColors[Math.floor(Math.random() * petalColors.length)],
            rotation: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 0.1,
            gravity: 0.15,
            drag: 0.98,
            opacity: 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        let activePetals = 0;

        petals.forEach(p => {
            if (p.opacity <= 0) return;
            activePetals++;

            // Physics updates
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity; // Gravity pull
            p.x += p.vx + Math.sin(p.y * 0.02); // Subtle floating flutter
            p.y += p.vy;
            p.rotation += p.vRot;

            // Start fading out when falling near the bottom
            if (p.y > height * 0.7) {
                p.opacity -= 0.008;
            }

            // Draw Pixel Art Petal (Cluster of 2x2 blocks)
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;

            // Pixelated heart/petal shape
            const s = p.size;
            ctx.fillRect(-s, -s, s, s);
            ctx.fillRect(0, -s, s, s);
            ctx.fillRect(-s * 1.5, 0, s * 4, s);
            ctx.fillRect(-s, s, s * 2, s);

            ctx.restore();
        });

        if (activePetals > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove(); // Clean up DOM when animation finishes
        }
    }

    animate();
}

// Run date check when DOM is ready
document.addEventListener("DOMContentLoaded", checkAndTriggerPetals);
