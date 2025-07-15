import React, { memo } from 'react';
import styles from './M1M3DetailedStatus.module.css';


function M1M3DetailedStatus(props) {
  return <div className={styles.container}>{props.title}</div>
}


export default memo(M1M3DetailedStatus);
