import React from 'react';
import styles from './PlayIcon.module.css';

function PlayIcon(props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        className={styles.cls1}
        d="m12,0C5.37,0,0,5.37,0,12s5.37,12,12,12,12-5.37,12-12S18.63,0,12,0Zm5.19,12.84l-8.01,5.32c-.47.32-1.11.19-1.43-.29-.11-.17-.17-.37-.17-.57V6.67c0-.57.44-1.04,1.01-1.05.21,0,.41.06.59.17l8,5.31c.48.31.62.95.31,1.42-.08.12-.18.23-.31.31h.01Z"
      />
    </svg>
  );
}

export default PlayIcon;
