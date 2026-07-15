/* ============================================================
   Midnight Rose — Interactions & Animations
   Easy to edit: change LOVE_START date below for the counter
   ============================================================ */

(() => {
  "use strict";

  /* ------------------------------------------------------------
     EDIT ME: Anniversary / together-since date
     Format: Year, Month (0-indexed!), Day, Hour, Minute, Second
     Example: new Date(2023, 5, 14, 18, 0, 0) = June 14, 2023 6:00 PM
     ------------------------------------------------------------ */
  /* Approx. December 2024 → today (mid-July 2026) */
  const LOVE_START = new Date(2024, 11, 1, 20, 0, 0); // Dec 1, 2024

  /* ---------- DOM helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ============================================================
     1. CURSOR GLOW
     ============================================================ */
  const cursorGlow = $("#cursorGlow");
  const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;

  if (isTouch) {
    document.body.classList.add("touch-device");
  } else if (cursorGlow) {
    let mx = 0;
    let my = 0;
    let gx = 0;
    let gy = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    const tickCursor = () => {
      gx += (mx - gx) * 0.18;
      gy += (my - gy) * 0.18;
      cursorGlow.style.left = `${gx}px`;
      cursorGlow.style.top = `${gy}px`;
      requestAnimationFrame(tickCursor);
    };
    tickCursor();

    $$("a, button, .flip-card, .masonry-item, .surprise-btn").forEach((el) => {
      el.addEventListener("mouseenter", () => cursorGlow.classList.add("hovering"));
      el.addEventListener("mouseleave", () => cursorGlow.classList.remove("hovering"));
    });
  }

  /* ============================================================
     2. AMBIENT — floating hearts, stars, butterflies
     ============================================================ */
  const ambient = $("#ambient");

  function spawnAmbient() {
    if (!ambient) return;

    // Hearts
    for (let i = 0; i < 14; i++) {
      const el = document.createElement("span");
      el.className = "float-heart";
      el.textContent = i % 3 === 0 ? "♡" : "♥";
      el.style.setProperty("--x", `${Math.random() * 100}%`);
      el.style.setProperty("--size", `${0.6 + Math.random() * 1.2}rem`);
      el.style.setProperty("--dur", `${10 + Math.random() * 16}s`);
      el.style.setProperty("--delay", `${-Math.random() * 14}s`);
      ambient.appendChild(el);
    }

    // Glowing particles / stars
    for (let i = 0; i < 28; i++) {
      const el = document.createElement("span");
      el.className = "float-star";
      el.style.setProperty("--x", `${Math.random() * 100}%`);
      el.style.setProperty("--y", `${Math.random() * 100}%`);
      el.style.setProperty("--size", `${2 + Math.random() * 4}px`);
      el.style.setProperty("--dur", `${2 + Math.random() * 4}s`);
      el.style.setProperty("--delay", `${-Math.random() * 4}s`);
      ambient.appendChild(el);
    }

    // Butterflies
    ["🦋", "🦋", "🦋"].forEach((emoji, i) => {
      const el = document.createElement("span");
      el.className = "float-butterfly";
      el.textContent = emoji;
      el.style.setProperty("--x", `${15 + i * 30}%`);
      el.style.setProperty("--y", `${20 + i * 18}%`);
      el.style.setProperty("--size", `${1 + Math.random() * 0.5}rem`);
      el.style.setProperty("--dur", `${14 + i * 3}s`);
      el.style.setProperty("--delay", `${-i * 2}s`);
      ambient.appendChild(el);
    });
  }

  spawnAmbient();

  /* ============================================================
     3. NAV scroll state
     ============================================================ */
  const nav = $(".nav");

  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ============================================================
     4. SCROLL REVEALS — Intersection Observer
     ============================================================ */
  const revealEls = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Stagger siblings slightly for masonry
            if (entry.target.classList.contains("masonry-item")) {
              entry.target.style.transitionDelay = `${(entry.target.dataset.index % 4) * 0.08}s`;
            }
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ============================================================
     5. PARALLAX — hero orbs + ambient drift on scroll
     ============================================================ */
  const orbs = $$(".orb");

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.04;
        orb.style.transform = `translateY(${y * speed}px)`;
      });
    },
    { passive: true }
  );

  /* ============================================================
     6. LOVE COUNTER — updates every second
     ============================================================ */
  const counterEls = {
    years: $('[data-unit="years"]'),
    months: $('[data-unit="months"]'),
    days: $('[data-unit="days"]'),
    hours: $('[data-unit="hours"]'),
    minutes: $('[data-unit="minutes"]'),
    seconds: $('[data-unit="seconds"]'),
  };

  function diffLove(from, to) {
    let years = to.getFullYear() - from.getFullYear();
    let months = to.getMonth() - from.getMonth();
    let days = to.getDate() - from.getDate();
    let hours = to.getHours() - from.getHours();
    let minutes = to.getMinutes() - from.getMinutes();
    let seconds = to.getSeconds() - from.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes -= 1;
    }
    if (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }
    if (hours < 0) {
      hours += 24;
      days -= 1;
    }
    if (days < 0) {
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }

    return { years, months, days, hours, minutes, seconds };
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCounter() {
    const now = new Date();
    const d = diffLove(LOVE_START, now);

    if (counterEls.years) counterEls.years.textContent = d.years;
    if (counterEls.months) counterEls.months.textContent = d.months;
    if (counterEls.days) counterEls.days.textContent = d.days;
    if (counterEls.hours) counterEls.hours.textContent = pad(d.hours);
    if (counterEls.minutes) counterEls.minutes.textContent = pad(d.minutes);
    if (counterEls.seconds) counterEls.seconds.textContent = pad(d.seconds);
  }

  updateCounter();
  setInterval(updateCounter, 1000);

  /* ============================================================
     7. FLIP CARDS
     ============================================================ */
  $$(".flip-card").forEach((card) => {
    const toggle = () => card.classList.toggle("flipped");

    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ============================================================
     8. LIGHTBOX — masonry gallery
     ============================================================ */
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCounter = $("#lightboxCounter");
  const masonryItems = $$(".masonry-item");
  let currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImage) return;
    currentIndex = ((index % masonryItems.length) + masonryItems.length) % masonryItems.length;
    const img = masonryItems[currentIndex].querySelector("img");
    lightboxImage.classList.remove("switching");
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCounter.textContent = `${currentIndex + 1} / ${masonryItems.length}`;
    lightbox.hidden = false;
    // Force reflow so open transition plays
    void lightbox.offsetWidth;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!lightbox.classList.contains("open")) lightbox.hidden = true;
    }, 400);
  }

  function showLightboxImage(index) {
    if (!lightboxImage) return;
    currentIndex = ((index % masonryItems.length) + masonryItems.length) % masonryItems.length;
    lightboxImage.classList.add("switching");

    setTimeout(() => {
      const img = masonryItems[currentIndex].querySelector("img");
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxCounter.textContent = `${currentIndex + 1} / ${masonryItems.length}`;
      lightboxImage.classList.remove("switching");
    }, 180);
  }

  masonryItems.forEach((item) => {
    item.addEventListener("click", () => {
      openLightbox(Number(item.dataset.index));
    });
  });

  $("#lightboxClose")?.addEventListener("click", closeLightbox);
  $("#lightboxPrev")?.addEventListener("click", () => showLightboxImage(currentIndex - 1));
  $("#lightboxNext")?.addEventListener("click", () => showLightboxImage(currentIndex + 1));

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showLightboxImage(currentIndex - 1);
    if (e.key === "ArrowRight") showLightboxImage(currentIndex + 1);
  });

  /* ============================================================
     9. MUSIC PLAYER
     ============================================================ */
  const audio = $("#loveSong");
  const musicToggle = $("#musicToggle");
  const musicProgress = $("#musicProgress");
  const musicVolume = $("#musicVolume");
  const iconPlay = musicToggle?.querySelector(".icon-play");
  const iconPause = musicToggle?.querySelector(".icon-pause");

  function syncPlayIcons(playing) {
    if (!iconPlay || !iconPause) return;
    iconPlay.hidden = playing;
    iconPause.hidden = !playing;
    musicToggle?.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  }

  musicToggle?.addEventListener("click", async () => {
    if (!audio) return;
    try {
      if (audio.paused) {
        await audio.play();
        syncPlayIcons(true);
      } else {
        audio.pause();
        syncPlayIcons(false);
      }
    } catch {
      // Autoplay policies / missing file — stay paused gracefully
      syncPlayIcons(false);
    }
  });

  audio?.addEventListener("timeupdate", () => {
    if (!musicProgress || !audio.duration) return;
    musicProgress.value = String((audio.currentTime / audio.duration) * 100);
  });

  audio?.addEventListener("ended", () => syncPlayIcons(false));

  musicProgress?.addEventListener("input", () => {
    if (!audio || !audio.duration) return;
    audio.currentTime = (Number(musicProgress.value) / 100) * audio.duration;
  });

  if (audio && musicVolume) {
    audio.volume = Number(musicVolume.value);
    musicVolume.addEventListener("input", () => {
      audio.volume = Number(musicVolume.value);
    });
  }

  /* ============================================================
     10. BUTTON RIPPLES
     ============================================================ */
  $$(".ripple").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      circle.className = "ripple-circle";
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ============================================================
     11. SURPRISE — confetti + hearts + message
     ============================================================ */
  const surpriseBtn = $("#surpriseBtn");
  const surpriseMessage = $("#surpriseMessage");
  const surpriseSection = $(".surprise-section");
  const canvas = $("#confettiCanvas");
  const ctx = canvas?.getContext("2d");

  function resizeCanvas() {
    if (!canvas || !surpriseSection) return;
    canvas.width = surpriseSection.offsetWidth;
    canvas.height = surpriseSection.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let particles = [];
  let confettiRunning = false;

  function spawnExplosion() {
    if (!canvas || !ctx) return;
    resizeCanvas();
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.45;
    particles = [];

    const colors = ["#c45c7a", "#d4a574", "#e8a0b5", "#b8a4c9", "#f0c9a0", "#ffffff"];

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        decay: 0.008 + Math.random() * 0.012,
        size: 3 + Math.random() * 5,
        color: colors[i % colors.length],
        type: Math.random() > 0.55 ? "heart" : "rect",
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.2,
      });
    }

    if (!confettiRunning) {
      confettiRunning = true;
      requestAnimationFrame(drawConfetti);
    }
  }

  function drawHeart(c, x, y, size, color, rot) {
    c.save();
    c.translate(x, y);
    c.rotate(rot);
    c.fillStyle = color;
    c.beginPath();
    const s = size / 15;
    c.moveTo(0, 3 * s);
    c.bezierCurveTo(-8 * s, -6 * s, -14 * s, 4 * s, 0, 12 * s);
    c.bezierCurveTo(14 * s, 4 * s, 8 * s, -6 * s, 0, 3 * s);
    c.fill();
    c.restore();
  }

  function drawConfetti() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter((p) => p.life > 0);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.vx *= 0.99;
      p.life -= p.decay;
      p.rot += p.vr;

      ctx.globalAlpha = Math.max(p.life, 0);

      if (p.type === "heart") {
        drawHeart(ctx, p.x, p.y, p.size * 3, p.color, p.rot);
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    ctx.globalAlpha = 1;

    if (particles.length) {
      requestAnimationFrame(drawConfetti);
    } else {
      confettiRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  surpriseBtn?.addEventListener("click", () => {
    spawnExplosion();
    surpriseSection?.classList.add("glowing");
    setTimeout(() => surpriseSection?.classList.remove("glowing"), 2000);

    if (surpriseMessage) {
      surpriseMessage.textContent = "I Love You More Than Yesterday ❤️";
      surpriseMessage.classList.add("show");
    }
  });

  /* ============================================================
     Image fallback — soft gradient when file is missing
     (so the site looks finished before you drop in real photos)
     ============================================================ */
  function paintPlaceholder(img, label) {
    const w = img.naturalWidth || 800;
    const h = img.naturalHeight || 1000;
    // Use a canvas data-URL as fallback fill
    const c = document.createElement("canvas");
    c.width = 600;
    c.height = Math.round(600 * (h / w || 1.25));
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, c.width, c.height);
    grad.addColorStop(0, "#3a1828");
    grad.addColorStop(0.45, "#1a0b14");
    grad.addColorStop(1, "#2a1838");
    g.fillStyle = grad;
    g.fillRect(0, 0, c.width, c.height);

    // Soft orbs
    g.fillStyle = "rgba(196,92,122,0.25)";
    g.beginPath();
    g.arc(c.width * 0.3, c.height * 0.35, 80, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "rgba(212,165,116,0.18)";
    g.beginPath();
    g.arc(c.width * 0.7, c.height * 0.6, 100, 0, Math.PI * 2);
    g.fill();

    g.fillStyle = "rgba(245,235,232,0.55)";
    g.font = "italic 28px Georgia, serif";
    g.textAlign = "center";
    g.fillText(label || "♡", c.width / 2, c.height / 2);

    img.src = c.toDataURL("image/jpeg", 0.85);
  }

  $$("img[src^='images/']").forEach((img) => {
    img.addEventListener("error", function onErr() {
      img.removeEventListener("error", onErr);
      const name = (img.getAttribute("src") || "").split("/").pop() || "Photo";
      paintPlaceholder(img, name.replace(".jpg", ""));
    });
  });
})();
