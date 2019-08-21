import React, { Component } from 'react';
import styles from './RightArrowIcon.module.css';

export default class RightArrowIcon extends Component {
  static defaultProps = {
    style: '',
  };

  render() {
    return (
      <svg data-name="Layer 1" viewBox="0 0 16.39 12.34">
        <title>{'target-arrow'}</title>
        <path
          className={styles.arrow}
          fill="none"
          stroke="#f9f9f9"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M.0 6.24l9.72-.07L10.17.5l5.72 5.62-5.63 5.72-.02-2.52"
        />
      </svg>
    );
  }
}
