(() => {
 const graphic = document.querySelector('.brain-map-animated');
 if (!graphic) return;
 const toggle = graphic.querySelector('.brain-motion-control');
 const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
 const updateMotion = () => {
  graphic.classList.add('brain-motion-enabled');
  graphic.classList.toggle('brain-motion-off', preference.matches);
  toggle.hidden = preference.matches;
 };
 updateMotion();
 preference.addEventListener('change', updateMotion);
 toggle.addEventListener('click', () => {
  const paused = graphic.classList.toggle('brain-motion-paused');
  toggle.setAttribute('aria-label', paused ? 'Resume graphic animation' : 'Pause graphic animation');
  toggle.querySelector('.brain-motion-label').textContent = paused ? 'Resume' : 'Pause';
  toggle.querySelector('[aria-hidden]').textContent = paused ? '▶' : 'Ⅱ';
 });
 const examples = {
  brief: ['“Help me prepare for Monday’s client meeting.”', 'CONTEXT: Approved notes + account priorities', 'A draft agenda, open questions, and a short brief—ready for your review.'],
  draft: ['“Draft a proposal in our voice for this opportunity.”', 'CONTEXT: Approved services + writing examples', 'A first draft with scope, assumptions, and questions to confirm before sending.'],
  plan: ['“Help me organize next week’s priorities.”', 'CONTEXT: Your goals + approved planning notes', 'A draft plan with focus areas, dependencies, and decisions for you to make.']
 };
 graphic.querySelectorAll('[data-brain-example]').forEach(button => {
  button.addEventListener('click', () => {
   const content = examples[button.dataset.brainExample];
   graphic.querySelectorAll('[data-brain-example]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
   ['.brain-demo-request','.brain-demo-context','.brain-demo-answer'].forEach((selector, i) => graphic.querySelector(selector).textContent = content[i]);
  });
 });
})();
