import React, { Component } from 'react';
import styles from './MoveUpIcon.module.css';

export default class MoveUpIcon extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.9 37.9" className={styles.svg}>
        <title>Move script up</title>
        <path
          className={styles['cls-1']}
          d="M.29,19.39a19,19,0,1,1,19,19A19,19,0,0,1,.29,19.39Zm26.07-3.16L19.51,9.84a.61.61,0,0,0-.86-.1.94.94,0,0,0-.1.1l-6.84,6.39a.62.62,0,0,0,.48,1h5V28a.62.62,0,0,0,.62.62h2.47a.62.62,0,0,0,.62-.62V17.23h5a.61.61,0,0,0,.62-.61A.65.65,0,0,0,26.36,16.23Z"
          transform="translate(-0.29 -0.44)"
        />
      </svg>
    );
  }
}
