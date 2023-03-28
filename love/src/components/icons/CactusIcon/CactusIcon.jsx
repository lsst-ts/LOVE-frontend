import React from 'react';
import styles from './CactusIcon.module.css';

export default function CactusIcon(props) {
  const status = props.active ? styles.active : styles.inactive;
  const className = [styles.cactusIcon, props.className, props.style].join(' ');
  return (
    <svg viewBox="0 0 19.84 20" className={className}>
      <path
        className={status} 
        d="m17.84,6.35c-1.1,0-2,.9-2,2v3.8c0,.44-.36.81-.81.81h-1.11V4c0-2.21-1.79-4-4-4s-4,1.79-4,4v4.95h-1.11c-.44,0-.81-.36-.81-.81v-3.8c0-1.1-.9-2-2-2S0,3.24,0,4.35v3.8c0,2.65,2.16,4.81,4.81,4.81h1.11v6.05c0,.55.45,1,1,1h6c.55,0,1-.45,1-1v-2.05h1.11c2.65,0,4.81-2.16,4.81-4.81v-3.8c0-1.1-.9-2-2-2Z"/>
    </svg>
  );
}
