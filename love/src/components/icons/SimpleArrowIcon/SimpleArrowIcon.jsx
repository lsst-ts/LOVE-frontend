import React from 'react';
import styles from './SimpleArrowIcon.module.css';

export default function SimpleArrowIcon(props) {
  const direction = props.direction ? props.direction : '';
  const className = [styles.icon, props.className, props.style].join(' ');

  switch (direction) {
    case 'top':
      return (
        <svg viewBox="0 0 12 22" className={styles.top}>
          <polyline className={className} points="1 21 11 11 1 1" />
        </svg>
      );
    case 'right':
      return (
        <svg viewBox="0 0 12 22" className={styles.right}>
          <polyline className={className} points="1 21 11 11 1 1" />
        </svg>
      );
    case 'bottom':
      return (
        <svg viewBox="0 0 12 22" className={styles.bottom}>
          <polyline className={className} points="1 21 11 11 1 1" />
        </svg>
      );
    case 'left':
      return (
        <svg viewBox="0 0 12 22" className={styles.left}>
          <polyline className={className} points="1 21 11 11 1 1" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 12 22" className={styles.right}>
          <polyline className={className} points="1 21 11 11 1 1" />
        </svg>
      );
  }
}
