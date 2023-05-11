import React from 'react';
import styles from './PauseIcon.module.css';

export default function PauseIcon(props) {
  const className = [styles.pauseIcon, props.className].join(' ');
  return (
    <svg className={styles.pauseIcon} viewBox="0 0 37.96 37.96"  {...props}>
      <path
        className={styles['cls-1']}
        d="M19.28.47a19,19,0,1,0,19,19A19,19,0,0,0,19.28.47Zm-2.13,27.7a.73.73,0,0,1-.74.74H11.2a.73.73,0,0,1-.75-.74V10.74A.73.73,0,0,1,11.2,10h5.21a.73.73,0,0,1,.74.75Zm11,0a.73.73,0,0,1-.75.74h-5.2a.73.73,0,0,1-.75-.74V10.74a.73.73,0,0,1,.75-.75h5.2a.73.73,0,0,1,.75.75Z"
        transform="translate(-0.29 -0.47)"
      />
    </svg>
  );
}
