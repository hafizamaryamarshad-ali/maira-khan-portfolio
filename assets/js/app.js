/* Interactions for the Maira Khan portfolio. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;

  /* ---------- Split headlines into animated words ---------- */
  $$('[data-split]').forEach((el) => {
    let i = 0;
    const wrap = (node) => {
      const outer = document.createElement('span');
      outer.className = 'split-word';
      const inner = document.createElement('span');
      inner.style.setProperty('--d', `${i++ * 70 + (+el.dataset.delay || 0)}ms`);
      inner.appendChild(node);
      outer.appendChild(inner);
      return outer;
    };
    [...el.childNodes].forEach((node) => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          frag.appendChild(/^\s+$/.test(part) ? document.createTextNode(' ') : wrap(document.createTextNode(part)));
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') {
        const placeholder = document.createComment('');
        node.replaceWith(placeholder);
        placeholder.replaceWith(wrap(node));
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    revealIO.unobserve(e.target);
  }), { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

  let pending = [];
  const sweep = () => {
    // Fallback for fast jumps (anchors, reloads mid-page): reveal anything at or above the viewport.
    if (!pending.length) return;
    pending = pending.filter((el) => {
      if (el.classList.contains('is-in')) return false;
      if (el.getBoundingClientRect().top < innerHeight * 0.92) { el.classList.add('is-in'); revealIO.unobserve(el); return false; }
      return true;
    });
  };
  const startReveals = () => {
    pending = $$('[data-reveal], [data-split]');
    pending.forEach((el) => revealIO.observe(el));
    addEventListener('scroll', () => requestAnimationFrame(sweep), { passive: true });
    sweep();
  };

  // Stagger children: <div data-stagger> children get increasing delays
  $$('[data-stagger]').forEach((group) => {
    const step = +group.dataset.stagger || 90;
    [...group.children].forEach((child, i) => {
      if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', '');
      child.style.setProperty('--d', `${i * step}ms`);
    });
  });

  /* ---------- Preloader ---------- */
  const preloader = $('[data-preloader]');
  if (preloader) {
    const bar = $('[data-preload-bar]');
    const count = $('[data-preload-count]');
    let n = 0;
    document.body.style.overflow = 'hidden';
    const tick = setInterval(() => {
      n = Math.min(100, n + Math.ceil(Math.random() * 9));
      bar.style.width = `${n}%`;
      count.textContent = String(n).padStart(2, '0');
      if (n >= 100) {
        clearInterval(tick);
        sessionStorage.setItem('mk-loaded', '1');
        setTimeout(() => {
          preloader.classList.add('is-done');
          document.body.style.overflow = '';
          startReveals();
          setTimeout(() => preloader.remove(), 1100);
        }, 250);
      }
    }, 45);
  } else {
    startReveals();
  }

  /* ---------- Rotating words ---------- */
  $$('[data-rotator]').forEach((rot) => {
    const words = [...rot.children];
    let idx = 0;
    words[0].classList.add('is-active');
    if (reduced || words.length < 2) return;
    setInterval(() => {
      const prev = words[idx];
      idx = (idx + 1) % words.length;
      prev.classList.remove('is-active');
      prev.classList.add('is-out');
      words[idx].classList.remove('is-out');
      words[idx].classList.add('is-active');
      setTimeout(() => prev.classList.remove('is-out'), 900);
    }, 2400);
  });

  /* ---------- Nav: scrolled state, hide on scroll down, progress ---------- */
  const nav = $('[data-nav]');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    nav?.classList.toggle('is-scrolled', y > 20);
    nav?.classList.toggle('is-hidden', y > 400 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
    const max = root.scrollHeight - innerHeight;
    root.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('[data-menu-btn]');
  const menu = $('[data-mobile-menu]');
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    menuBtn.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn?.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.classList.contains('is-open')) setMenu(false); });

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduced) {
    const dot = $('[data-cursor-dot]');
    const ring = $('[data-cursor-ring]');
    let mx = -100, my = -100, rx = -100, ry = -100;
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate3d(${mx}px,${my}px,0)`; }, { passive: true });
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('pointerover', (e) => {
      const view = e.target.closest('[data-cursor="view"]');
      const hover = e.target.closest('a, button, [data-cursor="hover"], input, select, textarea');
      ring.classList.toggle('is-view', !!view);
      ring.classList.toggle('is-hover', !view && !!hover);
      ring.textContent = view ? (view.dataset.cursorLabel || 'View') : '';
    });
    document.addEventListener('pointerleave', () => { mx = my = -100; });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$('[data-magnetic]').forEach((el) => {
      const strength = +el.dataset.magnetic || 0.3;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Spotlight + tilt ---------- */
  $$('.spotlight').forEach((card) => card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));
  if (finePointer && !reduced) {
    $$('[data-tilt]').forEach((el) => {
      const max = +el.dataset.tilt || 6;
      el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1), opacity 1s cubic-bezier(.16,1,.3,1)';
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1100px) rotateX(${-y * max}deg) rotateY(${x * max}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Parallax ---------- */
  const parallax = $$('[data-parallax]');
  if (parallax.length && !reduced) {
    const run = () => {
      parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const speed = +el.dataset.parallax || 0.1;
        el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - innerHeight / 2) * -speed}px, 0)`;
      });
      requestAnimationFrame(run);
    };
    run();
  }

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    const el = e.target;
    const end = +el.dataset.count;
    const dur = reduced ? 0 : 1600;
    const t0 = performance.now();
    const step = (t) => {
      const p = dur ? Math.min(1, (t - t0) / dur) : 1;
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  /* ---------- Page transitions ---------- */
  const wipe = $('[data-wipe]');
  sessionStorage.removeItem('mk-wipe');
  if (wipe?.classList.contains('is-active')) {
    requestAnimationFrame(() => requestAnimationFrame(() => { wipe.classList.add('is-exit'); wipe.classList.remove('is-active'); }));
    setTimeout(() => wipe.classList.remove('is-exit'), 800);
  }
  $$('a[href]').forEach((a) => a.addEventListener('click', (e) => {
    const url = new URL(a.href, location.href);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target === '_blank') return;
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash) || reduced) return;
    e.preventDefault();
    sessionStorage.setItem('mk-wipe', '1');
    wipe?.classList.add('is-active');
    setTimeout(() => { location.href = url.href; }, 560);
  }));
  addEventListener('pageshow', (e) => { if (e.persisted) wipe?.classList.remove('is-active'); });

  /* ---------- Back to top ---------- */
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-to-top]')) scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- Project filters ---------- */
  const filters = $$('[data-filter]');
  filters.forEach((btn) => btn.addEventListener('click', () => {
    filters.forEach((b) => { b.setAttribute('aria-pressed', 'false'); });
    btn.setAttribute('aria-pressed', 'true');
    const f = btn.dataset.filter;
    $$('[data-project]').forEach((p) => {
      const show = f === 'all' || p.dataset.project === f;
      p.classList.toggle('is-hidden', !show);
      if (show) { p.classList.remove('is-in'); requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('is-in'))); }
    });
  }));

  /* ---------- Theme toggle ---------- */
  const themeBtn = $('[data-theme-toggle]');
  const themeMeta = $('meta[name="theme-color"]');
  const syncTheme = () => {
    const light = root.dataset.theme === 'light';
    themeBtn?.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    if (themeMeta) themeMeta.content = light ? '#FAF6F1' : '#141218';
  };
  if (!root.dataset.theme) root.dataset.theme = 'dark';
  syncTheme();
  themeBtn?.addEventListener('click', () => {
    root.classList.add('theme-anim');
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('mk-theme', root.dataset.theme); } catch {}
    syncTheme();
    setTimeout(() => root.classList.remove('theme-anim'), 600);
  });

  /* ---------- Copy email ---------- */
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const label = $('[data-copy-label]', btn) || btn;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      label.textContent = 'Copied ✓';
    } catch {
      label.textContent = btn.dataset.copy;
    }
    setTimeout(() => { label.textContent = 'Copy address'; }, 2000);
  }));
})();
