import React from 'react';
import styles from './UserAndSubIcon.module.css';

export const SUBICON_OPTIONS = {
  HAS: 'has',
  NO: 'no',
  PENDING: 'pending',
};

const SUB_ICONS = {
  // check
  [SUBICON_OPTIONS.HAS]: (
    <path
      className={styles.has}
      d="M5.85,13.31a1.85,1.85,0,0,1,2.67,0L10,14.77l6.08-6.08a1.89,1.89,0,1,1,2.67,2.67l-7.41,7.42a1.87,1.87,0,0,1-2.67,0L5.85,16A1.9,1.9,0,0,1,5.85,13.31Z"
      transform="translate(-1.22 -0.67)"
    />
  ),
  // X
  [SUBICON_OPTIONS.NO]: (
    <path
      className={styles.no}
      d="M10.63,7.78l2.76,2.76,2.76-2.76a1.61,1.61,0,1,1,2.28,2.28l-2.76,2.76,2.76,2.76a1.62,1.62,0,1,1-2.28,2.29l-2.76-2.76-2.76,2.76a1.62,1.62,0,1,1-2.28-2.29l2.75-2.76L8.35,10.06a1.61,1.61,0,0,1,2.28-2.28Z"
      transform="translate(-1.49 -0.45)"
    />
  ),
  // clock
  [SUBICON_OPTIONS.PENDING]: (
    <g>
      <circle className={styles.pending1} cx="10.64" cy="12.36" r="5.05" />
      <path
        className={styles.pending2}
        d="M12.73,8.47a5,5,0,1,0,5.05,5A5.06,5.06,0,0,0,12.73,8.47Zm2.83,5.78H13a.71.71,0,0,1-.73-.72v-3a.73.73,0,0,1,1.45,0v2.27h1.82a.7.7,0,0,1,.72.72A.72.72,0,0,1,15.56,14.25Z"
        transform="translate(-2.1 -1.16)"
      />
    </g>
  ),
};

export function UserAndSubIcon(props) {
  const className = [styles.userIcon, props.className].join(' ');
  let subicon = null;
  if (props.subIcon) {
    subicon = SUB_ICONS[props.subIcon];
  }
  return (
    <svg viewBox="0 0 19 21" className={className}>
      {/* left torso */}
      <path
        className={styles.base}
        d="M13.09,10.88a5.84,5.84,0,0,0-1.95-2.09.26.26,0,0,0-.31,0,5.25,5.25,0,0,1-3.11,1,5.15,5.15,0,0,1-3.12-1,.29.29,0,0,0-.31,0c-2,1.34-3.07,3.92-3.07,6.91,0,1.13,3.87,1.64,7.4,1.54"
        transform="translate(-1.22 -0.67)"
      />
      {/* right torso */}
      <path
        className={styles.base}
        d="M2.56,10.88A5.84,5.84,0,0,1,4.51,8.79a.25.25,0,0,1,.31,0,5.27,5.27,0,0,0,3.11,1,5.15,5.15,0,0,0,3.12-1,.29.29,0,0,1,.31,0c2.05,1.34,3.07,3.92,3.07,6.91,0,1.13-3.87,1.64-7.4,1.54"
        transform="translate(-1.22 -0.67)"
      />
      {/* head */}
      <circle className={styles.base} cx="6.5" cy="3.9" r="3.9" />

      {subicon}
    </svg>
  );
}
