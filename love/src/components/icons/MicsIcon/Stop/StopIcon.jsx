import React from 'react';
import styles from './StopIcon.module.css';

function StopIcon(props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="4 50 500 415">
      <path
        className={styles.cls1}
        d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm80,288H176V176H336Z"
      />
    </svg>
  );
}

export default StopIcon;
