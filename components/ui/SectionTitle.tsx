'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionTitleProps {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionTitle({
  index,
  label,
  title,
  subtitle,
  align = 'left',
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl',
        className,
      )}
    >
      <p className="mb-3 font-mono text-xs font-medium tracking-[0.2em] uppercase text-[#22d3ee]">
        {index}. {label}
      </p>
      <h2 className="font-display text-3xl font-bold tracking-tight text-[#f1f5f9] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15] [text-wrap:balance]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-[#94a3b8] sm:text-lg [text-wrap:pretty]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
