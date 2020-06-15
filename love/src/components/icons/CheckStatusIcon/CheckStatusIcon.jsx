import React from 'react';
import styles from './CheckStatusIcon.module.css';

function CheckStatusIcon(props) {
  if (props.checked) {
    return (
      <svg className={styles.checked} viewBox="0 0 60.68 60.68">
        <circle className={styles.circle} cx="30.82" cy="30" r="28" />
        <path
          className={styles.path}
          d="M32.56,2.3A30.32,30.32,0,0,0,18.05,6a1.2,1.2,0,0,0-.48,1.63,1.21,1.21,0,0,0,1.63.48,28,28,0,1,1-6.27,4.66,1.2,1.2,0,1,0-1.69-1.7A30.34,30.34,0,1,0,32.56,2.3Z"
          transform="translate(-2.22 -2.3)"
        />
        <polyline className={styles.polyline} points="17.38 34.54 26.81 44.21 43.75 20.02" />
      </svg>
    );
  } else {
    return (
      <svg className={styles.unckecked}>
        <circle className={styles.circle} cx="30.82" cy="30" r="28" />
        <path
          className={styles.path}
          d="M31,2.3A30.32,30.32,0,0,0,16.48,6,1.21,1.21,0,0,0,16,7.62a1.22,1.22,0,0,0,1.64.48,27.93,27.93,0,1,1-6.28,4.66,1.2,1.2,0,1,0-1.69-1.7A30.34,30.34,0,1,0,31,2.3Z"
          transform="translate(-0.65 -2.3)"
        />
        <path
          className={styles.path}
          d="M20,45a1.23,1.23,0,0,1-1.74,0,1.21,1.21,0,0,1,0-1.72L28.73,32.74,18.25,22.26A1.23,1.23,0,1,1,20,20.52L30.47,31,40.94,20.52a1.23,1.23,0,1,1,1.74,1.74L32.21,32.73,42.68,43.21A1.23,1.23,0,1,1,40.94,45L30.47,34.47Z"
          transform="translate(-0.65 -2.3)"
        />
      </svg>
    );
  }
}

export default CheckStatusIcon;
