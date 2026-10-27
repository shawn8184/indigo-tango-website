(() => {
  const page = document.querySelector('.services-page');
  if (!page) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const explorer = page.querySelector('.workflow-explorer');
  const tabs = [...explorer.querySelectorAll('[role="tab"]')];
  const panel = explorer.querySelector('[role="tabpanel"]');
  const scenarios = {
    leads: {stages: [['An enquiry comes in.', 'Inbox or website form'], ['AI prepares the handoff.', 'Summarize · classify · route'], ['Your team takes over.', 'Review context · follow up']], result: 'Less retyping. A clearer next step.'},
    reporting: {stages: [['Business data changes.', 'CRM · accounting · spreadsheets'], ['AI prepares a report.', 'Collect · check · draft'], ['Your team approves.', 'Review figures · publish']], result: 'Less assembly. More time for the decisions.'},
    knowledge: {stages: [['A question comes up.', 'Team member · service request'], ['AI finds the context.', 'Search approved knowledge sources'], ['An answer with oversight.', 'Source links · human review']], result: 'Less searching. Knowledge your team can use.'}
  };
  function selectTab(tab) {
    const scenario = scenarios[tab.dataset.workflow];
    tabs.forEach(item => {const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;});
    panel.setAttribute('aria-labelledby', tab.id);
    explorer.querySelectorAll('.flow-node').forEach((node, index) => {node.querySelector('h3').textContent = scenario.stages[index][0]; node.querySelector('p').textContent = scenario.stages[index][1];});
    explorer.querySelector('.workflow-result').textContent = scenario.result;
    if (!reducedMotion.matches && explorer.dataset.paused !== 'true' && panel.animate) panel.animate([{opacity: .35, transform: 'translateY(5px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 240, easing: 'ease-out'});
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {event.preventDefault(); tabs[next].focus(); selectTab(tabs[next]);}
    });
  });
  const pause = explorer.querySelector('.motion-toggle');
  function setPaused(paused) {
    explorer.dataset.paused = String(paused);
    pause.setAttribute('aria-pressed', String(paused));
    pause.firstChild.textContent = paused ? 'Resume motion ' : 'Pause motion ';
    pause.querySelector('span').textContent = paused ? '▷' : 'Ⅱ';
  }
  setPaused(reducedMotion.matches);
  pause.addEventListener('click', () => setPaused(explorer.dataset.paused !== 'true'));
  reducedMotion.addEventListener('change', event => setPaused(event.matches));
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const items = [...page.querySelectorAll('.service-offer, .services-outcome-grid article, .assessment-aside, .assessment-stage, .services-faq details')];
    items.forEach((item, index) => {item.classList.add('scroll-reveal'); item.style.setProperty('--reveal-delay', (index % 3) * 65 + 'ms');});
    page.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('is-visible'); observer.unobserve(entry.target);}}), {threshold: .07});
    items.forEach(item => observer.observe(item));
    page.querySelectorAll('input,select,textarea,summary,a,button').forEach(control => control.addEventListener('focus', () => control.closest('.scroll-reveal')?.classList.add('is-visible')));
    reducedMotion.addEventListener('change', event => {if(event.matches){page.classList.remove('motion-ready'); observer.disconnect();}});
  }
  const form = page.querySelector('.services-assessment');
  const required = [...form.querySelectorAll('[required]')];
  const progress = form.querySelector('progress');
  const progressText = form.querySelector('.assessment-progress-text');
  progress.max = required.length;
  function updateProgress() {
    const count = required.filter(field => field.validity.valid && (field.type === 'checkbox' ? field.checked : field.value.trim())).length;
    if (progress.value !== count || !progressText.textContent) {
      progress.value = count;
      progressText.textContent = count + ' of ' + required.length + ' required fields complete';
    }
  }
  form.addEventListener('input', updateProgress);
  form.addEventListener('change', updateProgress);
  form.addEventListener('reset', () => requestAnimationFrame(updateProgress));
  addEventListener('pageshow', updateProgress);
  updateProgress();
})();
