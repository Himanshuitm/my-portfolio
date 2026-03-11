/* ═══════════════════════════════════════════
   Himanshu Saini Portfolio — script.js
═══════════════════════════════════════════ */

/* ════ LOADER ════ */
const ldMsgs = ['LOADING MODULES...', 'PARSING JSON...', 'COMPILING ASSETS...', 'INJECTING STYLES...', 'READY!'];
let lp = 0;
const ldf = document.getElementById('ld-f');
const ldl = document.getElementById('ld-l');
const ldi = setInterval(() => {
  lp += Math.random() * 18 + 5;
  if (lp >= 100) {
    lp = 100;
    clearInterval(ldi);
    setTimeout(() => document.getElementById('loader').classList.add('gone'), 500);
  }
  ldf.style.width = Math.min(lp, 100) + '%';
  ldl.textContent = ldMsgs[Math.floor(Math.min(lp, 99) / 20)] || 'READY!';
}, 130);

/* ════ CURSOR ════ */
let mx = 0, my = 0, rx = 0, ry = 0;
const cd = document.getElementById('cur');
const cr = document.getElementById('cur-ring');

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cd.style.left = mx + 'px';
  cd.style.top = my + 'px';
});

(function raf() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  cr.style.left = rx + 'px';
  cr.style.top = ry + 'px';
  requestAnimationFrame(raf);
})();

document.querySelectorAll('a, button, .sk, .pc, .sb, .c-it, .chip').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-big'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-big'));
});

/* ════ MATRIX CANVAS ════ */
const cv = document.getElementById('mx');
const ctx = cv.getContext('2d');

function rsz() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
rsz();
window.addEventListener('resize', rsz);

const ch = '01アイウエオカキクケコサシスセソタチ';
let drops = [];

function initD() { drops = Array(Math.floor(cv.width / 18)).fill(1); }
initD();
window.addEventListener('resize', initD);

setInterval(() => {
  ctx.fillStyle = 'rgba(5,8,16,.055)';
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = '#00ff88';
  ctx.font = '13px Fira Code';
  drops.forEach((y, i) => {
    ctx.fillText(ch[Math.floor(Math.random() * ch.length)], i * 18, y * 18);
    if (y * 18 > cv.height && Math.random() > .975) drops[i] = 0;
    drops[i]++;
  });
}, 55);

/* ════ TYPEWRITER ════ */
const roles = ['Full Stack Developer', 'React.js Expert', 'Next.js Architect', 'Laravel Specialist', 'API Engineer', 'Creative Coder'];
let ri = 0, ci = 0, del = false;
const tw = document.getElementById('tw');

function typ() {
  const r = roles[ri];
  if (del) {
    tw.textContent = r.slice(0, --ci);
    if (!ci) { del = false; ri = (ri + 1) % roles.length; }
  } else {
    tw.textContent = r.slice(0, ++ci);
    if (ci === r.length) { setTimeout(() => { del = true; }, 1900); return; }
  }
  setTimeout(typ, del ? 40 : 90);
}
setTimeout(typ, 1400);

/* ════ LIVE CMD (hero terminal) ════ */
const lcC = ['git pull origin main', 'npm run dev', 'php artisan serve', 'redis-cli ping', './deploy.sh --prod'];
let lci2 = 0;
const lce = document.getElementById('lc');

function animLC() {
  const c = lcC[lci2 % lcC.length];
  let i = 0;
  lce.textContent = '';
  const t = setInterval(() => {
    lce.textContent = c.slice(0, ++i);
    if (i >= c.length) {
      clearInterval(t);
      setTimeout(() => { lci2++; animLC(); }, 2200);
    }
  }, 65);
}
setTimeout(animLC, 2200);

/* ════ PARALLAX ORBS ════ */
window.addEventListener('scroll', () => {
  const s = window.pageYOffset;
  document.querySelectorAll('.orb[data-spd]').forEach(o => {
    o.style.transform = `translateY(${s * +o.dataset.spd}px)`;
  });
}, { passive: true });

