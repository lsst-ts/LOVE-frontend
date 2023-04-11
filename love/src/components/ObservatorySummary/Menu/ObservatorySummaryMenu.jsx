import React from 'react';
import PropTypes from 'prop-types';
import styles from './ObservatorySummaryMenu.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';

/** Contents of the ObservatorySummary details Dropdown Menu */
export default function ObservatorySummaryMenu({
  location,
  locationIcon,
  menuElementClassName,
  dividerClassName,
  simonyiOperationMode,
  simonyiTrackingMode,
  simonyiObsMode,
  simonyiPower,
  auxtelOperationMode,
  auxtelObsMode,
  auxtelPower,
}) {
  return (
    <>
      <div className={[menuElementClassName, styles.menuElement].join(' ')}>
        <div className={styles.bigIconRow}>
          <div className={styles.iconContainer}>{locationIcon}</div>
          <div className={styles.contentContainer}>
            <span>Observatory control </span>
            <div>
              <span className={styles.highlight}>{location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={dividerClassName}></div>

      <div className={[menuElementClassName, styles.menuElement, styles.section].join(' ')}>
        <div className={styles.smallIconRow}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18.42">
            <polygon
              className={styles.iconWhite}
              points="0 .5 0 18.42 18.98 18.42 18.98 12.64 16.87 4.62 11.09 .5 0 .5"
            />
            <polygon
              className={styles.iconBlack}
              points="10.35 1.02 14.95 4.62 17 12.12 11.89 12.12 9.97 4.37 5.5 .77 10.35 1.02"
            />
            <polygon
              className={styles.iconWhite}
              points="17.76 12.14 20 12.14 17.83 4.28 12.14 0 9.52 0 9.52 .83 10.61 .83 15.65 4.6 17.76 12.14"
            />
            <polygon
              className={styles.iconWhite}
              points="9.52 12.14 12.56 12.14 10.77 4.37 5.22 0 .77 0 .77 .83 2.36 .83 7.41 4.6 9.52 12.14"
            />
          </svg>
          <span className={styles.sectionTitle}>Simonyi</span>
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
            <path className={styles.iconWhite} d="m7,0h4.67C15.53,0,18.67,3.14,18.67,7v11.67H0V7C0,3.14,3.14,0,7,0Z" />
            <path
              className={styles.iconBlack}
              d="m9.33,0C8.65,0,9.33,0,9.33,0c3.58,1.9,4,4.87,4,9.33h4C17.33,4.18,14.49,0,9.33,0Z"
            />
          </svg>
          <span className={styles.sectionTitle}>Auxtel</span>
        </div>

        <span className={styles.label}>Operation Mode</span>
        <span>{auxtelOperationMode}</span>

        <span className={styles.label}>Obsv. Mode</span>
        <span>{auxtelObsMode}</span>

        <span className={styles.label}>Power Source</span>
        <span>{auxtelPower}</span>
      </div>
    </>
  );
}

ObservatorySummaryMenu.propTypes = {
  /** Locaation from where LOVE is being controlled from */
  location: PropTypes.string,
  /** An svg representing the location generated on Layout.jsx */
  locationIcon: PropTypes.object,
  /** Classname to add ot the menu elements */
  menuElementClassName: PropTypes.string,
  /** Classname to add ot the diveiders */
  dividerClassName: PropTypes.string,

  /** Simonyi Telemetry and Event Data */
  /** Simonyi Operation Mode */
  simonyiOperationMode: PropTypes.string,
  /** Simonyi Tracking Mode */
  simonyiTrackingMode: PropTypes.string,
  /** Simonyi Observation Mode */
  simonyiObsMode: PropTypes.string,
  /** Simonyi Power Source */
  simonyiPower: PropTypes.string,

  /** Auxiliary Telescope Telemetry and Event Data */
  /** Auxiliary Telescope Operation Mode */
  auxtelOperationMode: PropTypes.string,
  /** Auxiliary Telescope Observation Mode */
  auxtelObsMode: PropTypes.string,
  /** Auxiliary Telescope Power Source */
  auxtelPower: PropTypes.string,
};
