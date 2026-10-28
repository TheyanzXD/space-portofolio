'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  createShootingStar,
  drawShootingStar,
  type ShootingStar,
} from './ShootingStars';
import { Nebula } from './Nebula';

interface StarParticle {
  x: number;
  y: number;
  z: number; // Lapisan kedalaman parallax (0.2 - 1.0)
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

function detectSoftwareGl(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

/**
 * Kanvas latar belakang bintang multi-lapisan dengan efek parallax mouse/scroll
 * dan bintang jatuh acak. Otomatis menyesuaikan jumlah partikel dengan kemampuan perangkat.
 */
export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isSoftware = detectSoftwareGl();
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const cores =
      typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    const starCount = isSoftware
      ? 240
      : cores <= 4
        ? 450
        : window.innerWidth < 768
          ? 400
          : 820;

    const palette = ['#f8fafc', '#e2e8f0', '#22d3ee', '#a78bfa', '#f472b6'];
    const stars: StarParticle[] = Array.from({ length: starCount }, () => {
      const isBright = Math.random() > 0.92;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.2 + Math.random() * 0.8,
        radius: isBright ? 1.6 + Math.random() * 1.1 : 0.5 + Math.random() * 0.9,
        baseAlpha: isBright ? 0.85 : 0.3 + Math.random() * 0.5,
        twinkleSpeed: 0.8 + Math.random() * 2.2,
        twinklePhase: Math.random() * Math.PI * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
    });

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let scrollY = window.scrollY;
    let shootingStar: ShootingStar | null = null;
    let nextShootingStarTime = performance.now() + 4200;

    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      targetMouseX = (e.clientX / width - 0.5) * 36;
      targetMouseY = (e.clientY / height - 0.5) * 36;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let frameId = 0;
    let timerId = 0;

    const renderFrame = (now: number) => {
      if (document.hidden) {
        timerId = window.setTimeout(
          () => {
            frameId = requestAnimationFrame(renderFrame);
          },
          250,
        );
        return;
      }

      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      const timeSec = now * 0.001;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const parallaxX = reducedMotion ? 0 : mouseX * s.z;
        const parallaxY = reducedMotion
          ? 0
          : mouseY * s.z - scrollY * 0.12 * s.z;

        const drawX = (((s.x + parallaxX) % width) + width) % width;
        const drawY = (((s.y + parallaxY) % height) + height) % height;

        const twinkle = reducedMotion
          ? s.baseAlpha
          : s.baseAlpha *
            (0.65 + 0.35 * Math.sin(timeSec * s.twinkleSpeed + s.twinklePhase));

        ctx.globalAlpha = twinkle;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(drawX, drawY, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bintang jatuh acak tiap 4 - 9 detik
      if (!reducedMotion) {
        if (!shootingStar && now >= nextShootingStarTime) {
          shootingStar = createShootingStar(width, height);
        }

        if (shootingStar && shootingStar.active) {
          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.opacity -= 0.018;

          drawShootingStar(ctx, shootingStar);

          if (
            shootingStar.opacity <= 0 ||
            shootingStar.x > width + 100 ||
            shootingStar.y > height + 100
          ) {
            shootingStar = null;
            nextShootingStarTime = now + 4000 + Math.random() * 5000;
          }
        }
      }

      ctx.globalAlpha = 1;

      if (reducedMotion) {
        // Cukup gambar sekali jika pengguna memilih reduced motion
        return;
      }

      if (isSoftware) {
        timerId = window.setTimeout(() => {
          frameId = requestAnimationFrame(renderFrame);
        }, 90);
      } else {
        frameId = requestAnimationFrame(renderFrame);
      }
    };

    frameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion]);

  return (
    <>
      <Nebula />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        data-testid="starfield-canvas"
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      />
    </>
  );
}
