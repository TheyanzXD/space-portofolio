'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Camera, Layers, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type PlanetFinish = 'nebula' | 'titanium' | 'crystal' | 'gold';
export type CameraPreset = 'orbit' | 'astronaut' | 'polar';

/**
 * Tekstur Albedo Planet Prosedural (SRGBColorSpace + Max Anisotropy).
 */
function createPlanetTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.2, '#4c1d95');
    grad.addColorStop(0.42, '#0891b2');
    grad.addColorStop(0.55, '#6d28d9');
    grad.addColorStop(0.76, '#be185d');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    for (let y = 6; y < 250; y += 5) {
      ctx.fillStyle =
        y % 10 === 0
          ? 'rgba(34, 211, 238, 0.22)'
          : 'rgba(244, 114, 182, 0.14)';
      ctx.beginPath();
      for (let x = 0; x <= 512; x += 16) {
        const wave = Math.sin((x / 512) * Math.PI * 4 + y * 0.22) * 3.8;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.lineTo(512, y + 3.5);
      ctx.lineTo(0, y + 3.5);
      ctx.closePath();
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

/**
 * Tekstur Micro-Relief Bump Map Prosedural (Linear NoColorSpace).
 */
function createBumpTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 128);
    for (let y = 0; y < 128; y += 3) {
      const shade = 110 + Math.floor(Math.sin(y * 0.35) * 35);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(0, y, 256, 2);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

/**
 * Model 3D Prosedural Komposit 11-Bagian: Astronot EVA + Probe Satelit Pendamping.
 * Memvariasikan roughness (>= 0.25) dan metalness antar komponen.
 */
function buildProceduralAstronaut(): THREE.Group {
  const astronaut = new THREE.Group();

  const suitMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.72,
    metalness: 0.15,
  });
  const armorTrimMat = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    roughness: 0.32,
    metalness: 0.78,
  });
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    roughness: 0.1,
    metalness: 0.95,
    emissive: 0x0891b2,
    emissiveIntensity: 0.3,
  });
  const packMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.45,
    metalness: 0.65,
  });
  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xf472b6,
    emissiveIntensity: 0.95,
    roughness: 0.15,
  });

  // 1. Torso Utama
  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.22, 0.28, 8, 16),
    suitMat,
  );
  astronaut.add(torso);

  // 2. Modul Ransel Life-Support (PLSS)
  const backpack = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.42, 0.2),
    packMat,
  );
  backpack.position.set(0, 0.04, -0.2);
  astronaut.add(backpack);

  // 3. Kubah Helm
  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.21, 20, 20),
    suitMat,
  );
  helmet.position.set(0, 0.42, 0);
  astronaut.add(helmet);

  // 4. Visor Spekular
  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.196,
      18,
      18,
      0,
      Math.PI * 2,
      Math.PI * 0.28,
      Math.PI * 0.38,
    ),
    visorMat,
  );
  visor.rotation.x = Math.PI * 0.5;
  visor.position.set(0, 0.42, 0.036);
  astronaut.add(visor);

  // 5. Cincin Kerah Metalik
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.17, 0.032, 10, 24),
    armorTrimMat,
  );
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.24, 0);
  astronaut.add(collar);

  // 6. Unit Telemetri Dada
  const chestBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.15, 0.08),
    armorTrimMat,
  );
  chestBox.position.set(0, 0.05, 0.2);
  astronaut.add(chestBox);

  // 7 & 8. Lengan Kiri & Kanan
  const leftArm = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.068, 0.24, 6, 12),
    suitMat,
  );
  leftArm.position.set(-0.29, 0.08, 0.05);
  leftArm.rotation.z = 0.45;
  leftArm.rotation.x = -0.3;
  astronaut.add(leftArm);

  const rightArm = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.068, 0.24, 6, 12),
    suitMat,
  );
  rightArm.position.set(0.29, 0.16, 0.06);
  rightArm.rotation.z = -0.75;
  rightArm.rotation.x = -0.4;
  astronaut.add(rightArm);

  // 9 & 10. Kaki Kiri & Kanan
  const leftLeg = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.078, 0.26, 6, 12),
    suitMat,
  );
  leftLeg.position.set(-0.11, -0.36, 0.02);
  leftLeg.rotation.x = 0.22;
  astronaut.add(leftLeg);

  const rightLeg = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.078, 0.26, 6, 12),
    suitMat,
  );
  rightLeg.position.set(0.11, -0.38, -0.04);
  rightLeg.rotation.x = -0.18;
  astronaut.add(rightLeg);

  // 11. Antena & Suar Cahaya
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.26, 8),
    armorTrimMat,
  );
  antenna.position.set(0.14, 0.34, -0.22);
  astronaut.add(antenna);

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.034, 10, 10),
    beaconMat,
  );
  beacon.position.set(0.14, 0.48, -0.22);
  astronaut.add(beacon);

  astronaut.scale.setScalar(0.84);
  return astronaut;
}

