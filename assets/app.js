// A-Spec Auto HQ — interactions
window.addEventListener('load', () => {
  setTimeout(() => {
    const l = document.querySelector('.loader');
    if (l) l.classList.add('hidden');
  }, 1100);
});

// Loader readout (terminal-style)
const readout = document.querySelector('[data-readout]');
if (readout) {
  const lines = [
    '> init systems',
    '> calibrating dyno',
    '> loading specs',
    '> ready'
  ];
  let i = 0;
  const tick = () => {
    if (i < lines.length) {
      readout.textContent = lines[i++];
      setTimeout(tick, 240);
    }
  };
  tick();
}

const scrollBar = document.querySelector('.scroll-progress');
if (scrollBar) {
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    scrollBar.style.width = pct + '%';
  });
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal,.reveal-stagger').forEach(el => io.observe(el));

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

// Quote / Build estimate modal
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
        ? '> request received · spec sheet sent to your email'
        : '> request received · spec sheet sent to your email';
      out.classList.remove('hidden');
    }
    form.reset();
  });
});

document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

// Animated counter for dyno numbers
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counterIO.unobserve(e.target);
    const el = e.target;
    const target = parseInt(el.getAttribute('data-count'), 10);
    const dur = 1400;
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * eased).toString();
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterIO.observe(c));
