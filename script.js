const gift = document.getElementById("giftScene");
const confetti = document.getElementById("confetti");
const toast = document.getElementById("toast");
const message = document.getElementById("message");

function celebrate() {
  gift.classList.add("open");
  toast.classList.add("show");
  message.scrollIntoView({ behavior: "smooth", block: "center" });

  for (let i = 0; i < 85; i++) {
    const p = document.createElement("span");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "vw";
    p.style.setProperty("--drift", (Math.random() * 260 - 130) + "px");
    p.style.animationDuration = (2.2 + Math.random() * 2.4) + "s";
    p.style.animationDelay = Math.random() * .45 + "s";
    p.style.background = ["#ff3d78","#ffd13d","#16d8d2","#a76be8","#fff0d2","#ff8144"][Math.floor(Math.random()*6)];
    p.style.width = (5 + Math.random() * 7) + "px";
    p.style.height = (7 + Math.random() * 12) + "px";
    confetti.appendChild(p);
    setTimeout(() => p.remove(), 5200);
  }

  setTimeout(() => toast.classList.remove("show"), 1500);
  setTimeout(() => gift.classList.remove("open"), 1000);
}

gift.addEventListener("click", celebrate);
gift.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    celebrate();
  }
});

// Gentle floating pixels that appear as the page is opened.
document.addEventListener("pointermove", e => {
  if (Math.random() > 0.96) {
    const dot = document.createElement("span");
    dot.textContent = "·";
    dot.style.position = "fixed";
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    dot.style.color = "#ffd13d";
    dot.style.pointerEvents = "none";
    dot.style.zIndex = "5";
    dot.style.fontSize = "18px";
    dot.style.transition = "transform .8s, opacity .8s";
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.transform = "translateY(-25px)";
      dot.style.opacity = "0";
    });
    setTimeout(() => dot.remove(), 850);
  }
});
