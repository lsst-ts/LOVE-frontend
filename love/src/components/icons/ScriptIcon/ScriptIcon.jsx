import React, { Component } from 'react';
import styles from './ScriptIcon.module.css';

export default class ScriptIcon extends Component {
  render() {
    const status = this.props.active !== undefined && this.props.active === false ? styles.inactive : styles.active;
    return (
      <svg className={styles["svg"]} viewBox="0 0 42.4 53.54">
        <title>{'XML version'}</title>
        <path 
          className={styles["cls-1"]} 
          d="M7.09,2.91H31.5L45.69,17.1V52.65a3.81,3.81,0,0,1-3.79,3.8H7.09a3.81,3.81,0,0,1-3.8-3.8V6.7a3.8,3.8,0,0,1,3.8-3.79Zm12,24-6.16,3.28,6.16,3.27v4C14.29,35.09,8.2,31.84,8.17,31.83V28.62S14.29,25.36,19.05,23v4Zm10.88,0,6.16,3.28L29.93,33.5v4c4.77-2.41,10.85-5.66,10.88-5.67V28.62S34.7,25.36,29.93,23v4Zm-.52-6-6,18.55H19.57l6-18.55Z" 
          transform="translate(-3.29 -2.91)"
        />
      </svg>
    );
  }
}
