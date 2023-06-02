import React from 'react';
import styles from './CopyIcon.module.css';

function CopyIcon({ title, className, ...props }) {
  return (
    <svg viewBox="0 0 90 120" className={[styles.svg, className].join(' ')} {...props}>
      <title>{title}</title>
      <rect y="20" width="70" height="100" rx="10" ry="10" />
      <path d="m80,0H31c-5.52,0-10,4.48-10,10v4h40c8.27,0,15,6.73,15,15v70h4c5.52,0,10-4.48,10-10V10c0-5.52-4.48-10-10-10Z" />
    </svg>
  );
}

export default CopyIcon;
