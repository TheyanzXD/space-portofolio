'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TagListProps {
  items: string[];
  className?: string;
}

/**
 * Menampilkan daftar teknologi/metadata sebagai teks bersih dengan pemisah tipografis (·)
 * sesuai prinsip Zero-Pill Metadata Discipline.
 */
export function TagList({ items, className }: TagListProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[#94a3b8]',
        className,
      )}
    >
      {items.map((item, idx) => (
        <React.Fragment key={`${item}-${idx}`}>
          <span className="text-[#cbd5e1]">{item}</span>
          {idx < items.length - 1 && (
            <span aria-hidden="true" className="text-[#8b5cf6]">
              ·
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
