/* ============================================================
   SCRIPT.JS — Mariana Ortega Sales Architect
   Rediseño 2026 · Paleta Teal #5CB6A4
   ============================================================ */

'use strict';

// ============================================================
// 0. ICONS
// ============================================================
lucide.createIcons();


// ============================================================
// 1. NAVBAR — scroll state
// ============================================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// ============================================================
// 2. MOBILE MENU
// ============================================================
(function initMobileMenu() {
  const burger   = document.getElementById('burger');
  const menu     = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-close');

  const open  = () => { menu.classList.add('open'); burger.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { menu.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = ''; };

  burger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  document.querySelectorAll('.m-link').forEach(el => el.addEventListener('click', close));
})();


// ============================================================
// 3. SCROLL REVEAL
// ============================================================
(function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || '0', 10);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();


// ============================================================
// 4. TYPEWRITER — hero accent line
// ============================================================
(function initTypewriter() {
  const el = document.getElementById('typewriter-line');
  if (!el) return;

  const phrases = [
    'no likes vacíos.',
    'no seguidores fantasma.',
    'no métricas de vanidad.',
    'clientes que pagan.',
  ];
  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;

  const tick = () => {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1) + (charIdx < current.length - 1 ? '|' : '');
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; loop(); }, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx) + '|';
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        charIdx = 0;
      }
    }
    loop();
  };

  const loop = () => setTimeout(tick, deleting ? 40 : 65);
  setTimeout(tick, 900);
})();


// ============================================================
// 5. STAT COUNTERS — animación count-up
// ============================================================
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const target  = parseInt(el.dataset.count, 10);
      const suffix  = el.dataset.suffix || '';
      const prefix  = el.dataset.prefix || '';
      let   current = 0;
      const step    = Math.max(1, Math.ceil(target / 70));
      const tick    = () => {
        current = Math.min(current + step, target);
        el.textContent = prefix + current + suffix;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      io.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(el => io.observe(el));
})();


