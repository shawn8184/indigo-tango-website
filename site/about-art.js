(() => {
 const art=document.querySelector('.about-art');
 if(!art)return;
 const toggle=art.querySelector('.about-art-toggle');
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 const sync=()=>{art.classList.toggle('about-art-motion',!preference.matches);toggle.hidden=preference.matches;};
 sync();preference.addEventListener('change',sync);
 toggle.addEventListener('click',()=>{
  const paused=art.classList.toggle('about-art-paused');
  toggle.setAttribute('aria-label',paused?'Resume illustration animation':'Pause illustration animation');
  toggle.querySelector('.about-art-motion-label').textContent=paused?'Resume animation':'Pause animation';
  toggle.querySelector('[aria-hidden]').textContent=paused?'▶':'Ⅱ';
 });
 if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>art.classList.toggle('about-art-outside',!entries[0].isIntersecting),{threshold:0}).observe(art);
 }
})();
