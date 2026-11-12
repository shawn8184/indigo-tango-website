/* Indigo Tango — home page motion additions, 2026-11-09.
   Load with defer, after site-motion-20261026.js. Pairs with home-motion-20261109.css. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const ease = 'cubic-bezier(.2,.7,.2,1)';
  const once = (elements, run, threshold = .3) => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target); run(entry.target);
    }), {threshold});
    elements.forEach(element => observer.observe(element));
  };

  // "20+" counts up once when the hero foot is on screen.
  once(document.querySelectorAll('.network-hero-foot strong'), el => {
    const match = el.textContent.trim().match(/^(\d+)(\D*)$/);
    if (!match) return;
    const target = Number(match[1]), suffix = match[2], final = el.textContent, start = performance.now() + 700;
    el.setAttribute('aria-label', final);
    const tick = now => {
      if (reduced.matches) { el.textContent = final; return; }
      const t = Math.min(1, Math.max(0, (now - start) / 1300));
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(tick); else el.textContent = final;
    };
    el.textContent = '0' + suffix; requestAnimationFrame(tick);
  }, .6);

  // Benefit cards: the lit signal bars fill one after another.
  once(document.querySelectorAll('.benefit-card .signal'), signal => {
    signal.querySelectorAll('i.lit').forEach((bar, index) => {
      bar.animate([{opacity: .15, scale: '1 .3'}, {opacity: 1, scale: '1 1'}], {duration: 460, delay: 120 + index * 95, easing: ease, fill: 'backwards'});
    });
  }, .9);

  // Service cards: the line drawings fan open.
  once(document.querySelectorAll('.feature-card .wire-art'), art => {
    [...art.children].forEach((line, index) => {
      line.animate([{opacity: 0}, {opacity: 1}], {duration: 520, delay: index * 30, easing: 'ease-out', fill: 'backwards'});
    });
  }, .15);

  // "How it works": a request runs intake -> AI -> team, twice, then rests. Hover or focus replays it.
  document.querySelectorAll('.workflow-visual').forEach(visual => {
    const nodes = [...visual.querySelectorAll('.workflow-node')];
    const connectors = [...visual.querySelectorAll('.workflow-connector')];
    if (nodes.length < 2 || connectors.length !== nodes.length - 1) return;
    const dots = connectors.map(connector => {
      const dot = document.createElement('span');
      dot.className = 'flow-dot'; dot.setAttribute('aria-hidden', 'true'); connector.append(dot); return dot;
    });
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    let running = false;
    async function run(times) {
      if (running || reduced.matches) return;
      running = true;
      for (let pass = 0; pass < times && !reduced.matches; pass++) {
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].classList.add('is-live');
          await wait(i === 1 ? 950 : 650);            // the AI step takes a moment longer
          if (i < dots.length) {
            const travel = connectors[i].offsetHeight;
            await dots[i].animate([{opacity: 0, transform: 'translateY(0)'}, {opacity: 1, offset: .2}, {opacity: 1, offset: .8}, {opacity: 0, transform: `translateY(${travel}px)`}], {duration: 420, easing: 'ease-in-out'}).finished.catch(() => {});
          }
        }
        await wait(700);
        nodes.forEach(node => node.classList.remove('is-live'));
        await wait(500);
      }
      nodes.forEach(node => node.classList.remove('is-live'));
      running = false;
    }
    once([visual], () => run(2), .45);
    visual.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') run(1); });
  });
})();
