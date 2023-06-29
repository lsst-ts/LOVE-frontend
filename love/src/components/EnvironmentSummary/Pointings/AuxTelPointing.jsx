import React, { Component } from 'react';
import styles from './AuxTelPointing.module.css';

function AuxTelPointing({ className, ...props }) {
  return (
    <svg viewBox="0 0 14.63 14.63" className={className} {...props}>
      <g id="AuxTel">
        <circle className={styles.cls2} cx="7.32" cy="7.32" r="6.82" />
        <text className={styles.cls1} transform="translate(2.72 11.43)">
          <tspan x="0" y="0">
            A
          </tspan>
        </text>
      </g>
    </svg>
  );
}

export default AuxTelPointing;
