'use client';

import { useEffect, useState } from 'react';

/**
 * Mendeteksi apakah viewport saat ini berukuran mobile/tablet (< 768px) atau perangkat sentuh.
 */
export function useIsMobile(breakpoint = 768): {
  isMobile: boolean;
  isTouch: boolean;
} {
  const [state, setState] = useState({ isMobile: false, isTouch: false });

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < breakpoint;
      const touch =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setState({ isMobile: mobile, isTouch: touch });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice, { passive: true });
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, [breakpoint]);

  return state;
}
