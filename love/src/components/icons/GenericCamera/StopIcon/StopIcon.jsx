import React, { Component } from 'react';
import styles from './StopIcon.module.css';

export default class StopIcon extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={styles.svg}>
        <title>{'Stop live view'}</title>
        <path
          className={styles['cls-1']}
          d="M19.12.47a19,19,0,1,0,19,19A19,19,0,0,0,19.12.47Zm9.42,26.29a2.12,2.12,0,0,1-2.11,2.11H11.82a2.12,2.12,0,0,1-2.11-2.11V12.15A2.13,2.13,0,0,1,11.82,10H26.37a2.13,2.13,0,0,1,2.12,2.12V26.76Z"
          transform="translate(-0.14 -0.47)"
        />
      </svg>
    );
  }
}
