import React from 'react';
import PropTypes from 'prop-types';
import styles from './UserDetails.module.css';
import ScreenshotIcon from '../../icons/ScreenshotIcon/ScreenshotIcon';
import EmergencyContactIcon from '../../icons/EmergencyContactIcon/EmergencyContactIcon';
import ScriptIcon from '../../icons/ScriptIcon/ScriptIcon';
import NewUserIcon from '../../icons/NewUserIcon/NewUserIcon';

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
  /** Callback to execute when clicking on the Config file menu element */
  onConfigClick: PropTypes.func,
  /** Callback to execute when clicking on the Emergency contact menu element */
  onEmergencyContactsClick: PropTypes.func,
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
  onEmergencyContactsClick,
  logout,
  requireUserSwap,
  takeScreenshot,
}) {
  return (
    <>
      <div className={[menuElementClassName, styles.menuElement].join(' ')}>
        <div className={styles.bigIconRow}>
          <div className={styles.iconContainer}>
            <NewUserIcon />
          </div>
          <div className={styles.contentContainer}>
            <span>User </span>
            <span className={styles.highlight}>{username}</span>
            <div>
              <span className={styles.secondary}>
                {execPermission ? 'Allowed to run Commands' : 'Not allowed to run Commands'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={dividerClassName}></div>
      <div className={[menuElementClassName, styles.menuElement].join(' ')} onClick={takeScreenshot}>
        <div className={styles.smallIconRow}>
          <ScreenshotIcon className={styles.paddedIcon} />
          <span>Screenshot </span>
        </div>
      </div>
      <div className={[menuElementClassName, styles.menuElement].join(' ')} onClick={onEmergencyContactsClick}>
        <div className={styles.smallIconRow}>
          <EmergencyContactIcon active={false} className={styles.paddedIcon} />
          <span>Emergency contacts </span>
        </div>
      </div>
      <div className={[menuElementClassName, styles.menuElement].join(' ')} onClick={onXMLClick}>
        <div className={styles.smallIconRow}>
          <ScriptIcon active={false} className={styles.paddedIcon} />
          <span>XML versions </span>
        </div>
      </div>
      <div className={[menuElementClassName, styles.menuElement].join(' ')} onClick={onConfigClick}>
        <div className={styles.smallIconRow}>
          <ScriptIcon active={false} className={styles.paddedIcon} />
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
