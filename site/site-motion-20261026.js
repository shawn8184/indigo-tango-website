(() => {
  'use strict';
  if (document.documentElement.dataset.motionLayer) return;
  document.documentElement.dataset.motionLayer = '20261026';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const active = new Set();
  const seen = new WeakSet();
  function play(element, frames, options) {
    if (reduced.matches || !element.animate || element.hidden) return;
    const animation = element.animate(frames, options);
    active.add(animation);
    const done = () => active.delete(animation);
    animation.onfinish = done;
    animation.oncancel = done;
  }
  function sync() {
    document.body.classList.toggle('motion-enhanced', !reduced.matches);
    if (reduced.matches) {
      active.forEach(animation => animation.cancel());
      active.clear();
    }
  }
  sync();
  reduced.addEventListener('change', sync);

  // No hidden starting state, so late scripts, deep links and JS failures stay readable.
  const targets = document.querySelectorAll('.section-heading,.feature-card,.benefit-card,.process-step,.about-grid,.insight-card,.faq-list,.footer-invitation,.services-hero,.service-offer,.services-outcome-grid article,.second-brain-heading,.brain-map,.brain-capabilities>article,.workflow-explorer,.document-section,.insights-intro,.insights-feature,.editorial-card,.contact-location,.assessment-form-intro');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const entering = entries.filter(entry => entry.isIntersecting);
      entering.forEach((entry, index) => {
        observer.unobserve(entry.target);
        if (seen.has(entry.target)) return;
        seen.add(entry.target);
        // Avoid combining a parent reveal with its already animated children.
        if (entry.target.querySelector('.feature-card,.benefit-card,.service-offer,.editorial-card')) return;
        play(entry.target, [{opacity:.58,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}], {
          duration:480,delay:Math.min(index,3)*65,easing:'cubic-bezier(.2,.7,.2,1)'
        });
      });
    }, {threshold:.08, rootMargin:'0px 0px -15px 0px'});
    targets.forEach(element => observer.observe(element));
    document.addEventListener('focusin', event => {
      active.forEach(animation => {
        if (animation.effect?.target?.contains(event.target)) animation.finish();
      });
    });
  }

  document.querySelectorAll('.document h1,.services-hero h1,.insights-intro h1').forEach(heading => {
    const accent = document.createElement('span');
    accent.className = 'motion-heading-accent';
    accent.setAttribute('aria-hidden','true');
    for (let i=0; i<4; i++) accent.append(document.createElement('i'));
    heading.after(accent);
    if (heading.getBoundingClientRect().top < innerHeight) {
      play(accent,[{opacity:.4,transform:'scaleX(.4)',transformOrigin:'left'},{opacity:1,transform:'scaleX(1)',transformOrigin:'left'}],{duration:650,easing:'ease-out'});
    }
  });

  // Keep effects off forms, maps, navigation and existing canvas/SVG motion controls.
  const surfaces = document.querySelectorAll('.feature-card,.benefit-card,.service-offer,.insight-card,.editorial-card,.services-outcome-grid article');
  surfaces.forEach(surface => {
    surface.classList.add('motion-surface');
    const glint = document.createElement('span');
    glint.className = 'motion-glint'; glint.setAttribute('aria-hidden','true');
    surface.append(glint);
    let frame=0, x=0, y=0;
    surface.addEventListener('pointermove',event=>{
      if(reduced.matches || !fine.matches || event.pointerType==='touch') return;
      const rect=surface.getBoundingClientRect(); x=event.clientX-rect.left; y=event.clientY-rect.top;
      if(!frame) frame=requestAnimationFrame(()=>{
        frame=0; surface.style.setProperty('--light-x',x+'px'); surface.style.setProperty('--light-y',y+'px');
      });
    },{passive:true});
    surface.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame); frame=0; surface.style.removeProperty('--light-x');surface.style.removeProperty('--light-y');});
  });
  document.querySelectorAll('.about-grid figure,.workflow-visual,.insights-feature .featured-image').forEach(visual=>{
    visual.classList.add('motion-visual');
    let frame=0, x=0, y=0;
    visual.addEventListener('pointermove',event=>{
      if(reduced.matches || !fine.matches || event.pointerType==='touch') return;
      const rect=visual.getBoundingClientRect();x=(event.clientX-rect.left)/rect.width-.5;y=(event.clientY-rect.top)/rect.height-.5;
      if(!frame) frame=requestAnimationFrame(()=>{
        frame=0;visual.style.setProperty('--tilt-x',(-y*3).toFixed(2)+'deg');visual.style.setProperty('--tilt-y',(x*3).toFixed(2)+'deg');
      });
    },{passive:true});
    visual.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);frame=0;visual.style.removeProperty('--tilt-x');visual.style.removeProperty('--tilt-y');});
  });
})();
