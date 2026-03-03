# Rampod Landing Page Plan (Light Premium, Future-Proof Dark)

## Summary
Build a high-performance static website for `www.rampod.co` using vanilla HTML/CSS/JS with a light premium look, saffron-led branding, balanced interaction design, and v1 single-product focus (`DocPod`).

## Locked Decisions
- Theme: Light premium default, dark-ready token system included now.
- Brand: Saffron-led palette with neutral support.
- Colors (base): `#ff914d`, `#ffbd59`, `#fffbed` + accessible neutrals.
- Typography: `Poppins` preferred; robust fallback stack defined.
- Scope: `DocPod` only in v1.
- CTA: Hero primary CTA scrolls to contact form.
- Form: Client-side validation + success toast (mock, no backend).
- Social links: Temporary `#` links.
- Tech: Vanilla HTML/CSS/JS + GSAP/ScrollTrigger + lightweight canvas effect.

## Interfaces / Contracts
- Files:
  - `/index.html`
  - `/styles.css`
  - `/script.js`
  - `/assets/brand/rampod-wordmark.svg`
  - `/assets/brand/rampod-mark.svg`
  - `/assets/brand/favicon.svg`
- Theme tokens in `:root`:
  - `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`
  - `--color-brand-1`, `--color-brand-2`, `--color-brand-3`
  - mirrored `[data-theme="dark"]` token set
- JS modules:
  - `initNav()`
  - `initHeroTyping()`
  - `initRevealAnimations()`
  - `initProductCard()`
  - `initContactForm()`
  - `initBackgroundFX()`

## Execution Steps

### Step 1: Brand Foundation + Layout Skeleton
- Replace dark-first baseline with light premium semantic structure.
- Sections:
  - Header (logo, nav, CTA)
  - Hero
  - About
  - Product showcase (DocPod)
  - Features
  - Contact
- Wire logo + favicon from `assets/brand`.
- Ensure responsive behavior for desktop/tablet/mobile.

### Step 2: Design System + Visual Polish
- Implement saffron + neutral token system.
- Add dark-ready token mirrors without visible toggle.
- Apply Poppins-driven type scale, spacing system, card and button variants.
- Add subtle premium polish:
  - soft gradients
  - depth/shadows
  - clean nav hover underline
  - balanced CTA pulse/glow
- Verify readable contrast for core surfaces and CTAs.

### Step 3: Interaction Layer (Balanced Motion)
- Hero typing animation.
- Scroll reveal and staggered entrances.
- Lightweight ambient/cursor-reactive background with reduced-motion fallback.
- DocPod card hover + expand details behavior.
- Icon lift interaction.
- Floating contact CTA.

### Step 4: Mock Form UX + Content Finalization
- Required validation for name/email/message.
- Email format validation.
- Success/error toast states.
- Premium-concise copy pass across all sections.

### Step 5: Performance + Hardening
- Prefer transform/opacity animations.
- Lazy-init heavy effects.
- Load only required font weights.
- Add essential SEO/meta scaffolding.
- Run QA checks for layout, interaction, reduced-motion behavior, and missing assets.

## Acceptance Checklist
- [ ] Sticky header remains readable across scroll and device sizes.
- [ ] Hero CTA scrolls to contact correctly.
- [ ] DocPod card supports hover and click/keyboard expansion.
- [ ] Form validation + success toast works with no network dependency.
- [ ] Motion feels balanced and disables under reduced-motion preference.
- [ ] No missing file references in console.
- [ ] Light theme contrast is clear for text and actionable elements.
- [ ] Social placeholder links render correctly without layout regressions.

## Assumptions
- Existing draft files are disposable and can be replaced.
- Temporary brand assets may be used until final files are provided.
- v1 ships with mock form behavior only.

## Future Backlog
- Add visible theme toggle and persist user preference.
- Expand product section to `CodePod` and additional products.
- Integrate real contact backend endpoint and spam protection.
- Add analytics and conversion tracking events.
- Optional migration to React/Vite if component complexity grows.
