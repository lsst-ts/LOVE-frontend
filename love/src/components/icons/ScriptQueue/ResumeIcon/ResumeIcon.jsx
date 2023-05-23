import React from 'react';
import styles from './ResumeIcon.module.css';

export default function ResumeIcon(props) {
  const className = [styles.svg, props.className].join(' ');
  return (
    <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.94 37.94" {...props}>
      <path
        className={styles['cls-1']}
        d="M19,0A19,19,0,1,0,38,19,19,19,0,0,0,19,0Zm8.36,20.35L14.46,28.92a1.66,1.66,0,0,1-2.58-1.38V10.41A1.66,1.66,0,0,1,14.46,9l12.88,8.56A1.66,1.66,0,0,1,27.34,20.35Z"
        transform="translate(-0.01)"
      />
    </svg>
  );
}
