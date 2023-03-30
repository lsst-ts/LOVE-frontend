import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './WindRose.module.css';

export default class WindRose extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.21 61.32">
        <path
          d="M36.66 31.62l2.59-5a1.57 1.57 0 00-2.13-2.13L32 26.91l1.21 3.5zM12.33 31.62l3.5-1.21 1.22-3.5-5-2.43a1.57 1.57 0 00-2.15 2.13zM36.66 46.52l-3.5 1.22-1.16 3.5 5 2.58a1.57 1.57 0 002.12-2.13zM12.33 46.52l-2.58 5a1.57 1.57 0 002.13 2.13l5-2.58-1.22-3.5z"
          className={styles['cls-1']}
          transform="translate(-.86 -1.55)"
        ></path>
        <path
          d="M47 37.55l-11.4-3.8-1.22-.45-3.19-1.07-.61-1.82-.46-1.22-.45-1.19L26 16.57a1.58 1.58 0 00-3 0L19.18 28l-.46 1.21-.3 1.22-.61 2-3.19 1.07-1.22.45L2 37.55a1.58 1.58 0 000 3l11.4 3.85 1.22.45 1.21.46 2 .61.61 2 .45 1.22.46 1.22 3.8 11.4a1.58 1.58 0 003 0L30 50.33l.46-1.22.45-1.22.61-2 2-.61 1.21-.46 1.22-.45 11.4-3.81a1.73 1.73 0 00-.35-3.01zm-22.5 6.24a4.72 4.72 0 114.71-4.72 4.74 4.74 0 01-4.71 4.72z"
          className={styles['cls-1']}
          transform="translate(-.86 -1.55)"
        ></path>
        <path
          d="M27.67 10.94L21.28 2.4v8.54H21V2.05h.39l6.39 8.53V2.05h.28v8.89z"
          className={styles['cls-2']}
          transform="translate(-.86 -1.55)"
        ></path>
      </svg>
    );
  }
}
