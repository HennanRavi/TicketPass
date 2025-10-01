import React from 'react';

/** Largura travada para FHD (figma) */
export default function Container({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-6">{children}</div>
  );
}
