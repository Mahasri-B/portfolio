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

/* ===== CONTACT FORM — EmailJS + Google Sheets ===== */
const EMAILJS_SERVICE  = 'service_0yaq2eh';
const EMAILJS_TEMPLATE = 'template_p7hwh6d';
const EMAILJS_KEY      = 'q5ikh8IIVMo1Y5LeC';
// Paste your Google Apps Script Web App URL below after setup
const SHEETS_URL = 'YOUR_GOOGLE_SCRIPT_URL';

emailjs.init(EMAILJS_KEY);

document.getElementById('contactForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-msg').value.trim();

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;

  try {
    // Send email via EmailJS
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE,
      { name, email, title: subject, message }
    );

    // Save to Google Sheets if URL is set
    if(SHEETS_URL !== 'YOUR_GOOGLE_SCRIPT_URL'){
      fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, date: new Date().toLocaleString() })
      });
    }

    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
    showToast(`📬 New message from ${name} — check your inbox!`);
    this.reset();
  } catch(err){
    btn.innerHTML = '<i class="fas fa-times"></i> Failed — try email directly';
    btn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
  }

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.style.background = ''; btn.disabled = false;
  }, 4000);
});

/* ===== tl-card layout — content always below overlay ===== */

/* ===== CHATBOT ===== */
const KB = {
  name: "Maha Sri B",
  email: "mahasribairavanathan@gmail.com",
  phone: "+91-9894330457",
  location: "Kalavasal, Madurai, India",
  linkedin: "linkedin.com/in/mahasri10",
  github: "github.com/Mahasri-B",
  education: [
    { degree: "B.Tech Computer Science & Engineering", college: "Kalasalingam Academy of Research and Education", period: "Sep 2022 – Present", grade: "CGPA: 8.52 / 10.00" },
    { degree: "Foreign Exchange Semester", college: "INTI International University, Malaysia", period: "Jan 2025 – May 2025", grade: "GPA: 3.30 / 4.00" }
  ],
  skills: ["Python", "TensorFlow", "PyTorch", "OpenCV", "Computer Vision", "NLP", "BERT", "LSTM", "React.js", "Flask", "Scikit-learn", "Pandas", "NumPy", "MySQL", "Google Colab"],
  projects: [
    { name: "RGB–Thermal Image Alignment & Overlay System", desc: "Aligned thermal images with RGB using OpenCV feature matching and homography. Deployed as Flask web app.", tags: "OpenCV, Flask, Python", date: "Dec 2025", link: "https://rgb-thermal-overlay.onrender.com/" },
    { name: "Bitcoin Transaction Anomaly Detection", desc: "Unsupervised ML system to detect anomalous Bitcoin transactions with live web interface.", tags: "ML, React, Python", date: "Nov–Dec 2025", link: "https://bitcoin-anamoly-detection.vercel.app/" },
    { name: "Stress Monitoring Cap", desc: "Wearable IoT device using ECG, EEG, GSR sensors with LSTM model and Blynk Cloud.", tags: "IoT, LSTM, ECG/EEG", date: "Jun–Dec 2024" },
    { name: "Multilingual Chatbot for Mental Support", desc: "Chatbot supporting 5+ languages using BERT-based NLP for sentiment analysis.", tags: "BERT, NLP, Python", date: "Jun–Dec 2024" },
    { name: "CTR Prediction", desc: "Predictive model for Click-Through Rate using ad campaign data and ML algorithms.", tags: "ML, Scikit-learn", date: "Dec 2023–May 2024" },
    { name: "UPI-Based Charging System", desc: "IoT mobile charging system with Arduino, GSM, and UPI payment verification.", tags: "IoT, Arduino, GSM", date: "Jun–Dec 2024" },
    { name: "Wayvo AI – Smart Travel Assistant for Tamil Nadu", desc: "Intelligent travel planning platform with route optimization, transport comparison, weather integration, and AI-based travel assistance.", tags: "LLM, API Integration, Geo-location, AI Navigation, Python", date: "2025" }
  ],
  experience: [
    { role: "Student Summer Intern – AI & Cybersecurity", company: "IEEE – NIT Silchar Subsection", period: "Jun–Aug 2024", desc: "Research on ChatGPT/GenAI in IoV systems, ML-based cybersecurity strategies, EV framework prototype." },
    { role: "Frontend Development Intern", company: "Unimity Solutions Pvt. Ltd.", period: "May–Jun 2024", desc: "Built responsive React.js interfaces, used React Hooks, worked in Agile sprints." },
    { role: "Web Development Intern", company: "CodeBind Technologies, Chennai", period: "Jun 2023", desc: "Full-stack web apps with HTML, CSS, PHP, MySQL." }
  ],
  certifications: [
    "The Complete Neural Networks Bootcamp",
    "Oracle Cloud Infrastructure 2023 AI Certified Foundations Associate",
    "2nd Prize – IEEE RAS Project Showcase (KARE)",
    "2nd Place – Brilliant Bharath Hackathon 2026 (Viksit Bharat)",
    "Former KARE IEEE CS Society & KARE ACM Web Developer (2024)",
    "Frontend Workshop for 50+ participants",
    "ACM Outreach Volunteer – Mentored 100+ government school students"
  ]
};

