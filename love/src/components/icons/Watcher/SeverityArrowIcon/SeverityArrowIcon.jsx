import React from 'react';
import styles from './SeverityArrowIcon.module.css'

const SeverityArrowIcon = ({ increase }) => (
  <svg viewBox="0 0 6.41 19.42">
    <title>{increase ? 'Severity increased' : 'Severity decreased'}</title>
    <path
      d="M3.46 6v4.75a.17.17 0 010 .14.49.49 0 01-.17.06.24.24 0 01-.23-.2V6H.67a.2.2 0 01-.18-.12.18.18 0 010-.2l2.58-2.55a.18.18 0 01.25 0h0l2.55 2.53a.19.19 0 01-.14.34z"
      className={increase ? styles.increase: styles.decrease}
      strokeMiterlimit={10}
      strokeWidth={0.5}
    />
  </svg>
);

export default SeverityArrowIcon;


