import React from 'react';
import styles from './LogoIcon.module.css';

function LogoIcon(props) {
  const style = [styles, props.className].join(' ');
  return (
    <svg viewBox="0 0 101.2 26.8" {...props}>
      <path className={style.path} d="M3.7,1.3v21.1h16.2v3.5H0V1.3H3.7z"/>
      <path className={style.path} d="M24.7,13.4c0-3.3,1.2-6.2,3.7-8.6c2.4-2.4,5.4-3.6,8.8-3.6c3.4,0,6.3,1.2,8.7,3.6c2.4,2.4,3.7,5.3,3.7,8.7
        c0,3.4-1.2,6.3-3.7,8.7c-2.5,2.4-5.4,3.6-8.9,3.6c-3.1,0-5.8-1.1-8.3-3.2C26,20.3,24.7,17.2,24.7,13.4z M28.3,13.5
        c0,2.6,0.9,4.8,2.7,6.5c1.8,1.7,3.8,2.5,6.1,2.5c2.5,0,4.6-0.9,6.3-2.6c1.7-1.7,2.6-3.9,2.6-6.4c0-2.5-0.8-4.7-2.5-6.4
        c-1.7-1.7-3.8-2.6-6.3-2.6c-2.5,0-4.6,0.9-6.3,2.6C29.2,8.9,28.3,11,28.3,13.5z"/>
      <path className={style.path} d="M57.4,1.1l6.5,16.2l6.5-16.2h3.9L63.8,26.2L53.6,1.1H57.4z"/>
      <path className={style.path} d="M81.4,1.2h19.9v3.7H81.4V1.2z"/>
      <path className={style.path} d="M81.4,11.7h19.9v3.7H81.4V11.7z"/>
      <path className={style.path} d="M81.4,22.2h19.9v3.7H81.4V22.2z"/>
    </svg>
  );
}

export default LogoIcon;
