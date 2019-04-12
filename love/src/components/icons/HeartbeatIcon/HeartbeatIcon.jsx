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
    
    const statusStyle = this.props.status === 'ok' ? styles.okStatus : styles.alertStatus;
    const title = this.props.title;
    return (
      <svg
        className={[styles.heartbeatIcon, statusStyle].join(' ')}
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        viewBox="0 0 320 320"
      >
        <title>{title}</title>
        <g
          id="full-svg-transform"
          transform="translate(5 5) scale(16.315737061391534) translate(-539.0999145507812 -246.44995880126953)"
        >
          <path
            d="M557.3,257.8h-5.7c-0.3,0-0.6-0.2-0.7-0.5l-1.7-4.4l-2.7,8.8c-0.1,0.3-0.4,0.5-0.7,0.5 
          c-0.3,0-0.6-0.2-0.7-0.4l-1.8-4h-3.5c-0.4,0-0.7-0.3-0.7-0.7c0-0.4,0.3-0.7,0.7-0.7h4c0.3,0,0.6,0.2,0.7,0.4l1.2,2.7l2.8-9 
          c0.1-0.3,0.4-0.5,0.7-0.5c0,0,0,0,0,0c0.3,0,0.6,0.2,0.7,0.5l2.3,5.9h5.2c0.4,0,0.7,0.3,0.7,0.7 
          C558,257.5,557.7,257.8,557.3,257.8z"
          />
          <path
            d="M555.5,254c-0.1,0-0.1,0-0.2-0.1c-0.2-0.2-0.4-0.3-0.6-0.5l0,0c-0.5-0.4-0.9-0.8-1.2-1.1 
          c-0.3-0.4-0.5-0.8-0.5-1.2c0-0.4,0.1-0.8,0.4-1c0.3-0.3,0.6-0.4,1-0.4c0.3,0,0.5,0.1,0.8,0.3c0.1,0.1,0.2,0.2,0.3,0.3 
          c0.1-0.1,0.2-0.2,0.3-0.3c0.2-0.2,0.5-0.3,0.8-0.3c0.4,0,0.7,0.2,1,0.4c0.2,0.3,0.4,0.6,0.4,1c0,0.4-0.2,0.8-0.5,1.2 
          c-0.3,0.4-0.7,0.7-1.2,1.1c-0.2,0.1-0.4,0.3-0.6,0.5C555.6,254,555.6,254,555.5,254z"
          />
        </g>
      </svg>
    );
  }
}
