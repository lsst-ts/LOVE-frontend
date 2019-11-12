import React from 'react';
import styles from './SeverityArrowIcon.module.css';

const SeverityArrowIcon = ({ increase, decrease }) => (
  <svg
    viewBox="0 0 6.41 19.42"
    className={[increase || decrease ? '' : styles.hidden, decrease ? styles.flip : ''].join(' ')}
  >
    <title>{increase ? 'Severity increased' : 'Severity decreased'}</title>
    <path
      d="M3.5,6v9.1c0,0.1-0.1,0.1-0.1,0.2c-0.1,0-0.1,0.1-0.2,0c-0.1,0-0.2-0.1-0.2-0.2V6H0.7C0.6,6,0.5,6,0.5,5.9c0-0.1,0-0.1,0-0.2l2.6-2.6c0.1-0.1,0.2-0.1,0.2,0l0,0l2.5,2.5C6,5.7,6,5.8,5.9,5.9C5.9,6,5.8,6,5.7,6L3.5,6z"
      className={[increase ? styles.increase : '', decrease ? styles.decrease : ''].join(' ')}
      strokeMiterlimit={10}
      strokeWidth={0.5}
    />
  </svg>
);

export default SeverityArrowIcon;
