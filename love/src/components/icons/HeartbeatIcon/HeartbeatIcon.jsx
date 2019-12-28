import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './HeartbeatIcon.module.css';

export default class HeartbeatIcon extends Component {
  static propTypes = {
    /** SAL property: Index of Script SAL component */
    status: PropTypes.oneOf(['ok', 'alert', 'unknown']),
    title: PropTypes.string,
  };

  static defaultProps = {
    status: 'ok',
    title: 'Script heartbeat',
  };

  render() {
    let statusStyle = '';
    if (this.props.status === 'ok') statusStyle = styles.okStatus;
    if (this.props.status === 'alert') statusStyle = styles.alertStatus;
    const title = this.props.title;

    return this.props.status === 'ok' ? (
      <svg
        className={[styles.heartbeatIcon, statusStyle].join(' ')}
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        viewBox="0 0 61.87 53.57"
      >
        <title>{title}</title>
        <g id="Icons">
          <path
            d="M48.83,7.53a16.63,16.63,0,0,0-18,7.54A16.66,16.66,0,1,0,5.74,36.33l7.3,7.3,7,7L29.35,60a2.16,2.16,0,0,0,3,0L56,36.33a16.65,16.65,0,0,0,2-23.09,21.48,21.48,0,0,0-4.14-3.61A31.48,31.48,0,0,0,48.83,7.53Z"
            transform="translate(0.11 -6.99)"
          />
        </g>
      </svg>
    ) : (
      <svg
        className={[styles.heartbeatIcon, statusStyle].join(' ')}
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        viewBox="0 0 63.74 61.19"
      >
        <title>{title}</title>
        <line x1="4.55" y1="59.19" x2="61.74" y2="2" />
        <g id="Icons">
          <path
            d="M21.3,51.6l9.31,9.31a2.15,2.15,0,0,0,3,0L57.28,37.29a16.65,16.65,0,0,0,2-23.09Z"
            transform="translate(-1.26 -0.96)"
          />
          <path
            d="M50.09,8.49a16.64,16.64,0,0,0-18,7.54A16.66,16.66,0,1,0,7,37.29l7.3,7.3Z"
            transform="translate(-1.26 -0.96)"
          />
        </g>
      </svg>
    );
  }
}
