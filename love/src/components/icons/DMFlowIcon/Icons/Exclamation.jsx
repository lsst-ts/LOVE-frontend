import React from 'react';
import styles from './Style.module.css';

function Exclamation() {
  return (
    <svg viewBox="0 0 1.25 6">
      <path
        className={styles.alert}
        d="m.62,0C.28,0,.03.18.03.5.03,1.47.14,2.86.14,3.83c0,.25.22.36.48.36.2,0,.47-.11.47-.36,0-.97.11-2.36.11-3.33,0-.32-.27-.5-.59-.5Z"
      />
      <path className={styles.alert} d="m.63,4.75c-.35,0-.63.28-.63.63s.28.63.63.63.63-.28.63-.63-.28-.63-.63-.63Z" />
    </svg>
  );
}

export default Exclamation;
