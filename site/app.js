const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if(event.key === 'Escape' && navigation?.classList.contains('open')) {
    navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.focus();
  }
});
const enquiryForm = 'https://docs.google.com/forms/d/e/1FAIpQLSfaTqEq0ROboZEY0zxCtxyqrcTQ2cTFXDBUrUlcXGqmwlLBRg/viewform';
document.querySelectorAll('.preview-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const controls = [...form.elements].filter(el => el.name && !el.disabled && !['submit', 'button'].includes(el.type));
    const supplied = controls.filter(el => !['checkbox', 'radio'].includes(el.type) || el.checked);
    const find = names => {
      const el = supplied.find(el => names.includes(el.name.toLowerCase().replace(/[^a-z]/g, '')));
      return el?.value.trim() || '';
    };
    const summary = ['Website enquiry: ' + document.title, 'Page: ' + location.pathname, ''];
    for (const el of supplied) {
      if (!el.value.trim()) continue;
      const label = [...(el.labels || [])].map(label => label.textContent.trim()).join(' ').replace(/\s+/g, ' ') || el.name;
      const value = el.tagName === 'SELECT' ? el.selectedOptions[0]?.textContent.trim() : el.value.trim();
      summary.push(label + ': ' + value);
    }
    const url = new URL(enquiryForm);
    url.searchParams.set('usp', 'pp_url');
    const entries = {
      '46421530': find(['name']),
      '1146031004': find(['email', 'workemail']),
      '543494756': find(['company', 'companyname']),
      '2102511121': find(['phone', 'phonenumber']),
      '1736998422': find(['role', 'title', 'jobtitle']),
      '90690135': summary.join('\n')
    };
    for (const [id, value] of Object.entries(entries)) if (value) url.searchParams.set('entry.' + id, value);
    const feedback = form.querySelector('.form-feedback');
    if (url.href.length > 14000) {
      feedback.textContent = 'Your answers are too long for the review link. Please shorten the longer answers, or email swallis@indigotango.us. Your answers are still here and have not been sent.';
      feedback.tabIndex = -1;
      feedback.focus();
      return;
    }
    feedback.textContent = 'Opening Google Forms. Review your answers and select Submit to send your enquiry.';
    location.assign(url.href);
  });
});

const currentPath = location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('nav a').forEach(link => {
  if (new URL(link.href).pathname.replace(/\/$/, '') === (currentPath === '/' ? '' : currentPath)) link.setAttribute('aria-current', 'page');
});
