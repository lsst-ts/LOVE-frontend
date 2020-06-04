import React, { Component } from 'react';
import styles from './HealpixOverlay.module.css';

export default class HealpixOverlay extends Component {
  render() {
      const {width, height} = this.props;
    return (
        <svg className={styles.svg} width={width} height={height} viewBox='0 0 100 100'>
        <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
      </svg>
    );
  }
}
