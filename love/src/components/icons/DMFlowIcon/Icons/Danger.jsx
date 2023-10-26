import React from 'react';
import styles from './Style.module.css';

function Danger() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <g>
        <path
          className={styles.danger}
          d="m11.58,15.34l-1.95,1.95c-1.91,1.91-5.01,1.91-6.92,0h0c-1.91-1.91-1.91-5.01,0-6.92l1.95-1.95,6.92,6.92Z"
        />
        <rect
          className={styles.danger}
          x="0"
          y="16.13"
          width="5.5"
          height="2.25"
          transform="translate(-11.4 6.99) rotate(-45)"
        />
        <g>
          <rect
            className={styles.danger}
            x="3.05"
            y="8.82"
            width="6.91"
            height="2.25"
            rx=".69"
            ry=".69"
            transform="translate(-5.13 7.52) rotate(-45)"
          />
          <rect
            className={styles.danger}
            x="6.6"
            y="12.36"
            width="6.91"
            height="2.25"
            rx=".69"
            ry=".69"
            transform="translate(-6.59 11.06) rotate(-45)"
          />
        </g>
        <rect
          className={styles.danger}
          x="7.29"
          y="6.05"
          width="1.67"
          height="11.65"
          rx=".83"
          ry=".83"
          transform="translate(-6.02 9.22) rotate(-45)"
        />
      </g>
      <g>
        <path
          className={styles.danger}
          d="m15.34,11.58l1.95-1.95c1.91-1.91,1.91-5.01,0-6.92h0c-1.91-1.91-5.01-1.91-6.92,0l-1.95,1.95,6.92,6.92Z"
        />
        <rect
          className={styles.danger}
          x="14.51"
          y="1.61"
          width="5.5"
          height="2.25"
          transform="translate(3.12 13.01) rotate(-45)"
        />
        <rect
          className={styles.danger}
          x="11.04"
          y="2.3"
          width="1.67"
          height="11.65"
          rx=".83"
          ry=".83"
          transform="translate(-2.26 10.78) rotate(-45)"
        />
      </g>
    </svg>
  );
}

export default Danger;
