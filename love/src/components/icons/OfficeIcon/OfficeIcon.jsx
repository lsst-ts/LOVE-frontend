import React from 'react';
import styles from './OfficeIcon.module.css';

export default function OfficeIcon(props) {
  const status = props.active ? styles.active : styles.inactive;
  const className = [styles.icon, props.className, props.style].join(' ');
  return (
    <svg viewBox="0 0 18.49 16.74" className={className}>
      <path className={status} d="m4.18.07L1.11,1.78c-.68.38-1.11,1.14-1.11,1.96v13h5.02V.62c0-.46-.45-.76-.83-.55Z" />
      <path
        className={status}
        d="m17.72,6.04H5.86v10.71h2.69v-2.28h7.26v2.28h2.69V6.81c0-.43-.35-.77-.77-.77Zm-8.86,4.2h-1.31v-2.38h1.31v2.38Zm5.91,0h-5.18v-2.38h5.18v2.38Zm2.04,0h-1.31v-2.38h1.31v2.38Z"
      />
    </svg>
  );
}