import React, { Component } from 'react';
import styles from './CloudlessSkyIcon.module.css';

function CloudlessSkyIcon(props) {
  return (
    <svg viewBox="0 0 81.09 78.36" {...props}>
      <g>
      <path className={styles.path} d="m28.66,18.29l13.61,3.93c1.68.63,1.68,3.01,0,3.64l-13.61,3.93c-.52.2-.94.61-1.14,1.14l-3.93,13.61c-.63,1.68-3.01,1.68-3.64,0l-3.93-13.61c-.2-.52-.61-.94-1.14-1.14l-13.61-3.93c-1.68-.63-1.68-3.01,0-3.64l13.61-3.93c.52-.2.94-.61,1.14-1.14l3.93-13.61c.63-1.68,3.01-1.68,3.64,0l3.93,13.61c.2.52.61.94,1.14,1.14Z"/>
      <path className={styles.path} d="m71.75,61.07l8.55,2.47c1.06.4,1.06,1.89,0,2.29l-8.55,2.47c-.33.12-.59.38-.71.71l-2.47,8.55c-.4,1.06-1.89,1.06-2.29,0l-2.47-8.55c-.12-.33-.38-.59-.71-.71l-8.55-2.47c-1.06-.4-1.06-1.89,0-2.29l8.55-2.47c.33-.12.59-.38.71-.71l2.47-8.55c.4-1.06,1.89-1.06,2.29,0l2.47,8.55c.12.33.38.59.71.71Z"/>
      <circle className={styles.path} cx="27.05" cy="66.98" r="7.21"/>
      <circle className={styles.path} cx="52.16" cy="4.19" r="4.19"/>
      <circle className={styles.path} cx="68.63" cy="26.79" r="10.62"/>
      </g>
    </svg>
    );
  }

export default CloudlessSkyIcon;
