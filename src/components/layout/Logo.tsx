'use client';

import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  alt?: string;
}

/**
 * Project DNA brand logo.
 * Prefers the real brand image at /public/logo.png — drop the official
 * PNG there and it is picked up automatically. Falls back to /logo.svg
 * while the PNG is not present.
 */
export const Logo: React.FC<LogoProps> = ({
  className = 'w-6 h-6',
  alt = 'Project DNA'
}) => {
  const [src, setSrc] = useState('/logo.png');

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`${className} object-contain select-none`}
      draggable={false}
      onError={() => {
        if (src !== '/logo.svg') setSrc('/logo.svg');
      }}
    />
  );
};
