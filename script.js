/* ===== PARTICLES ===== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
class Particle {
  constructor(){ this.reset(); }
  reset(){
    this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + .5; this.speedX = (Math.random()-.5)*.4; this.speedY = (Math.random()-.5)*.4;
    this.opacity = Math.random()*.5+.1; this.color = Math.random()>.5?'99,102,241':'139,92,246';
  }
  update(){ this.x+=this.speedX; this.y+=this.speedY; if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height) this.reset(); }
  draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fillStyle=`rgba(${this.color},${this.opacity})`; ctx.fill(); }
}
function initParticles(){ particles=[]; const n=Math.min(120,Math.floor(canvas.width*canvas.height/12000)); for(let i=0;i<n;i++) particles.push(new Particle()); }
function connectParticles(){
  for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++){
    const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, d=Math.sqrt(dx*dx+dy*dy);
    if(d<120){ ctx.beginPath(); ctx.strokeStyle=`rgba(99,102,241,${.08*(1-d/120)})`; ctx.lineWidth=.5; ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke(); }
  }
}
function animateParticles(){ ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw();}); connectParticles(); requestAnimationFrame(animateParticles); }
initParticles(); animateParticles();

/* ===== THEME ===== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
themeToggle.addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
  themeIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
});

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ===== ACTIVE NAV ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if(window.scrollY >= s.offsetTop - 130) cur = s.id; });
  navLinks.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === `#${cur}`); });
});

/* ===== REVEAL ===== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ===== SKILL BARS ===== */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.querySelectorAll('.bar-fill').forEach(b => b.style.width = b.dataset.w + '%'); });
}, { threshold: .3 });
const sb = document.querySelector('.skill-bars');
if(sb) barObs.observe(sb);

/* ===== COUNTERS ===== */
function animCount(el, target){
  const dec = target % 1 !== 0 ? 2 : 0;
  const dur = 2000; const start = performance.now();
  function tick(now){ const p = Math.min((now-start)/dur,1); const v = (1-Math.pow(1-p,3))*target; el.textContent = dec ? v.toFixed(dec) : Math.floor(v); if(p<1) requestAnimationFrame(tick); }
  requestAnimationFrame(tick);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.querySelectorAll('.snum').forEach(el => animCount(el, parseFloat(el.dataset.target))); cntObs.unobserve(e.target); } });
}, { threshold: .5 });
const hc = document.querySelector('.hero-card');
if(hc) cntObs.observe(hc);

/* ===== CURSOR GLOW ===== */
if(window.innerWidth > 768){
  const g = document.createElement('div');
  g.style.cssText = 'position:fixed;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,.05) 0%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:left .12s ease,top .12s ease;';
  document.body.appendChild(g);
  document.addEventListener('mousemove', e => { g.style.left = e.clientX+'px'; g.style.top = e.clientY+'px'; });
}

/* ===== IMAGE SLIDER INIT ===== */
function initSlider(container) {
  const slides = container.querySelectorAll('.img-slide');
  if(slides.length <= 1) return;
  const dotsWrap = container.querySelector('.slider-dots');
  let current = 0, timer = null;
  // build dots
  if(dotsWrap){
    slides.forEach((_,i) => {
      const d = document.createElement('span'); d.className = 'dot' + (i===0?' active':'');
      d.addEventListener('click', e => { e.stopPropagation(); goTo(i); });
      dotsWrap.appendChild(d);
    });
  }
  function goTo(n){
    slides[current].classList.remove('active');
    if(dotsWrap) dotsWrap.querySelectorAll('.dot')[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if(dotsWrap) dotsWrap.querySelectorAll('.dot')[current]?.classList.add('active');
  }
  function startAuto(){ timer = setInterval(() => goTo(current+1), 2000); }
  function stopAuto(){ clearInterval(timer); }
  container.addEventListener('mouseenter', startAuto);
  container.addEventListener('mouseleave', () => { stopAuto(); goTo(0); });
}

/* init all sliders */
document.querySelectorAll('.proj-overlay, .tl-overlay, .cert-overlay').forEach(initSlider);

/* ===== LIGHTBOX for cert/project images ===== */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCaption');
let lbImages = [], lbIndex = 0;

function openLightbox(imgs, idx, caption){
  lbImages = imgs; lbIndex = idx;
  lbImg.src = imgs[idx]; lbCap.textContent = caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){ lb.classList.remove('open'); document.body.style.overflow = ''; }
function lbGo(dir){ lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length; lbImg.src = lbImages[lbIndex]; }

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => lbGo(-1));
document.getElementById('lbNext').addEventListener('click', () => lbGo(1));
lb.addEventListener('click', e => { if(e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => {
  if(!lb.classList.contains('open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') lbGo(-1);
  if(e.key === 'ArrowRight') lbGo(1);
});

/* click cert cards to open lightbox */
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const imgs = [...card.querySelectorAll('.img-slide img')].map(i => i.src).filter(Boolean);
    if(imgs.length) openLightbox(imgs, 0, card.querySelector('p')?.textContent);
  });
});

/* ===== TOAST ===== */
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
function showToast(msg, duration = 4000){
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ===== CONTACT FORM — EmailJS ===== */
// To receive emails: go to emailjs.com, create a free account,
// add an Email Service, create a template, then replace the 3 values below.
const EMAILJS_SERVICE  = 'service_0yaq2eh';
const EMAILJS_TEMPLATE = 'template_p7hwh6d';
const EMAILJS_KEY      = 'q5ikh8IIVMo1Y5LeC';

document.getElementById('contactForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-msg').value.trim();

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;

  // If EmailJS is configured, use it; otherwise simulate
  if(EMAILJS_KEY !== 'YOUR_PUBLIC_KEY'){
    try {
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE,
        { from_name: name, from_email: email, subject, message },
        EMAILJS_KEY
      );
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
      showToast(`📬 New message from ${name} — check your inbox!`);
      this.reset();
    } catch(err){
      btn.innerHTML = '<i class="fas fa-times"></i> Failed — try email directly';
      btn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
    }
  } else {
    // Fallback: open mailto
    const mailto = `mailto:mahasribairavanathan@gmail.com?subject=${encodeURIComponent(subject||'Portfolio Contact')}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
    window.location.href = mailto;
    btn.innerHTML = '<i class="fas fa-check"></i> Opening email app…';
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
    showToast(`Opening your email app to send to Maha Sri!`);
  }

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.style.background = ''; btn.disabled = false;
  }, 4000);
});

/* ===== tl-card layout fix — push content below overlay ===== */
document.querySelectorAll('.tl-card').forEach(card => {
  const overlay = card.querySelector('.tl-overlay');
  const header  = card.querySelector('.tl-header');
  const ul      = card.querySelector('ul');
  const ref     = card.querySelector('.tl-ref');
  if(!overlay) return;
  // wrap content so overlay doesn't cover it
  const wrap = document.createElement('div');
  wrap.className = 'tl-content-wrap';
  if(header) wrap.appendChild(header);
  if(ul) wrap.appendChild(ul);
  if(ref) wrap.appendChild(ref);
  card.appendChild(wrap);
});
