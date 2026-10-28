'use client';

import React from 'react';

/**
 * Lapisan gradien nebula atmosferik yang menyatu di belakang kanvas bintang.
 */
export function Nebula() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#05030f]"
    >
      <div
        className="absolute -top-[20%] -left-[10%] h-[65vw] w-[65vw] max-h-[780px] max-w-[780px] rounded-full opacity-25 blur-[110px]"
        style={{
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.55) 0%, rgba(19, 12, 51, 0.2) 60%, transparent 100%)',
        }}
      />
      <div
        className="absolute top-[28%] -right-[12%] h-[55vw] w-[55vw] max-h-[680px] max-w-[680px] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(34, 211, 238, 0.45) 0%, rgba(11, 7, 32, 0.15) 65%, transparent 100%)',
        }}
      />
      <div
        className="absolute -bottom-[18%] left-[20%] h-[50vw] w-[50vw] max-h-[640px] max-w-[640px] rounded-full opacity-18 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(244, 114, 182, 0.4) 0%, rgba(19, 12, 51, 0.1) 65%, transparent 100%)',
        }}
      />
    </div>
  );
}
