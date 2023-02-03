import React from 'react';
import styles from './SpinnerIcon.module.css';

function LogoIcon(props) {
  return (
    <svg className={styles.spinner} viewBox="0 0 50 50" {...props}>
      <title>{props.title}</title>
      <circle className={styles.path} cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
    </svg>
  );
}

export default LogoIcon;
