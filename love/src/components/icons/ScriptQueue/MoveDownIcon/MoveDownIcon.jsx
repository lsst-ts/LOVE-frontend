import React, { Component } from 'react';
import styles from './MoveDownIcon.module.css';

export default class MoveDownIcon extends Component {
  render() {
    return (
      <svg viewBox="0 0 19.84 20.83" className={styles.svg}>
        <title>{'Move script down'}</title>
        <path
          d="M11.41,20.48a.76.76,0,0,0,1.08,0l8.91-8.91a.77.77,0,0,0,.16-.84.78.78,0,0,0-.71-.47H12.72V1.14A.76.76,0,0,0,12,.37a.8.8,0,0,0-.54.22.79.79,0,0,0-.23.55V11a.77.77,0,0,0,.77.77h7l-7,7-7-7H8.44a.77.77,0,0,0,0-1.54H3.05a.78.78,0,0,0-.71.47.77.77,0,0,0,.16.84Z"
          fill="#798d99"
          stroke="#798d99"
          strokeMiterlimit={10}
          strokeWidth={0.5}
        />
      </svg>
    );
  }
}
