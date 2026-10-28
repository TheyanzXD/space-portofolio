'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type CursorMode = 'default' | 'interactive' | 'project';

/**
 * Kursor kustom bertema titik bintang & cincin orbital dengan interpolasi lerp halus.
 * Otomatis mati pada perangkat sentuh atau mode reduced motion.
 */
export function CustomCursor() {
  const { isTouch } = useIsMobile();
  const reducedMotion = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>('default');
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    if (isTouch || reducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('[data-cursor="project"]')) {
        setMode('project');
      } else if (
        target.closest(
          'a, button, [role="button"], input, textarea, select, [data-cursor="button"]',
        )
      ) {
        setMode('interactive');
      } else {
        setMode('default');
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const id = Date.now();
      setRipples((prev) => [
        ...prev.slice(-2),
        { id, x: e.clientX, y: e.clientY },
      ]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== id));
      }, 550);
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isTouch, reducedMotion]);

  if (isTouch || reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      {/* Titik Inti Cahaya */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[#22d3ee] shadow-[0_0_12px_#22d3ee]"
      />

      {/* Cincin Pengikut (Lerp Ring) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex items-center justify-center transition-[width,height,margin,border-color,background-color] duration-200"
        style={{
          width: mode === 'project' ? 68 : mode === 'interactive' ? 46 : 32,
          height: mode === 'project' ? 68 : mode === 'interactive' ? 46 : 32,
          marginLeft:
            mode === 'project' ? -34 : mode === 'interactive' ? -23 : -16,
          marginTop:
            mode === 'project' ? -34 : mode === 'interactive' ? -23 : -16,
          borderRadius: '9999px',
          border:
            mode === 'interactive'
              ? '1.5px solid rgba(34, 211, 238, 0.85)'
              : mode === 'project'
                ? '1.5px solid rgba(139, 92, 246, 0.95)'
                : '1px solid rgba(241, 245, 249, 0.35)',
          backgroundColor:
            mode === 'project'
              ? 'rgba(11, 7, 32, 0.92)'
              : mode === 'interactive'
                ? 'rgba(34, 211, 238, 0.08)'
                : 'transparent',
        }}
      >
        {mode === 'project' && (
          <span className="font-mono text-[10px] font-bold tracking-wider text-[#22d3ee]">
            LIHAT
          </span>
        )}
      </div>

      {/* Gelombang Radar Saat Klik */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="fixed -ml-5 -mt-5 h-10 w-10 animate-ping rounded-full border border-[#22d3ee]/60"
          style={{ left: r.x, top: r.y, animationDuration: '550ms' }}
        />
      ))}
    </div>
  );
}
