/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import PropTypes from 'prop-types';
import ScreenshotIcon from 'components/icons/ScreenshotIcon/ScreenshotIcon';
import EmergencyContactIcon from 'components/icons/EmergencyContactIcon/EmergencyContactIcon';
import ScriptIcon from 'components/icons/ScriptIcon/ScriptIcon';
import UserIcon from 'components/icons/UserIcon/UserIcon';
import styles from './UserDetails.module.css';

UserDetails.propTypes = {
  /** Name of the current user */
  username: PropTypes.string,
  /** Wether or not the user has permissions to execute commands */
  execPermission: PropTypes.bool,
  /** Classname to add ot the menu elements */
  menuElementClassName: PropTypes.string,
  /** Classname to add ot the diveiders */
  dividerClassName: PropTypes.string,
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
  /** Callback to execute when clicking on the About menu element */
  onAboutClick: PropTypes.func,
};

/** Contents of the User details Dropdown Menu */
export default function UserDetails({
  username,
  execPermission,
  menuElementClassName,
  dividerClassName,
  onConfigClick,
  onEmergencyContactsClick,
  logout,
  requireUserSwap,
  takeScreenshot,
  onAboutClick,
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
      <div className={[menuElementClassName, styles.menuElement].join(' ')} title="About" onClick={onAboutClick}>
        About
      </div>
    </>
  );
}
