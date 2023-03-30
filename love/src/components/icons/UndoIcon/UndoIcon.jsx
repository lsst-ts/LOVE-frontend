import React from 'react';
import styles from './UndoIcon.module.css';

function UndoIcon(props) {
  return (
    <svg viewBox="0 0 46.36 49.01" {...props}>
      <path
        d="M46.55 26.81A20.72 20.72 0 0126 50.22H12.53a1.73 1.73 0 01-1.71-1.71v-5.3a1.73 1.73 0 011.71-1.71h13.6A12 12 0 0037.89 27a12.26 12.26 0 00-12.12-9.49h-6.29v5.88a1.69 1.69 0 01-2.62 1.39L1.13 14.55a1.69 1.69 0 010-2.84L16.86 1.5a1.68 1.68 0 012.62 1.4v5.87h5.88c10.52 0 19.9 7.58 21.19 18.04z"
        className={styles['cls-1']}
        transform="translate(-.36 -1.21)"
      ></path>
    </svg>
  );
}

export default UndoIcon;
