import React from 'react';
import styles from './LeftCurve.module.css';

function LeftCurve(props) {
  const style = [styles, props.className].join(' ');
  return (
    <svg viewBox="0 0 76.3 60.5" {...props}>
      <path className={style.path} d="M0,60.5h15.8c9.4,0,18.3-4.3,24.2-11.6L76.3,0H0V60.5z"/>
    </svg>
  );
}

export default LeftCurve;
