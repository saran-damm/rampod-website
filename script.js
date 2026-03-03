(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initNav() {
    const toggle = document.getElementById("menu-toggle");
    const links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
      const next = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(next));
      links.classList.toggle("open", next);
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("open");
      });
    });
  }

  function initHeroTyping() {
    const target = document.getElementById("typed-headline");
    if (!target) return;

    const text = "Welcome to rampod - Innovating the Future of AI.";
    let i = 0;

    const tick = () => {
      if (i <= text.length) {
        target.textContent = text.slice(0, i);
        i += 1;
        window.setTimeout(tick, 32);
      }
    };

    tick();
  }

  function initRevealAnimations() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    if (prefersReducedMotion) {
      revealEls.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const hasGsap = typeof window.gsap !== "undefined";
    const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

    if (hasGsap && hasScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      revealEls.forEach((el, index) => {
        window.gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          delay: index % 2 === 0 ? 0.02 : 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%"
          }
        });
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transition = "opacity 450ms ease, transform 450ms ease";
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  function initProductCard() {
    const card = document.getElementById("docpod-card");
    const btn = document.getElementById("docpod-toggle");
    if (!card || !btn) return;

    const toggle = () => {
      const expanded = card.classList.toggle("expanded");
      card.setAttribute("aria-expanded", String(expanded));
      btn.textContent = expanded ? "Hide details" : "View details";
    };

    btn.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const fields = ["name", "email", "message"];

    const setError = (name, msg) => {
      const slot = form.querySelector(`[data-error-for="${name}"]`);
      if (slot) slot.textContent = msg;
    };

    const clearErrors = () => {
      fields.forEach((f) => setError(f, ""));
    };

    const validate = () => {
      clearErrors();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const message = String(fd.get("message") || "").trim();

      let ok = true;

      if (!name) {
        setError("name", "Please enter your name.");
        ok = false;
      }

      if (!email) {
        setError("email", "Please enter your work email.");
        ok = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("email", "Please enter a valid email address.");
        ok = false;
      }

      if (!message) {
        setError("message", "Please add a short project brief.");
        ok = false;
      }

      return ok;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) {
        showToast("Please fix the highlighted fields.");
        return;
      }

      form.reset();
      clearErrors();
      showToast("Thanks. We will get back to you soon.");
    });
  }

  function initBackgroundFX() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const mouse = { x: -9999, y: -9999 };

    const particles = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0013,
      vy: (Math.random() - 0.5) * 0.0013,
      r: 1 + Math.random() * 2
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= 1) p.vx *= -1;
        if (p.y <= 0 || p.y >= 1) p.vy *= -1;

        const px = p.x * width;
        const py = p.y * height;

        const dx = mouse.x - px;
        const dy = mouse.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        ctx.beginPath();
        ctx.fillStyle = dist < 120 ? "rgba(255,145,77,0.62)" : "rgba(255,189,89,0.34)";
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      window.requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    window.addEventListener("resize", resize);
    resize();
    draw();
  }

  function boot() {
    initNav();
    initHeroTyping();
    initRevealAnimations();
    initProductCard();
    initContactForm();
    initBackgroundFX();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