function getBotReply(input) {
  const q = input.toLowerCase();

  if(q.match(/hi|hello|hey|who are you|what are you/))
    return `Hi! 👋 I'm the portfolio assistant for <b>Maha Sri B</b> — an AI Enthusiast & ML/Data Science Explorer from Madurai, India. Ask me about her skills, projects, experience, or how to contact her!`;

  if(q.match(/name|who is|about her|about maha/))
    return `<b>Maha Sri B</b> is a final-year B.Tech CSE student at Kalasalingam Academy of Research and Education with a CGPA of 8.52. She's passionate about Computer Vision, Deep Learning, and IoT, and completed a foreign exchange semester at INTI International University, Malaysia.`;

  if(q.match(/education|study|college|university|degree|cgpa|gpa/))
    return KB.education.map(e => `🎓 <b>${e.degree}</b><br>${e.college}<br><i>${e.period} · ${e.grade}</i>`).join('<br><br>');

  if(q.match(/skill|know|tech|language|framework|tool/))
    return `💡 <b>Technical Skills:</b><br>${KB.skills.join(', ')}<br><br>Strong in Computer Vision, Deep Learning, NLP, and Full-Stack Development.`;

  if(q.match(/project|built|work|portfolio|wayvo|bitcoin|thermal|stress|chatbot|ctr|upi/)) {
    const match = KB.projects.find(p => q.includes(p.name.toLowerCase().split(' ')[0].toLowerCase()) || q.includes(p.tags.toLowerCase().split(',')[0].trim()));
    if(match) return `🚀 <b>${match.name}</b><br>${match.desc}<br><i>Tags: ${match.tags} · ${match.date}</i>${match.link ? `<br><a href="${match.link}" target="_blank" style="color:var(--accent)">→ Live Demo</a>` : ''}`;
    return `🚀 <b>Projects (${KB.projects.length}):</b><br>` + KB.projects.map(p => `• <b>${p.name}</b> (${p.date})`).join('<br>');
  }

  if(q.match(/experience|intern|work|job|ieee|unimity|codebind/)) {
    const match = KB.experience.find(e => q.includes(e.company.toLowerCase().split(' ')[0].toLowerCase()));
    if(match) return `💼 <b>${match.role}</b><br>${match.company} · ${match.period}<br>${match.desc}`;
    return `💼 <b>Experience:</b><br>` + KB.experience.map(e => `• <b>${e.role}</b> @ ${e.company} (${e.period})`).join('<br>');
  }

  if(q.match(/certif|award|achiev|prize|hackathon|oracle|neural|acm/))
    return `🏆 <b>Certifications & Awards:</b><br>` + KB.certifications.map(c => `• ${c}`).join('<br>');

  if(q.match(/contact|email|phone|reach|linkedin|github|location|where/))
    return `📬 <b>Contact Maha Sri:</b><br>📧 ${KB.email}<br>📞 ${KB.phone}<br>📍 ${KB.location}<br>🔗 <a href="https://${KB.linkedin}" target="_blank" style="color:var(--accent)">LinkedIn</a> · <a href="https://${KB.github}" target="_blank" style="color:var(--accent)">GitHub</a>`;

  if(q.match(/resume|cv|download/))
    return `📄 You can download Maha Sri's resume directly from the <b>Resume</b> button at the top of the page!`;

  if(q.match(/malaysia|exchange|inti|abroad/))
    return `✈️ Maha Sri completed a <b>Foreign Exchange Semester</b> at INTI International University, Malaysia (Jan–May 2025) with a GPA of 3.30/4.00.`;

  if(q.match(/wayvo|travel|tamil nadu|route|navigation/))
    return `🗺️ <b>Wayvo AI</b> is Maha Sri's latest project — an AI-powered smart travel assistant for Tamil Nadu. It features route optimization, transport comparison, weather integration, and LLM-based travel assistance. Built with Python, LLM Integration, Geo-location & Routing systems.`;

  return `🤔 I'm not sure about that. Try asking about:<br>• Skills & Technologies<br>• Projects<br>• Experience & Internships<br>• Education<br>• Certifications & Awards<br>• Contact details`;
}

// Chat UI logic
const chatBubble = document.getElementById('chatBubble');
const chatWindow = document.getElementById('chatWindow');
const chatClose  = document.getElementById('chatClose');
const chatInput  = document.getElementById('chatInput');
const chatSend   = document.getElementById('chatSend');
const chatMsgs   = document.getElementById('chatMessages');

chatBubble.addEventListener('click', () => {
  chatWindow.classList.toggle('open');
  if(chatWindow.classList.contains('open')) chatInput.focus();
});
chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

function addMsg(text, who) {
  const div = document.createElement('div');
  div.className = `chat-msg ${who}`;
  div.innerHTML = `<span>${text}</span>`;
  chatMsgs.appendChild(div);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'chat-msg bot chat-typing';
  div.id = 'typingIndicator';
  div.innerHTML = '<span>typing…</span>';
  chatMsgs.appendChild(div);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if(t) t.remove();
}

function askBot(question) {
  if(!chatWindow.classList.contains('open')) chatWindow.classList.add('open');
  addMsg(question, 'user');
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMsg(getBotReply(question), 'bot');
  }, 600);
}

function sendChat() {
  const val = chatInput.value.trim();
  if(!val) return;
  chatInput.value = '';
  askBot(val);
}

chatSend.addEventListener('click', sendChat);
chatInput.addEventListener('keydown', e => { if(e.key === 'Enter') sendChat(); });
