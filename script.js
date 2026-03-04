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

  function initSystemScroll() {
    const orbit = document.getElementById("psychology-orbit");
    if (!orbit || prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const nodes = orbit.querySelectorAll(".orbit-node");
    const core = orbit.querySelector(".orbit-core");
    const links = orbit.querySelectorAll(".orbit-links path");
    if (!nodes.length || !core || !links.length) return;

    const tl = window.gsap.timeline({
      scrollTrigger: {
        trigger: orbit,
        start: "top 75%",
        end: "bottom 45%",
        scrub: true
      }
    });

    tl.fromTo(core, { scale: 0.9, opacity: 0.75 }, { scale: 1, opacity: 1, ease: "none" })
      .fromTo(nodes[0], { y: 30, opacity: 0.2 }, { y: 0, opacity: 1, ease: "none" })
      .fromTo(nodes[1], { y: 30, opacity: 0.2 }, { y: 0, opacity: 1, ease: "none" })
      .fromTo(nodes[2], { y: 30, opacity: 0.2 }, { y: 0, opacity: 1, ease: "none" });

    window.gsap.fromTo(
      links,
      { strokeDashoffset: 40, opacity: 0.2 },
      {
        strokeDashoffset: 0,
        opacity: 0.9,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: orbit,
          start: "top 80%",
          end: "bottom 50%",
          scrub: true
        }
      }
    );
  }

  function initPodCard() {
    const card = document.getElementById("docpod-card");
    const btn = document.getElementById("docpod-toggle");
    if (!card || !btn) return;

    const toggle = () => {
      const expanded = card.classList.toggle("expanded");
      card.setAttribute("aria-expanded", String(expanded));
      btn.textContent = expanded ? "Hide architecture" : "View architecture";
    };

    btn.addEventListener("click", toggle);
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

  function initArchitectureViewer() {
    const obj = document.getElementById("arch-svg");
    const zoomIn = document.getElementById("arch-zoom-in");
    const zoomOut = document.getElementById("arch-zoom-out");
    const reset = document.getElementById("arch-reset");
    if (!obj || !zoomIn || !zoomOut || !reset || typeof window.svgPanZoom === "undefined") return;

    let viewer = null;

    obj.addEventListener("load", () => {
      const svg = obj.contentDocument && obj.contentDocument.querySelector("svg");
      if (!svg) return;

      viewer = window.svgPanZoom(svg, {
        zoomEnabled: true,
        panEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        minZoom: 0.7,
        maxZoom: 8
      });
    });

    zoomIn.addEventListener("click", () => viewer && viewer.zoomIn());
    zoomOut.addEventListener("click", () => viewer && viewer.zoomOut());
    reset.addEventListener("click", () => {
      if (!viewer) return;
      viewer.resetZoom();
      viewer.center();
      viewer.fit();
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

    const clearErrors = () => fields.forEach((f) => setError(f, ""));

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
        setError("message", "Please describe the workflow.");
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
    initSystemScroll();
    initPodCard();
    initPodParallax();
    initArchitectureViewer();
    initContactForm();
    initBackgroundFX();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
