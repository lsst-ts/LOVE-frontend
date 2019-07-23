import React, { Component } from 'react';
import styles from './ResumeIcon.module.css';

export default class ResumeIcon extends Component {
  render() {
    return (
      <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.9 23.9">
        <path
          className={styles.st0}
          d="M6.5,20.1L5.2,21c-0.3,0.2-0.4,0.6-0.2,0.9c0.2,0.2,0.4,0.3,0.6,0.3c0.1,0,0.3-0.1,0.4-0.2l13.9-9.8	c0.2-0.1,0.3-0.3,0.3-0.5s-0.1-0.4-0.3-0.5L7.5,2.6C7.2,2.4,6.8,2.4,6.6,2.7c0,0.1-0.1,0.3-0.1,0.4v15.3"
        />
      </svg>
    );
  }
}
