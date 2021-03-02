import React from 'react';
import styles from './EmergencyContactIcon.module.css';

export default class EmergencyContactIcon extends React.Component {
  render() {
    return (
      <svg className={styles.EmergencycontactIcon} viewBox="0 0 47.68 45.5">
        <rect className={styles["cls-1"]} y="33.93" width="8.17" height="3.41" rx="1.5" />
        <rect className={styles["cls-1"]} y="7.36" width="8.17" height="3.41" rx="1.5" />
        <rect className={styles["cls-1"]} y="20.98" width="8.17" height="3.41" rx="1.5" />
        <path className={styles["cls-2"]} d="M27.51,11.62c-3.43,0-6.21,2.51-6.21,6.8s2.31,8.73,6.21,8.73c4.25,0,6.21-4.44,6.21-8.73S31,11.62,27.51,11.62Zm-7,15.86a7,7,0,0,0-6.82,5.6,3.33,3.33,0,0,0,.45,2.32l0,0c.51.83,8.55,3.07,13.3,3.07s12.8-2.24,13.3-3.07l0,0a3.22,3.22,0,0,0,.45-2.32,7,7,0,0,0-6.82-5.6H32.7a1.22,1.22,0,0,0-.59.2,7.5,7.5,0,0,1-4.6,1.54,7.22,7.22,0,0,1-4.45-1.54,1.09,1.09,0,0,0-.58-.2ZM7.69,44.79V5.42a3.07,3.07,0,0,1,3.06-3.07H44.91A3.07,3.07,0,0,1,48,5.42V44.79a3.06,3.06,0,0,1-3.06,3.07H10.75A3.06,3.06,0,0,1,7.69,44.79Z" transform="translate(-0.29 -2.35)" />
      </svg>
    );
  }
}
