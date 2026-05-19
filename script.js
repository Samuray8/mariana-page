/* ============================================================
   SCRIPT.JS — Mariana Ortega Sales Architect
   Rediseño 2026 · Paleta Teal #5CB6A4
   ============================================================ */

'use strict';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

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

  const layerIds = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
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
// 6b. HERO — macropad 3D (Three.js, misma lógica que social.html)
// ============================================================
(function initHeroMacropad3D() {
  const wrap = document.getElementById('hero-stage-wrap');
  const canvas = document.getElementById('hero-macropad-canvas');
  const reactionsEl = document.getElementById('hero-macropad-reactions');
  const hintEl = document.querySelector('.hero-macropad-hint');
  if (!wrap || !canvas || !reactionsEl) return;

  Promise.all([
    import('three'),
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/controls/OrbitControls.js'),
    import('three/addons/environments/RoomEnvironment.js')
  ])
    .then(([THREE, { GLTFLoader }, { OrbitControls }, { RoomEnvironment }]) => {
      const LED_GRID = [
        0x32e875, 0x32e875, 0x32e875,
        0x3d6ee8, 0xf2f2f2, 0x5ee8ff,
        0x32e875, 0xf2f2f2, 0xff6e4f
      ];
      const ORTHO_FRUSTUM_PADDING = 0.84;
      const GLTF_ORTHO_CAMERA_INDEX = 0;

      let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 5000);
      let gltfOrthoFrustum = null;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.88;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      scene.background = null;

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new RoomEnvironment();
      scene.environment = pmrem.fromScene(envScene, 0.032).texture;
      pmrem.dispose();
      envScene.dispose();

      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enableZoom = false;
      controls.minZoom = 0.35;
      controls.maxZoom = 6;
      controls.minDistance = 0.5;
      controls.maxDistance = 200;

      const clock = new THREE.Clock();
      let mixer = null;
      let potNode = null;
      let gltfReady = false;

      function applyCanvasAspectToOrtho(cam, viewAspect) {
        if (!viewAspect || viewAspect <= 0) return;
        const w = cam.right - cam.left;
        const h = cam.top - cam.bottom;
        const cx = (cam.left + cam.right) / 2;
        const cy = (cam.top + cam.bottom) / 2;
        const frustumAspect = w / Math.max(h, 1e-8);
        if (frustumAspect > viewAspect) {
          const newH = w / viewAspect;
          cam.top = cy + newH / 2;
          cam.bottom = cy - newH / 2;
        } else {
          const newW = h * viewAspect;
          cam.left = cx - newW / 2;
          cam.right = cx + newW / 2;
        }
      }

      function padOrthoFrustum(cam, factor) {
        const cx = (cam.left + cam.right) / 2;
        const cy = (cam.top + cam.bottom) / 2;
        const hw = ((cam.right - cam.left) / 2) * factor;
        const hh = ((cam.top - cam.bottom) / 2) * factor;
        cam.left = cx - hw;
        cam.right = cx + hw;
        cam.top = cy + hh;
        cam.bottom = cy - hh;
      }

      function layoutRenderer() {
        const r = canvas.getBoundingClientRect();
        const cw = Math.max(1, Math.floor(r.width));
        const ch = Math.max(1, Math.floor(r.height));
        const pr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(pr);
        renderer.setSize(cw, ch, false);
        if (camera.isOrthographicCamera && gltfOrthoFrustum) {
          camera.left = gltfOrthoFrustum.left;
          camera.right = gltfOrthoFrustum.right;
          camera.top = gltfOrthoFrustum.top;
          camera.bottom = gltfOrthoFrustum.bottom;
          camera.near = gltfOrthoFrustum.near;
          camera.far = gltfOrthoFrustum.far;
          applyCanvasAspectToOrtho(camera, cw / ch);
          padOrthoFrustum(camera, ORTHO_FRUSTUM_PADDING);
          camera.updateProjectionMatrix();
        } else if (camera.isPerspectiveCamera) {
          camera.aspect = cw / ch;
          camera.updateProjectionMatrix();
        }
      }

      layoutRenderer();

      function removeGltfLights(root) {
        const lights = [];
        root.traverse(o => {
          if (o.isLight) lights.push(o);
        });
        lights.forEach(L => L.parent?.remove(L));
      }

      function isUnderNode(o, named) {
        let p = o;
        while (p) {
          if (p.name === named) return true;
          p = p.parent;
        }
        return false;
      }

      function findToucheRoot(o) {
        let p = o;
        let topTouche = null;
        while (p && p !== pickRoot) {
          if (/^Touche/i.test(p.name)) topTouche = p;
          p = p.parent;
        }
        if (!topTouche) return null;
        if (topTouche.parent && /^group$/i.test(topTouche.parent.name)) {
          return topTouche.parent;
        }
        return topTouche;
      }

      const TOUCHE_NAME_RE = /^Touche/i;
      const KEY_DOWN_MS = 150;
      const KEY_UP_MS = 200;
      const KEY_DEPTH_FACTOR = 0.2;
      const KEY_DEPTH_MIN_FR = 0.5;
      const KEY_DEPTH_MAX_FR = 0.5;

      const raycaster = new THREE.Raycaster();
      const pointerNdc = new THREE.Vector2();
      let pickRoot = null;
      const toucheList = [];
      const activeKeyPointers = new Map();

      const KEY_DEMO_SYMBOLS = ['❤️', '🔀'];
      const KEY_DEMO_DOWN_MS = 320;
      const KEY_DEMO_UP_MS = 420;
      const KEY_DEMO_HOLD_MS = 200;
      const KEY_DEMO_PAUSE_MS = 220;
      const KEY_DEMO_SPAWN_DELAY_MS = 245;
      const KEY_DEMO_INITIAL_DELAY_MS = 400;
      let keyDemoMainTimeoutId = null;
      let keyDemoSpawnTimeoutId = null;
      let keyDemoActive = false;

      function easeOutCubic(t) {
        return 1 - (1 - t) ** 3;
      }

      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      }

      function initToucheKeyInteraction(root) {
        pickRoot = root;
        toucheList.length = 0;
        root.updateMatrixWorld(true);
        const registered = new Set();
        root.traverse(o => {
          if (!TOUCHE_NAME_RE.test(o.name)) return;
          if (o.parent && TOUCHE_NAME_RE.test(o.parent.name)) return;
          const container = o.parent && /^group$/i.test(o.parent.name) ? o.parent : o;
          if (registered.has(container)) return;
          registered.add(container);
          const box = new THREE.Box3().setFromObject(container);
          const sz = box.getSize(new THREE.Vector3());
          const mn_world = Math.max(Math.min(sz.x, sz.y, sz.z), 1e-8);
          const _pws = new THREE.Vector3();
          (container.parent || container).matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), _pws);
          const invPS = 1.0 / Math.max(_pws.x, _pws.y, _pws.z, 1e-8);
          const mn = mn_world * invPS;
          const depth = THREE.MathUtils.clamp(mn * KEY_DEPTH_FACTOR, mn * KEY_DEPTH_MIN_FR, mn * KEY_DEPTH_MAX_FR);
          const pressDirParent = new THREE.Vector3(0, -1, 0).applyQuaternion(container.quaternion).normalize();
          container.userData.restPosition = container.position.clone();
          container.userData.pressDepth = depth;
          container.userData.pressDirParent = pressDirParent;
          container.userData.pointerCount = 0;
          container.userData.pressBlend = 0;
          container.userData.keyPressAnim = null;
          let symbol = '✦';
          container.traverse(child => {
            if (/heart/i.test(child.name)) symbol = '❤️';
            else if (/shuffle/i.test(child.name)) symbol = '🔀';
            else if (/chat.bubble/i.test(child.name)) symbol = '💬';
            else if (child.name === 'Text') symbol = '➕';
          });
          container.userData.symbol = symbol;
          toucheList.push(container);
        });
      }

      function stopKeyAutoDemo() {
        if (keyDemoMainTimeoutId !== null) {
          clearTimeout(keyDemoMainTimeoutId);
          keyDemoMainTimeoutId = null;
        }
        if (keyDemoSpawnTimeoutId !== null) {
          clearTimeout(keyDemoSpawnTimeoutId);
          keyDemoSpawnTimeoutId = null;
        }
        keyDemoActive = false;
        for (const k of toucheList) {
          k.userData.pointerCount = 0;
          syncKeyPressTarget(k);
        }
      }

      function startKeyAutoDemo() {
        const keys = KEY_DEMO_SYMBOLS.map(s => toucheList.find(t => t.userData.symbol === s)).filter(Boolean);
        if (keys.length === 0) return;
        keyDemoActive = true;
        let phase = 0;
        const demoMs = { downMs: KEY_DEMO_DOWN_MS, upMs: KEY_DEMO_UP_MS, ease: 'inOutCubic' };

        function runStep() {
          if (!keyDemoActive) return;
          const n = keys.length;
          const pairIndex = Math.floor(phase / 2) % n;
          const isDown = phase % 2 === 0;
          const k = keys[pairIndex];

          if (isDown) {
            k.userData.pointerCount += 1;
            syncKeyPressTarget(k, demoMs);
            if (keyDemoSpawnTimeoutId !== null) {
              clearTimeout(keyDemoSpawnTimeoutId);
              keyDemoSpawnTimeoutId = null;
            }
            keyDemoSpawnTimeoutId = setTimeout(() => {
              keyDemoSpawnTimeoutId = null;
              if (!keyDemoActive) return;
              spawnReaction(k.userData.symbol);
            }, KEY_DEMO_SPAWN_DELAY_MS);
          } else {
            k.userData.pointerCount = Math.max(0, k.userData.pointerCount - 1);
            syncKeyPressTarget(k, demoMs);
          }

          phase += 1;
          const waitMs = isDown ? KEY_DEMO_DOWN_MS + KEY_DEMO_HOLD_MS : KEY_DEMO_UP_MS + KEY_DEMO_PAUSE_MS;
          keyDemoMainTimeoutId = setTimeout(runStep, waitMs);
        }

        keyDemoMainTimeoutId = setTimeout(runStep, KEY_DEMO_INITIAL_DELAY_MS);
      }

      function syncKeyPressTarget(touche, opts) {
        const ud = touche.userData;
        const want = ud.pointerCount > 0 ? 1 : 0;
        const downMs = opts?.downMs ?? KEY_DOWN_MS;
        const upMs = opts?.upMs ?? KEY_UP_MS;
        const ease = opts?.ease ?? 'outCubic';
        if (Math.abs(ud.pressBlend - want) < 1e-5 && !ud.keyPressAnim) return;
        ud.keyPressAnim = {
          t0: performance.now(),
          dur: want > ud.pressBlend - 1e-5 ? downMs : upMs,
          b0: ud.pressBlend,
          b1: want,
          ease
        };
      }

      function updateToucheKeyPresses() {
        const now = performance.now();
        for (const key of toucheList) {
          const ud = key.userData;
          const anim = ud.keyPressAnim;
          if (anim) {
            const u = Math.min(1, (now - anim.t0) / anim.dur);
            const easeFn = anim.ease === 'inOutCubic' ? easeInOutCubic : easeOutCubic;
            const kk = easeFn(u);
            ud.pressBlend = anim.b0 + (anim.b1 - anim.b0) * kk;
            if (u >= 1) {
              ud.pressBlend = anim.b1;
              ud.keyPressAnim = null;
            }
          }
          key.position.copy(ud.restPosition).addScaledVector(ud.pressDirParent, ud.pressDepth * ud.pressBlend);
        }
      }

      const REACTION_CONE_HALF_DEG = 38;
      const REACTION_MIN_UP_PX = 55;
      const REACTION_MAX_UP_PX = 130;

      function spawnReaction(symbol) {
        if (!potNode || !reactionsEl) return;
        potNode.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        camera.updateProjectionMatrix();
        const potBox = new THREE.Box3().setFromObject(potNode);
        const cx = (potBox.min.x + potBox.max.x) / 2;
        const cz = (potBox.min.z + potBox.max.z) / 2;
        const halfW = (potBox.max.x - potBox.min.x) / 2;
        const halfD = (potBox.max.z - potBox.min.z) / 2;
        const rMax = Math.max(1e-6, Math.min(halfW, halfD) * 0.42);
        const diskU = Math.sqrt(Math.random());
        const diskA = Math.random() * Math.PI * 2;
        const topWorld = new THREE.Vector3(
          cx + Math.cos(diskA) * rMax * diskU,
          potBox.max.y,
          cz + Math.sin(diskA) * rMax * diskU
        );
        topWorld.project(camera);
        const rect = canvas.getBoundingClientRect();
        const rr = reactionsEl.getBoundingClientRect();
        const sx = ((topWorld.x + 1) / 2) * rect.width + rect.left - rr.left;
        const sy = ((-topWorld.y + 1) / 2) * rect.height + rect.top - rr.top;
        const el = document.createElement('span');
        el.className = 'rp';
        el.textContent = symbol;
        el.style.left = `${sx}px`;
        el.style.top = `${sy}px`;
        const hUp = REACTION_MIN_UP_PX + Math.random() * (REACTION_MAX_UP_PX - REACTION_MIN_UP_PX);
        const tanCone = Math.tan((REACTION_CONE_HALF_DEG * Math.PI) / 180);
        const maxSide = hUp * tanCone;
        el.style.setProperty('--fly-x', `${((Math.random() * 2 - 1) * maxSide).toFixed(2)}px`);
        el.style.setProperty('--fly-y', `${(-hUp).toFixed(2)}px`);
        reactionsEl.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
      }

      function setPointerNdcFromEvent(ev) {
        const rect = canvas.getBoundingClientRect();
        const w = Math.max(rect.width, 1);
        const h = Math.max(rect.height, 1);
        pointerNdc.x = ((ev.clientX - rect.left) / w) * 2 - 1;
        pointerNdc.y = -((ev.clientY - rect.top) / h) * 2 + 1;
      }

      const _pickCenter = new THREE.Vector3();

      function pickToucheByNdcProximity(ndc) {
        let best = null;
        let bestD = Infinity;
        const thresh = 0.09;
        for (let i = 0; i < toucheList.length; i++) {
          const t = toucheList[i];
          t.updateMatrixWorld(true);
          new THREE.Box3().setFromObject(t).getCenter(_pickCenter);
          _pickCenter.project(camera);
          if (Math.abs(_pickCenter.z) > 1.02) continue;
          const dx = _pickCenter.x - ndc.x;
          const dy = _pickCenter.y - ndc.y;
          const d = Math.hypot(dx, dy);
          if (d < thresh && d < bestD) {
            bestD = d;
            best = t;
          }
        }
        return best;
      }

      function pickToucheFromPointerEvent(ev) {
        if (!pickRoot || toucheList.length === 0) return null;
        setPointerNdcFromEvent(ev);
        camera.updateMatrixWorld(true);
        camera.updateProjectionMatrix();
        pickRoot.updateMatrixWorld(true);
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObject(pickRoot, true);
        for (let i = 0; i < hits.length; i++) {
          const t = findToucheRoot(hits[i].object);
          if (t) return t;
        }
        return pickToucheByNdcProximity(pointerNdc);
      }

      const CURSOR_PICK_THROTTLE_MS = 72;
      let lastCursorPickT = 0;
      let lastCursorOverKey = false;

      function updateCanvasCursorFromPointer(ev) {
        if (!pickRoot || toucheList.length === 0) return;
        if (activeKeyPointers.size > 0) return;
        if (ev.pointerType !== 'mouse') return;
        const now = performance.now();
        if (now - lastCursorPickT < CURSOR_PICK_THROTTLE_MS) return;
        lastCursorPickT = now;
        const touche = pickToucheFromPointerEvent(ev);
        const overKey = !!touche;
        if (overKey === lastCursorOverKey) return;
        lastCursorOverKey = overKey;
        canvas.style.cursor = overKey ? 'pointer' : 'grab';
      }

      function onCanvasPointerDown(ev) {
        if (ev.button !== 0 && ev.pointerType === 'mouse') return;
        const touche = pickToucheFromPointerEvent(ev);
        if (!touche) return;
        if (keyDemoActive) stopKeyAutoDemo();
        ev.preventDefault();
        ev.stopImmediatePropagation();
        try {
          canvas.setPointerCapture(ev.pointerId);
        } catch (_) {
          /* ignore */
        }
        activeKeyPointers.set(ev.pointerId, touche);
        touche.userData.pointerCount += 1;
        controls.enabled = false;
        syncKeyPressTarget(touche);
        spawnReaction(touche.userData.symbol);
      }

      function onWindowPointerUpOrCancel(ev) {
        const touche = activeKeyPointers.get(ev.pointerId);
        if (!touche) return;
        activeKeyPointers.delete(ev.pointerId);
        try {
          canvas.releasePointerCapture(ev.pointerId);
        } catch (_) {
          /* ignore */
        }
        touche.userData.pointerCount = Math.max(0, touche.userData.pointerCount - 1);
        syncKeyPressTarget(touche);
        if (activeKeyPointers.size === 0) controls.enabled = true;
      }

      canvas.addEventListener('pointerdown', onCanvasPointerDown, { capture: true });
      canvas.addEventListener('pointermove', updateCanvasCursorFromPointer, { passive: true });
      canvas.addEventListener('pointerleave', () => {
        lastCursorOverKey = false;
        lastCursorPickT = 0;
        canvas.style.cursor = 'grab';
      });
      window.addEventListener('pointerup', onWindowPointerUpOrCancel);
      window.addEventListener('pointercancel', onWindowPointerUpOrCancel);

      function isUnderNodeFlex(o, prefix) {
        let p = o;
        while (p) {
          if (p.name.startsWith(prefix)) return true;
          p = p.parent;
        }
        return false;
      }

      function isUnderLeds(o, leds) {
        if (!leds) return false;
        let p = o;
        while (p) {
          if (p === leds) return true;
          p = p.parent;
        }
        return false;
      }

      function setMeshMaterial(mesh, spec) {
        const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const mats = list.map(
          () =>
            new THREE.MeshStandardMaterial({
              color: spec.color,
              emissive: spec.emissive ?? 0x000000,
              emissiveIntensity: spec.emissiveIntensity ?? 0,
              metalness: spec.metalness,
              roughness: spec.roughness,
              envMapIntensity: spec.envMapIntensity ?? 0.6,
              side: spec.side ?? THREE.FrontSide,
              polygonOffset: spec.polygonOffset ?? false,
              polygonOffsetFactor: spec.polygonOffsetFactor ?? 0,
              polygonOffsetUnits: spec.polygonOffsetUnits ?? 0
            })
        );
        list.forEach(m => m.dispose?.());
        mesh.material = mats.length === 1 ? mats[0] : mats;
      }

      function collectOrthoCameras(root) {
        const list = [];
        root.traverse(o => {
          if (o.isOrthographicCamera) list.push(o);
        });
        return list;
      }

      function pickGltfOrthoCamera(root) {
        const all = collectOrthoCameras(root);
        if (!all.length) return null;
        if (GLTF_ORTHO_CAMERA_INDEX === 1 && all.length > 1) return all[1];
        const named = all.find(c => c.parent?.name === 'Camera');
        return named ?? all[0];
      }

      function applyMacropadMaterials(root) {
        const leds = root.getObjectByName('LEDS');
        const alu = { color: 0x464449, metalness: 0.42, roughness: 0.64, envMapIntensity: 0.32 };
        const aluScrew = { color: 0xc8ccd2, metalness: 0.52, roughness: 0.44, envMapIntensity: 0.38 };
        const darkPlate = {
          color: 0x9a9a98,
          emissive: 0x18161a,
          emissiveIntensity: 0.055,
          metalness: 0.02,
          roughness: 0.98,
          envMapIntensity: 0.035
        };
        const keyWhite = { color: 0xd0d0d0, metalness: 0, roughness: 0.93, envMapIntensity: 0.055 };
        const iconRed = {
          color: 0xe81d1d,
          emissive: 0x480808,
          emissiveIntensity: 0.045,
          metalness: 0,
          roughness: 0.92,
          envMapIntensity: 0,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1
        };
        const iconBlack = {
          color: 0x09090b,
          emissive: 0x000000,
          emissiveIntensity: 0,
          metalness: 0,
          roughness: 0.98,
          envMapIntensity: 0,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1
        };
        const followText = {
          color: 0x09090b,
          metalness: 0,
          roughness: 0.97,
          envMapIntensity: 0,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1
        };

        root.traverse(o => {
          if (!o.isMesh) return;
          if (isUnderLeds(o, leds)) return;
          const n = o.name;
          if (n === 'Base') {
            setMeshMaterial(o, alu);
            return;
          }
          if (n === 'Base_2') {
            setMeshMaterial(o, darkPlate);
            return;
          }
          if (n.startsWith('Vis')) {
            setMeshMaterial(o, aluScrew);
            return;
          }
          if (n === 'Text') {
            setMeshMaterial(o, followText);
            return;
          }
          if (isUnderNodeFlex(o, 'heart')) {
            setMeshMaterial(o, iconRed);
            return;
          }
          if (isUnderNode(o, 'shuffle')) {
            setMeshMaterial(o, iconBlack);
            return;
          }
          if (isUnderNode(o, 'chat-bubble-empty-solid')) {
            setMeshMaterial(o, iconBlack);
            return;
          }
          if (isUnderNode(o, 'Pot')) {
            return;
          }
          if (n === 'Cube' || n.startsWith('Cube_')) {
            setMeshMaterial(o, keyWhite);
            return;
          }
          setMeshMaterial(o, {
            color: 0x000000,
            metalness: 0.12,
            roughness: 0.78,
            envMapIntensity: 0.14
          });
        });

        function orderLedCells(ledsGroup) {
          const kids = [...ledsGroup.children];
          const items = kids.map(child => {
            child.updateMatrixWorld(true);
            const b = new THREE.Box3().setFromObject(child);
            const c = b.getCenter(new THREE.Vector3());
            return { child, c };
          });
          if (items.length !== 9) return kids;
          const span = key => Math.max(...items.map(i => i.c[key])) - Math.min(...items.map(i => i.c[key]));
          const axes = [
            { key: 'x', s: span('x') },
            { key: 'y', s: span('y') },
            { key: 'z', s: span('z') }
          ].sort((a, b) => b.s - a.s);
          const rowKey = axes[0].key;
          const colKey = axes[1].key;
          const rowVals = items.map(i => i.c[rowKey]);
          const rowMin = Math.min(...rowVals);
          const rowMax = Math.max(...rowVals);
          const rowSpan = rowMax - rowMin;
          const rowBand = rowSpan / 3;
          function rowIndex(c) {
            if (rowBand < 1e-8) return 0;
            const t = (rowMax - c[rowKey]) / rowBand;
            return Math.min(2, Math.max(0, Math.floor(t + 1e-5)));
          }
          items.sort((a, b) => {
            const ra = rowIndex(a.c);
            const rb = rowIndex(b.c);
            if (ra !== rb) return ra - rb;
            return a.c[colKey] - b.c[colKey];
          });
          return items.map(i => i.child);
        }

        if (leds && leds.children.length) {
          const cells = orderLedCells(leds);
          cells.forEach((cell, i) => {
            const hex = LED_GRID[i % LED_GRID.length];
            cell.traverse(o => {
              if (!o.isMesh) return;
              setMeshMaterial(o, {
                color: hex,
                emissive: hex,
                emissiveIntensity: 0.5,
                metalness: 0,
                roughness: 1,
                envMapIntensity: 0.04
              });
            });
          });
        }

        const pot = root.getObjectByName('Pot');
        if (pot) {
          const ellipses = [];
          pot.traverse(o => {
            if (!o.isMesh) return;
            if (o.name === 'Cylinder') {
              setMeshMaterial(o, keyWhite);
            } else if (o.name === 'Ellipse') {
              o.updateMatrixWorld(true);
              o.geometry?.computeBoundingSphere();
              const rad = o.geometry?.boundingSphere?.radius ?? 1;
              ellipses.push({ mesh: o, r: rad });
            }
          });
          ellipses.sort((a, b) => a.r - b.r);
          ellipses.forEach((e, idx) => {
            const isDot = ellipses.length > 1 && idx === 0;
            if (isDot) {
              setMeshMaterial(e.mesh, {
                color: 0x0a0a0c,
                metalness: 0,
                roughness: 0.95,
                envMapIntensity: 0
              });
            } else {
              setMeshMaterial(e.mesh, keyWhite);
            }
          });
        }
      }

      function addKeyLights(center, size, root) {
        const extent = Math.max(size.x, size.y, size.z, 1e-6);
        scene.add(new THREE.AmbientLight(0x909499, 0.24));
        scene.add(new THREE.HemisphereLight(0xc4cad0, 0x22252c, 0.32));
        const key = new THREE.DirectionalLight(0xffffff, 0.78);
        key.position.set(center.x - extent * 1.12, center.y + extent * 1.75, center.z + extent * 0.82);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        key.shadow.camera.near = 0.05;
        key.shadow.camera.far = Math.max(extent * 30, 50);
        const sh = extent * 1.4;
        key.shadow.camera.left = -sh;
        key.shadow.camera.right = sh;
        key.shadow.camera.top = sh;
        key.shadow.camera.bottom = -sh;
        key.shadow.bias = -0.00015;
        key.shadow.normalBias = 0.02;
        key.target.position.copy(center);
        scene.add(key.target);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xe8eef5, 0.2);
        fill.position.set(center.x + extent * 0.95, center.y + extent * 0.5, center.z - extent * 0.6);
        scene.add(fill);
        const bounce = new THREE.DirectionalLight(0xffd0dc, 0.12);
        bounce.position.set(center.x + extent * 0.15, center.y - extent * 0.48, center.z + extent * 0.32);
        scene.add(bounce);
        const pink = new THREE.PointLight(0xff8a9e, 0.92, extent * 12);
        pink.position.set(center.x, center.y + extent * 0.15, center.z + extent * 0.26);
        scene.add(pink);
        const pinkFill = new THREE.PointLight(0xffc4cf, 0.38, extent * 14);
        pinkFill.position.set(center.x - extent * 0.2, center.y + extent * 0.1, center.z + extent * 0.4);
        scene.add(pinkFill);
        const rim = new THREE.PointLight(0xc8f5e8, 0.22, extent * 13);
        rim.position.set(center.x + extent * 0.38, center.y + extent * 0.48, center.z - extent * 0.42);
        scene.add(rim);
        if (root) {
          const ledGrp = root.getObjectByName('LEDS');
          if (ledGrp) {
            ledGrp.updateMatrixWorld(true);
            const kids = [...ledGrp.children];
            kids.forEach((cell, i) => {
              cell.updateMatrixWorld(true);
              const cb = new THREE.Box3().setFromObject(cell);
              const cc = cb.getCenter(new THREE.Vector3());
              const hex = LED_GRID[i % LED_GRID.length];
              const ledLight = new THREE.PointLight(hex, 0.1, extent * 0.1);
              ledLight.position.copy(cc).add(new THREE.Vector3(0, extent * 0.06, 0));
              scene.add(ledLight);
            });
          }
        }
      }

      let rafId = null;
      let sceneVisible = false;

      function tick() {
        if (!sceneVisible) {
          rafId = null;
          return;
        }
        rafId = requestAnimationFrame(tick);
        const dt = clock.getDelta();
        if (mixer) mixer.update(dt);
        updateToucheKeyPresses();
        controls.update();
        renderer.render(scene, camera);
      }

      function startRaf() {
        if (rafId != null) return;
        rafId = requestAnimationFrame(tick);
      }

      function stopRaf() {
        if (rafId != null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }

      const visObserver = new IntersectionObserver(
        entries => {
          entries.forEach(e => {
            const vis = e.isIntersecting && e.intersectionRatio > 0.06;
            if (vis === sceneVisible) return;
            sceneVisible = vis;
            if (sceneVisible && gltfReady) startRaf();
            else stopRaf();
          });
        },
        { threshold: [0, 0.06, 0.15, 0.35] }
      );
      visObserver.observe(wrap);

      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => layoutRenderer()) : null;
      if (ro) ro.observe(wrap);
      window.addEventListener('resize', layoutRenderer);

      new GLTFLoader().load(
        'social_media_interactions_keyboard.gltf',
        gltf => {
          scene.add(gltf.scene);
          gltf.scene.updateMatrixWorld(true);
          removeGltfLights(gltf.scene);
          applyMacropadMaterials(gltf.scene);
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const target = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const md = Math.max(size.x, size.y, size.z, 1e-6);
          addKeyLights(target, size, gltf.scene);

          const srcOrtho = pickGltfOrthoCamera(gltf.scene);
          if (srcOrtho) {
            srcOrtho.updateMatrixWorld(true);
            const near = Math.max(0.01, srcOrtho.near);
            const far = srcOrtho.far > near ? srcOrtho.far : 100000;
            const next = new THREE.OrthographicCamera(
              srcOrtho.left,
              srcOrtho.right,
              srcOrtho.top,
              srcOrtho.bottom,
              near,
              far
            );
            gltfOrthoFrustum = {
              left: srcOrtho.left,
              right: srcOrtho.right,
              top: srcOrtho.top,
              bottom: srcOrtho.bottom,
              near,
              far
            };
            if (srcOrtho.parent) srcOrtho.parent.remove(srcOrtho);
            const _p = new THREE.Vector3();
            const _q = new THREE.Quaternion();
            const _s = new THREE.Vector3();
            srcOrtho.matrixWorld.decompose(_p, _q, _s);
            next.position.copy(_p);
            next.quaternion.copy(_q);
            next.scale.set(1, 1, 1);
            next.updateMatrixWorld(true);
            camera = next;
            controls.object = camera;
            controls.target.copy(target);
            controls.update();
          } else {
            console.warn('hero-macropad: sin OrthographicCamera en el GLTF');
            const pc = new THREE.PerspectiveCamera(45, 1, 0.01, 500000);
            const dist = md * 2.05;
            pc.position.set(target.x + dist * 0.48, target.y + dist * 0.42, target.z + dist * 0.54);
            pc.lookAt(target);
            camera = pc;
            controls.object = camera;
            controls.target.copy(target);
            controls.update();
          }

          gltf.scene.traverse(o => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });
          if (gltf.animations?.length) {
            mixer = new THREE.AnimationMixer(gltf.scene);
            gltf.animations.forEach(clip => mixer.clipAction(clip).play());
          }
          initToucheKeyInteraction(gltf.scene);
          potNode = gltf.scene.getObjectByName('Pot');
          startKeyAutoDemo();
          gltfReady = true;
          layoutRenderer();
          if (sceneVisible) startRaf();
        },
        undefined,
        e => {
          console.error(e);
          if (hintEl) {
            hintEl.textContent = 'No se pudo cargar el modelo 3D. Usa un servidor local (p. ej. npx serve).';
          }
        }
      );
    })
    .catch(err => {
      console.error('hero-macropad:', err);
      if (hintEl) hintEl.textContent = 'Error al cargar la vista 3D. Comprueba la conexión.';
    });
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
// 15. PILAR CARDS — 3D tilt + cursor spotlight
// ============================================================
(function initPilaresTilt() {
  const cards = document.querySelectorAll('.pilar-card');
  if (!cards.length) return;

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;

  cards.forEach((card) => {
    const spot = card.querySelector('.pilar-spotlight');
    if (!spot) return;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.classList.add('is-hover');
      card.style.transform =
        `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(4px)`;

      spot.style.left = `${e.clientX - rect.left}px`;
      spot.style.top = `${e.clientY - rect.top}px`;
    };

    const onLeave = () => {
      card.classList.remove('is-hover');
      card.style.transform = '';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
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


// ============================================================
// 17. PROBLEMA — carrusel 3D two-tone
// ============================================================
(function initProblemaCarousel() {
  const inner = document.querySelector('.problema-carousel__inner');
  if (!inner) return;

  const cards = [
    { variant: 'dark',  icon: 'img/cards-problemas/problema-01.png', alt: 'Gráfico a la baja', text: 'Ventas <em>planas</em> pese al ruido online.' },
    { variant: 'coral', icon: 'img/cards-problemas/problema-02.png', alt: 'Dinero con alas', text: 'Presupuesto que <em>vuela</em> sin retorno.' },
    { variant: 'dark',  icon: 'img/cards-problemas/problema-03.png', alt: 'Reloj de arena', text: 'Esperas <em>semanas</em> por un “quizás”.' },
    { variant: 'coral', icon: 'img/cards-problemas/problema-04.png', alt: 'Teléfono móvil', text: 'Publicas mucho, <em>vendes</em> poco.' },
    { variant: 'dark',  icon: 'img/cards-problemas/problema-05.png', alt: 'Frustración', text: 'Equipo <em>quemado</em> con el feed.' },
    { variant: 'coral', icon: 'img/cards-problemas/problema-06.png', alt: 'Signos de exclamación e interrogación', text: 'Sin <em>mapa</em>: tácticas sueltas.' },
    { variant: 'dark',  icon: 'img/cards-problemas/problema-07.png', alt: 'Fantasma', text: 'Tu marca es <em>invisible</em> donde importa.' },
    { variant: 'coral', icon: 'img/cards-problemas/problema-08.png', alt: 'Cruz de cierre', text: 'Lo que haces <em>no escala</em>.' },
    { variant: 'dark',  icon: 'img/cards-problemas/problema-09.png', alt: 'Megáfono', text: 'Gritas al vacío: <em>cero</em> respuesta.' },
    { variant: 'coral', icon: 'img/cards-problemas/problema-10.png', alt: 'Cabeza explotando', text: 'Demasiadas <em>herramientas</em>, poco orden.' },
  ];

  inner.style.setProperty('--quantity', String(cards.length));

  inner.innerHTML = cards.map((card, index) => `
    <div class="problema-card" style="--index: ${index}" data-variant="${card.variant}">
      <div class="problema-card__face">
        <div class="problema-card__header">
          <img class="problema-card__icon" src="${card.icon}" width="44" height="44" alt="${card.alt}">
        </div>
        <div class="problema-card__body">
          <p class="problema-card__text">${card.text}</p>
        </div>
      </div>
    </div>
  `).join('');
})();
