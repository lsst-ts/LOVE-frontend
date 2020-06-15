import React, { Component } from 'react';
import styles from './StopIcon.module.css';

export default class StopIcon extends Component {
  render() {
    return (
      <svg viewBox="1 0 23.9 23.9" className={styles.svg}>
        <title>{'Stop script'}</title>
        <path
          className={styles.st0}
          d="M21.6 20H5.4c-.4 0-.8-.3-.8-.7V4.2c0-.4.4-.7.8-.7h14.1c.4 0 .8.3.8.7v10.4c-.1.4-.6.7-1 .6-.3-.1-.5-.3-.6-.6V5.3H6.2v13.1h16c.4.1.7.6.6 1-.1.3-.3.5-.6.6h-.6z"
        />
        <path className={styles.st0} d="M5.8 4.8h14.5v14H5.8z" />
      </svg>
    );
  }
}
