import React, { Component } from 'react';
import styles from './MoveUpIcon.module.css';

export default class MoveUpIcon extends Component {
  render() {
    return (
      <svg viewBox="0 0 19.84 20.83" className={styles.svg}>
        <title>{'Move script up'}</title>
        <path
          d="M10.46.44a.76.76 0 00-1.08 0L.47 9.38a.77.77 0 00-.16.84.78.78 0 00.71.47h8.13v9.12a.76.76 0 00.77.77.76.76 0 00.54-.22.79.79 0 00.23-.55V9.92a.77.77 0 00-.77-.77h-7l7-7 7 7h-3.49a.77.77 0 100 1.54h5.39a.78.78 0 00.71-.47.77.77 0 00-.16-.84z"
          fill="#798d99"
          stroke="#798d99"
          strokeMiterlimit={10}
          strokeWidth={0.5}
        />
      </svg>
    );
  }
}