// ============================================================
// 6. HERO — escena vectorial (marketing-capas)
// ============================================================
(function initHeroMarketingVector() {
  const stageWrap = document.getElementById('hero-stage-wrap');
  const sceneLayers = document.getElementById('hero-scene-layers');
  const sceneObjects = document.getElementById('hero-scene-objects');
  if (!stageWrap || !sceneLayers || !sceneObjects) return;

  const DESIGN_WIDTH = 810;
  const DESIGN_HEIGHT = 1012.49997;
  const CACHE_BUST = Date.now();
  const statusEl = document.getElementById('hero-vector-status');
  const layerNodeMap = new Map();
  const loopState = { active: false, observer: null, timers: [], animations: [] };

  const layerIds = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13];
  const layerConfig = layerIds.map((layerNo, index) => ({
    id: 'layer-' + layerNo,
    href: 'marketing-capas/' + layerNo + '.svg?v=' + CACHE_BUST,
    x: 0,
    y: 0,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    zIndex: index
  }));

  const objectConfig = [
    { id: 'flecha', type: 'rect', x: 296, y: 463, width: 180, height: 74 },
    { id: 'diana', type: 'circle', cx: 576, cy: 334, r: 92 }
  ];

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function svgEl(tag, attrs) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attrs).forEach(key => {
      node.setAttribute(key, String(attrs[key]));
    });
    return node;
  }

  function mountLayers() {
    const ordered = layerConfig.slice().sort((a, b) => a.zIndex - b.zIndex);
    ordered.forEach(layer => {
      const img = svgEl('image', {
        id: layer.id,
        'data-layer-id': layer.id,
        href: layer.href,
        x: layer.x,
        y: layer.y,
        width: layer.width,
        height: layer.height,
        preserveAspectRatio: 'xMidYMid meet'
      });
      sceneLayers.appendChild(img);
      layerNodeMap.set(layer.id, img);
    });
  }

  function mountObjects() {
    objectConfig.forEach(cfg => {
      const attrs = {
        id: 'obj-' + cfg.id,
        'data-object-id': cfg.id,
        class: 'obj-hit',
        'pointer-events': 'all'
      };
      let node;
      if (cfg.type === 'circle') {
        node = svgEl('circle', Object.assign(attrs, { cx: cfg.cx, cy: cfg.cy, r: cfg.r }));
      } else {
        node = svgEl('rect', Object.assign(attrs, { x: cfg.x, y: cfg.y, width: cfg.width, height: cfg.height, rx: 10 }));
      }
      sceneObjects.appendChild(node);
    });
  }

  function getObject(id) {
    return sceneObjects.querySelector('[data-object-id="' + id + '"]');
  }

  function setObjectState(id, active) {
    const node = getObject(id);
    if (!node) return false;
    node.classList.toggle('is-active', Boolean(active));
    return true;
  }

  function setObjectBounds(id, bounds) {
    const node = getObject(id);
    if (!node) return false;
    if (node.tagName === 'rect') {
      if (typeof bounds.x === 'number') node.setAttribute('x', bounds.x);
      if (typeof bounds.y === 'number') node.setAttribute('y', bounds.y);
      if (typeof bounds.width === 'number') node.setAttribute('width', bounds.width);
      if (typeof bounds.height === 'number') node.setAttribute('height', bounds.height);
    } else if (node.tagName === 'circle') {
      if (typeof bounds.cx === 'number') node.setAttribute('cx', bounds.cx);
      if (typeof bounds.cy === 'number') node.setAttribute('cy', bounds.cy);
      if (typeof bounds.r === 'number') node.setAttribute('r', bounds.r);
    }
    return true;
  }

  function clearLoops() {
    loopState.timers.forEach(timerId => window.clearInterval(timerId));
    loopState.timers = [];
    loopState.animations.forEach(animation => {
      if (animation && typeof animation.cancel === 'function') animation.cancel();
    });
    loopState.animations = [];
  }

  function trackAnimation(animation) {
    if (animation) loopState.animations.push(animation);
    return animation;
  }

  function animateFloatingIcons() {
    const floatingLayerIds = ['layer-3', 'layer-4', 'layer-5'];
    floatingLayerIds.forEach((layerId, index) => {
      const layerNode = layerNodeMap.get(layerId);
      if (!layerNode) return;
      const amplitude = 8 + index * 2;
      const duration = 2400 + index * 320;
      trackAnimation(
        layerNode.animate(
          [
            { transform: 'translate(0px,0px)' },
            { transform: 'translate(0px,' + -amplitude + 'px)', offset: 0.5 },
            { transform: 'translate(0px,0px)', offset: 1 }
          ],
          { duration, delay: index * 150, easing: 'ease-in-out', iterations: Infinity }
        )
      );
    });
  }

  function startLoops() {
    if (loopState.active) return;
    loopState.active = true;
    clearLoops();
    animateFloatingIcons();
    setStatus('Animación activa al estar en vista.');
  }

  function stopLoops() {
    if (!loopState.active) return;
    loopState.active = false;
    clearLoops();
    setStatus('Animación en pausa (fuera de vista).');
  }

  function bindOnViewObserver() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.42) {
          startLoops();
        } else {
          stopLoops();
        }
      });
    }, { threshold: [0, 0.42, 0.8] });
    observer.observe(stageWrap);
    loopState.observer = observer;
  }

  function playSequence(name) {
    if (name !== 'arrow-shot') return false;
    return true;
  }

  function bindInteractions() {
    sceneObjects.addEventListener('click', event => {
      const objectId = event.target && event.target.getAttribute('data-object-id');
      if (!objectId) return;
      setObjectState(objectId, !event.target.classList.contains('is-active'));
    });
  }

  mountLayers();
  mountObjects();
  bindInteractions();
  bindOnViewObserver();

  window.heroMarketingVector = {
    layerConfig,
    objectConfig,
    getObject,
    setObjectState,
    setObjectBounds,
    playSequence,
    startLoops,
    stopLoops,
    hideObjectOutlines() {
      sceneObjects.classList.add('is-hidden');
    },
    showObjectOutlines() {
      sceneObjects.classList.remove('is-hidden');
    }
  };

  setStatus('Ilustración lista. La animación se activa al entrar en vista.');
})();


// ============================================================
// 7. MOCKUP CAROUSELS
// ============================================================
const mobileCases = [
  {
    title: '@clinicadental_elite — +210% reservas en 60 días',
    imgBg:  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80',
    imgTop: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: '@estudio_reformas — Leads x3 en primer mes',
    imgBg:  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80',
    imgTop: 'https://images.unsplash.com/photo-1611162618758-6a4fd1258671?auto=format&fit=crop&w=400&q=80'
  }
];

