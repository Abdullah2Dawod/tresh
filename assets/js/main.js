/* =========================================================
   TRSEAH — main.js
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ===== year ===== */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* =========================================================
     0) Custom cursor — green triangle from the logo
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
<<<<<<< HEAD
      // fast follow — feels like the native pointer, with just a hint of inertia
      x += (tx - x) * 0.55;
      y += (ty - y) * 0.55;
=======
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
>>>>>>> e58407ecb5fcd97cc393f0cebcb1b9a050989b9f
      c.style.transform = `translate3d(${x - 11}px, ${y - 11}px, 0)`;
      requestAnimationFrame(loop);
    })();

    const HOVER_SEL = 'a, button, [role="button"], .sec-node, .chip, .sg-item, .dot, .feat-card, .contact-info li';
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
    document.addEventListener('mouseup', () => c.classList.remove('is-click'));
    document.addEventListener('mouseleave', () => { c.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { c.style.opacity = '1'; });
  })();

  /* =========================================================
     0b) Body section spy — drives bg-tint via [data-section]
     ========================================================= */
  (function sectionSpy() {
    const sections = $$('section[id]');
    if (!sections.length) return;
    document.body.dataset.section = 'hero';
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (e.isIntersecting) document.body.dataset.section = e.target.id;
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  })();

  /* =========================================================
     0c) Side rail — section indicator + smooth-scroll
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
     0d) Auth modal — login / register tabs
     ========================================================= */
  (function authModal() {
    const modal = $('#authModal');
    if (!modal) return;
    const panel = $('.modal-panel', modal);
    const tabs = $$('.modal-tabs .tab', modal);
    const tabsBar = $('.modal-tabs', modal);
    const forms = $$('.auth-form', modal);
    const triggers = $$('[data-open-auth]');
    const closers = $$('[data-close]', modal);

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
    // submit feedback
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
     1) Hero — code matrix columns (scene 0)
     ========================================================= */
  const codeChars = '0101{}<>/$#*+=-_();[]ƒΣ∆∇⌘λ→←•◊◆';
  const codeGroup = $('.hero-scene[data-scene="0"] .code-cols');
  if (codeGroup) {
    const cols = 22;
    const w = 1600, h = 900;
    const step = w / cols;
    for (let i = 0; i < cols; i++) {
      const x = i * step + step / 2;
      const rows = 22;
      for (let j = 0; j < rows; j++) {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', x);
        t.setAttribute('y', j * (h / rows) + 22);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('opacity', (Math.random() * 0.7 + 0.1).toFixed(2));
        t.textContent = codeChars[(Math.random() * codeChars.length) | 0];
        codeGroup.appendChild(t);
      }
    }
    // shimmer
    anime({
      targets: codeGroup.children,
      opacity: () => [0.05, Math.random() * 0.8 + 0.2],
      duration: () => 2000 + Math.random() * 3000,
      delay: anime.stagger(20, { from: 'random' }),
      direction: 'alternate',
      easing: 'easeInOutSine',
      loop: true,
    });
  }

  /* =========================================================
     2) Hero — neural net (scene 1)
     ========================================================= */
  (function buildNeuralNet() {
    const edges = $('.hero-scene[data-scene="1"] .nn-edges');
    const nodes = $('.hero-scene[data-scene="1"] .nn-nodes');
    if (!edges || !nodes) return;

    const layers = [
      { x: 240, n: 5 },
      { x: 600, n: 7 },
      { x: 1000, n: 7 },
      { x: 1360, n: 4 },
    ];
    const ys = (count) => {
      const arr = [];
      const span = 700, top = (900 - span) / 2;
      for (let i = 0; i < count; i++) arr.push(top + (span / (count - 1)) * i);
      return arr;
    };
    const layerPos = layers.map(l => ({ x: l.x, y: ys(l.n) }));

    // edges
    for (let li = 0; li < layerPos.length - 1; li++) {
      const a = layerPos[li], b = layerPos[li + 1];
      a.y.forEach(ay => {
        b.y.forEach(by => {
          const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          p.setAttribute('d', `M${a.x},${ay} C${(a.x+b.x)/2},${ay} ${(a.x+b.x)/2},${by} ${b.x},${by}`);
          p.setAttribute('stroke-opacity', (Math.random() * 0.5 + 0.15).toFixed(2));
          edges.appendChild(p);
        });
      });
    }
    // nodes
    layerPos.forEach(l => {
      l.y.forEach(yy => {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', l.x); c.setAttribute('cy', yy); c.setAttribute('r', 6);
<<<<<<< HEAD
=======
        c.setAttribute('filter', 'drop-shadow(0 0 10px #61f9b0)');
>>>>>>> e58407ecb5fcd97cc393f0cebcb1b9a050989b9f
        nodes.appendChild(c);
      });
    });

    // animate
    anime({
      targets: edges.querySelectorAll('path'),
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 2200,
      delay: anime.stagger(30, { from: 'first' }),
      direction: 'alternate',
      loop: true,
    });
    anime({
      targets: nodes.querySelectorAll('circle'),
      r: [{ value: 9 }, { value: 5 }],
      opacity: [{ value: 1 }, { value: 0.55 }],
      duration: 1800,
      easing: 'easeInOutQuad',
      delay: anime.stagger(120, { from: 'random' }),
      loop: true,
      direction: 'alternate',
    });
  })();

  /* =========================================================
     3) Hero — data flow waves (scene 3)
     ========================================================= */
  (function buildWaves() {
    const waves = $('.hero-scene[data-scene="3"] .wave-lines');
    const dots = $('.hero-scene[data-scene="3"] .data-dots');
    if (!waves || !dots) return;

    const W = 1600, H = 900;
    const count = 7;
    for (let i = 0; i < count; i++) {
      const baseY = 200 + i * 90 + (Math.random() - .5) * 20;
      const amp = 28 + Math.random() * 30;
      const pts = [];
      for (let x = 0; x <= W; x += 60) {
        const y = baseY + Math.sin((x / W) * Math.PI * (2 + i)) * amp;
        pts.push(`${x === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`);
      }
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', pts.join(' '));
      p.setAttribute('stroke-dasharray', '6 10');
      waves.appendChild(p);
    }
    // dots
    for (let i = 0; i < 24; i++) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', Math.random() * W);
      c.setAttribute('cy', Math.random() * H);
      c.setAttribute('r', (Math.random() * 2.5 + 1).toFixed(1));
      c.setAttribute('opacity', '0.6');
      dots.appendChild(c);
    }

    anime({
      targets: waves.querySelectorAll('path'),
      strokeDashoffset: [0, -200],
      duration: 5000,
      easing: 'linear',
      loop: true,
      delay: anime.stagger(120),
    });
    anime({
      targets: dots.querySelectorAll('circle'),
      opacity: [0.2, 1],
      r: () => [1, 2 + Math.random() * 2],
      duration: 2500,
      direction: 'alternate',
      delay: anime.stagger(80, { from: 'random' }),
      easing: 'easeInOutSine',
      loop: true,
    });
  })();

  /* =========================================================
     4) Hero — slider state machine (smooth tech transitions)
     ========================================================= */
  (function heroSlider() {
    const slides  = $$('.hero-slide');
    const scenes  = $$('.hero-scene');
    const dots    = $$('.hero-pagination .dot');
    const prev    = $('.hero-nav.prev');
    const next    = $('.hero-nav.next');
    let i = 0, n = slides.length, timer = null, busy = false;

    // wrap each title's "free" words in spans for stagger animation
    // — skip text inside .grad-text and <em> so their dedicated styling survives
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
      const fragments = [];
      let node;
      while ((node = walker.nextNode())) fragments.push(node);
      fragments.forEach(text => {
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
      const slide = slides[idx];
      const eb = slide.querySelector('.hero-eyebrow');
      const words = slide.querySelectorAll('.hero-title .word, .hero-title .grad-text, .hero-title em');
      const txt = slide.querySelector('.hero-text');

      if (eb) anime({
        targets: eb, opacity: [0, 1], translateY: [16, 0],
        duration: 700, easing: 'easeOutQuint',
      });
      anime({
        targets: words,
        opacity: [0, 1],
        translateY: [28, 0],
        filter: ['blur(6px)', 'blur(0px)'],
        duration: 900,
        delay: anime.stagger(55, { start: 120 }),
        easing: 'easeOutQuint',
      });
      if (txt) anime({
        targets: txt, opacity: [0, 1], translateY: [18, 0],
        duration: 800, delay: 360, easing: 'easeOutQuint',
      });
    }

    function goto(idx) {
      idx = (idx + n) % n;
      if (idx === i || busy) return;
      busy = true;

      const prevI = i;
      // leaving
      slides[prevI].classList.add('is-leaving');
      slides[prevI].classList.remove('is-active');
      scenes[prevI].classList.add('is-leaving');
      scenes[prevI].classList.remove('is-active');
      dots[prevI].classList.remove('is-active');

      i = idx;
      // small delay so the leaving frame paints first, then incoming feels layered
      setTimeout(() => {
        slides[i].classList.add('is-active');
        scenes[i].classList.add('is-active');
        dots[i].classList.add('is-active');
        animateIn(i);
      }, 60);

      // clear leaving state once transition window passes
      setTimeout(() => {
        slides[prevI].classList.remove('is-leaving');
        scenes[prevI].classList.remove('is-leaving');
        busy = false;
      }, 1300);
    }

    function autoplay() {
      stop();
      timer = setInterval(() => goto(i + 1), 7200);
    }
    function stop() { if (timer) clearInterval(timer); }

    prev?.addEventListener('click', () => { goto(i - 1); autoplay(); });
    next?.addEventListener('click', () => { goto(i + 1); autoplay(); });
    dots.forEach(d => d.addEventListener('click', () => { goto(+d.dataset.go); autoplay(); }));

    // pause on hover
    const heroEl = $('.hero');
    heroEl?.addEventListener('mouseenter', stop);
    heroEl?.addEventListener('mouseleave', autoplay);

    autoplay();
    // initial entrance of slide 0
    setTimeout(() => animateIn(0), 250);
  })();

  /* =========================================================
     5) Navbar — scroll behaviour + section spy
     ========================================================= */
  (function navbar() {
    const shell = $('.nav-shell');
    const bar = $('#navbar');
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

    // section spy
    const links = $$('.nav-menu a');
    const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
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
     6) Orbit Sectors — clock-hand sweep + active sync
     ========================================================= */
  (function sectors() {
    const nodes = $$('.sec-node');
    const arm = $('.sweep-arm');
    const centerLabel = $('#centerLabel');
    const centerSub = $('#centerSubLabel');
    const chips = $$('.sg-item');
    if (!nodes.length) return;

    // place each node at its angle on the orbit
    nodes.forEach(node => {
      const ang = +node.dataset.angle;
      node.style.setProperty('--ang', ang + 'deg');
    });

    // angles array
    const angles = nodes.map(n => +n.dataset.angle);
    let active = 0;
    setActive(active);

    function setActive(idx) {
      nodes.forEach((n, k) => n.classList.toggle('is-active', k === idx));
      chips.forEach((c, k) => c.classList.toggle('is-active', k === idx));
      const n = nodes[idx];
      centerLabel.textContent = n.dataset.label;
      centerSub.textContent = n.dataset.sub;
      anime({
        targets: '#centerLabel',
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 500,
        easing: 'easeOutQuint',
      });
    }

    // sweep-driven activation: rotate via anime so we control the angle
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
        // find nearest sector angle
        let bestIdx = 0, bestDist = Infinity;
        angles.forEach((a, k) => {
          let d = Math.abs(((armAngle - a + 540) % 360) - 180);
          if (d < bestDist) { bestDist = d; bestIdx = k; }
        });
        if (bestDist < 14 && bestIdx !== active) {
          active = bestIdx;
          setActive(active);
        }
      },
    });
    // disable the default CSS animation since we drive it via JS
    arm.style.animation = 'none';

    // click on chip or node jumps the sweep
    function jumpTo(idx) {
      const targetA = angles[idx];
      anime.remove({ a: armAngle });
      const tmp = { a: armAngle };
      anime({
        targets: tmp,
        a: targetA,
        duration: 700,
        easing: 'easeInOutQuart',
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
     7) Stats counter
     ========================================================= */
  (function stats() {
    const items = $$('.stat strong[data-count]');
    if (!items.length) return;
    const io = new IntersectionObserver(ents => {
      ents.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target, target = +el.dataset.count;
          anime({
            targets: { v: 0 },
            v: target,
            round: 1,
            duration: 1600,
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
     8) Scroll reveal — auto add .reveal & toggle .is-in
     ========================================================= */
  (function reveal() {
    const candidates = $$('.about-copy, .about-visual, .feat-card, .contact-copy, .contact-form, .sec-head, .sectors-grid, .stats-grid, .foot-grid');
    candidates.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver(ents => {
      ents.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    candidates.forEach(c => io.observe(c));
  })();

  /* =========================================================
     9) Initial hero entrance
     ========================================================= */
  window.addEventListener('load', () => {
    anime({
      targets: '.hero-cta-row, .hero-controls',
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 900,
      delay: anime.stagger(140, { start: 700 }),
      easing: 'easeOutQuint',
    });
    anime({
      targets: '.navbar',
      opacity: [0, 1],
      translateY: [-30, 0],
      duration: 700,
      easing: 'easeOutQuint',
    });
    anime({
      targets: '.chip',
      opacity: [0, .72],
      scale: [.6, 1],
      duration: 800,
      delay: anime.stagger(140, { start: 700 }),
      easing: 'spring(1, 80, 12, 0)',
    });
  });

})();
