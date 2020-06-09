import React from 'react';
import styles from './UserDetails.module.css';
import UserIcon from '../../icons/UserIcon/UserIcon';
import ScreenshotIcon from '../../icons/ScreenshotIcon/ScreenshotIcon';
import CodeIcon from '../../icons/CodeIcon/CodeIcon';

export default function UserDetails({
  username,
  execPermission,
  menuElementClassName,
  dividerClassName,
  onXMLClick,
  onConfigClick,
  logout,
  requireUserSwap,
  takeScreenshot,
}) {
  return (
    <>
      <div className={[menuElementClassName, styles.menuElement].join(' ')}>
        <div className={styles.bigIconRow}>
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
      <div className={dividerClassName}></div>
      <div className={[menuElementClassName, styles.menuElement].join(' ')} onClick={takeScreenshot}>
        <div className={styles.smallIconRow}>
          <ScreenshotIcon />
          <span>Screenshot </span>
        </div>
      </div>
      <div className={[menuElementClassName, styles.menuElement].join(' ')} onClick={onXMLClick}>
        <div className={styles.smallIconRow}>
          <CodeIcon active={false} className={styles.paddedIcon} />
          <span>XML versions </span>
        </div>
      </div>
      <div className={[menuElementClassName, styles.menuElement].join(' ')} onClick={onConfigClick}>
        <div className={styles.smallIconRow}>
          <CodeIcon active={false} className={styles.paddedIcon} />
          <span>LOVE Config File </span>
        </div>
      </div>
      <div className={dividerClassName}></div>
      <div className={[menuElementClassName, styles.menuElement].join(' ')} title="User swap" onClick={requireUserSwap}>
        User swap
      </div>
      <div className={[menuElementClassName, styles.menuElement].join(' ')} title="Logout" onClick={logout}>
        Logout
      </div>
    </>
  );
}
