(() => {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.network-hero');
  const pauseButton = document.querySelector('.network-pause');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches, visible = true, raf = 0, last = 0, time = 0;
  let width = 0, height = 0, pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  const rows = 18, cols = 48;
  const points = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const u = i / cols * Math.PI * 2;
      const v = j / rows * Math.PI * 2;
      const jitter = Math.sin(i * 31.7 + j * 17.3) * .024;
      points.push({u: u + jitter, v: v + jitter, seed: Math.sin(i * 2.91 + j * 3.31)});
    }
  }
  const projected = points.map(() => ({x:0,y:0,z:0,light:0}));
  const stars = Array.from({length:78}, (_,i)=>({x:((i*37.731)%100)/100,y:((i*59.137)%100)/100,phase:i*1.73}));
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0,0,width,height);
    const mobile = width < 600;
    const cx = width * (mobile ? .55 : .76);
    const cy = height * (mobile ? .71 : .45);
    const size = mobile ? width * .58 : Math.min(width*.29,height*.49);
    const glow = ctx.createRadialGradient(cx,cy,0,cx,cy,size*1.7);
    glow.addColorStop(0,'rgba(0,194,209,.08)');glow.addColorStop(.5,'rgba(0,194,209,.045)');glow.addColorStop(1,'rgba(0,194,209,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    // A quiet background lattice ties the sculpture to the full hero.
    stars.forEach((a,i)=>{
      const ax=a.x*width, ay=a.y*height;
      for(let j=i+1;j<stars.length;j++){
        const b=stars[j], bx=b.x*width, by=b.y*height, distance=Math.hypot(ax-bx,ay-by);
        if(distance<140){ctx.strokeStyle=`rgba(77,151,163,${.085*(1-distance/140)})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();}
      }
      ctx.fillStyle=`rgba(64,187,198,${.14+(Math.sin(time*.5+a.phase)+1)*.08})`;ctx.beginPath();ctx.arc(ax,ay,1,0,Math.PI*2);ctx.fill();
    });
    const turn=time*.075 + pointerX*.15;
    const tilt=-.56 + Math.sin(time*.13)*.12 + pointerY*.12;
    const ct=Math.cos(turn),st=Math.sin(turn),cl=Math.cos(tilt),sl=Math.sin(tilt);
    points.forEach((p,index)=>{
      const wave=Math.sin(p.u*3+time*.43)*.04+Math.sin(p.v*2-time*.31)*.035;
      const radius=.64 + .24*Math.cos(p.v)+wave;
      let x=radius*Math.cos(p.u), y=radius*Math.sin(p.u), z=.24*Math.sin(p.v);
      const tx=x*ct-z*st,tz=x*st+z*ct; x=tx;z=tz;
      const ty=y*cl-z*sl;z=y*sl+z*cl;y=ty;
      // A diagonal orientation gives the connected mesh depth and an open center.
      const angle=-.48, rx=x*Math.cos(angle)-y*Math.sin(angle),ry=x*Math.sin(angle)+y*Math.cos(angle);
      const perspective=2.7/(2.7-z);
      const point=projected[index];point.x=cx+rx*size*perspective;point.y=cy+ry*size*perspective;point.z=z;
      point.light=.5+.5*Math.sin(p.u*2+p.v-time*.4);
    });
    ctx.lineWidth=.7;
    projected.forEach((p,index)=>{
      const i=Math.floor(index/rows),j=index%rows;
      const neighbors=[((i+1)%cols)*rows+j,i*rows+(j+1)%rows,((i+1)%cols)*rows+(j+1)%rows];
      neighbors.forEach((n,k)=>{
        const q=projected[n], front=(p.z+q.z+1.8)/3.6;
        ctx.strokeStyle=`rgba(${k===2?26:65},${k===2?155:207},${k===2?176:219},${.06+front*.3+p.light*.13})`;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
        if(k===2&&p.light>.91&&p.z>.05){ctx.fillStyle=`rgba(0,194,209,${(p.light-.91)*.5})`;const r=projected[i*rows+(j+1)%rows];ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineTo(r.x,r.y);ctx.fill();}
      });
      if(index%7===0){ctx.fillStyle=`rgba(139,247,250,${.13+(p.z+1)*.28})`;ctx.beginPath();ctx.arc(p.x,p.y,p.z>.2?1.55:1,0,Math.PI*2);ctx.fill();}
    });
    // Travelling highlights suggest information moving through connected systems.
    for(let i=0;i<7;i++){
      const a=(time*.035+i/7)*Math.PI*2;
      const index=(Math.floor(((a/(Math.PI*2))%1)*cols)*rows+Math.floor(i*2.4))%points.length;
      const p=projected[index];
      const halo=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,12);halo.addColorStop(0,'rgba(143,255,255,.8)');halo.addColorStop(.16,'rgba(0,210,225,.55)');halo.addColorStop(1,'rgba(0,194,209,0)');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(p.x,p.y,12,0,Math.PI*2);ctx.fill();
    }
  }
  function frame(now){
    raf=0;
    if(paused||!visible||document.hidden) return;
    if(now-last>=32){time+=Math.min((now-last)/1000,.06);last=now;pointerX+=(targetX-pointerX)*.035;pointerY+=(targetY-pointerY)*.035;draw();}
    raf=requestAnimationFrame(frame);
  }
  function sync(){
    cancelAnimationFrame(raf);raf=0;last=performance.now();
    pauseButton.setAttribute('aria-pressed',String(paused));
    pauseButton.innerHTML=paused?'Resume animation <span aria-hidden="true">▷</span>':'Pause animation <span aria-hidden="true">Ⅱ</span>';
    if(!paused&&visible&&!document.hidden&&ctx) raf=requestAnimationFrame(frame); else draw();
  }
  function resize(){
    const rect=hero.getBoundingClientRect();width=rect.width;height=rect.height;
    const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  if(ctx){
    new ResizeObserver(resize).observe(hero);resize();
    hero.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const r=hero.getBoundingClientRect();targetX=(event.clientX-r.left)/r.width-.5;targetY=(event.clientY-r.top)/r.height-.5;});
    hero.addEventListener('pointerleave',()=>{targetX=targetY=0;});
    if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(hero);
    document.addEventListener('visibilitychange',sync);
    preference.addEventListener('change',event=>{paused=event.matches;sync();});
    pauseButton.addEventListener('click',()=>{paused=!paused;sync();});sync();
  }else{canvas.parentElement.classList.add('canvas-unavailable');pauseButton.hidden=true;}
  if('IntersectionObserver'in window&&!preference.matches){
    const items=[...document.querySelectorAll('.section-heading,.feature-card,.benefit-card,.workflow-grid,.about-grid,.center-heading,.price-card,.insight-card,.faq-section,.footer-invitation')];
    items.forEach(el=>el.classList.add('home-reveal'));document.body.classList.add('home-motion');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.06});
    items.forEach(el=>observer.observe(el));
    document.addEventListener('focusin',event=>event.target.closest('.home-reveal')?.classList.add('in-view'));
    preference.addEventListener('change',event=>{if(event.matches){document.body.classList.remove('home-motion');observer.disconnect();}});
  }
})();
