// A-Spec Auto HQ — interactions (no loader)

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
document.querySelectorAll('.reveal,.reveal-stagger,.clip-reveal,.split-line').forEach(el => io.observe(el));

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
        ? '> recibido · spec sheet enviado a tu email'
        : '> received · spec sheet sent to your email';
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
    const target = parseFloat(el.getAttribute('data-count'));
    const decimals = (el.getAttribute('data-decimals') || '0') | 0;
    const dur = 1600;
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

// Speedometer needle — sweep to target on view
const speedos = document.querySelectorAll('[data-speedo]');
const speedoIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    speedoIO.unobserve(e.target);
    const wrap = e.target;
    const needle = wrap.querySelector('.speedo-needle');
    if (!needle) return;
    const targetDeg = parseFloat(wrap.getAttribute('data-speedo'));
    // Idle position
    needle.style.transform = 'rotate(-120deg)';
    requestAnimationFrame(() => {
      setTimeout(() => {
        needle.style.transform = `rotate(${targetDeg}deg)`;
      }, 150);
    });
  });
}, { threshold: 0.4 });
speedos.forEach(s => speedoIO.observe(s));

// Hero parallax on hero image
const hero = document.querySelector('[data-parallax]');
if (hero) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      hero.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${1 + y * 0.0004})`;
    }
  }, { passive: true });
}

// Magnetic-button (small attraction to cursor)
document.querySelectorAll('[data-magnet]').forEach(el => {
  const strength = 18;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});
