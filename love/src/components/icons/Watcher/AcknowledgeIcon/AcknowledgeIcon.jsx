import React from 'react';
import styles from './AcknowledgeIcon.module.css';

const AcknowledgeIcon = ({ active, className, nonAcknowledge }) => (
  <svg viewBox="0 0 23 19.42">
    {nonAcknowledge ? (<title>{active ? 'Acknowledge' : 'Acknowledged'}</title>) : <></>}
    <path
      className={[active ? styles.active : styles.inactive, className].join(' ')}
      d="M22.59 6a.58.58 0 10-.92.72.69.69 0 010 .84 12.79 12.79 0 01-5.33 4 6.51 6.51 0 000-8.88 12.66 12.66 0 013.33 2c.13.1.25.21.37.32a.57.57 0 00.82 0 .58.58 0 000-.81c-.13-.12-.26-.24-.4-.35a14 14 0 00-19.7 2L.56 6a1.86 1.86 0 000 2.28 13.88 13.88 0 0011 5.38 13.88 13.88 0 0011-5.38A1.86 1.86 0 0022.59 6zM1.48 7.53a.66.66 0 010-.84 12.79 12.79 0 015.33-4 6.47 6.47 0 000 8.88 12.59 12.59 0 01-5.33-4.04zm10.1 4.94a5.36 5.36 0 010-10.68 5.36 5.36 0 010 10.72z"
      transform="translate(0 2.43)"
    />
    <path
      className={[active ? styles.active : styles.inactive, className].join(' ')}
      d="M11.57 4.64A2.47 2.47 0 1014 7.12a2.47 2.47 0 00-2.43-2.48zm0 3.77a1.3 1.3 0 111.31-1.3 1.3 1.3 0 01-1.31 1.3z"
      transform="translate(0 2.43)"
    />
  </svg>
);

export default AcknowledgeIcon;
