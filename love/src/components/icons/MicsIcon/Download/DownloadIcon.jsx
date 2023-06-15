import React from 'react';
import styles from './DownloadIcon.module.css';

function DownloadIcon(props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.1 20.38">
      <polyline className={styles.cls2} points="22.1 15.79 22.1 19.38 1 19.38 1 15.79" />
      <polygon
        className={styles.cls1}
        points="13.26 7.91 13.26 0 9.85 0 9.85 7.91 7.05 7.91 9.3 11.29 11.55 14.68 13.8 11.29 16.06 7.91 13.26 7.91"
      />
    </svg>
  );
}

export default DownloadIcon;
