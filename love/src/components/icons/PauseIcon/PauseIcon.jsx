import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './PauseIcon.module.css';

export default class PauseIcon extends Component {

  render() {
    return (
      <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.9 23.9">
        <path
          className={styles.st0}
          d="M8.9,21V3C9,2.5,8.7,2.1,8.2,2c-0.5-0.1-0.9,0.3-1,0.7c0,0.1,0,0.2,0,0.2v18c-0.1,0.5,0.3,0.9,0.7,1	c0.5,0.1,0.9-0.3,1-0.7C8.9,21.1,8.9,21.1,8.9,21z"
        />
        <path
          className={styles.st0}
          d="M16.7,21V3c0-0.5-0.4-0.8-0.8-0.8c-0.5,0-0.8,0.4-0.8,0.8l0,0v18c0,0.5,0.4,0.8,0.8,0.8	C16.3,21.8,16.7,21.4,16.7,21z"
        />
      </svg>
    );
  }
}
