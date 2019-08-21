import React, { Component } from 'react';
import styles from './MoveToTopIcon.module.css';

export default class MoveToTopIcon extends Component {
  render() {
    return (
      <svg viewBox="0 0 21.88 24.27" className={styles.svg}>
        <title>{'Move script to top'}</title>
        <path
          className={styles.st0}
          d="M12.49 4a.76.76 0 00-1.08 0L2.5 12.94a.77.77 0 00-.16.84.78.78 0 00.71.47h8.13v9.12a.76.76 0 00.77.77.76.76 0 00.54-.22.79.79 0 00.23-.55v-9.89a.77.77 0 00-.77-.77h-7l7-7 7 7h-3.49a.77.77 0 100 1.54h5.39a.78.78 0 00.71-.47.77.77 0 00-.16-.84zM2.15 2.26a1 1 0 01-.89-.95.85.85 0 011-.88L21.68.37a.93.93 0 01.07 1.85z"
          transform="translate(-1.01 -.12)"
        />
      </svg>
    );
  }
}