/**
 * Adegan 3D Studio PBR dengan Collapsible Bottom Control Dock (Zero Viewport Occlusion).
 * Mendukung pengaturan Exploded Orbital View, Material PBR Presets, dan Camera Presets.
 */
export function Planet() {
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [explodedPct, setExplodedPct] = useState(20);
  const [finish, setFinish] = useState<PlanetFinish>('nebula');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('orbit');

  // Simpan state kontrol di useRef agar perubahan UI tidak pernah me-mount ulang WebGLRenderer
  const controlStateRef = useRef({
    exploded: 0.2,
    finish: 'nebula' as PlanetFinish,
    cameraPreset: 'orbit' as CameraPreset,
  });

  useEffect(() => {
    controlStateRef.current.exploded = explodedPct / 100;
    controlStateRef.current.finish = finish;
    controlStateRef.current.cameraPreset = cameraPreset;
  }, [explodedPct, finish, cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05030f, 0.042);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.45, 7.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2),
    );
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Mandatory Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3-Point Warm/Cool Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e1b4b, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.3);
    keyLight.position.set(5, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 1.85);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const planetTexture = createPlanetTexture(maxAnisotropy);
    const bumpTexture = createBumpTexture(maxAnisotropy);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const planetSystem = new THREE.Group();
    rootGroup.add(planetSystem);

    // 1. Inti Planet dengan MeshPhysicalMaterial PBR
    const planetGeo = new THREE.SphereGeometry(1.5, 48, 48);
    const planetMat = new THREE.MeshPhysicalMaterial({
      map: planetTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.03,
      color: 0xffffff,
      roughness: 0.45,
      metalness: 0.18,
      clearcoat: 0.25,
      clearcoatRoughness: 0.2,
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetSystem.add(planetMesh);

    // 2. Selubung Atmosfer
    const atmoGeo = new THREE.SphereGeometry(1.62, 36, 36);
    const atmoMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    planetSystem.add(atmoMesh);

    // 3. Cincin Planet Berlapis
    const ringGroup = new THREE.Group();
    ringGroup.rotation.x = Math.PI * 0.38;
    ringGroup.rotation.z = -Math.PI * 0.08;
    planetSystem.add(ringGroup);

    const innerRingGeo = new THREE.RingGeometry(1.88, 2.48, 64);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.25,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.68,
      roughness: 0.35,
      metalness: 0.45,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    ringGroup.add(innerRing);

    const outerRingGeo = new THREE.RingGeometry(2.6, 2.98, 64);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      emissiveIntensity: 0.3,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      roughness: 0.25,
      metalness: 0.55,
      depthWrite: false,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    ringGroup.add(outerRing);

    // 4. Dua Bulan Mengorbit + Sabuk Asteroid InstancedMesh (36 Asteroid Kecil)
    const asteroidGeo = new THREE.DodecahedronGeometry(0.038, 0);
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.6,
      metalness: 0.4,
    });
    const asteroidCount = 36;
    const asteroidBelt = new THREE.InstancedMesh(
      asteroidGeo,
      asteroidMat,
      asteroidCount,
    );
    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();
    const dummyScale = new THREE.Vector3();
    const dummyColor = new THREE.Color();

    for (let i = 0; i < asteroidCount; i++) {
      const angle = (i / asteroidCount) * Math.PI * 2;
      const radius = 2.52 + (i % 3) * 0.14;
      dummyPos.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        ((i % 5) - 2) * 0.03,
      );
      dummyQuat.setFromAxisAngle(new THREE.Vector3(0.4, 0.8, 0.2), i * 0.7);
      const s = 0.85 + (i % 4) * 0.1;
      dummyScale.set(s, s, s);
      dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
      asteroidBelt.setMatrixAt(i, dummyMatrix);
      dummyColor.setHex(i % 2 === 0 ? 0x22d3ee : 0xa78bfa);
      asteroidBelt.setColorAt(i, dummyColor);
    }
    asteroidBelt.computeBoundingSphere();
    ringGroup.add(asteroidBelt);

    const moon1Pivot = new THREE.Group();
    moon1Pivot.rotation.z = 0.25;
    planetSystem.add(moon1Pivot);

    const moon1Mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.21, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.35,
        metalness: 0.5,
        emissive: 0x0284c7,
        emissiveIntensity: 0.2,
      }),
    );
    moon1Mesh.position.set(2.3, 0, 0);
    moon1Pivot.add(moon1Mesh);

    const moon2Pivot = new THREE.Group();
    moon2Pivot.rotation.z = -0.38;
    moon2Pivot.rotation.x = 0.22;
    planetSystem.add(moon2Pivot);

    const moon2Mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 20, 20),
      new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        roughness: 0.45,
        metalness: 0.35,
        emissive: 0xdb2777,
        emissiveIntensity: 0.25,
      }),
    );
    moon2Mesh.position.set(-2.8, 0, 0);
    moon2Pivot.add(moon2Mesh);

    // 5. Astronot Prosedural Multi-Bagian
    const astronaut = buildProceduralAstronaut();
    astronaut.position.set(2.1, 0.9, 1.15);
    rootGroup.add(astronaut);

    // 6. Contact Shadow Disc di bawah sistem planet untuk figure-ground separation
    const contactShadowGeo = new THREE.CircleGeometry(2.4, 32);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      color: 0x05030f,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, -2.35, 0);
    rootGroup.add(contactShadow);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let targetRotX = 0;
    let targetRotY = 0;
    let scrollScale = 1;
    let isVisible = true;
    let currentExploded = 0.2;
    let appliedFinish: PlanetFinish = 'nebula';
    const cameraLookTarget = new THREE.Vector3(0, 0, 0);
    const desiredCamPos = new THREE.Vector3(0, 0.45, 7.2);
    const desiredLookAt = new THREE.Vector3(0, 0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotionRef.current) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = nx * 0.35;
      targetRotX = -ny * 0.22;
    };

    const handleScroll = () => {
      if (reducedMotionRef.current) return;
      const progress = Math.min(1, window.scrollY / 700);
      scrollScale = Math.max(0.7, 1 - progress * 0.3);
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let frameId = 0;
    let timerId = 0;
    let lastTimeMs = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        timerId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          timerId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          timerId = window.setTimeout(cb, 80);
        }
      };
      timerId = window.setTimeout(poll, 5);
    }

    function applyFinishMaterial(nextFinish: PlanetFinish) {
      if (nextFinish === 'nebula') {
        planetMat.map = planetTexture;
        planetMat.color.setHex(0xffffff);
        planetMat.metalness = 0.18;
        planetMat.roughness = 0.45;
        planetMat.clearcoat = 0.25;
      } else if (nextFinish === 'titanium') {
        planetMat.map = null;
        planetMat.color.setHex(0x94a3b8);
        planetMat.metalness = 0.92;
        planetMat.roughness = 0.18;
        planetMat.clearcoat = 0.4;
      } else if (nextFinish === 'crystal') {
        planetMat.map = planetTexture;
        planetMat.color.setHex(0x38bdf8);
        planetMat.metalness = 0.35;
        planetMat.roughness = 0.08;
        planetMat.clearcoat = 1.0;
      } else if (nextFinish === 'gold') {
        planetMat.map = null;
        planetMat.color.setHex(0xfbbf24);
        planetMat.metalness = 0.94;
        planetMat.roughness = 0.16;
        planetMat.clearcoat = 0.6;
      }
      planetMat.needsUpdate = true;
    }

    function tick() {
      if (!isVisible || document.hidden) {
        lastTimeMs = performance.now();
        timerId = window.setTimeout(tick, 200);
        return;
      }

      const nowMs = performance.now();
      const dt = Math.min((nowMs - lastTimeMs) / 1000, 0.1);
      lastTimeMs = nowMs;
      const elapsed = nowMs * 0.001;

      const state = controlStateRef.current;

      // Update material finish jika berubah
      if (appliedFinish !== state.finish) {
        appliedFinish = state.finish;
        applyFinishMaterial(appliedFinish);
      }

      // Smooth Exploded-View Separation menggunakan THREE.MathUtils.damp
      currentExploded = THREE.MathUtils.damp(
        currentExploded,
        state.exploded,
        5,
        dt,
      );
      innerRing.scale.setScalar(1 + currentExploded * 0.24);
      outerRing.scale.setScalar(1 + currentExploded * 0.38);
      moon1Mesh.position.x = 2.25 + currentExploded * 0.7;
      moon2Mesh.position.x = -2.75 - currentExploded * 0.85;
      astronaut.position.x = 1.95 + currentExploded * 0.75;

      // Smooth Camera Preset Transitions
      if (state.cameraPreset === 'orbit') {
        desiredCamPos.set(0, 0.45, 7.2);
        desiredLookAt.set(0, 0, 0);
      } else if (state.cameraPreset === 'astronaut') {
        desiredCamPos.set(1.75, 1.05, 4.1);
        desiredLookAt.set(astronaut.position.x * 0.65, 0.75, 0.5);
      } else if (state.cameraPreset === 'polar') {
        desiredCamPos.set(0, 4.8, 5.2);
        desiredLookAt.set(0, 0, 0);
      }

      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        desiredCamPos.x,
        4.5,
        dt,
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        desiredCamPos.y,
        4.5,
        dt,
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        desiredCamPos.z,
        4.5,
        dt,
      );
      cameraLookTarget.x = THREE.MathUtils.damp(
        cameraLookTarget.x,
        desiredLookAt.x,
        5,
        dt,
      );
      cameraLookTarget.y = THREE.MathUtils.damp(
        cameraLookTarget.y,
        desiredLookAt.y,
        5,
        dt,
      );
      cameraLookTarget.z = THREE.MathUtils.damp(
        cameraLookTarget.z,
        desiredLookAt.z,
        5,
        dt,
      );
      camera.lookAt(cameraLookTarget);

      if (!reducedMotionRef.current) {
        planetMesh.rotation.y += dt * 0.24;
        innerRing.rotation.z -= dt * 0.08;
        outerRing.rotation.z += dt * 0.05;
        asteroidBelt.rotation.z -= dt * 0.11;
        moon1Pivot.rotation.y += dt * 0.65;
        moon2Pivot.rotation.y -= dt * 0.42;

        astronaut.position.y = 0.88 + Math.sin(elapsed * 1.6) * 0.15;
        astronaut.rotation.y = -0.35 + Math.sin(elapsed * 0.9) * 0.18;
        astronaut.rotation.z = Math.cos(elapsed * 1.1) * 0.08;

        planetSystem.rotation.y = THREE.MathUtils.damp(
          planetSystem.rotation.y,
          targetRotY,
          4,
          dt,
        );
        planetSystem.rotation.x = THREE.MathUtils.damp(
          planetSystem.rotation.x,
          targetRotX,
          4,
          dt,
        );

        const nextScale = THREE.MathUtils.damp(
          rootGroup.scale.x,
          scrollScale,
          5,
          dt,
        );
        rootGroup.scale.setScalar(nextScale);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      planetTexture.dispose();
      bumpTexture.dispose();
      envTexture.dispose();
      planetGeo.dispose();
      planetMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      asteroidGeo.dispose();
      asteroidMat.dispose();
      contactShadowGeo.dispose();
      contactShadowMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative flex h-[390px] w-full flex-col items-center justify-center sm:h-[460px] lg:h-[560px]">
      {/* Aura Cahaya Belakang Planet */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[240px] w-[240px] rounded-full bg-gradient-to-tr from-[#8b5cf6]/30 via-[#22d3ee]/20 to-[#f472b6]/25 blur-[70px] sm:h-[330px] sm:w-[330px]"
      />

      {/* Kanvas 3D Terisolasi (100% Unobstructed Center) */}
      <div
        ref={mountRef}
        aria-hidden="true"
        data-testid="hero-planet-canvas"
        className="relative z-10 h-full w-full"
      />

      {/* Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute inset-x-0 bottom-1 z-20 flex flex-col items-center px-2">
        <button
          type="button"
          onClick={() => setHudCollapsed((prev) => !prev)}
          aria-expanded={!hudCollapsed}
          className="inline-flex items-center gap-1.5 rounded-t-xl border border-b-0 border-white/15 bg-[#0b0720]/95 px-3 py-1 font-mono text-[10px] font-medium text-[#cbd5e1] transition-colors hover:text-[#22d3ee] cursor-pointer"
        >
          {hudCollapsed ? (
            <>
              <ChevronUp className="h-3 w-3 text-[#22d3ee]" />
              <span>Tampilkan Kontrol Studio 3D</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 text-[#22d3ee]" />
              <span>Sembunyikan HUD 3D (Mode Sinema)</span>
            </>
          )}
        </button>

        {!hudCollapsed && (
          <div className="w-full max-w-[520px] space-y-2.5 rounded-2xl border border-white/15 bg-[#0b0720]/95 p-3.5 shadow-[0_12px_32px_rgba(5,3,15,0.85)]">
            {/* Baris 1: Slider Ekspansi Orbit & Sudut Kamera */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 min-w-[180px] flex-col">
                <label
                  htmlFor="orbital-exploded-slider"
                  className="flex items-center justify-between font-mono text-[10px] text-[#94a3b8] tabular-nums"
                >
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3 w-3 text-[#22d3ee]" />
                    <span>EKSPANSI ORBIT</span>
                  </span>
                  <span className="font-semibold text-[#22d3ee]">
                    {explodedPct}%
                  </span>
                </label>
                <input
                  id="orbital-exploded-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={explodedPct}
                  onChange={(e) => setExplodedPct(Number(e.target.value))}
                  className="mt-1.5 h-1.5 w-full accent-[#22d3ee] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Camera className="h-3.5 w-3.5 text-[#a78bfa] mr-0.5" />
                {(
                  [
                    { id: 'orbit', label: 'Orbit' },
                    { id: 'astronaut', label: 'EVA' },
                    { id: 'polar', label: 'Kutub' },
                  ] as const
                ).map((cam) => (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => setCameraPreset(cam.id)}
                    className={`rounded-lg px-2.5 py-1 font-mono text-[10px] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      cameraPreset === cam.id
                        ? 'bg-[#22d3ee] font-semibold text-[#05030f]'
                        : 'bg-white/[0.05] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Baris 2: Pilihan Material Studio PBR */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-2">
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#94a3b8]">
                <Sparkles className="h-3 w-3 text-[#8b5cf6]" />
                <span>STUDIO PBR:</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'nebula', label: 'Nebula' },
                    { id: 'titanium', label: 'Titanium' },
                    { id: 'crystal', label: 'Kristal' },
                    { id: 'gold', label: 'Emas Surya' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFinish(item.id)}
                    className={`rounded-lg px-2.5 py-1 font-mono text-[10px] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      finish === item.id
                        ? 'bg-[#8b5cf6] font-semibold text-white'
                        : 'bg-white/[0.05] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
