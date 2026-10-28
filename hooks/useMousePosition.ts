'use client';

import { useEffect, useRef } from 'react';

export interface MouseCoordinates {
  x: number;
  y: number;
  normalizedX: number; // -1 sampai 1
  normalizedY: number; // -1 sampai 1
}

/**
 * Hook pelacak posisi kursor yang menyimpan nilai pada useRef
 * agar loop animasi 3D/Canvas bisa membacanya tanpa memicu re-render React 60Hz.
 */
export function useMousePosition() {
  const mouseRef = useRef<MouseCoordinates>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      mouseRef.current.normalizedX = (event.clientX / width) * 2 - 1;
      mouseRef.current.normalizedY = -(event.clientY / height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mouseRef;
}
