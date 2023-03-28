import React from 'react';
import styles from './ExitModeIcon.module.css';

function ExitModeIcon(props) {
  return (
    <svg viewBox="0 0 59.05 54.85" {...props}>
      <path
        d="M16.2 28.47a5.2 5.2 0 005.22 5.22h21.1v13.77a8.44 8.44 0 01-8.44 8.44H8.76a8.44 8.44 0 01-8.44-8.44v-38a8.44 8.44 0 018.44-8.41h25.32a8.44 8.44 0 018.44 8.44v13.76h-21.1a5.11 5.11 0 00-5.22 5.22zM58.78 27l-8.44-8.44a2.11 2.11 0 10-3 3l4.85 4.83H21.42a2.11 2.11 0 000 4.22H52.2l-4.85 4.83a2.12 2.12 0 000 3 2.1 2.1 0 003 0L58.78 30a2.18 2.18 0 000-3z"
        className={styles['cls-1']}
        transform="translate(-.32 -1.05)"
      ></path>
    </svg>
  );
}

export default ExitModeIcon;
