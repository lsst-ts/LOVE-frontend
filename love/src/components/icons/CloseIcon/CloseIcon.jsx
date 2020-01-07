import React from 'react';
import styles from './CloseIcon.module.css';

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <title>{'Cerrar'}</title>
      <path
        className={styles.path}
        d="M3.33 22.19A1 1 0 012 20.82l8.26-8.26L2 4.31a1 1 0 010-1.38 1 1 0 011.37 0l8.25 8.25 8.26-8.26a1 1 0 011.37 1.38L13 12.56l8.25 8.26a1 1 0 010 1.37 1 1 0 01-1.38 0l-8.26-8.26z"
      />
    </svg>
  );
}

export default CloseIcon;
