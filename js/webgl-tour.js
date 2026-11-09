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
  const isSubdir = window.location.pathname.replace(/\\/g, '/').includes('/pages/');
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

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
    const uUVOffset = { value: new THREE.Vector2(0, 0) };
    const uUVScale = { value: new THREE.Vector2(1, 1) };

    const geometry = new (THREE.PlaneGeometry || THREE.PlaneBufferGeometry)(1, 1, 1, 1);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        map: uMap,
        center: uCenter,
        strength: uStrength,
        uvOffset: uUVOffset,
        uvScale: uUVScale,
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
        uniform vec2 uvOffset;
        uniform vec2 uvScale;
        varying vec2 vUv;

        float random(vec3 scale, float seed) {
          return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
        }
        
        void main() {
          vec2 tUv = vUv * uvScale + uvOffset;
          if (abs(strength) > 0.001) {
            vec4 color = vec4(0.0);
            float total = 0.0;
            vec2 toCenter = center * uvScale + uvOffset - tUv;
            
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
            
            for (float t = 0.0; t <= 20.0; t++) {
              float percent = (t + offset) / 20.0;
              float weight = 2.0 * (percent - percent * percent);
              vec4 texel = texture2D(map, tUv + toCenter * percent * strength);

              texel.rgb *= texel.a;
              color += texel * weight;
              total += weight;
            }

            gl_FragColor = color / total;
            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;
            gl_FragColor.a = 1.0 - abs(strength);
          } else {
            gl_FragColor = texture2D(map, tUv);
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
      uUVOffset.value.set(0, 0);
      uUVScale.value.set(1, 1);
      if (iRatio > three.size.ratio) {
        uUVScale.value.x = three.size.ratio / iRatio;
        uUVOffset.value.x = (1 - uUVScale.value.x) / 2;
      } else {
        uUVScale.value.y = iRatio / three.size.ratio;
        uUVOffset.value.y = (1 - uUVScale.value.y) / 2;
      }
    }

    function setMap(texture) {
      uMap.value = texture;
      resize();
    }

    return { geometry, material, mesh, uCenter, uStrength, setMap, resize };
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
        if (e.target.closest('input, button, a, select, textarea, label, .login-glass-card, .login-hero-side, .modal-backdrop, .swal2-container, .webgl-campus-hud, .form-card, .user-banner-card, .table-card, .modal-content, .card, .sso-profile-card, #sectionRiwayat, #sectionLacak, #map, .leaflet-container')) {
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

