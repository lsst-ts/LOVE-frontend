import React from 'react';
import styles from './Style.module.css';

function Error() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <g>
        <path
          className={styles.error}
          d="m5.52,10.84h2.62v9.3h-2.62c-2.57,0-4.65-2.08-4.65-4.65h0c0-2.57,2.08-4.65,4.65-4.65Z"
          transform="translate(-9.63 7.72) rotate(-45)"
        />
        <rect
          className={styles.error}
          x=".12"
          y="16.64"
          width="4.32"
          height="2.14"
          transform="translate(-11.86 6.8) rotate(-45)"
        />
        <g>
          <rect
            className={styles.error}
            x="2.27"
            y="10.02"
            width="6.57"
            height="2.14"
            rx=".69"
            ry=".69"
            transform="translate(-6.21 7.17) rotate(-45)"
          />
          <rect
            className={styles.error}
            x="5.63"
            y="13.38"
            width="6.57"
            height="2.14"
            rx=".69"
            ry=".69"
            transform="translate(-7.61 10.54) rotate(-45)"
          />
        </g>
        <rect
          className={styles.error}
          x="6.29"
          y="7.39"
          width="1.59"
          height="11.07"
          rx=".79"
          ry=".79"
          transform="translate(-7.06 8.79) rotate(-45)"
        />
      </g>
      <g>
        <path
          className={styles.error}
          d="m16.5-.14h2.62v9.3h-2.62c-2.57,0-4.65-2.08-4.65-4.65h0C11.86,1.94,13.94-.14,16.5-.14Z"
          transform="translate(29.63 -3.26) rotate(135)"
        />
        <rect
          className={styles.error}
          x="15.55"
          y="1.22"
          width="4.32"
          height="2.14"
          transform="translate(3.57 13.2) rotate(-45)"
        />
        <rect
          className={styles.error}
          x="12.13"
          y="1.54"
          width="1.59"
          height="11.07"
          rx=".79"
          ry=".79"
          transform="translate(27.06 2.95) rotate(135)"
        />
      </g>
    </svg>
  );
}

export default Error;
