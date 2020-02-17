import React from 'react';
import styles from './NotchCurve.module.css';

function NotchCurve(props) {
  const style = [styles, props.className].join(' ');
  return (
    <svg viewBox="0 0 76.3 60.5" {...props} style={{transform: (props.flip ? 'scale(-1,1)' : '')}}>
      <path className={style.path} d="M0,60.5h15.8c9.4,0,18.3-4.3,24.2-11.6L76.3,0H0V60.5z"/>
    </svg>
  );
}

export default NotchCurve;
