import React, { Component } from 'react';
import styles from './RequeueIcon.module.css';

export default class RequeueIcon extends Component {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 27.34 36.5"
        className={[styles.svg, this.props.className].join(' ')}
      >
        <title>{this.props.title}</title>
        <path
          className={styles['cls-1']}
          d="M10,.44H23.36L31.1,8.25V27.82A2.08,2.08,0,0,1,29,29.91H10A2.08,2.08,0,0,1,8,27.82V2.52A2.08,2.08,0,0,1,10,.44Z"
          transform="translate(-7.97 -0.44)"
        />
        <path
          className={styles['cls-2']}
          d="M16.93,13.45,14,15l3,1.59v1.94c-2.29-1.17-5.21-2.74-5.22-2.75V14.26s2.93-1.58,5.22-2.75v1.94Z"
          transform="translate(-7.97 -0.44)"
        />
        <path
          className={styles['cls-2']}
          d="M22.14,13.45l3,1.58-3,1.59v1.94c2.29-1.17,5.21-2.74,5.22-2.75V14.26s-2.93-1.58-5.22-2.75v1.94Z"
          transform="translate(-7.97 -0.44)"
        />
        <polygon
          className={styles['cls-2']}
          points="13.92 10.11 11.05 19.09 9.21 19.09 12.08 10.11 13.92 10.11 13.92 10.11"
        />
        <path
          className={styles['cls-3']}
          d="M14.47,27.62v-7a.66.66,0,0,1,.67-.67H28.06V18a.77.77,0,0,1,1.24-.63l4.75,3.84a.77.77,0,0,1,0,1.2L29.3,26.27a.76.76,0,0,1-1.24-.62v-2H18.18v3.88a.66.66,0,0,1-.67.67H15.14A.59.59,0,0,1,14.47,27.62Z"
          transform="translate(-7.97 -0.44)"
        />
        <path
          className={styles['cls-3']}
          d="M34.81,33a.65.65,0,0,1-.67.67H21.22v2a.77.77,0,0,1-1.24.62l-4.75-3.83a.77.77,0,0,1,0-1.2L20,27.4a.75.75,0,0,1,1.24.63v2H31.1V26.11a.65.65,0,0,1,.67-.67h2.37a.65.65,0,0,1,.67.67Z"
          transform="translate(-7.97 -0.44)"
        />
      </svg>
    );
  }
}
