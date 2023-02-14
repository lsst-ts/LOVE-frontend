import React from 'react';
import styles from './PlusMinusIcon.module.css';

function PlusMinusIcon({ className, ...props }) {
  return (
    <svg class={className} viewBox="0 0 50 50" {...props}>
      <g transform="translate(0, -4.5)">
        <path class={styles.path} d="M9.077,25.99h14v14c0,0.553,0.448,1,1,1s1-0.447,1-1v-14h14c0.552,0,1-0.447,1-1s-0.448-1-1-1h-14v-14c0-0.553-0.448-1-1-1
            s-1,0.447-1,1v14h-14c-0.552,0-1,0.447-1,1S8.525,25.99,9.077,25.99z"/>
      </g>
      <g transform="translate(0, 20.5)">
        <path class={styles.path} d="M40,23.99H10c-0.552,0-1,0.447-1,1s0.448,1,1,1h30c0.552,0,1-0.447,1-1S40.552,23.99,40,23.99z"/>
      </g>
    </svg>
  );
}

export default PlusMinusIcon;
