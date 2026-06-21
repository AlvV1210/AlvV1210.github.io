/* ── Stars ───────────────────────────────────────────────── */
(function createStars() {
  const container = document.getElementById("stars");
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.setProperty("--dur", 2 + Math.random() * 4 + "s");
    star.style.setProperty("--delay", Math.random() * 5 + "s");
    container.appendChild(star);
  }
})();

/* ── Intro ───────────────────────────────────────────────── */
const intro = document.getElementById("intro");
const openGift = () => {
  intro.classList.add("hidden");
  document.body.style.overflow = "";
  startLetter();
};

document.getElementById("intro-gift")?.addEventListener("click", openGift);
document.getElementById("intro-gift")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openGift();
  }
});
document.getElementById("intro")?.addEventListener("click", (e) => {
  if (e.target === intro || e.target.closest("#intro-gift")) openGift();
});

document.body.style.overflow = "hidden";

/* ── Flip cards ────────────────────────────────────────────── */
const flipCards = document.querySelectorAll(".flip-card");
const progressEl = document.getElementById("cards-progress");
let flippedCount = 0;

flipCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("flipped")) return;
    card.classList.add("flipped");
    flippedCount++;
    progressEl.textContent = `${flippedCount} de ${flipCards.length} cartas abiertas`;
    if (flippedCount === flipCards.length) {
      progressEl.textContent = "¡Todas las cartas reveladas! Eres un papá increíble ♥";
    }
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });
});

/* ── Typewriter letter ─────────────────────────────────────── */
const letterText = document.getElementById("letter-body");
const letterCursor = document.getElementById("letter-cursor");
const letterSignature = document.getElementById("letter-signature");
let letterStarted = false;

const fullLetter = `Hoy quiero detenerme un momento para decirte algo que a veces no digo con suficiente frecuencia: gracias.

Gracias por estar ahí en los días buenos y en los difíciles. Por enseñarme con el ejemplo, con paciencia y con ese amor que no necesita palabras grandilocuentes para sentirse real.

Recuerdo las risas, los consejos que al principio no entendía y que hoy valoro con todo mi corazón, y esos gestos pequeños que marcaron mi camino más de lo que imaginas.

No existe manual para ser padre, pero tú lo hiciste parecer natural. Me diste valores, confianza y la certeza de que siempre tendría a alguien en quien apoyarme.

Este pequeño regalo digital no alcanza para todo lo que mereces, pero espero que al leerlo sientas, aunque sea un poquito, todo el cariño y admiración que tengo por ti.

Feliz Día del Padre.`;

function startLetter() {
  if (letterStarted || !letterText) return;
  letterStarted = true;

  let i = 0;
  const speed = 28;

  function type() {
    if (i < fullLetter.length) {
      letterText.textContent += fullLetter.charAt(i);
      i++;
      setTimeout(type, fullLetter.charAt(i - 1) === "\n" ? speed * 4 : speed);
    } else {
      letterCursor?.classList.add("done");
      letterSignature?.classList.add("visible");
    }
  }

  setTimeout(type, 800);
}

/* ── Scroll reveal ─────────────────────────────────────────── */
const revealEls = document.querySelectorAll(".reveal");
const reasonItems = document.querySelectorAll(".reason-item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

revealEls.forEach((el) => observer.observe(el));
reasonItems.forEach((el, idx) => {
  el.style.transitionDelay = idx * 0.12 + "s";
  observer.observe(el);
});

/* ── Confetti ──────────────────────────────────────────────── */
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas?.getContext("2d");
let particles = [];
let animating = false;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const colors = ["#d4a853", "#f0d78c", "#e85d4c", "#ff8a7a", "#faf6ee", "#6eceda"];

function launchConfetti() {
  if (!canvas || !ctx) return;
  particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 3 + Math.random() * 6,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12,
    });
  }
  if (!animating) {
    animating = true;
    animateConfetti();
  }
}

function animateConfetti() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let alive = 0;

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.rot += p.vr;
    if (p.y < canvas.height + 20) alive++;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });

  if (alive > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    animating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

document.getElementById("btn-confetti")?.addEventListener("click", launchConfetti);