const webCases = [
  {
    title: 'Despacho Abogados ML — Embudo de captación activo',
    link:   'abogados-ml.com',
    imgBg:  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1200&q=80',
    imgTop: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Inmobiliaria Premium — Web + CRM integrado',
    link:   'inmopremium.es',
    imgBg:  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    imgTop: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
  }
];

(function initCarousels() {
  let mobIdx = 0;
  const renderMob = () => {
    const c = mobileCases[mobIdx];
    document.getElementById('mob-bg-img').src  = c.imgBg;
    document.getElementById('mob-top-img').src = c.imgTop;
    document.getElementById('mob-title').textContent = c.title;
  };
  document.getElementById('mob-prev').addEventListener('click', () => { mobIdx = (mobIdx - 1 + mobileCases.length) % mobileCases.length; renderMob(); });
  document.getElementById('mob-next').addEventListener('click', () => { mobIdx = (mobIdx + 1) % mobileCases.length; renderMob(); });
  renderMob();

  let webIdx = 0;
  const renderWeb = () => {
    const c = webCases[webIdx];
    document.getElementById('web-bg-img').src  = c.imgBg;
    document.getElementById('web-top-img').src = c.imgTop;
    document.getElementById('web-title').textContent    = c.title;
    document.getElementById('web-link-text').textContent = c.link;
  };
  document.getElementById('web-prev').addEventListener('click', () => { webIdx = (webIdx - 1 + webCases.length) % webCases.length; renderWeb(); });
  document.getElementById('web-next').addEventListener('click', () => { webIdx = (webIdx + 1) % webCases.length; renderWeb(); });
  renderWeb();
})();


// ============================================================
// 8. MOCKUP MASK — mouse reveal effect
// ============================================================
(function initMaskEffect() {
  function applyMask(e, element, overlayId, size) {
    const rect = element.getBoundingClientRect();
    const x    = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y    = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const mask = `radial-gradient(circle ${size}px at ${x}px ${y}px, transparent 0%, black 100%)`;
    const ov   = document.getElementById(overlayId);
    if (ov) { ov.style.webkitMaskImage = mask; ov.style.maskImage = mask; }
  }
  function resetMask(overlayId) {
    const ov = document.getElementById(overlayId);
    if (ov) { ov.style.maskImage = 'none'; ov.style.webkitMaskImage = 'none'; }
  }

  const mobMock = document.getElementById('mobile-mockup');
  if (mobMock) {
    mobMock.addEventListener('mousemove',  e => applyMask(e, mobMock, 'mob-overlay', 100));
    mobMock.addEventListener('touchmove',  e => applyMask(e, mobMock, 'mob-overlay', 100));
    mobMock.addEventListener('mouseleave', () => resetMask('mob-overlay'));
    mobMock.addEventListener('touchend',   () => resetMask('mob-overlay'));
  }

  const webMock = document.getElementById('web-mockup');
  if (webMock) {
    webMock.addEventListener('mousemove',  e => applyMask(e, webMock, 'web-overlay', 160));
    webMock.addEventListener('touchmove',  e => applyMask(e, webMock, 'web-overlay', 160));
    webMock.addEventListener('mouseleave', () => resetMask('web-overlay'));
    webMock.addEventListener('touchend',   () => resetMask('web-overlay'));
  }
})();


