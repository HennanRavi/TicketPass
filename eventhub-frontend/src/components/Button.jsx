import React from 'react';

/** Variantes com tokens e altura consistente (44px ~ btn 25px) */
export default function Button({ variant='primary', className='', children, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded px-6 h-[44px] ' + // altura fixa
    'font-sans font-normal text-btn transition-colors ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-brand-blue text-white hover:brightness-110',
    success: 'bg-brand-green text-white hover:brightness-110',
    outline: 'bg-transparent border border-outline text-neutral-700 hover:bg-neutral-100',
  };

  return (
    <button className={[base, variants[variant], className].join(' ')} {...props}>
      {children}
    </button>
  );
}
