import React, { Component } from 'react';
import styles from './RequeueIcon.module.css';

export default class RequeueIcon extends Component {
  render() {
    return (
      <svg
      className={styles.svg} 
      viewBox="0 0 22 27.25"
    >
      <title>{'Requeue script'}</title>
      <path
        className={styles.st0}
        d="M18.36 22.49v-14L14.74 5H3a1.34 1.34 0 00-1.35 1.36v19.28A1.34 1.34 0 003 27h14a1.34 1.34 0 001.34-1.34"
        transform="translate(-1.15 -.23)"
      />
      <path
        className={styles.st0}
        d="M18.36 9.21h-2.71a1.52 1.52 0 01-1.59-1.44V5.5"
        transform="translate(-1.15 -.23)"
      />
      <path
        className={styles.st1}
        d="M7.26 14.39V15a1.21 1.21 0 01-1.2 1.21v1.2a1.2 1.2 0 011.2 1.2v.58A1.83 1.83 0 009.09 21h.1v-1.23h-.33a.39.39 0 01-.4-.39v-.81a2.4 2.4 0 00-.8-1.79 2.4 2.4 0 00.8-1.78v-.8a.4.4 0 01.4-.4h.33v-1.2h-.1a1.83 1.83 0 00-1.83 1.79zM13.34 19v-.56a1.2 1.2 0 011.2-1.2v-1.18a1.2 1.2 0 01-1.2-1.2v-.56a1.85 1.85 0 00-1.85-1.85h-.08v1.21h.31a.41.41 0 01.41.41v.79a2.42 2.42 0 00.79 1.78v.05a2.42 2.42 0 00-.79 1.78v.79a.41.41 0 01-.41.41h-.31v1.21h.08A1.85 1.85 0 0013.34 19z"
        transform="translate(-1.15 -.23)"
      />
      <path
        className={styles.st0}
        d="M22.65 18.2v-14L19 .73H7.29A1.34 1.34 0 006 2.07v2.81"
        transform="translate(-1.15 -.23)"
      />
      <path
        className={styles.st0}
        d="M22.65 4.92H20a1.52 1.52 0 01-1.59-1.44V1.2"
        transform="translate(-1.15 -.23)"
      />
    </svg>
    );
  }
}
