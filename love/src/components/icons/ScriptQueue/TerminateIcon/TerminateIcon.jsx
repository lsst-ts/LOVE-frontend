import React, { Component } from 'react';
import styles from './TerminateIcon.module.css';

export default class TerminateIcon extends Component {
  render() {
    return (
      <svg viewBox="0 0 23.9 23.9" className={styles.svg}>
        <title>{'Terminate script'}</title>
        <path
          className={styles.st0}
          d="M19.6 18.5L6.3 4.2c-.3-.3-.9-.3-1.3 0-.3.4-.3 1 0 1.3l13.3 14.4c.3.4.9.5 1.3.2s.5-.9.2-1.3c0-.1-.1-.1-.1-.1l-.1-.2z"
        />
        <path
          className={styles.st0}
          d="M6.3 19.8c-.4.3-.9.3-1.3 0-.4-.4-.4-.9 0-1.3L18.2 4.2c.3-.4.9-.4 1.3-.1s.4.9.1 1.3L6.3 19.8z"
        />
      </svg>
    );
  }
}
