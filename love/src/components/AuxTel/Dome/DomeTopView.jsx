import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './DomeTopView.module.css';

export default class DomeTopView extends Component {
  static propTypes = {
    /** Skyview width */
    width: PropTypes.number,
    /** Skyview height */
    height: PropTypes.number,
  };

  static defaultProps = {
    width: 596,
    height: 596,
    isProjected: true,
  };

  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width * 1.35}
        height={this.props.height * 1.35}
        viewBox="0 0 703 703"
      >
        <circle className={styles.background} cx="351.4" cy="353.09" r="276.09" />
        <path
          className={styles.background}
          d="M602.72,239A276.09,276.09,0,0,1,496.84,588l38.42,60A349,349,0,0,0,699.7,352.63c0-44.43-10.92-102.69-31.55-143.35Z"
        />
        <rect
          className={styles.foreground}
          x="166.36"
          y="85.11"
          width="120.49"
          height="28.25"
          transform="rotate(-26.04 226.62 99.237)"
        />
        <rect
          className={styles.foreground}
          x="251.73"
          y="619.61"
          width="120.49"
          height="28.1"
          transform="rotate(-172.05 311.974 633.656)"
        />
        <rect
          className={styles.foreground}
          x="489.59"
          y="137.49"
          width="120.49"
          height="28.25"
          transform="rotate(45 549.84 151.611)"
        />
        <rect
          className={styles.foreground}
          x="8.2"
          y="368.85"
          width="120.49"
          height="28.1"
          transform="rotate(-96.02 68.46 382.91)"
        />
      </svg>
    );
  }
}
