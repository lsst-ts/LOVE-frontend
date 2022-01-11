import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Inclinometer.module.css';

export default class DomePointing extends Component {
  static propTypes = {
    /** Skyview width */
    width: PropTypes.number,
    /** Skyview height */
    height: PropTypes.number,
    /** Inclination */
    inclination: PropTypes.number,
  };

  static defaultProps = {
    width: 302,
    height: 165.85,
    inclination: 0,
  };

  render() {
    const { width, height, inclination } = this.props;
    return (
      <svg className={styles.svgOverlay} height={height} width={width} viewBox="0 0 302 165.85">
        <path className={styles['cls-1']} d="M1,164.85a150,150,0,0,1,300,0" />
        <line className={styles['cls-1']} x1="151" y1="14.85" x2="151" y2="159.46" />
        <rect className={styles['cls-1']} x="1" y="155.62" width="300" height="9.23" />
        <line
          style={{
            transform: `rotate(${inclination}deg)`,
          }}
          className={styles.marker}
          x1="151"
          y1="3.31"
          x2="151"
          y2="164.85"
        />
        <path className={styles['cls-3']} d="M111,164.85a40,40,0,0,1,80,0" />
        <rect
          style={{
            transform: `rotate(${inclination}deg)`,
          }}
          className={styles['cls-3']}
          x="104.85"
          y="1"
          width="92.31"
          height="23.08"
        />
      </svg>
    );
  }
}
