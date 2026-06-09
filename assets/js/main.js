/* =========================================================
   TRSEAH — main.js
   Light cream/mint theme. RTL.
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const SVG_NS = 'http://www.w3.org/2000/svg';

  /* year */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* =========================================================
     1) Custom cursor — green triangle, fast follow
     ========================================================= */
  (function customCursor() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const c = $('.cursor');
    if (!c) return;
    let tx = 0, ty = 0, x = 0, y = 0, first = true;
    document.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (first) { x = tx; y = ty; first = false; }
    }, { passive: true });
    (function loop() {
      x += (tx - x) * 0.55;
      y += (ty - y) * 0.55;
      c.style.transform = `translate3d(${x - 11}px, ${y - 11}px, 0)`;
      requestAnimationFrame(loop);
    })();

    const HOVER_SEL = 'a, button, [role="button"], .sec-node, .chip, .sg-item, .dot, .feat-card, .contact-info li, .rail-item';
    const TEXT_SEL  = 'input, textarea, select';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(TEXT_SEL)) { c.classList.add('is-text'); return; }
      if (e.target.closest(HOVER_SEL)) c.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(TEXT_SEL)) c.classList.remove('is-text');
      if (e.target.closest(HOVER_SEL)) c.classList.remove('is-hover');
    });
    document.addEventListener('mousedown', () => c.classList.add('is-click'));
    document.addEventListener('mouseup',   () => c.classList.remove('is-click'));
    document.addEventListener('mouseleave', () => { c.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { c.style.opacity = '1'; });
  })();

  /* =========================================================
     2) Section spy → body[data-section] for bg-tint
     ========================================================= */
  (function sectionSpy() {
    const sections = $$('section[id]');
    if (!sections.length) return;
    document.body.dataset.section = 'hero';
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) document.body.dataset.section = e.target.id; });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  })();

  /* =========================================================
     3) Side rail — section indicator + smooth-scroll
     ========================================================= */
  (function sideRail() {
    const items = $$('.rail-item');
    if (!items.length) return;
    const targets = items.map(it => document.getElementById(it.dataset.target)).filter(Boolean);
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        items.forEach(it => it.classList.toggle('is-active', it.dataset.target === id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(t => io.observe(t));
    items.forEach(it => it.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(it.dataset.target);
      if (target) window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    }));
  })();

  /* =========================================================
     4) Hero SCENE 0 — generate vertical bar cluster
     ========================================================= */
  (function buildScene0Bars() {
    const g = $('.hero-scene[data-scene="0"] .s0-bars');
    if (!g) return;
    const W = 1600, H = 900;
    // cluster of bars on the LEFT (under the rising arrow)
    const count = 22;
    const startX = 140, endX = 440;
    const span = endX - startX;
    const barW = 9;
    for (let i = 0; i < count; i++) {
      const x = startX + (span / (count - 1)) * i;
      // smooth ascending heights with mild variance
      const base = 80 + (i / count) * 240;
      const noise = (Math.random() - .5) * 40;
      const h = Math.max(40, base + noise);
      const r = document.createElementNS(SVG_NS, 'rect');
      r.setAttribute('x', x);
      r.setAttribute('y', H - 120 - h);
      r.setAttribute('width', barW);
      r.setAttribute('height', h);
      r.setAttribute('rx', 2);
      r.style.animationDelay = (i * 0.10) + 's';
      g.appendChild(r);
    }
  })();

  /* =========================================================
     5) Hero SCENE 2 — consulting network (hub + spokes)
     ========================================================= */
  (function buildScene2Network() {
    const edges  = $('.hero-scene[data-scene="2"] .s2-edges');
    const nodes  = $('.hero-scene[data-scene="2"] .s2-nodes');
    const pulses = $('.hero-scene[data-scene="2"] .s2-pulses');
    if (!edges || !nodes || !window.anime) return;

    const cx = 800, cy = 450;
    // three rings of nodes at varying radii
    const rings = [
      { r: 180, count: 6, nodeR: 8,  offset: 0 },
      { r: 280, count: 9, nodeR: 6,  offset: Math.PI / 12 },
      { r: 380, count: 12, nodeR: 5, offset: 0 },
    ];

    rings.forEach((ring, ri) => {
      for (let i = 0; i < ring.count; i++) {
        const ang = (Math.PI * 2 / ring.count) * i + ring.offset;
        const nx = cx + Math.cos(ang) * ring.r;
        const ny = cy + Math.sin(ang) * ring.r;
        // edge from hub to node
        const p = document.createElementNS(SVG_NS, 'path');
        p.setAttribute('d', `M${cx},${cy} L${nx},${ny}`);
        p.style.animationDelay = (i * 0.08 + ri * 0.4) + 's';
        edges.appendChild(p);
        // node
        const c = document.createElementNS(SVG_NS, 'circle');
        c.setAttribute('cx', nx);
        c.setAttribute('cy', ny);
        c.setAttribute('r', ring.nodeR);
        c.style.animationDelay = (i * 0.15 + ri * 0.3) + 's';
        nodes.appendChild(c);
      }
    });

    // traveling pulses along the inner ring spokes
    const innerSpokes = 6;
    for (let i = 0; i < innerSpokes; i++) {
      const ang = (Math.PI * 2 / innerSpokes) * i;
      const tx = cx + Math.cos(ang) * 180;
      const ty = cy + Math.sin(ang) * 180;
      const p = document.createElementNS(SVG_NS, 'circle');
      p.setAttribute('cx', cx);
      p.setAttribute('cy', cy);
      p.setAttribute('r', 4);
      pulses.appendChild(p);
      anime({
        targets: p,
        cx: tx, cy: ty,
        opacity: [{ value: 0, duration: 0 }, { value: 1, duration: 200 }, { value: 0, duration: 800 }],
        duration: 1800,
        delay: i * 220,
        easing: 'easeOutQuart',
        loop: true,
      });
    }
  })();

  /* =========================================================
     7) Hero slider — smooth tech transitions
     ========================================================= */
  (function heroSlider() {
    const slides  = $$('.hero-slide');
    const scenes  = $$('.hero-scene');
    const dots    = $$('.hero-pagination .dot');
    const prev    = $('.hero-nav.prev');
    const next    = $('.hero-nav.next');
    if (!slides.length) return;
    let i = 0, n = slides.length, timer = null, busy = false;

    // wrap each non-gradient title word in a span for stagger entry
    slides.forEach(slide => {
      const t = slide.querySelector('.hero-title');
      if (!t) return;
      const walker = document.createTreeWalker(t, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const p = node.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          if (p.classList.contains('grad-text') || p.tagName === 'EM') return NodeFilter.FILTER_REJECT;
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      const frags = []; let nd;
      while ((nd = walker.nextNode())) frags.push(nd);
      frags.forEach(text => {
        const parts = text.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(w => {
          if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
          const s = document.createElement('span');
          s.className = 'word';
          s.textContent = w;
          frag.appendChild(s);
        });
        text.parentNode.replaceChild(frag, text);
      });
    });

    function animateIn(idx) {
      if (!window.anime) return;
      const slide = slides[idx];
      const eb    = slide.querySelector('.hero-eyebrow');
      const words = slide.querySelectorAll('.hero-title .word, .hero-title .grad-text, .hero-title em');
      const txt   = slide.querySelector('.hero-text');
      if (eb) anime({ targets: eb, opacity: [0, 1], translateY: [16, 0], duration: 700, easing: 'easeOutQuint' });
      anime({
        targets: words,
        opacity: [0, 1], translateY: [28, 0], filter: ['blur(6px)', 'blur(0px)'],
        duration: 900, delay: anime.stagger(55, { start: 120 }),
        easing: 'easeOutQuint',
      });
      if (txt) anime({ targets: txt, opacity: [0, 1], translateY: [18, 0], duration: 800, delay: 360, easing: 'easeOutQuint' });
    }

    function goto(idx) {
      idx = (idx + n) % n;
      if (idx === i || busy) return;
      busy = true;
      const prevI = i;
      slides[prevI].classList.add('is-leaving');
      slides[prevI].classList.remove('is-active');
      scenes[prevI].classList.add('is-leaving');
      scenes[prevI].classList.remove('is-active');
      dots[prevI].classList.remove('is-active');
      i = idx;
      setTimeout(() => {
        slides[i].classList.add('is-active');
        scenes[i].classList.add('is-active');
        dots[i].classList.add('is-active');
        animateIn(i);
      }, 60);
      setTimeout(() => {
        slides[prevI].classList.remove('is-leaving');
        scenes[prevI].classList.remove('is-leaving');
        busy = false;
      }, 1300);
    }

    function autoplay() { stop(); timer = setInterval(() => goto(i + 1), 7200); }
    function stop() { if (timer) clearInterval(timer); }

    prev?.addEventListener('click', () => { goto(i - 1); autoplay(); });
    next?.addEventListener('click', () => { goto(i + 1); autoplay(); });
    dots.forEach(d => d.addEventListener('click', () => { goto(+d.dataset.go); autoplay(); }));

    const heroEl = $('.hero');
    heroEl?.addEventListener('mouseenter', stop);
    heroEl?.addEventListener('mouseleave', autoplay);

    autoplay();
    setTimeout(() => animateIn(0), 250);
  })();

  /* =========================================================
     8) Navbar — scroll behavior + section spy
     ========================================================= */
  (function navbar() {
    const shell = $('.nav-shell');
    const bar = $('#navbar');
    if (!shell || !bar) return;
    let ticking = false;
    function update() {
      const sy = window.scrollY || 0;
      const scrolled = sy > 60;
      bar.classList.toggle('is-scrolled', scrolled);
      shell.classList.toggle('is-scrolled', scrolled);
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();

    const links = $$('.nav-menu a');
    const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    if (!sections.length) return;
    const spy = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (e.isIntersecting) {
          const id = '#' + e.target.id;
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));
  })();

  /* =========================================================
     9) Mobile drawer
     ========================================================= */
  (function mobileDrawer() {
    const drawer = $('#mobileDrawer');
    const burger = $('.nav-burger');
    if (!drawer || !burger) return;
    const closers = $$('[data-close-drawer]');

    function open() {
      drawer.hidden = false;
      requestAnimationFrame(() => drawer.classList.add('is-open'));
      burger.classList.add('is-active');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      drawer.classList.remove('is-open');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
      setTimeout(() => { drawer.hidden = true; document.body.style.overflow = ''; }, 340);
    }
    burger.addEventListener('click', () => drawer.hidden ? open() : close());
    closers.forEach(c => c.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) close(); });
  })();

  /* =========================================================
     10) Orbit sectors — sweep + active sync
     ========================================================= */
  (function sectors() {
    const nodes = $$('.sec-node');
    const arm = $('.sweep-arm');
    const centerLabel = $('#centerLabel');
    const centerSub = $('#centerSubLabel');
    const chips = $$('.sg-item');
    if (!nodes.length || !arm || !window.anime) return;

    nodes.forEach(node => node.style.setProperty('--ang', (+node.dataset.angle) + 'deg'));
    const angles = nodes.map(n => +n.dataset.angle);
    let active = 0;
    setActive(active);

    function setActive(idx) {
      nodes.forEach((n, k) => n.classList.toggle('is-active', k === idx));
      chips.forEach((c, k) => c.classList.toggle('is-active', k === idx));
      const n = nodes[idx];
      centerLabel.textContent = n.dataset.label;
      centerSub.textContent = n.dataset.sub;
      anime({ targets: '#centerLabel', opacity: [0, 1], translateY: [10, 0], duration: 450, easing: 'easeOutQuint' });
    }

    let armAngle = 0;
    const loop = anime({
      targets: { a: 0 },
      a: 360,
      duration: 18000,
      easing: 'linear',
      loop: true,
      update: anim => {
        armAngle = anim.animations[0].currentValue;
        arm.style.transform = `rotate(${armAngle}deg)`;
        let bestIdx = 0, bestDist = Infinity;
        angles.forEach((a, k) => {
          let d = Math.abs(((armAngle - a + 540) % 360) - 180);
          if (d < bestDist) { bestDist = d; bestIdx = k; }
        });
        if (bestDist < 14 && bestIdx !== active) {
          active = bestIdx; setActive(active);
        }
      },
    });
    arm.style.animation = 'none';

    function jumpTo(idx) {
      const targetA = angles[idx];
      const tmp = { a: armAngle };
      anime({
        targets: tmp, a: targetA, duration: 700, easing: 'easeInOutQuart',
        update: () => {
          armAngle = tmp.a;
          arm.style.transform = `rotate(${tmp.a}deg)`;
        },
        complete: () => {
          active = idx; setActive(active);
          loop.seek((targetA / 360) * loop.duration);
        }
      });
    }

    nodes.forEach((node, k) => node.addEventListener('click', () => jumpTo(k)));
    chips.forEach((chip, k) => chip.addEventListener('click', () => jumpTo(k)));
  })();

  /* =========================================================
     10b) Features — scroll-pinned cards (mozn-style)
     ========================================================= */
  (function featuresScroll() {
    const blocks = $$('.feat-block');
    const cards  = $$('.feat-card[data-card]');
    if (!blocks.length || !cards.length) return;

    const setActive = (idx) => {
      blocks.forEach((b, k) => b.classList.toggle('is-active', k === idx));
      cards.forEach((c, k)  => c.classList.toggle('is-active', k === idx));
    };

    const io = new IntersectionObserver((entries) => {
      // pick the entry with the largest intersection ratio
      let best = null;
      entries.forEach(e => {
        if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
          best = e;
        }
      });
      if (best) {
        const idx = +best.target.dataset.index;
        if (!Number.isNaN(idx)) setActive(idx);
      }
    }, {
      rootMargin: '-42% 0px -42% 0px',
      threshold: [0, .25, .5, .75, 1]
    });

    blocks.forEach(b => io.observe(b));
    // safety: kick the first one
    setActive(0);
  })();

  /* =========================================================
     11) Stats counter
     ========================================================= */
  (function stats() {
    const items = $$('.stat strong[data-count]');
    if (!items.length || !window.anime) return;
    const io = new IntersectionObserver(ents => {
      ents.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target, target = +el.dataset.count;
          anime({
            targets: { v: 0 }, v: target, round: 1, duration: 1600,
            easing: 'easeOutQuart',
            update: a => el.textContent = a.animations[0].currentValue,
          });
          io.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    items.forEach(it => io.observe(it));
  })();

  /* =========================================================
     12) Scroll reveal
     ========================================================= */
  (function reveal() {
    const candidates = $$('.about-copy, .about-visual, .stat-card, .contact-copy, .contact-form, .sec-head, .sectors-grid, .stats-grid, .foot-grid');
    candidates.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver(ents => {
      ents.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    candidates.forEach(c => io.observe(c));
  })();

  /* =========================================================
     13) Auth modal — login / register tabs
     ========================================================= */
  (function authModal() {
    const modal = $('#authModal');
    if (!modal) return;
    const tabs    = $$('.modal-tabs .tab', modal);
    const tabsBar = $('.modal-tabs', modal);
    const forms   = $$('.auth-form', modal);
    const triggers = $$('[data-open-auth]');
    const closers  = $$('[data-close]', modal);

    function open(which = 'login') {
      modal.hidden = false;
      setTab(which);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        const firstInput = $(`.auth-form[data-form="${which}"] input`, modal);
        firstInput?.focus({ preventScroll: true });
      });
    }
    function close() {
      modal.classList.add('is-closing');
      setTimeout(() => {
        modal.hidden = true;
        modal.classList.remove('is-closing');
        document.body.style.overflow = '';
      }, 300);
    }
    function setTab(which) {
      tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === which));
      forms.forEach(f => f.classList.toggle('is-active', f.dataset.form === which));
      tabsBar.classList.toggle('tab-register', which === 'register');
    }

    triggers.forEach(t => t.addEventListener('click', (e) => {
      e.preventDefault();
      open(t.dataset.openAuth || 'login');
    }));
    closers.forEach(c => c.addEventListener('click', close));
    tabs.forEach(t => t.addEventListener('click', () => setTab(t.dataset.tab)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
    forms.forEach(f => f.addEventListener('submit', () => {
      const btn = f.querySelector('.btn');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '✓ تم';
        setTimeout(() => { btn.innerHTML = original; close(); }, 900);
      }
    }));
  })();

  /* =========================================================
     14) Initial entrance + cleanup
     ========================================================= */
  window.addEventListener('load', () => {
    if (!window.anime) return;
    anime({
      targets: '.hero-cta-row, .hero-controls',
      opacity: [0, 1], translateY: [40, 0],
      duration: 900,
      delay: anime.stagger(140, { start: 700 }),
      easing: 'easeOutQuint',
    });
    anime({
      targets: '.navbar',
      opacity: [0, 1], translateY: [-30, 0],
      duration: 700, easing: 'easeOutQuint',
    });
    anime({
      targets: '.chip',
      opacity: [0, .85], scale: [.6, 1],
      duration: 800, delay: anime.stagger(140, { start: 700 }),
      easing: 'spring(1, 80, 12, 0)',
    });
    anime({
      targets: '.side-rail .rail-item',
      opacity: [0, 1], translateX: [-16, 0],
      duration: 600, delay: anime.stagger(80, { start: 600 }),
      easing: 'easeOutQuint',
    });
  });

})();
