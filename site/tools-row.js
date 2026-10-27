(() => {
  const ribbon = document.querySelector('.tools-marquee');
  if (!ribbon) return;
  const button = ribbon.querySelector('.tools-motion-toggle');
  const label = button.querySelector('.motion-label');
  const symbol = button.querySelector('[aria-hidden]');
  ribbon.classList.add('tools-marquee-ready');
  button.hidden = false;
  button.addEventListener('click', () => {
    const paused = ribbon.dataset.paused !== 'true';
    ribbon.dataset.paused = String(paused);
    label.textContent = paused ? 'Resume' : 'Pause';
    symbol.textContent = paused ? '▶' : 'Ⅱ';
    button.setAttribute('aria-label', paused ? 'Resume scrolling logos' : 'Pause scrolling logos');
  });
})();
