import React, { Component } from 'react';
import styles from './SimonyiPointing.module.css';

function SimonyiPointing({ className, ...props }) {
  return (
    <svg viewBox="0 0 14.63 14.63" className={className} {...props}>
      <g id="Simonyi">
        <circle className={styles.cls2} cx="7.32" cy="7.32" r="6.82" />
        <text className={styles.cls1} transform="translate(3.49 11.43)">
          <tspan x="0" y="0">
            S
          </tspan>
        </text>
      </g>
    </svg>
  );
}

export default SimonyiPointing;
