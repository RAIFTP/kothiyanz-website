/* Kothiyanz - Vanilla JS interactions
   Features: preloader, navbar behavior, mobile menu, scroll reveal, cursor, progress, particles, testimonial slider, lightbox
*/
(function(){
  'use strict';

  const preloader = document.getElementById('preloader');
  const heroVideo = document.getElementById('hero-video');
  const siteHeader = document.getElementById('site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const cursor = document.getElementById('cursor');
  const scrollProgress = document.getElementById('scroll-progress');
  const yearEl = document.getElementById('year');

  // Year
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Preloader handling
  function hidePreloader(){
    if(!preloader) return;
    preloader.setAttribute('aria-hidden','true');
  }

  window.addEventListener('load', function(){
    // ensure video fallback
    setTimeout(()=>{
      hidePreloader();
    }, 600);
  });

  // Video fallback: hide video if it cannot play
  if(heroVideo){
    let played = false;
    heroVideo.addEventListener('canplay', ()=>{
      played = true;
      heroVideo.style.opacity = '1';
    }, {once:true});
    heroVideo.addEventListener('error', ()=>{
      heroVideo.style.display = 'none';
    });
    // if not playable after a few seconds, hide
    setTimeout(()=>{ if(!played) heroVideo.style.display = 'none'; }, 2000);
  }

  // Header on scroll
  function onScroll(){
    const y = window.scrollY || window.pageYOffset;
    if(y > 32) siteHeader.classList.add('scrolled'); else siteHeader.classList.remove('scrolled');
    // progress
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    const pct = total>0 ? Math.min(100, Math.round((y/total)*100)) : 0;
    scrollProgress.style.width = pct + '%';
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Nav toggle for mobile
  navToggle.addEventListener('click', function(){
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href === '#') return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        // close mobile menu
        if(navMenu.classList.contains('open')){ navMenu.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); }
      }
    });
  });

  // IntersectionObserver reveal
  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          // if we want only once
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    reveals.forEach(r=>io.observe(r));
  } else {
    reveals.forEach(r=>r.classList.add('visible'));
  }

  // Custom cursor
  (function(){
    const dot = cursor.querySelector('.cursor-dot');
    let mouse = {x:window.innerWidth/2, y:window.innerHeight/2};
    let pos = {x:mouse.x, y:mouse.y};
    window.addEventListener('mousemove', e=>{ mouse.x = e.clientX; mouse.y = e.clientY; cursor.style.display = ''; });
    function render(){
      pos.x += (mouse.x - pos.x) * 0.18;
      pos.y += (mouse.y - pos.y) * 0.18;
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      requestAnimationFrame(render);
    }
    render();
    // Hide on touch
    window.addEventListener('touchstart', ()=> cursor.style.display = 'none');
  })();

  // Testimonial slider (simple)
  (function(){
    const track = document.querySelector('.testi-track');
    if(!track) return;
    const cards = track.children;
    let idx = 0;
    function update(){
      const w = cards[0].getBoundingClientRect().width + 20; // gap
      track.style.transform = `translateX(${-idx * w}px)`;
    }
    window.addEventListener('resize', update);
    setInterval(()=>{ idx = (idx + 1) % cards.length; update(); }, 4200);
    update();
  })();

  // Lightbox for gallery
  (function(){
    const grid = document.querySelector('.masonry-grid');
    if(!grid) return;
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:99999;opacity:0;visibility:hidden;transition:opacity .28s';
    const img = document.createElement('img');
    img.style.maxWidth = '90%'; img.style.maxHeight = '90%'; img.style.borderRadius='10px';
    overlay.appendChild(img);
    overlay.addEventListener('click', ()=>{ overlay.style.opacity='0'; overlay.style.visibility='hidden'; img.src=''; });
    document.body.appendChild(overlay);
    grid.querySelectorAll('img').forEach(i=>{
      i.style.cursor = 'zoom-in';
      i.addEventListener('click', ()=>{
        img.src = i.src; overlay.style.visibility='visible'; overlay.style.opacity='1';
      });
    });
  })();

  // Floating particles using canvas
  (function(){
    const canvas = document.createElement('canvas');
    canvas.style.position='fixed'; canvas.style.inset='0'; canvas.style.zIndex='1'; canvas.style.pointerEvents='none';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let w,h, particles=[];
    function resize(){ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }
    window.addEventListener('resize', resize); resize();
    function Particle(){ this.x = Math.random()*w; this.y=Math.random()*h; this.r= Math.random()*1.8+0.6; this.vy = 0.1+Math.random()*0.6; this.opacity = 0.05+Math.random()*0.12 }
    for(let i=0;i<60;i++) particles.push(new Particle());
    function draw(){ ctx.clearRect(0,0,w,h); for(const p of particles){ p.y -= p.vy; if(p.y < -10){ p.y = h + 10; p.x = Math.random()*w } ctx.beginPath(); ctx.fillStyle = `rgba(212,175,55,${p.opacity})`; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill() } requestAnimationFrame(draw); }
    draw();
  })();

})();
