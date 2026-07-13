/* Portfolio JS — theme toggle, typing effect, reveal animations, nav highlighting,
   carousel, filters, certificates search/filter, contact form validation + submission.
*/

(function(){
  const root = document.documentElement;
  const themeBtn = document.querySelector('.theme-toggle');

  function applyTheme(theme){
    if(theme === 'light') root.setAttribute('data-theme','light');
    else root.removeAttribute('data-theme');
  }

  // Theme init
  const saved = localStorage.getItem('theme');
  if(saved){ applyTheme(saved); }
  else {
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  }

  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  // Navbar: mobile toggle + active link
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('#primary-nav');

  navToggle?.addEventListener('click', () => {
    const open = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Close mobile nav on click link
  document.querySelectorAll('.primary-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if(primaryNav.classList.contains('is-open')){
        primaryNav.classList.remove('is-open');
        navToggle?.setAttribute('aria-expanded','false');
      }
    });
  });

  const current = (() => {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path.replace(/\.html$/,'');
  })();

  const activeMap = {
    'index':'home',
    'about':'about',
    'projects':'projects',
    'services':'services',
    'certificates':'certificates',
    'contact':'contact'
  };

  const activeKey = activeMap[current] || 'home';
  document.querySelectorAll('[data-page]').forEach(a => {
    if(a.getAttribute('data-page') === activeKey) a.classList.add('is-active');
  });

  // Footer year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Back to top
  const backToTop = document.querySelector('.back-to-top');
  function updateBackToTop(){
    if(!backToTop) return;
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });

  function prefersReducedMotion(){
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Reveal animations
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting) e.target.classList.add('is-visible');
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Stat counter animation
  const counters = document.querySelectorAll('[data-count]');
  if(counters.length && !prefersReducedMotion()){
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        if(el.dataset.animated) return;
        el.dataset.animated = 'true';

        const target = parseInt(el.dataset.count, 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        function tick(now){
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = prefix + current + suffix;
          if(progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.3 });
    counters.forEach(el => counterObs.observe(el));
  }

  // Typing effect (Home hero)
  const typingRoot = document.querySelector('.typing-text');
  const titles = ['Cybersecurity', 'Networking','IT Support', 'Web Development', 'UI/UX Design', 'System Administration'];
  let tIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function runTyping(){
    if(!typingRoot) return;
    if(prefersReducedMotion()){
      typingRoot.textContent = titles[0];
      return;
    }

    const speed = deleting ? 35 : 55;
    const pause = deleting ? 700 : 900;

    const tick = () => {
      const current = titles[tIndex];
      if(!deleting){
        charIndex++;
        typingRoot.textContent = current.slice(0, charIndex);
        if(charIndex >= current.length){
          deleting = true;
          setTimeout(tick, pause);
          return;
        }
      } else {
        charIndex--;
        typingRoot.textContent = current.slice(0, charIndex);
        if(charIndex <= 0){
          deleting = false;
          tIndex = (tIndex + 1) % titles.length;
          setTimeout(tick, 250);
          return;
        }
      }
      setTimeout(tick, speed);
    };

    tick();
  }
  runTyping();

  // Carousel (About)
  const carousel = document.querySelector('[data-carousel]');
  if(carousel){
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dotsWrap = carousel.querySelector('.carousel-dots');

    let idx = 0;
    const count = slides.length;

    function setActive(i){
      idx = (i + count) % count;
      slides.forEach((s, si) => s.classList.toggle('is-active', si === idx));
      const dotBtns = dotsWrap?.querySelectorAll('button');
      dotBtns?.forEach((b, bi) => b.setAttribute('aria-selected', String(bi === idx)));
    }

    function buildDots(){
      if(!dotsWrap) return;
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role','tab');
        b.setAttribute('aria-label', `Go to slide ${i+1}`);
        b.setAttribute('aria-selected', String(i === 0));
        b.addEventListener('click', () => setActive(i));
        dotsWrap.appendChild(b);
      });
    }

    buildDots();
    setActive(0);

    prevBtn?.addEventListener('click', () => setActive(idx - 1));
    nextBtn?.addEventListener('click', () => setActive(idx + 1));

    if(!prefersReducedMotion() && count > 1){
      setInterval(() => setActive(idx + 1), 5500);
    }
  }

  // Projects filter
  const projectsGrid = document.getElementById('projects-grid');
  const projectFilters = Array.from(document.querySelectorAll('[data-filter]'));
  if(projectsGrid && projectFilters.length){
    projectFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        projectFilters.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filter = btn.getAttribute('data-filter');
        const cards = Array.from(projectsGrid.querySelectorAll('.project-card'));
        cards.forEach(card => {
          const cat = card.getAttribute('data-category');
          const show = filter === 'all' || cat === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Certificates search + filter
  const certGrid = document.getElementById('cert-grid');
  const certSearch = document.getElementById('cert-search');
  const certFilterBtns = Array.from(document.querySelectorAll('[data-cert-filter]'));
  if(certGrid){
    let activeCertFilter = 'all';

    function normalize(s){ return String(s||'').toLowerCase().trim(); }

    function applyCerts(){
      const q = normalize(certSearch?.value);
      const cards = Array.from(certGrid.querySelectorAll('.cert-card'));

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const title = normalize(card.querySelector('h2')?.textContent);
        const showCat = activeCertFilter === 'all' || cat === activeCertFilter;
        const showQuery = !q || title.includes(q) || normalize(card.textContent).includes(q);
        const show = showCat && showQuery;
        card.style.display = show ? '' : 'none';
      });
    }

    certFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        certFilterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeCertFilter = btn.getAttribute('data-cert-filter') || 'all';
        applyCerts();
      });
    });

    certSearch?.addEventListener('input', () => applyCerts());
    applyCerts();
  }

  // Contact form validation
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('form-toast');
  if(contactForm){
    function setToast(kind, msg){
      if(!toast) return;
      toast.hidden = false;
      toast.classList.remove('is-success','is-error');
      toast.classList.add(kind === 'success' ? 'is-success' : 'is-error');
      toast.textContent = msg;
    }

    function clearErrors(){
      ['fullName','email','subject','message'].forEach(id => {
        const el = document.getElementById('err-' + id);
        if(el) el.textContent = '';
      });
    }

    function validate(){
      clearErrors();
      let ok = true;

      const fullName = document.getElementById('fullName');
      const email = document.getElementById('email');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');

      const fullNameVal = fullName.value.trim();
      if(fullNameVal.length < 2){
        document.getElementById('err-fullName').textContent = 'Please enter your full name.';
        ok = false;
      }

      const emailVal = email.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      if(!emailOk){
        document.getElementById('err-email').textContent = 'Please enter a valid email address.';
        ok = false;
      }

      const subjectVal = subject.value.trim();
      if(subjectVal.length < 3){
        document.getElementById('err-subject').textContent = 'Subject should be at least 3 characters.';
        ok = false;
      }

      const messageVal = message.value.trim();
      if(messageVal.length < 10){
        document.getElementById('err-message').textContent = 'Message should be at least 10 characters.';
        ok = false;
      }

      return ok;
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      setToast('error', '');

      if(!validate()){
        setToast('error', 'Please fix the highlighted fields and try again.');
        return;
      }

      const payload = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
      };

      // Formspree endpoint
      const FORM_SUBMIT_ENDPOINT = 'https://formspree.io/f/mpqnrlka';

      try{
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn && (submitBtn.disabled = true);
        setToast('error', 'Sending message...');

        // Formspree accepts application/json
        const res = await fetch(FORM_SUBMIT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if(!res.ok) throw new Error('Formspree submission failed');

        setToast('success', 'Message sent successfully. Thank you!');
        contactForm.reset();
      } catch(err){
        setToast('error', 'Message could not be delivered. Please try again later.');
      } finally {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn && (submitBtn.disabled = false);
      }
    });

  }

})();