/* ════ SCROLL REVEAL ════ */
(() => {
  const obs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: .1 });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
})();

/* ════ TIMELINE SCROLL ANIMATION ════ */
(() => {
  const obs = new IntersectionObserver(es => {
    es.forEach((e, idx) => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('vis'), idx * 180);
    });
  }, { threshold: .18 });
  document.querySelectorAll('.tl-item').forEach(el => obs.observe(el));
})();

/* ════ COUNT UP ════ */
(() => {
  const obs = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-c]').forEach(el => {
          const end = +el.dataset.c, sf = el.dataset.s || '+';
          let c = 0;
          const step = () => {
            c = Math.min(c + Math.ceil(end / 25), end);
            el.textContent = c + sf;
            if (c < end) requestAnimationFrame(step);
          };
          step();
        });
      }
    });
  }, { threshold: .5 });
  document.querySelectorAll('.hstats, .stat-grid').forEach(el => obs.observe(el));
})();

/* ════ NAV ACTIVE HIGHLIGHT ════ */
const secs = document.querySelectorAll('section[id]');
const nls = document.querySelectorAll('.nav-ul a');

window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.pageYOffset >= s.offsetTop - 200) cur = s.id; });
  nls.forEach(l => l.classList.toggle('act', l.getAttribute('href') === '#' + cur));
}, { passive: true });

/* ════ HAMBURGER MENU ════ */
const ham = document.getElementById('ham');
const mob = document.getElementById('mobNav');

ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mob.classList.toggle('open');
});
mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open');
  mob.classList.remove('open');
}));

/* ════ SKILL FILTER → PROJECTS ════ */
let activeSkill = null;

document.querySelectorAll('.sk').forEach(sk => {
  sk.addEventListener('click', () => {
    const s = sk.dataset.s;
    if (activeSkill === s) { clearFilter(); return; }
    activeSkill = s;
    document.querySelectorAll('.sk').forEach(x => x.classList.remove('act'));
    sk.classList.add('act');

    let any = false;
    document.querySelectorAll('.pc').forEach(pc => {
      const match = (pc.dataset.t || '').toLowerCase().includes(s.toLowerCase());
      pc.classList.toggle('hide', !match);
      if (match) any = true;
    });

    document.getElementById('noProj').classList.toggle('show', !any);
    document.getElementById('sfi-t').textContent = `Filtering by: "${s}"`;
    document.getElementById('sfi').classList.add('show');
    setTimeout(() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' }), 220);
  });
});

function clearFilter() {
  activeSkill = null;
  document.querySelectorAll('.sk').forEach(x => x.classList.remove('act'));
  document.querySelectorAll('.pc').forEach(pc => pc.classList.remove('hide'));
  document.getElementById('noProj').classList.remove('show');
  document.getElementById('sfi').classList.remove('show');
}

/* ════ CONTACT FORM ════ */
const cForm = document.getElementById('cForm');
const cfMsg = document.getElementById('cfMsg');
const cfBtn = document.getElementById('cfBtn');

cForm.addEventListener('submit', async e => {
  e.preventDefault();
  cfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  cfBtn.disabled = true;
  try {
    const r = await fetch(cForm.action, { method: 'POST', body: new FormData(cForm) });
    if (r.ok) {
      cfMsg.textContent = "✅ Message sent! I'll get back soon.";
      cfMsg.className = 'cf-msg ok';
      cfMsg.style.display = 'block';
      cForm.reset();
    } else throw 0;
  } catch {
    cfMsg.textContent = '❌ Something went wrong. Please try again.';
    cfMsg.className = 'cf-msg err';
    cfMsg.style.display = 'block';
  } finally {
    cfBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    cfBtn.disabled = false;
    setTimeout(() => cfMsg.style.display = 'none', 5000);
  }
});

/* ════ CV DOWNLOAD ════ */
function downloadCV() {
  const btn = document.querySelector('.btn-p');
  const orig = btn.innerHTML;
  btn.disabled = true;
  const steps = [
    '<i class="fas fa-spinner fa-spin"></i> Connecting...',
    '<i class="fas fa-spinner fa-spin"></i> Fetching CV...',
    '<i class="fas fa-check"></i> Done!'
  ];
  let si = 0;
  const iv = setInterval(() => {
    if (si < steps.length) {
      btn.innerHTML = steps[si++];
    } else {
      clearInterval(iv);
      const a = document.createElement('a');
      a.href = 'assets/Himanshu_Saini_CV.pdf';
      a.download = 'Himanshu_Saini_CV.pdf';
      a.click();
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 900);
    }
  }, 700);
}

