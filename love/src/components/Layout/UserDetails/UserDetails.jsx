import React from 'react';
import PropTypes from 'prop-types';
import styles from './UserDetails.module.css';
import UserIcon from '../../icons/UserIcon/UserIcon';
import ScreenshotIcon from '../../icons/ScreenshotIcon/ScreenshotIcon';
import CodeIcon from '../../icons/CodeIcon/CodeIcon';

UserDetails.propTypes = {
  /** Name of the current user */
  username: PropTypes.string,
  /** Wether or not the user has permissions to execute commands */
  execPermission: PropTypes.bool,
  /** Classname to add ot the menu elements */
  menuElementClassName: PropTypes.string,
  /** Classname to add ot the diveiders */
  dividerClassName: PropTypes.string,
  /** Callback to execute when clicking on the XML menu element */
  onXMLClick: PropTypes.func,
  /** Callback to execute when clicking on the XML menu element */
  onXMLConConfigClicklick: PropTypes.func,
  /** Callback to execute when clicking on the logout menu element */
  logout: PropTypes.func,
  /** Callback to execute when clicking on the user swap menu element */
  requireUserSwap: PropTypes.func,
  /** Callback to execute when clicking on the take screenshot menu element */
  takeScreenshot: PropTypes.func,
};

/** Contents of the User details Dropdown Menu */
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
