import React from 'react';
import styles from './Style.module.css';

function Enabled() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <g>
        <path
          className={styles.enabled}
          d="m12.58,14.34l-1.95,1.95c-1.91,1.91-5.01,1.91-6.92,0h0c-1.91-1.91-1.91-5.01,0-6.92l1.95-1.95,6.92,6.92Z"
        />
        <rect
          className={styles.enabled}
          x="-.22"
          y="15.63"
          width="6.91"
          height="2.25"
          transform="translate(-10.9 7.2) rotate(-45)"
        />
        <g>
          <rect
            className={styles.enabled}
            x="4.05"
            y="7.82"
            width="6.91"
            height="2.25"
            rx=".69"
            ry=".69"
            transform="translate(-4.13 7.93) rotate(-45)"
          />
          <rect
            className={styles.enabled}
            x="7.6"
            y="11.36"
            width="6.91"
            height="2.25"
            rx=".69"
            ry=".69"
            transform="translate(-5.59 11.47) rotate(-45)"
          />
        </g>
        <rect
          className={styles.enabled}
          x="8.29"
          y="5.05"
          width="1.67"
          height="11.65"
          rx=".83"
          ry=".83"
          transform="translate(-5.02 9.64) rotate(-45)"
        />
      </g>
      <g>
        <path
          className={styles.enabled}
          d="m14.34,12.58l1.95-1.95c1.91-1.91,1.91-5.01,0-6.92h0c-1.91-1.91-5.01-1.91-6.92,0l-1.95,1.95,6.92,6.92Z"
        />
        <rect
          className={styles.enabled}
          x="13.3"
          y="2.11"
          width="6.91"
          height="2.25"
          transform="translate(2.62 12.8) rotate(-45)"
        />
        <rect
          className={styles.enabled}
          x="10.04"
          y="3.3"
          width="1.67"
          height="11.65"
          rx=".83"
          ry=".83"
          transform="translate(-3.26 10.36) rotate(-45)"
        />
      </g>
    </svg>
  );
}

export default Enabled;
