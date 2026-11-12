(() => {
  const page = document.querySelector('.insights-page');
  if (!page) return;
  const search = page.querySelector('#insight-search');
  const buttons = [...page.querySelectorAll('[data-filter]')];
  const cards = [...page.querySelectorAll('.editorial-card')];
  const results = page.querySelector('.insights-results');
  const empty = page.querySelector('.insights-empty');
  const normalize = value => value.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const text = cards.map(card => normalize(card.textContent));
  let category = 'all';
  function filter() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach((card,index) => {
      const match = (category === 'all' || card.dataset.category === category) && terms.every(term => text[index].includes(term));
      card.hidden = !match;
      if (match) count++;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    results.textContent = count === cards.length && !terms.length && category === 'all' ? `Showing all ${count} insights` : `Showing ${count} of ${cards.length} insights`;
    empty.hidden = count !== 0;
  }
  buttons.forEach(button => button.addEventListener('click', () => {category = button.dataset.filter; filter();}));
  search.addEventListener('input',filter);
  page.querySelector('.insights-reset').addEventListener('click', () => {category = 'all'; search.value = ''; filter(); search.focus();});
  page.querySelector('.insights-search').hidden = false;
  page.querySelector('.insights-filters').hidden = false;
  results.hidden = false;
  filter();
})();
