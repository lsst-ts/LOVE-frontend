import React from 'react';
import styles from './Style.module.css';

function Disabled() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <g>
        <path
          className={styles.disabled}
          d="m5.48,10.69h2.76v9.79h-2.76c-2.7,0-4.89-2.19-4.89-4.89h0c0-2.7,2.19-4.89,4.89-4.89Z"
          transform="translate(-9.73 7.69) rotate(-45)"
        />
        <rect
          className={styles.disabled}
          x="-.22"
          y="15.63"
          width="6.91"
          height="2.25"
          transform="translate(-10.9 7.2) rotate(-45)"
        />
        <g>
          <rect
            className={styles.disabled}
            x="2.05"
            y="9.82"
            width="6.91"
            height="2.25"
            rx=".69"
            ry=".69"
            transform="translate(-6.13 7.1) rotate(-45)"
          />
          <rect
            className={styles.disabled}
            x="5.6"
            y="13.36"
            width="6.91"
            height="2.25"
            rx=".69"
            ry=".69"
            transform="translate(-7.59 10.65) rotate(-45)"
          />
        </g>
        <rect
          className={styles.disabled}
          x="6.29"
          y="7.05"
          width="1.67"
          height="11.65"
          rx=".83"
          ry=".83"
          transform="translate(-7.02 8.81) rotate(-45)"
        />
      </g>
      <g>
        <path
          className={styles.disabled}
          d="m16.65-.48h2.76v9.79h-2.76c-2.7,0-4.89-2.19-4.89-4.89h0C11.76,1.71,13.95-.48,16.65-.48Z"
          transform="translate(29.73 -3.49) rotate(135)"
        />
        <rect
          className={styles.disabled}
          x="13.3"
          y="2.11"
          width="6.91"
          height="2.25"
          transform="translate(30.9 -6.32) rotate(135)"
        />
        <rect
          className={styles.disabled}
          x="12.04"
          y="1.3"
          width="1.67"
          height="11.65"
          rx=".83"
          ry=".83"
          transform="translate(27.02 3.05) rotate(135)"
        />
      </g>
    </svg>
  );
}

export default Disabled;
