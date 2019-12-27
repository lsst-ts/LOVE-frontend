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
    const { title } = this.props;
    return (
      <svg
        className={[styles.heartbeatIcon, statusStyle].join(' ')}
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        viewBox="0 0 63.74 61.19"
      >
        <title>{title}</title>
        {this.props.status === 'ok' && (
          <g id="prefix__Icons">
            <path
              d="M21.3 51.6l9.31 9.31a2.15 2.15 0 003 0l23.67-23.62a16.65 16.65 0 002-23.09zM50.09 8.49a16.64 16.64 0 00-18 7.54A16.66 16.66 0 107 37.29l7.3 7.3z"
              transform="translate(-1.26 -.96)"
            />
          </g>
        )}
        {this.props.status !== 'ok' && (
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M4.55 59.19L61.74 2" />
            <g id="prefix__Icons">
              <path
                d="M21.3 51.6l9.31 9.31a2.15 2.15 0 003 0l23.67-23.62a16.65 16.65 0 002-23.09zM50.09 8.49a16.64 16.64 0 00-18 7.54A16.66 16.66 0 107 37.29l7.3 7.3z"
                transform="translate(-1.26 -.96)"
              />
            </g>
          </>
        )}
      </svg>
    );
  }
}
