import React from 'react';
import styles from './AcknowledgeIcon.module.css';

const AcknowledgeIcon = ({ active, className, nonAcknowledge }) => (
  <svg viewBox="0 0 13.81 9.55">
    {nonAcknowledge ? (<title>{active ? 'Acknowledge' : 'Acknowledged'}</title>) : <></>}
    <path
      className={[active ? styles.active : styles.inactive, className].join(' ')}
      d="M12.25,2.21C9.3-.74,4.51-.74,1.56,2.21L0,3.78l1.56,1.56c2.95,2.95,7.74,2.95,10.69,0l1.56-1.56-1.56-1.56ZM6.91,6.28c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5,2.5,1.12,2.5,2.5-1.12,2.5-2.5,2.5Z"
    />

  </svg>
);

export default AcknowledgeIcon;


<svg id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.81 7.55">
  <path d="M12.25,2.21C9.3-.74,4.51-.74,1.56,2.21L0,3.78l1.56,1.56c2.95,2.95,7.74,2.95,10.69,0l1.56-1.56-1.56-1.56ZM6.91,6.28c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5,2.5,1.12,2.5,2.5-1.12,2.5-2.5,2.5Z"/>
</svg>