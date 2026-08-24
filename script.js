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