/* ════ SMOOTH SCROLL ════ */
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

/* ════════════════════════════════════════
   INTERACTIVE TERMINAL ENGINE
════════════════════════════════════════ */
const CMDS = {
  help: () => out([
    { g: '╔═══════════════════════════════════════════╗' },
    { g: '║  Himanshu\'s Interactive Terminal  v2.1   ║' },
    { g: '╚═══════════════════════════════════════════╝' },
    { v: '' },
    { gold: ' NAVIGATION' },
    { c: ' goto <section>    ' }, { v: '→ home | about | experience | projects | skills | contact' },
    { v: '' },
    { gold: ' INFO' },
    { c: ' whoami            ' }, { v: '→ About Himanshu' },
    { c: ' skills            ' }, { v: '→ List all skills' },
    { c: ' projects          ' }, { v: '→ List all projects' },
    { c: ' experience        ' }, { v: '→ Work history' },
    { c: ' education         ' }, { v: '→ Education background' },
    { c: ' contact           ' }, { v: '→ How to reach me' },
    { c: ' social            ' }, { v: '→ Social links' },
    { v: '' },
    { gold: ' ACTIONS' },
    { c: ' filter <skill>    ' }, { v: '→ Filter projects by skill (e.g. filter React.js)' },
    { c: ' open <project>    ' }, { v: '→ Jump to a project (e.g. open byoli)' },
    { c: ' hire              ' }, { v: '→ Why hire me? 🚀' },
    { c: ' secret            ' }, { v: '→ 🤫' },
    { c: ' clear             ' }, { v: '→ Clear terminal' },
    { v: '' },
    { dim: ' Tip: ↑↓ for history · Tab to autocomplete · Esc to close' },
  ]),

  whoami: () => out([
    { g: ' ██╗  ██╗███████╗' }, { g: ' ██║  ██║██╔════╝' }, { g: ' ███████║███████╗' },
    { g: ' ██╔══██║╚════██║' }, { g: ' ██║  ██║███████║' }, { g: ' ╚═╝  ╚═╝╚══════╝' },
    { v: '' },
    { c: ' Name:      ' }, { v: 'Himanshu Saini' },
    { c: ' Role:      ' }, { v: 'Full Stack Web Developer' },
    { c: ' Exp:       ' }, { v: '4+ years' },
    { c: ' Location:  ' }, { v: 'Dehradun, Uttarakhand 🇮🇳' },
    { c: ' Email:     ' }, { v: 'himanshusaini8518@gmail.com' },
    { c: ' Stack:     ' }, { v: 'React, Next.js, Laravel, MySQL, Redis' },
    { c: ' Hobbies:   ' }, { v: 'Photography, Poetry, Coding' },
    { v: '' },
    { gold: ' Status: ' }, { g: '🟢 Available for new opportunities' },
  ]),

  skills: () => out([
    { gold: ' FRONTEND' }, { g: '  React.js  Next.js  Tailwind CSS  JavaScript  HTML5/CSS3' }, { v: '' },
    { gold: ' BACKEND' }, { g: '  Laravel  PHP 8+  RESTful APIs  Redis  Flutter API Integration' }, { v: '' },
    { gold: ' DATABASE & DEVOPS' }, { g: '  MySQL  PostgreSQL  AWS Linux  Git/GitHub  Docker  Postman  Wix' }, { v: '' },
    { dim: ' Tip: type "filter React.js" to see matching projects' },
  ]),

  projects: () => out([
    { g: ' 5 projects found:' }, { v: '' },
    { c: ' 01. ' }, { v: 'Byoli.com Matrimonial       [React, Laravel, Redis, MySQL, Flutter API]' },
    { c: ' 02. ' }, { v: 'Jeeprep College Predictor   [Next.js, React, Laravel, MySQL]' },
    { c: ' 03. ' }, { v: 'Moonyoga & Samvedna         [React, Laravel, Wix Studio]' },
    { c: ' 04. ' }, { v: 'Billing System POS          [PHP, MySQL, JavaScript]' },
    { c: ' 05. ' }, { v: 'Book Marketplace            [PHP, MySQL, JavaScript]' }, { v: '' },
    { dim: ' Tip: "open byoli" or "filter Next.js" to explore' },
  ]),

  experience: () => out([
    { gold: ' WORK EXPERIENCE' }, { v: '' },
    { g: ' Hostcob Solutions Pvt Ltd' },
    { c: ' Role:     ' }, { v: 'Full Stack Web Developer' },
    { c: ' Period:   ' }, { v: 'Nov 2021 – Present (4+ years)' },
    { c: ' Location: ' }, { v: 'Dehradun, Uttarakhand' }, { v: '' },
    { v: ' ▸ React.js, Next.js, Laravel, MySQL, Redis stack' },
    { v: ' ▸ RESTful APIs architected for Flutter mobile apps' },
    { v: ' ▸ Redis caching + MySQL indexing for performance' },
    { v: ' ▸ Full SDLC: design → build → deploy on AWS Linux' },
    { v: ' ▸ Wix Studio & WordPress client projects' },
  ]),

  education: () => out([
    { gold: ' EDUCATION' }, { v: '' },
    { g: ' Bachelor of Computer Applications (BCA)' },
    { c: ' Institute: ' }, { v: 'ITM, Dehradun' },
    { c: ' Year:      ' }, { v: '2018 – 2021' }, { v: '' },
    { v: ' Core: Algorithms, Databases, Web Tech, Software Engineering' },
    { v: ' Languages: PHP, MySQL, HTML/CSS, JavaScript' },
  ]),

  contact: () => out([
    { gold: ' CONTACT' }, { v: '' },
    { c: ' Email:    ' }, { v: 'himanshusaini8518@gmail.com' },
    { c: ' Phone:    ' }, { v: '+91 9639290498' },
    { c: ' Location: ' }, { v: 'Dehradun, Uttarakhand, India' },
    { c: ' LinkedIn: ' }, { g: 'linkedin.com/in/himanshu-saini-25b036201' }, { v: '' },
    { dim: ' Type "goto contact" to open the contact form' },
  ]),

  social: () => out([
    { gold: ' SOCIAL' }, { v: '' },
    { c: ' LinkedIn: ' }, { g: 'linkedin.com/in/himanshu-saini-25b036201' },
    { c: ' Email:    ' }, { g: 'himanshusaini8518@gmail.com' },
    { c: ' Phone:    ' }, { g: '+91 9639290498' },
  ]),

  hire: () => out([
    { g: ' ██╗  ██╗██╗██████╗ ███████╗    ███╗   ███╗███████╗██╗' },
    { g: ' ██║  ██║██║██╔══██╗██╔════╝    ████╗ ████║██╔════╝██║' },
    { g: ' ███████║██║██████╔╝█████╗      ██╔████╔██║█████╗  ██║' },
    { g: ' ██╔══██║██║██╔══██╗██╔══╝      ██║╚██╔╝██║██╔══╝  ╚═╝' },
    { g: ' ██║  ██║██║██║  ██║███████╗    ██║ ╚═╝ ██║███████╗██╗' },
    { g: ' ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝╚══════╝╚═╝' }, { v: '' },
    { v: ' ✅  4+ years of production-level, shipped code' },
    { v: ' ✅  React + Next.js + Laravel — full spectrum' },
    { v: ' ✅  API architect for Flutter cross-platform apps' },
    { v: ' ✅  Redis + MySQL performance optimization expert' },
    { v: ' ✅  Full SDLC ownership — zero handholding needed' },
    { v: ' ✅  Creative eye from photography & design work' }, { v: '' },
    { gold: ' 👉 Email: himanshusaini8518@gmail.com' },
    { g: " Let's build something extraordinary together! 🚀" },
  ]),

  secret: () => out([
    { gold: ' 🤫 Secret unlocked!' }, { v: '' },
    { g: '  "Any sufficiently advanced technology is' },
    { g: '   indistinguishable from magic."' },
    { c: '                   — Arthur C. Clarke' }, { v: '' },
    { v: ' I write poetry too. Quite the contradiction, huh?' },
    { g: ' Konami code: ↑↑↓↓←→←→BA also works 🎮' },
  ]),
};

