import React from 'react';
import PropTypes from 'prop-types';
import styles from './ObservatorySummaryMenu.module.css';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';

UserDetails.propTypes = {
  /** Name of the current user */
  location: PropTypes.string,
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
  location,
  locationIcon,
  menuElementClassName,
  dividerClassName,
  simonyiState,
  simonyiOperationMode,
  simonyiTrackingMode,
  simonyiObsMode,
  simonyiPower,
  auxtelState,
  auxtelOperationMode,
  auxtelPower,
}) {
  return (
    <>
      <div className={[menuElementClassName, styles.menuElement].join(' ')}>
        <div className={styles.bigIconRow}>
          <div className={styles.iconContainer}>
            {locationIcon}
          </div>
          <div className={styles.contentContainer}>
            <span>Observatory control </span>
            <div>
              <span className={styles.highlight}>{location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={dividerClassName}></div>

      <div className={[menuElementClassName, styles.menuElement, styles.section].join(' ')} >

        <div className={styles.smallIconRow}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18.42">
            <polygon className={styles.iconWhite} points="0 .5 0 18.42 18.98 18.42 18.98 12.64 16.87 4.62 11.09 .5 0 .5"/>
            <polygon className={styles.iconBlack} points="10.35 1.02 14.95 4.62 17 12.12 11.89 12.12 9.97 4.37 5.5 .77 10.35 1.02"/>
            <polygon className={styles.iconWhite} points="17.76 12.14 20 12.14 17.83 4.28 12.14 0 9.52 0 9.52 .83 10.61 .83 15.65 4.6 17.76 12.14"/>
            <polygon className={styles.iconWhite} points="9.52 12.14 12.56 12.14 10.77 4.37 5.22 0 .77 0 .77 .83 2.36 .83 7.41 4.6 9.52 12.14"/>
          </svg>
          <span className={styles.sectionTitle}>Simonyi</span>
          <span className={styles.state}>
            <StatusText title={simonyiState} status='ok'>
              {simonyiState}
            </StatusText>
          </span>
        </div>

          <span className={styles.label}>Operation Mode</span>
          <span>{simonyiOperationMode}</span>

          <span className={styles.label}>Tracking Mode</span>
          <span>{simonyiTrackingMode}</span>

          <span className={styles.label}>Obsv. Mode</span>
          <span>{simonyiObsMode}</span>

          <span className={styles.label}>Power Source</span>
          <span>{simonyiPower}</span>

      </div>

      <div className={dividerClassName}></div>

      <div className={[menuElementClassName, styles.menuElement, styles.section].join(' ')} title="Auxtel">
        
        <div className={styles.smallIconRow}>
          <svg viewBox="0 0 18.67 18.67">
            <path className={styles.iconWhite} d="m7,0h4.67C15.53,0,18.67,3.14,18.67,7v11.67H0V7C0,3.14,3.14,0,7,0Z"/>
            <path className={styles.iconBlack} d="m9.33,0C8.65,0,9.33,0,9.33,0c3.58,1.9,4,4.87,4,9.33h4C17.33,4.18,14.49,0,9.33,0Z"/>
          </svg>
          <span className={styles.sectionTitle}>Auxtel</span>
          <span className={styles.state}>
            <StatusText title={auxtelState} status='warning'>
              {auxtelState}
            </StatusText>
          </span>
        </div>

          <span className={styles.label}>Operation Mode</span>
          <span>{auxtelOperationMode}</span>

          <span className={styles.label}>Power Source</span>
          <span>{auxtelPower}</span>

      </div>
    </>
  );
}
