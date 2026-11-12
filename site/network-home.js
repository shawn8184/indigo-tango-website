(() => {
 const button = document.querySelector('.network-motion-toggle');
 if (!button) return;
 document.body.classList.add('has-network-motion');
 button.hidden = false;
 button.addEventListener('click', () => {
   const paused = document.body.dataset.networkPaused !== 'true';
   document.body.dataset.networkPaused = String(paused);
   button.querySelector('.network-motion-label').textContent = paused ? 'Resume visual' : 'Pause visual';
   button.setAttribute('aria-label', paused ? 'Resume hero animation' : 'Pause hero animation');
   button.querySelector('[aria-hidden]').textContent = paused ? '▶' : 'Ⅱ';
 });
})();