/* ── Terminal helpers ── */
function parseCmd(raw) {
  const parts = raw.trim().toLowerCase().split(/\s+/);
  const cmd = parts[0];
  const arg = parts.slice(1).join(' ');

  if (cmd === 'clear') { document.getElementById('ft-hist').innerHTML = ''; return; }

  const NAV = { home: '#hero', about: '#about', experience: '#experience', exp: '#experience', projects: '#projects', skills: '#skills', contact: '#contact' };

  if (cmd === 'goto' || cmd === 'go') {
    const t = NAV[arg];
    if (t) {
      addH(raw);
      out([{ g: ` Navigating to ${arg}...` }]);
      setTimeout(() => { closeTerm(); document.querySelector(t)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 400);
    } else {
      addH(raw);
      out([{ red: ` Unknown: "${arg}". Options: ${Object.keys(NAV).join(', ')}` }]);
    }
    return;
  }

  if (cmd === 'filter') {
    if (!arg) { addH(raw); out([{ red: ' Usage: filter <skill>  e.g. filter React.js' }]); return; }
    const all = Array.from(document.querySelectorAll('.sk')).map(s => s.dataset.s);
    const match = all.find(s => s.toLowerCase().includes(arg.toLowerCase()));
    if (match) {
      addH(raw);
      out([{ g: ` Filtering by "${match}"...` }, { dim: ' Scrolling to projects...' }]);
      document.querySelectorAll('.sk').forEach(x => x.classList.remove('act'));
      document.querySelector(`.sk[data-s="${match}"]`)?.classList.add('act');
      let any = false;
      document.querySelectorAll('.pc').forEach(pc => {
        const m = (pc.dataset.t || '').toLowerCase().includes(match.toLowerCase());
        pc.classList.toggle('hide', !m);
        if (m) any = true;
      });
      document.getElementById('noProj').classList.toggle('show', !any);
      document.getElementById('sfi-t').textContent = `Filtering: "${match}"`;
      document.getElementById('sfi').classList.add('show');
      activeSkill = match;
      setTimeout(() => { closeTerm(); document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 500);
    } else {
      addH(raw);
      out([{ red: ` Skill "${arg}" not found.` }, { dim: ` Available: ${all.join(', ')}` }]);
    }
    return;
  }

  if (cmd === 'open') {
    const m = { byoli: '#projects', jeeprep: '#projects', yoga: '#projects', book: '#projects', billing: '#projects' };
    const t = m[arg] || NAV[arg];
    addH(raw);
    if (t) {
      out([{ g: ` Opening ${arg}...` }]);
      setTimeout(() => { closeTerm(); document.querySelector(t)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 400);
    } else {
      out([{ red: ` Unknown target: "${arg}"` }]);
    }
    return;
  }

  if (CMDS[cmd]) { addH(raw); CMDS[cmd](); return; }

  addH(raw);
  out([{ red: ` Command not found: "${raw}"` }, { dim: ' Type "help" to see all commands.' }]);
}

let cmdH = [], hIdx = -1;

function addH(cmd) {
  const h = document.getElementById('ft-hist');
  const r = document.createElement('div');
  r.className = 'ft-row';
  r.innerHTML = `<span class="ft-pr">himanshu@portfolio</span><span class="ft-pr2">:~$&nbsp;</span><span class="ft-ct">${esc(cmd)}</span>`;
  h.appendChild(r);
  cmdH.unshift(cmd);
  hIdx = -1;
}

function out(lines) {
  const h = document.getElementById('ft-hist');
  lines.forEach(l => {
    const k = Object.keys(l)[0];
    const v = l[k] || '';
    const d = document.createElement('div');
    d.className = 'fo' + (k !== 'v' ? ' ' + k : '');
    d.innerHTML = esc(v) + '&nbsp;';
    h.appendChild(d);
  });
  const fb = document.getElementById('ft-body');
  fb.scrollTop = fb.scrollHeight;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function openTerm() {
  document.getElementById('fterm').classList.add('open');
  document.getElementById('ft-overlay').classList.add('open');
  setTimeout(() => document.getElementById('fti').focus(), 300);
  if (!document.getElementById('ft-hist').children.length) {
    out([
      { g: "Welcome to Himanshu's Interactive Terminal!" },
      { dim: 'Type "help" to see all available commands.' },
      { v: '' }
    ]);
  }
}

function closeTerm() {
  document.getElementById('fterm').classList.remove('open');
  document.getElementById('ft-overlay').classList.remove('open');
}

/* ── Terminal keyboard input ── */
const fti = document.getElementById('fti');

fti.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const v = fti.value.trim();
    if (v) { parseCmd(v); fti.value = ''; }
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (hIdx < cmdH.length - 1) { hIdx++; fti.value = cmdH[hIdx] || ''; }
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (hIdx > 0) { hIdx--; fti.value = cmdH[hIdx] || ''; }
    else { hIdx = -1; fti.value = ''; }
  }
  if (e.key === 'Tab') {
    e.preventDefault();
    const p = fti.value.toLowerCase();
    const m = Object.keys(CMDS).find(k => k.startsWith(p));
    if (m) fti.value = m;
  }
  if (e.key === 'Escape') closeTerm();
});

/* Click terminal body to focus input */
document.getElementById('ft-body').addEventListener('click', () => document.getElementById('fti').focus());

/* ════ DRAGGABLE TERMINAL ════ */
(() => {
  const el = document.getElementById('fterm');
  const bar = document.getElementById('ft-drag');
  let ox = 0, oy = 0, drag = false;

  bar.addEventListener('mousedown', e => {
    if (e.target.closest('.ft-close')) return;
    drag = true;
    const r = el.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    el.style.transition = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!drag) return;
    el.style.left = e.clientX - ox + 'px';
    el.style.top = e.clientY - oy + 'px';
    el.style.transform = 'none';
  });

  document.addEventListener('mouseup', () => {
    drag = false;
    el.style.transition = '';
  });
})();

/* ════ KONAMI CODE ════ */
let kc = [];
document.addEventListener('keydown', e => {
  kc.push(e.key);
  if (kc.length > 10) kc.shift();
  if (kc.join(',') === ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'].join(',')) {
    openTerm();
    out([
      { gold: '🎉 KONAMI CODE! Secret developer mode activated!' },
      { g: 'console.log("Hire me! 🚀")' },
      { dim: 'Try the "hire" command 👆' }
    ]);
    kc = [];
  }
});

/* ════ CONSOLE WELCOME ════ */
console.log(
  '%c\nHimanshu Saini — Full Stack Developer\nOpen the Terminal widget for an interactive experience!\nhimanshusaini8518@gmail.com\n',
  'color:#00ff88;font-family:monospace;font-size:13px'
);
