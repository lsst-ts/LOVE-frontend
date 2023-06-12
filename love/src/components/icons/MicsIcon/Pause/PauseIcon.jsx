import React from 'react';
import styles from './PauseIcon.module.css';

function PauseIcon(props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.6 23.6">
      <path
        className={styles.cls1}
        d="m11.8,0C5.28,0,0,5.28,0,11.8s5.28,11.8,11.8,11.8,11.8-5.28,11.8-11.8S18.32,0,11.8,0Zm-1.28,18.23h-1.71V5.38h1.71v12.85Zm4.27,0h-1.71V5.38h1.71v12.85Z"
      />
    </svg>
  );
}

export default PauseIcon;
