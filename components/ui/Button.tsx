'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  const baseStyles =
    'group relative inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-all duration-200 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#22d3ee] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap shrink-0 overflow-hidden cursor-pointer select-none';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] text-[#05030f] font-semibold shadow-[0_0_32px_rgba(139,92,246,0.38)] hover:shadow-[0_0_44px_rgba(34,211,238,0.52)]',
    outline:
      'bg-[#0b0720]/90 text-[#f1f5f9] border border-white/15 hover:border-[#22d3ee]/60 hover:text-white hover:shadow-[0_0_28px_rgba(34,211,238,0.22)]',
    ghost:
      'bg-transparent text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-white/[0.05]',
  };

  const sizeStyles = {
    sm: 'min-h-[40px] px-4 py-2 text-xs',
    md: 'min-h-[46px] px-6 py-2.5 text-sm',
    lg: 'min-h-[52px] px-7 py-3.5 text-base',
  };

  const combinedClassName = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  const innerContent = (
    <>
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClassName}
        data-cursor="button"
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button className={combinedClassName} data-cursor="button" {...props}>
      {innerContent}
    </button>
  );
}
