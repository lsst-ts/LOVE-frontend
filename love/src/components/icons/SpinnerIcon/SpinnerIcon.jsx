import React from 'react';
import styles from './SpinnerIcon.module.css';

function LogoIcon(props) {
  const { className: propsClassName, ...otherProps } = props;
  return (
    <svg className={[styles.spinner, propsClassName].join(' ')} viewBox="0 0 50 50" {...otherProps}>
      <title>{props.title}</title>
      <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </svg>
  );
}

export default LogoIcon;
