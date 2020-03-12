import React from 'react';
import styles from './NotchCurve.module.css';

function NotchCurve(props) {
  const style = [styles, props.className].join(' ');
  return (
    <svg viewBox="0 0 60.5 60.5" {...props} style={{transform: (props.flip ? 'scale(-1,1)' : '')}}>
      <path className={style.path} d="M0,60.5c9.4,0,18.3-4.3,24.2-11.6L60.5,0H0V60.5z"/>
    </svg>
  );
}

export default NotchCurve;
