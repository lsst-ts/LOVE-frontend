import React from 'react';
import styles from './MinusIcon.module.css';

export default function MinusIcon(props) {
  const className = props.className ? [styles.cls1, props.className].join(' ') : styles.cls1;
  return (
    <svg viewBox="0 0 15.56 15.56" className={className}>
      <path
        d="M2.66,10.36a7.78,7.78,0,1,0,7.78-7.78A7.79,7.79,0,0,0,2.66,10.36ZM14.51,9.17a1.19,1.19,0,1,1,0,2.38H6.36a1.19,1.19,0,1,1,0-2.38Z"
        transform="translate(-2.66 -2.58)"
      />
    </svg>
  );
}
