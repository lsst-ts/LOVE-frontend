import React from 'react';
import styles from './ExitModeIcon.module.css';

function ExitModeIcon(props) {
  return (
    <svg viewBox="0 0 27.8 27.8" {...props}>
      <path
        className={styles.path}
        d="M19.11,16.15a.48.48,0,0,0-.49.48v9H2.86V1H18.62v9a.49.49,0,0,0,1,0V.48A.48.48,0,0,0,19.11,
      0H2.37a.48.48,0,0,0-.5.48V26.13a.48.48,0,0,0,.5.47H19.11a.48.48,0,0,0,.49-.47v-9.5A.48.48,0,0,0,19.11,16.15Z"
        transform="translate(-1.87)"
      />
      <path
        className={styles.path}
        d="M28.12,13.14l-6-5.75a.46.46,0,0,0-.49-.09.44.44,0,0,0-.28.4V13H14.77a.45.45,0,0,0-.45.44.44.44,0,0,
      0,.13.31.53.53,0,0,0,.32.12h7.06a.45.45,0,0,0,.45-.44V8.75l4.87,4.7-4.89,4.72V16.76a.45.45,0,0,0-.46-.43.44.44,
      0,0,0-.45.43v2.47a.44.44,0,0,0,.28.4.45.45,0,0,0,.49-.1l6-5.77A.42.42,0,0,0,28.12,13.14Z"
        transform="translate(-1.87)"
      />
    </svg>
  );
}

export default ExitModeIcon;
