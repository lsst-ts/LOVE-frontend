import React from 'react';
import styles from './UserDetails.module.css';
import UserIcon from '../../icons/UserIcon/UserIcon';

export default function UserDetails({
  username,
  execPermission,
  menuElementClassName,
  onXMLClick,
  logout,
  takeScreenshot,
}) {
  return (
    <>
      <div className={menuElementClassName}>
        <div className={styles.container}>
          <div className={styles.iconContainer}>
            <UserIcon />
          </div>
          <div className={styles.contentContainer}>
            <span>User </span>
            <span className={styles.highlight}>{username}</span>
            <div>
              <span>{execPermission ? '☑ ' : '☒ '}</span>
              <span className={styles.secondary}>Command execution</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.menuElement} onClick={takeScreenshot}>
        <span>Screenshot </span>
      </div>
      <div className={styles.menuElement} onClick={onXMLClick}>
        <span>XML versions </span>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.menuElement} title="Logout" onClick={logout}>
        Logout
      </div>
    </>
  );
}
