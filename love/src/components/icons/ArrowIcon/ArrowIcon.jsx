import React from 'react';
import styles from './ArrowIcon.module.css';

const ArrowIcon = ({ active, className, style, up, horizontal }) => (
  <svg
    className={[
      horizontal ? styles.horizontalArrowIcon : styles.arrowIcon,
      active ? styles.active : styles.inactive,
      style
    ].join(' ')}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="3 3 12 12"
  >
    {up ? (
      <path
        className={[styles['cls-1'], className].join(' ')}
        d="M11.74,5.47,9.2,3A.18.18,0,0,0,9.05,3,.19.19,0,0,0,8.9,3L6.4,5.47a.18.18,0,0,0,0,.22.17.17,0,0,0,.18.13h2v8a.17.17,0,0,0,.05.14.2.2,0,0,0,.15.06h.7a.17.17,0,0,0,.14-.06.18.18,0,0,0,.06-.14v-8h2a.19.19,0,0,0,.19-.13A.22.22,0,0,0,11.74,5.47Z"
      />
    ) : (
      <path
        className={[styles['cls-1'], className].join(' ')}
        d="M6.4,11.48l2.53,2.46a.25.25,0,0,0,.16.06.24.24,0,0,0,.15-.06l2.5-2.46a.22.22,0,0,0,0-.22.19.19,0,0,0-.19-.12h-2v-8A.2.2,0,0,0,9.56,3,.17.17,0,0,0,9.42,3h-.7A.2.2,0,0,0,8.57,3a.2.2,0,0,0-.05.15v8h-2a.19.19,0,0,0-.18.12A.18.18,0,0,0,6.4,11.48Z"
      />
    )}
  </svg>
);
>>>>>>> little changes about icons

export default ArrowIcon;