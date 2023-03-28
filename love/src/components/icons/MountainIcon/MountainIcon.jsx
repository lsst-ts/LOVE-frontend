import React from 'react';
import styles from './MountainIcon.module.css';

export default function MountainIcon(props) {
  const status = props.active ? styles.active : styles.inactive;
  const className = [styles.icon, props.className, props.style].join(' ');
  return (
    <svg viewBox="0 0 17.12 18.46" className={className}>
      <path
        className={status}
        d="m1.15,17.54l1.61-4.14c.23-.59.94-.75,1.38-.32h0s2.11-6.49,2.11-6.49c.18-.55.51-1.04.95-1.4h0c1.38-1.12,3.37-.68,4.21.93l.76,1.47h0c.53-.19,1.1.09,1.32.64l3.59,9.3c.17.44-.13.92-.58.92H1.73c-.45,0-.75-.48-.58-.92Z"
      />{' '}
      <path
        className={style}
        d="m4.02,2.95l-1.2.35c-.15.06-.15.26,0,.32l1.2.35s.08.05.1.1l.35,1.2c.06.15.26.15.32,0l.35-1.2s.05-.08.1-.1l1.2-.35c.15-.06.15-.26,0-.32l-1.2-.35s-.08-.05-.1-.1l-.35-1.2c-.06-.15-.26-.15-.32,0l-.35,1.2s-.05.08-.1.1Z"
      />
      <path
        className={status}
        d="m10.21,1.33l-.76.22c-.09.04-.09.17,0,.2l.76.22s.05.03.06.06l.22.76c.04.09.17.09.2,0l.22-.76s.03-.05.06-.06l.76-.22c.09-.04.09-.17,0-.2l-.76-.22s-.05-.03-.06-.06l-.22-.76c-.04-.09-.17-.09-.2,0l-.22.76s-.03.05-.06.06Z"
      />
      <circle className={status} cx="2.34" cy="1.05" r="1.05" />
      <circle className={status} cx="13.83" cy="3.79" r="1.05" />
      <circle className={status} cx="7.78" cy=".56" r=".52" />
      <circle className={status} cx=".44" cy="3.43" r=".44" />
      <circle className={status} cx="15.99" cy="1.74" r=".44" />
    </svg>
  );
}
