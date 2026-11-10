/* Shared layout: header, mobile menu, cursor, preloader and footer.
   Loaded synchronously at the top of <body> so the nav renders without a flash. */
(function () {
  const me = document.currentScript;
  const root = me.dataset.root || './';
  const page = me.dataset.page || 'home';
  document.documentElement.classList.add('js');

  const items = [
    ['about', 'about/', 'About'],
    ['web-development', 'web-development/', 'Web & UI/UX'],
    ['ai-video-studio', 'ai-video-studio/', 'AI Video'],
    ['projects', 'projects/', 'Work'],
    ['experience', 'experience/', 'Experience'],
  ];
  const href = (p) => `${root}${p}index.html`;
  const cur = (k) => (k === page ? 'aria-current="page"' : '');
  const arrow = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const firstVisit = !sessionStorage.getItem('mk-loaded') && !matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = `
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-cream focus:px-5 focus:py-3 focus:text-ink">Skip to content</a>
  <div class="fixed inset-x-0 top-0 z-[80] h-[2px]"><div class="scroll-progress h-full bg-brand-gradient"></div></div>
  ${firstVisit ? `
  <div class="preloader" data-preloader>
    <div class="text-center">
      <p class="font-mono text-[11px] uppercase tracking-[0.3em] text-mist">Pixels &amp; Frames</p>
      <p class="mt-4 text-5xl font-semibold tracking-tighter sm:text-7xl">Maira <span class="italic-accent text-gradient">Khan</span></p>
      <div class="mx-auto mt-8 h-px w-48 overflow-hidden bg-white/10"><div class="h-full w-0 bg-brand-gradient transition-[width] duration-100" data-preload-bar></div></div>
      <p class="mt-3 font-mono text-xs text-mist"><span data-preload-count>00</span> / 100</p>
    </div>
  </div>` : ''}
  <div class="page-wipe${!firstVisit && sessionStorage.getItem('mk-wipe') ? ' is-active' : ''}" data-wipe></div>
  <div class="cursor-ring" data-cursor-ring></div><div class="cursor-dot" data-cursor-dot></div>

  <header class="site-nav fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-expo sm:px-5 sm:pt-4" data-nav>
    <div class="nav-shell mx-auto flex max-w-[1320px] items-center justify-between gap-4 rounded-full border border-transparent px-3 py-2.5 backdrop-blur-xl transition-all duration-500 sm:px-4">
      <a href="${href('')}" class="group flex items-center gap-3" aria-label="Maira Khan, home" data-magnetic>
        <span class="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-cream font-serif text-lg italic text-ink">
          <span class="transition-transform duration-500 ease-expo group-hover:-translate-y-8">mk</span>
          <span class="absolute translate-y-8 transition-transform duration-500 ease-expo group-hover:translate-y-0">✦</span>
        </span>
        <span class="hidden text-[15px] font-semibold tracking-tight sm:block">Maira Khan</span>
      </a>
      <nav class="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.02] p-1 lg:flex" aria-label="Main">
        ${items.map(([k, p, n]) => `<a class="nav-link" href="${href(p)}" ${cur(k)}>${n}</a>`).join('')}
      </nav>
      <div class="flex items-center gap-2">
        <span class="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mist xl:flex"><span class="relative flex h-2 w-2"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60"></span><span class="relative h-2 w-2 rounded-full bg-lime"></span></span>Open to projects</span>
        <button type="button" class="group relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-white/15 text-cream transition hover:border-white/40 hover:bg-white/5" data-theme-toggle aria-label="Switch to light theme">
          <svg class="absolute h-[18px] w-[18px] transition duration-500 ease-expo [html[data-theme=light]_&]:-translate-y-8 [html[data-theme=light]_&]:rotate-90" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
          <svg class="absolute h-[18px] w-[18px] translate-y-8 transition duration-500 ease-expo [html[data-theme=light]_&]:translate-y-0" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </button>
        <a href="${href('contact/')}" class="btn-primary hidden !px-5 !py-3 sm:inline-flex" data-magnetic ${cur('contact')}><span>Let’s talk</span><span class="btn-arrow !h-6 !w-6">${arrow}</span></a>
        <button class="menu-btn grid h-11 w-11 place-items-center rounded-full border border-white/15 lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu" data-menu-btn>
          <span class="flex flex-col gap-[5px]"><span class="block h-px w-5 bg-cream transition-transform duration-500"></span><span class="block h-px w-5 bg-cream transition-transform duration-500"></span></span>
        </button>
      </div>
    </div>
  </header>

  <div id="mobile-menu" class="mobile-menu fixed inset-0 z-40 flex flex-col justify-between bg-ink-800 px-6 pb-10 pt-28 lg:hidden" data-mobile-menu aria-hidden="true">
    <div class="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-ember/30 blur-[100px]"></div>
    <nav class="relative flex flex-col" aria-label="Mobile">
      ${[['home', '', 'Home'], ...items, ['contact', 'contact/', 'Contact']].map(([k, p, n], i) => `
        <a style="--i:${i}" href="${href(p)}" ${cur(k)} class="group flex items-baseline gap-4 border-b border-white/[0.07] py-4 text-4xl font-semibold tracking-tighter aria-[current=page]:text-ember">
          <span class="font-mono text-xs text-mist">0${i + 1}</span>${n}</a>`).join('')}
    </nav>
    <p class="relative font-mono text-[11px] uppercase tracking-[0.2em] text-mist">Frontend · UI/UX · AI Video</p>
  </div>`;

  me.insertAdjacentHTML('beforebegin', header);

  const footer = `
  <footer class="relative overflow-hidden border-t border-white/[0.07] bg-ink">
    <div class="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/15 blur-[120px]"></div>
    <div class="container-x relative py-20">
      <div class="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p class="eyebrow">Next chapter</p>
          <a href="${href('contact/')}" class="group mt-6 block text-huge font-semibold" data-cursor="hover">
            Let’s make it <span class="italic-accent text-gradient">unforgettable</span>
            <span class="ml-2 inline-grid h-12 w-12 place-items-center rounded-full bg-cream align-middle text-ink transition-transform duration-500 ease-expo group-hover:rotate-45 md:h-16 md:w-16">${arrow.replace(/14/g, '20')}</span>
          </a>
        </div>
        <div>
          <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">Explore</p>
          <ul class="mt-6 space-y-3 text-cream/80">
            ${[['', 'Home'], ...items.map(([, p, n]) => [p, n]), ['contact/', 'Contact']].map(([p, n]) => `<li><a class="inline-flex items-center gap-2 transition hover:translate-x-1 hover:text-cream" href="${href(p)}">${n}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">Practice</p>
          <ul class="mt-6 space-y-3 text-cream/80"><li>Frontend Development</li><li>UI/UX Design</li><li>AI Video Production</li><li>Creative Editing</li></ul>
          <button type="button" class="btn-ghost mt-8 !px-5 !py-3" data-to-top>Back to top <span aria-hidden="true">↑</span></button>
        </div>
      </div>
    </div>
    <div class="relative select-none overflow-hidden" aria-hidden="true">
      <p class="whitespace-nowrap text-center text-[22vw] font-semibold leading-[.78] tracking-[-0.07em] text-stroke">Maira Khan</p>
    </div>
    <div class="container-x relative flex flex-col gap-3 border-t border-white/[0.07] py-6 font-mono text-[11px] uppercase tracking-[0.16em] text-mist sm:flex-row sm:items-center sm:justify-between">
      <p>© ${new Date().getFullYear()} Maira Khan — Independent creative practice</p>
      <p>Designed &amp; built with care · Pixels &amp; Frames</p>
    </div>
  </footer>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-footer]')?.insertAdjacentHTML('afterend', footer);
    document.querySelector('[data-footer]')?.remove();
  });

  window.MK = { firstVisit, arrow };
})();
