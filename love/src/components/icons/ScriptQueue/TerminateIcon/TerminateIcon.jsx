import React, { Component } from 'react';
import styles from './TerminateIcon.module.css';

export default class TerminateIcon extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" className={styles.svg}>
        <title>{'Terminate script'}</title>
        <path
          className={styles['cls-1']}
          d="M19.29.44a19,19,0,1,0,19,19A19,19,0,0,0,19.29.44ZM29.37,27.13,27,29.52a.82.82,0,0,1-1.16,0l-5.94-5.95a.83.83,0,0,0-1.17,0l-5.94,5.95a.83.83,0,0,1-1.17,0L9.21,27.13a.83.83,0,0,1,0-1.17L15.16,20a.83.83,0,0,0,0-1.17L9.21,12.91a.82.82,0,0,1,0-1.16l2.39-2.4a.83.83,0,0,1,1.17,0l5.94,6a.83.83,0,0,0,1.17,0l5.94-6a.82.82,0,0,1,1.16,0l2.39,2.4a.8.8,0,0,1,0,1.16l-5.94,5.94a.83.83,0,0,0,0,1.17L29.37,26A.82.82,0,0,1,29.37,27.13Z"
          transform="translate(-0.29 -0.44)"
        />
      </svg>
    );
  }
}
