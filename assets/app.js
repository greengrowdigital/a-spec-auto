// A-Spec Auto HQ — interactions

const scrollBar = document.querySelector('.scroll-progress');
if (scrollBar) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    scrollBar.style.width = pct + '%';
  }, { passive: true });
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal,.reveal-stagger,.clip-reveal,.split-line,.draw-path').forEach(el => io.observe(el));

// SVG path lengths — set --len for any path with class draw-path
document.querySelectorAll('.draw-path').forEach(p => {
  try {
    const len = p.getTotalLength ? p.getTotalLength() : 1000;
    p.style.setProperty('--len', len);
  } catch (_) {}
});

const menuBtn = document.getElementById('menuBtn');
const menuPanel = document.getElementById('menuPanel');
if (menuBtn && menuPanel) {
  menuBtn.addEventListener('click', () => menuPanel.classList.toggle('hidden'));
  menuPanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menuPanel.classList.add('hidden')));
}

const I18N_KEY = 'aspec-lang';
function applyLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en],[data-es]').forEach(el => {
    const v = el.getAttribute('data-' + lang);
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll('[data-en-html],[data-es-html]').forEach(el => {
    const v = el.getAttribute('data-' + lang + '-html');
    if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll('[data-en-placeholder],[data-es-placeholder]').forEach(el => {
    const v = el.getAttribute('data-' + lang + '-placeholder');
    if (v != null) el.setAttribute('placeholder', v);
  });
  document.querySelectorAll('.lang-toggle [data-lang]').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });
  try { localStorage.setItem(I18N_KEY, lang); } catch (_) {}
}
const savedLang = (() => { try { return localStorage.getItem(I18N_KEY); } catch (_) { return null; } })() || 'en';
applyLang(savedLang);
document.querySelectorAll('.lang-toggle [data-lang]').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.getAttribute('data-lang')));
});

// Quote modal
const quoteOpen = document.querySelectorAll('[data-open-quote]');
const quoteModal = document.getElementById('quoteModal');
const quoteClose = document.querySelectorAll('[data-close-quote]');
quoteOpen.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); if (quoteModal) quoteModal.classList.add('open'); }));
quoteClose.forEach(b => b.addEventListener('click', () => quoteModal && quoteModal.classList.remove('open')));
if (quoteModal) quoteModal.addEventListener('click', (e) => { if (e.target === quoteModal) quoteModal.classList.remove('open'); });

document.querySelectorAll('form[data-fake]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const out = form.querySelector('[data-form-result]');
    if (out) {
      const lang = document.documentElement.lang;
      out.textContent = lang === 'es'
        ? '> recibido · spec sheet enviado'
        : '> received · spec sheet sent';
      out.classList.remove('hidden');
    }
    form.reset();
  });
});

document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

// Animated counter
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counterIO.unobserve(e.target);
    const el = e.target;
    const target = parseFloat(el.getAttribute('data-count'));
    const decimals = (el.getAttribute('data-decimals') || '0') | 0;
    const dur = 1700;
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      const val = target * eased;
      el.textContent = decimals ? val.toFixed(decimals) : Math.round(val).toString();
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterIO.observe(c));

// Tachometer needle — sweep to target degrees on view
const tachos = document.querySelectorAll('[data-tacho]');
const tachoIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    tachoIO.unobserve(e.target);
    const wrap = e.target;
    const needle = wrap.querySelector('.tacho-needle');
    if (!needle) return;
    const target = parseFloat(wrap.getAttribute('data-tacho'));
    needle.style.transform = 'rotate(-130deg)';
    requestAnimationFrame(() => {
      setTimeout(() => {
        needle.style.transition = 'transform 2s cubic-bezier(.34,1.56,.64,1)';
        needle.style.transform = `rotate(${target}deg)`;
      }, 200);
    });
  });
}, { threshold: 0.35 });
tachos.forEach(t => tachoIO.observe(t));

// Parallax (subtle) on tagged elements
const parallaxEls = document.querySelectorAll('[data-parallax]');
if (parallaxEls.length) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
  }, { passive: true });
}

// Magnetic buttons
document.querySelectorAll('[data-magnet]').forEach(el => {
  const strength = 16;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});
