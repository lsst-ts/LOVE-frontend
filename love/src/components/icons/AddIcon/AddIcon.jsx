import React from 'react';
import styles from './AddIcon.module.css';

function AddIcon({ innerClass, ...props }) {
  return (
    <svg viewBox="0 0 48.02 48.02" {...props}>
      <path
        d="M24 .47a24 24 0 1024 24 24 24 0 00-24-24zm0 7.68A2.88 2.88 0 0126.84 11v10.59H37.4a2.88 2.88 0 110 5.76H26.84v10.57a2.89 2.89 0 01-5.77 0V27.35H10.51a2.88 2.88 0 110-5.76h10.56V11A2.88 2.88 0 0124 8.15z"
        className={innerClass ?? styles['cls-1']}
        transform="translate(.05 -.47)"
      ></path>
    </svg>
  );
}

export default AddIcon;
