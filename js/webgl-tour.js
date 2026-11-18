/**
 * WebGL Zoom-Blur 3D Campus Tour - UIN Siber Syekh Nurjati Cirebon
 * Adapted from WebGL Collection (by Kevin Levron / soju22)
 * Features:
 * - 5 Verified Campus Locations of UIN Siber Syekh Nurjati Cirebon
 * - GPU Accelerated Zoom-Blur GLSL Shader Transitions
 * - Interactive Mouse Parallax & Focal Center Tracking
 * - Mouse Wheel, Keyboard (Arrow Keys), Click & HUD Controls
 * - Graceful Fallback for Non-WebGL Devices & PWA Offline Support
 */

(function () {
  'use strict';

  function limit(val, min, max) {
    return val < min ? min : (val > max ? max : val);
  }

  function lerp(a, b, x) {
    return a + x * (b - a);
  }

  function lerpv2(v1, v2, amount) {
    v1.x = lerp(v1.x, v2.x, amount);
    v1.y = lerp(v1.y, v2.y, amount);
  }

  function safeMod(n, m) {
    return ((n % m) + m) % m;
  }

  // Dynamic base path resolver: works in root ('/') and subfolders ('/pages/')
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  const isSubdir = currentPath.includes('/pages/') || currentPath.includes('pages/') || currentPath.endsWith('user.html') || currentPath.endsWith('admin.html');
  const basePath = isSubdir ? '../' : '';

  // UIN Siber Syekh Nurjati Cirebon Campus Photos
  const campusImages = [
    { src: basePath + 'assets/img/gedungCyber.png', title: 'Gedung Cyber UIN Siber Cirebon', tag: 'Pusat Siber Terpadu' },
    { src: basePath + 'assets/img/uinssc_siber.jpg', title: 'Pusat Pembelajaran Siber UINSSC', tag: 'Smart Learning Center' },
    { src: basePath + 'assets/img/uinssc_fasya.jpg', title: 'Gedung Fakultas Syariah (FASYA)', tag: 'Kawasan Akademik' },
    { src: basePath + 'assets/img/uinssc_fdk.jpg', title: 'Gedung Fakultas Dakwah & Komunikasi', tag: 'Kawasan Pembelajaran' }
  ];

  function createThreeContext(canvas) {
    if (!window.THREE) return null;
    const THREE = window.THREE;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      console.warn('WebGL tidak didukung oleh perangkat:', err);
      return null;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    if (THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / Math.max(window.innerHeight, 1), 0.1, 1000);
    camera.position.set(0, 0, 50);
    camera.lookAt(0, 0, 0);

    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
      wWidth: 0,
      wHeight: 0,
      ratio: window.innerWidth / Math.max(window.innerHeight, 1)
    };

    const mouse = new THREE.Vector2(0, 0);
    const resizeCallbacks = [];

    function updateSize() {
      size.width = window.innerWidth;
      size.height = window.innerHeight;
      size.ratio = size.width / Math.max(size.height, 1);

      renderer.setSize(size.width, size.height);
      camera.aspect = size.ratio;
      camera.updateProjectionMatrix();

      const distance = camera.position.z;
      const vFOV = (camera.fov * Math.PI) / 180;
      size.wHeight = 2 * Math.tan(vFOV / 2) * distance;
      size.wWidth = size.wHeight * size.ratio;

      resizeCallbacks.forEach(cb => {
        try { cb(); } catch (e) { console.debug('Resize callback notice:', e); }
      });
    }

    updateSize();
    window.addEventListener('resize', updateSize);

    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    return {
      renderer,
      camera,
      size,
      mouse,
      onAfterResize(cb) {
        resizeCallbacks.push(cb);
      }
    };
  }

  function createZoomBlurImage(three) {
    const THREE = window.THREE;
    const uMap = { value: null };
    const uCenter = { value: new THREE.Vector2(0.5, 0.5) };
    const uStrength = { value: -1 };
    const uHeroBounds = { value: new THREE.Vector4(0, 0, 1, 1) };
    const uBgUvScale = { value: new THREE.Vector2(1, 1) };
    const uBgUvOffset = { value: new THREE.Vector2(0, 0) };
    const uParallax = { value: new THREE.Vector2(0, 0) };

    const geometry = new (THREE.PlaneGeometry || THREE.PlaneBufferGeometry)(1, 1, 1, 1);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        map: uMap,
        center: uCenter,
        strength: uStrength,
        heroBounds: uHeroBounds,
        bgUvScale: uBgUvScale,
        bgUvOffset: uBgUvOffset,
        parallax: uParallax
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform vec2 center;
        uniform float strength;
        uniform vec4 heroBounds;
        uniform vec2 bgUvScale;
        uniform vec2 bgUvOffset;
        uniform vec2 parallax;
        varying vec2 vUv;

        float random(vec3 scale, float seed) {
          return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
        }

        vec4 sampleZoom(sampler2D tex, vec2 uv, vec2 cntr, float str) {
          if (abs(str) > 0.001) {
            vec4 col = vec4(0.0);
            float tot = 0.0;
            vec2 toC = cntr - uv;
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
            for (float t = 0.0; t <= 16.0; t++) {
              float pct = (t + offset) / 16.0;
              float weight = 2.0 * (pct - pct * pct);
              vec4 texel = texture2D(tex, uv + toC * pct * str);
              texel.rgb *= texel.a;
              col += texel * weight;
              tot += weight;
            }
            col = col / tot;
            col.rgb /= (col.a + 0.00001);
            col.a = 1.0 - abs(str);
            return col;
          }
          return texture2D(tex, uv);
        }

        void main() {
          // 1. Ambient Background Layer (seamless 100% full cover without distortion across all devices)
          vec2 bgUv = clamp(vUv * bgUvScale + bgUvOffset, vec2(0.001), vec2(0.999));
          vec2 bgCenter = center * bgUvScale + bgUvOffset;
          vec4 bgCol = sampleZoom(map, bgUv, bgCenter, strength);
          bgCol.rgb *= 0.58;

          // 2. Sharp HD Hero Subject Layer (Framed so 100% of the building is visible without clipping)
          vec4 curBounds = heroBounds;
          curBounds.xy += parallax;
          vec2 heroUv = (vUv - curBounds.xy) / curBounds.zw;

          if (heroUv.x >= 0.0 && heroUv.x <= 1.0 && heroUv.y >= 0.0 && heroUv.y <= 1.0) {
            float feather = 0.04;
            float edgeX = smoothstep(0.0, feather, heroUv.x) * (1.0 - smoothstep(1.0 - feather, 1.0, heroUv.x));
            float edgeY = smoothstep(0.0, feather, heroUv.y) * (1.0 - smoothstep(1.0 - feather, 1.0, heroUv.y));
            float edgeAlpha = clamp(edgeX * edgeY, 0.0, 1.0);

            vec4 heroCol = sampleZoom(map, heroUv, center, strength);
            gl_FragColor = mix(bgCol, heroCol, edgeAlpha);
          } else {
            gl_FragColor = bgCol;
          }
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);

    function resize() {
      if (!uMap.value || !uMap.value.image) return;
      mesh.scale.set(three.size.wWidth, three.size.wHeight, 1);
      const iWidth = uMap.value.image.width || 1;
      const iHeight = uMap.value.image.height || 1;
      const iRatio = iWidth / iHeight;
      const sRatio = three.size.ratio;

      // 1. Ambient Background Cover UVs (guaranteed full screen cover without distortion)
      if (iRatio > sRatio) {
        uBgUvScale.value.x = sRatio / iRatio;
        uBgUvScale.value.y = 1.0;
        uBgUvOffset.value.x = (1.0 - uBgUvScale.value.x) / 2.0;
        uBgUvOffset.value.y = 0.0;
      } else {
        uBgUvScale.value.x = 1.0;
        uBgUvScale.value.y = iRatio / sRatio;
        uBgUvOffset.value.x = 0.0;
        uBgUvOffset.value.y = (1.0 - uBgUvScale.value.y) / 2.0;
      }

      // 2. Hero Subject Bounds (x, y, width, height) in screen UV space [0, 1]
      // Full architectural containment so roof, spire, and wings are never cut off
      let heroW, heroH, heroX, heroY;

      if (sRatio >= iRatio) {
        // Landscape / Widescreen / Ultrawide / Desktop
        // Keep 96% height with 4% headroom for top navigation bar
        heroH = 0.96;
        heroW = heroH * (iRatio / sRatio);
        heroX = (1.0 - heroW) / 2.0;
        heroY = 0.01; // Anchored cleanly: top at 0.97
      } else {
        // Portrait / Mobile / Tablet Portrait
        // Width fills 100% of viewport width
        heroW = 1.0;
        heroH = heroW * (sRatio / iRatio);
        heroX = 0.0;
        heroY = Math.max(0.02, (1.0 - heroH) * 0.65);
      }

      uHeroBounds.value.set(heroX, heroY, heroW, heroH);
    }

    function setMap(texture) {
      uMap.value = texture;
      resize();
    }

    return { geometry, material, mesh, uCenter, uStrength, uParallax, setMap, resize };
  }

  function initWebGLTour() {
    const canvas = document.getElementById('canvas');
    if (!canvas || !window.THREE) return;

    const three = createThreeContext(canvas);
    if (!three) return;

    const THREE = window.THREE;
    let scene, image1, image2;
    let progress = 0, targetProgress = 0;
    const center = new THREE.Vector2();
    const loader = new THREE.TextureLoader();

    function loadTexture(img) {
      return new Promise(resolve => {
        loader.load(
          img.src,
          texture => {
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            if (three.renderer && three.renderer.capabilities) {
              const maxAniso = three.renderer.capabilities.getMaxAnisotropy();
              if (maxAniso) {
                texture.anisotropy = Math.min(maxAniso, 16);
              }
            }
            if (THREE.sRGBEncoding) {
              texture.encoding = THREE.sRGBEncoding;
            }
            img.texture = texture;
            resolve(texture);
          },
          undefined,
          err => {
            console.debug('Skip fallback texture:', img.src, err);
            resolve(null);
          }
        );
      });
    }

    Promise.all(campusImages.map(loadTexture)).then(() => {
      const validImages = campusImages.filter(img => img.texture);
      if (validImages.length < 2) {
        console.info('Gambar WebGL kampus belum lengkap, mempertahankan background default.');
        return;
      }

      document.body.classList.add('webgl-active');
      initScene(validImages);
      initListeners(validImages);
      animate();
    }).catch(err => {
      console.warn('Inisialisasi WebGL Campus Tour gagal:', err);
    });

    function initScene(images) {
      scene = new THREE.Scene();

      image1 = createZoomBlurImage(three);
      image1.setMap(images[0].texture);
      scene.add(image1.mesh);

      image2 = createZoomBlurImage(three);
      image2.setMap(images[1].texture);
      scene.add(image2.mesh);

      setImagesProgress(0);
      updateHud(0, images);

      if (window.gsap) {
        window.gsap.fromTo(
          image1.uStrength,
          { value: -2 },
          { value: 0, duration: 2.4, ease: 'power2.out' }
        );
      } else {
        image1.uStrength.value = 0;
      }

      three.onAfterResize(() => {
        image1.resize();
        image2.resize();
      });
    }

    function initListeners(images) {
      // Mouse Wheel Navigation (hanya jika scroll di luar form input / modal / map)
      window.addEventListener('wheel', e => {
        if (e.target.closest('input, textarea, select, .login-glass-card-wrapper, .modal-backdrop, .swal2-container, #map, .leaflet-container')) {
          return;
        }
        if (Math.abs(e.deltaY) > 4) {
          if (e.deltaY > 0) {
            setTargetProgress(targetProgress + 1 / 18, images);
          } else {
            setTargetProgress(targetProgress - 1 / 18, images);
          }
        }
      }, { passive: true });

      // Click Navigation: Atas = Previous, Bawah = Next (hanya jika klik di latar canvas)
      document.addEventListener('click', e => {
          if (e.target.closest('input, button, a, select, textarea, label, .login-glass-card, .login-hero-side, .modal-backdrop, .swal2-container, .webgl-campus-hud, .form-card, .user-banner-card, .table-card, .modal-content, .card, .sso-profile-card, #sectionRiwayat, #sectionLacak, #map, .leaflet-container, .navbar, .top-util-bar, .app-footer, .tab-switcher, .form-step-panel')) {
            return;
          }
          if (e.clientY < three.size.height / 2) {
            navPrevious(images);
          } else {
            navNext(images);
          }
        });

      // Keyboard Arrow Navigation
      document.addEventListener('keydown', e => {
        if (e.target.matches('input, textarea, select')) return;
        if (e.keyCode === 37 || e.keyCode === 38) {
          navPrevious(images);
        } else if (e.keyCode === 39 || e.keyCode === 40) {
          navNext(images);
        }
      });

      // HUD Button Controls
      const prevBtn = document.getElementById('webglPrevBtn');
      const nextBtn = document.getElementById('webglNextBtn');
      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          navPrevious(images);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          navNext(images);
        });
      }
    }

    function navNext(images) {
      if (Number.isInteger(targetProgress)) {
        setTargetProgress(targetProgress + 1, images);
      } else {
        setTargetProgress(Math.ceil(targetProgress), images);
      }
    }

    function navPrevious(images) {
      if (Number.isInteger(targetProgress)) {
        setTargetProgress(targetProgress - 1, images);
      } else {
        setTargetProgress(Math.floor(targetProgress), images);
      }
    }

    function setTargetProgress(value, images) {
      targetProgress = value;
      if (targetProgress < 0) {
        progress += images.length;
        targetProgress += images.length;
      }
    }

    function setImagesProgress(p) {
      image1.uStrength.value = p;
      image2.uStrength.value = -1 + p;
    }

    function updateHud(index, images) {
      const safeIdx = safeMod(index, images.length);
      const cur = images[safeIdx];
      const titleEl = document.getElementById('webglBuildingName');
      const counterEl = document.getElementById('webglSlideCounter');
      if (titleEl && cur) {
        titleEl.textContent = cur.title;
      }
      if (counterEl) {
        counterEl.textContent = `${safeIdx + 1} / ${images.length}`;
      }
    }

    function updateProgress(images) {
      const progress1 = lerp(progress, targetProgress, 0.05);
      const pdiff = progress1 - progress;
      if (Math.abs(pdiff) < 0.0001) return;

      const p0 = safeMod(progress, 1);
      const p1 = safeMod(progress1, 1);
      if ((pdiff > 0 && p1 < p0) || (pdiff < 0 && p0 < p1)) {
        const i = Math.floor(progress1) % images.length;
        const j = (i + 1) % images.length;
        image1.setMap(images[safeMod(i, images.length)].texture);
        image2.setMap(images[safeMod(j, images.length)].texture);
        updateHud(safeMod(i, images.length), images);
      }

      progress = progress1;
      setImagesProgress(safeMod(progress, 1));
    }

    function animate() {
      requestAnimationFrame(animate);
      const { renderer, camera, mouse } = three;
      const validImages = campusImages.filter(img => img.texture);

      center.copy(mouse).divideScalar(2).addScalar(0.5);
      lerpv2(image1.uCenter.value, center, 0.1);
      lerpv2(image2.uCenter.value, center, 0.1);

      // Smooth 3D mouse parallax for hero subject
      const targetParallaxX = mouse.x * 0.012;
      const targetParallaxY = mouse.y * 0.008;
      image1.uParallax.value.x = lerp(image1.uParallax.value.x, targetParallaxX, 0.08);
      image1.uParallax.value.y = lerp(image1.uParallax.value.y, targetParallaxY, 0.08);
      image2.uParallax.value.x = lerp(image2.uParallax.value.x, targetParallaxX, 0.08);
      image2.uParallax.value.y = lerp(image2.uParallax.value.y, targetParallaxY, 0.08);

      updateProgress(validImages);

      renderer.render(scene, camera);
    }
  }

  // Auto initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebGLTour);
  } else {
    initWebGLTour();
  }

  window.initWebGLTour = initWebGLTour;
})();

