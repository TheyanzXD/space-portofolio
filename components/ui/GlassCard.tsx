'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlight?: boolean;
  hoverLift?: boolean;
}

/**
 * Panel permukaan ruang angkasa dengan efek spotlight kursor opsional.
 * Menggunakan warna permukaan terkalibrasi tanpa backdrop-filter berat di atas WebGL.
 */
export function GlassCard({
  children,
  className,
  spotlight = true,
  hoverLift = true,
  ...props
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlight || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative rounded-[20px] border border-white/[0.08] bg-[#0b0720]/90 transition-all duration-300',
        hoverLift &&
          'hover:-translate-y-1.5 hover:border-[#8b5cf6]/45 hover:shadow-[0_0_40px_rgba(139,92,246,0.22)]',
        className,
      )}
      {...props}
    >
      {spotlight && isHovered && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[20px] opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34, 211, 238, 0.12), rgba(139, 92, 246, 0.06) 45%, transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
