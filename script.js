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

    const text = "Build focused pods that teams actually adopt.";
    let i = 0;

    const tick = () => {
      if (i <= text.length) {
        target.textContent = text.slice(0, i);
        i += 1;
        window.setTimeout(tick, 28);
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

    if (!hasGsap || !hasScrollTrigger) return;

    window.gsap.registerPlugin(window.ScrollTrigger);
    revealEls.forEach((el, index) => {
      window.gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.58,
        delay: (index % 4) * 0.02,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%"
        }
      });
    });
  }

  function initPodParallax() {
    const pod = document.getElementById("docpod-card");
    if (!pod || prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    window.gsap.fromTo(
      pod,
      { y: 30, scale: 0.97 },
      {
        y: 0,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: pod,
          start: "top 86%",
          end: "bottom 64%",
          scrub: true
        }
      }
    );
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
    const endpoint = form.getAttribute("data-endpoint");
    const submitBtn = form.querySelector('button[type="submit"]');

    const fields = ["name", "email", "workflow"];

    const setError = (name, msg) => {
      const slot = form.querySelector(`[data-error-for="${name}"]`);
      if (slot) slot.textContent = msg;
    };

    const clearErrors = () => fields.forEach((f) => setError(f, ""));

    const validate = () => {
      clearErrors();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const workflow = String(fd.get("workflow") || "").trim();
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

      if (!workflow) {
        setError("workflow", "Please describe the workflow.");
        ok = false;
      }

      return ok;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) {
        showToast("Please fix the highlighted fields.");
        return;
      }

      if (!endpoint) {
        showToast("Contact form is not configured yet.");
        return;
      }

      const fd = new FormData(form);
      if (String(fd.get("company_website") || "").trim()) {
        showToast("Thanks. We will get back to you soon.");
        form.reset();
        clearErrors();
        return;
      }

      const payload = {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        workflow: String(fd.get("workflow") || "").trim()
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          showToast("Could not send right now. Please try again.");
          return;
        }

        form.reset();
        clearErrors();
        showToast("Thanks. We will get back to you soon.");
      } catch (_) {
        showToast("Network error. Please try again.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send inquiry";
        }
      }
    });
  }

  function initBackgroundFX() {
    const canvas = document.getElementById("fx-canvas");
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const mouse = { x: -9999, y: -9999 };

    const particles = Array.from({ length: 58 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0015,
      vy: (Math.random() - 0.5) * 0.0015,
      r: 1 + Math.random() * 2.2
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
        ctx.fillStyle = dist < 170 ? "rgba(255,145,77,0.62)" : "rgba(255,189,89,0.36)";
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        const ax = a.x * width;
        const ay = a.y * height;
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const bx = b.x * width;
          const by = b.y * height;
          const dx = ax - bx;
          const dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.19;
            ctx.strokeStyle = `rgba(255,145,77,${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
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
    initPodParallax();
    initContactForm();
    initBackgroundFX();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