// ============================================================
// 9. VIDEO CAROUSEL — Content Lab
// ============================================================
(function initVideos() {
  const videos = [
    { tag: 'VENTA',      title: 'Ad para Clínica Dental',    img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80' },
    { tag: 'AUTORIDAD',  title: '3 Errores en tu Despacho',  img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=400&q=80' },
    { tag: 'BRANDING',   title: 'Detrás de Escena',           img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80' },
    { tag: 'RETARGETING','title': 'Campaña Retargeting B2B',  img: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=400&q=80' },
    { tag: 'VIRAL',      title: 'Hook Psicológico #1',        img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80' }
  ];

  const container = document.getElementById('videos-container');
  if (!container) return;

  videos.forEach(v => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <img src="${v.img}" alt="${v.title}" loading="lazy">
      <div class="vid-gradient"></div>
      <div class="play-btn"><div><i data-lucide="play" fill="currentColor"></i></div></div>
      <div class="vid-info">
        <span class="vid-tag">${v.tag}</span>
        <h4>${v.title}</h4>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
})();


// ============================================================
// 10. FAQ ACCORDION
// ============================================================
(function initFaq() {
  const faqs = [
    {
      q: '¿Trabajas solo con negocios locales?',
      a: 'No. Aunque somos especialistas en marketing local, gestionamos estrategias para negocios en toda España y LATAM. El enfoque local es una metodología de conversión, no una limitación geográfica.'
    },
    {
      q: '¿En cuánto tiempo se ven los primeros resultados?',
      a: 'La infraestructura web y de automatización tarda 15–20 días en estar lista. Al lanzar campañas de pago, los primeros leads cualificados llegan en 48–72 horas.'
    },
    {
      q: '¿Tengo que grabar vídeos obligatoriamente?',
      a: 'No. Diseñamos estrategias adaptadas a tu situación y comodidad. Podemos trabajar con creatividades estáticas, UGC externo o campañas basadas exclusivamente en búsqueda y SEO local.'
    },
    {
      q: '¿Qué incluye exactamente la auditoría gratuita?',
      a: 'Análisis de tu posicionamiento web y en Google Maps, revisión de tus perfiles sociales, identificación de fugas de conversión y un plan de acción con estimación de ROI. Todo en un informe PDF entregado en 48h más una sesión de 30 min con Mariana.'
    },
    {
      q: '¿Cuál es el mínimo de inversión requerido?',
      a: 'Trabajamos con negocios que destinen mínimo 500€/mes en publicidad de pago. Por debajo de esa cifra, la optimización y los márgenes no justifican la estructura de servicios que ofrecemos.'
    },
    {
      q: '¿Qué pasa si no veo resultados en 90 días?',
      a: 'Ofrecemos garantía de ROI. Si en 90 días de trabajo conjunto no detectas un retorno positivo medible, te devolvemos el equivalente al trabajo realizado. Creemos tanto en nuestra metodología que asumimos el riesgo contigo.'
    }
  ];

  const container = document.getElementById('faq-container');
  if (!container) return;

  faqs.forEach(f => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    item.innerHTML = `
      <button class="faq-btn">
        <span>${f.q}</span>
        <i data-lucide="chevron-down" class="faq-icon"></i>
      </button>
      <div class="faq-answer">${f.a}</div>
    `;
    item.querySelector('.faq-btn').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
    container.appendChild(item);
  });
  lucide.createIcons();
})();


// ============================================================
// 11. CONTACT FORM
// ============================================================
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    btn.innerHTML = '✓ ¡Solicitud enviada! Te contactamos en 24h';
    btn.style.background = 'var(--teal-deep)';
    btn.style.cursor = 'default';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = 'Solicitar Sesión Gratuita <i data-lucide="arrow-up-right"></i>';
      lucide.createIcons();
      form.reset();
      btn.style.background = '';
      btn.style.cursor = '';
      btn.disabled = false;
    }, 4000);
  });
})();


// ============================================================
// 12. ACTIVE NAV LINKS on scroll
// ============================================================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          const active = a.getAttribute('href') === `#${id}`;
          a.style.color = active ? 'var(--teal)' : '';
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => io.observe(s));
})();


// ============================================================
// 13. PAIN ITEMS — staggered hover glow
// ============================================================
(function initPainItems() {
  document.querySelectorAll('.pain-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.05}s`;
  });
})();


// ============================================================
// 14. PROCESO STEPS — entrada escalonada
// ============================================================
(function initProcesoSteps() {
  const steps = document.querySelectorAll('.proceso-step');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      steps.forEach((step, i) => {
        setTimeout(() => {
          step.style.opacity    = '1';
          step.style.transform  = 'translateY(0)';
        }, i * 150);
      });
      io.disconnect();
    });
  }, { threshold: 0.2 });

  steps.forEach(step => {
    step.style.opacity   = '0';
    step.style.transform = 'translateY(30px)';
    step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const section = document.querySelector('.proceso-steps');
  if (section) io.observe(section);
})();


// ============================================================
// 15. PILAR CARDS — mouse tracking tilt
// ============================================================
(function initPilarTilt() {
  document.querySelectorAll('.pilar-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) scale(1.01) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


// ============================================================
// 16. TESTI CARDS — escalonada entrada
// ============================================================
(function initTestiCards() {
  const cards = document.querySelectorAll('.testi-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity    = '1';
          card.style.transform  = 'translateY(0)';
        }, i * 120);
      });
      io.disconnect();
    });
  }, { threshold: 0.15 });

  cards.forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  });

  const grid = document.querySelector('.testimonials-grid');
  if (grid) io.observe(grid);
})();
