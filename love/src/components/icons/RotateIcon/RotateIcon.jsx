import React from 'react';
import styles from './RotateIcon.module.css';

function RotateIcon(props) {
  return (
    <svg
      id="prefix__Layer_1"
      x={0}
      y={0}
      viewBox="0 0 24 24"
      xmlSpace="preserve"
      {...props}
      className={styles.container}
      style={{
        transform: props.orientation === 'beside' ? 'rotate(90deg) scaleX(-1) scaleY(-1)' : 'scaleX(-1) ',
      }}
    >
      {props.orientation & <title>{props.orientation === 'beside' ? 'Stacked' : 'Side-by-side'}</title>}
      <path
        className={styles.prefix__st2}
        d="M11.7 22.9H2.9C1.3 22.9 0 21.6 0 20V7.1c0-1.6 1.3-2.9 2.9-2.9h8.8c1.6 0 2.9 1.3 2.9 2.9V20c.1 1.6-1.2 2.9-2.9 2.9zM2.9 6.1c-.5 0-1 .5-1 1V20c0 .5.5 1 1 1h8.8c.5 0 1-.5 1-1V7.1c0-.5-.5-1-1-1H2.9z"
      />
      <path
        className={styles.prefix__st2}
        d="M19.6 15.3c-.2 0-.3-.1-.5-.1-.5-.3-.6-.9-.3-1.4 1.9-2.9 1.4-6.8-1-9.3s-6.3-2.9-9.3-1c-.5.3-1.1.2-1.4-.3-.3-.5-.1-1 .3-1.4C11.2-.5 16 0 19.1 3.1s3.7 7.9 1.3 11.7c-.2.3-.4.5-.8.5z"
      />
      <path
        className={styles.prefix__st2}
        d="M19.2 16.6c-.4 0-.8-.3-.9-.6l-1.6-3.8c-.2-.5.1-1 .5-1.3.5-.2 1 .1 1.3.5l1.2 2.9 2.9-1.2c.5-.2 1 .1 1.3.5.2.5-.1 1-.5 1.3l-3.8 1.6c-.1.1-.2.1-.4.1z"
      />
      <path
        className={styles.divider}
        d="M1.4 13.6h11.5"
      />
    </svg>
  );

  
}

export default RotateIcon;
