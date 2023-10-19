/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import PropTypes from 'prop-types';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import {
  telescopeTrackingStateMap,
  telescopeTrackingModeStateMap,
  telescopeTrackingStateToStyle,
  telescopeTrackingModeStateToStyle,
} from 'Config';
import styles from './ObservatorySummaryMenu.module.css';

/** Contents of the ObservatorySummary details Dropdown Menu */
export default function ObservatorySummaryMenu({
  location,
  locationLastUpdate,
  locationIcon,
  menuElementClassName,
  dividerClassName,
  simonyiOperationMode,
  simonyiTrackingState,
  simonyiTrackingMode,
  simonyiObsMode,
  simonyiPower,
  auxtelOperationMode,
  auxtelTrackingState,
  auxtelTrackingMode,
  auxtelObsMode,
  auxtelPower,
  degradation,
}) {
  const simonyiTrackingStateText = telescopeTrackingStateMap[simonyiTrackingState];
  const simonyiTrackingModeText = telescopeTrackingModeStateMap[simonyiTrackingMode];
  const auxtelTrackingStateText = telescopeTrackingStateMap[auxtelTrackingState];
  const auxtelTrackingModeText = telescopeTrackingModeStateMap[auxtelTrackingMode];
  return (
    <>
      <div className={[menuElementClassName, styles.menuElement, styles.section].join(' ')}>
        <div className={styles.bigIconRow}>
          <div className={styles.iconContainer}>{locationIcon}</div>
          <div className={styles.contentContainer}>
            <span>Observatory control </span>
            <div>
              <span title={`Last updated: ${locationLastUpdate?.toUTCString()}`} className={styles.highlight}>
                {location}
              </span>
            </div>
          </div>
        </div>
        <span className={styles.label}>Env. Degradation</span>
        <span>{degradation}</span>
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
          <StatusText status={telescopeTrackingStateToStyle[simonyiTrackingStateText]}>
            {simonyiTrackingStateText}
          </StatusText>
        </div>

        <span className={styles.label}>Operation Mode</span>
        <span>{simonyiOperationMode}</span>

        <span className={styles.label}>Obsv. Mode</span>
        <span>{simonyiObsMode}</span>

        <span className={styles.label}>Tracking Mode</span>
        <span>{simonyiTrackingModeText}</span>

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
          <StatusText status={telescopeTrackingStateToStyle[auxtelTrackingStateText]}>
            {auxtelTrackingStateText}
          </StatusText>
        </div>

        <span className={styles.label}>Operation Mode</span>
        <span>{auxtelOperationMode}</span>

        <span className={styles.label}>Tracking Mode</span>
        <span>{auxtelTrackingModeText}</span>

        <span className={styles.label}>Obsv. Mode</span>
        <span>{auxtelObsMode}</span>

        <span className={styles.label}>Power Source</span>
        <span>{auxtelPower}</span>
      </div>
    </>
  );
}

ObservatorySummaryMenu.propTypes = {
  /** Location from where LOVE is being controlled from */
  location: PropTypes.string,
  /** Location last update */
  locationLastUpdate: PropTypes.instanceOf(Date),
  /** An svg representing the location generated on Layout.jsx */
  locationIcon: PropTypes.object,
  /** Classname to add ot the menu elements */
  menuElementClassName: PropTypes.string,
  /** Classname to add ot the diveiders */
  dividerClassName: PropTypes.string,

  /** Simonyi Telemetry and Event Data */
  /** Simonyi Operation Mode */
  simonyiOperationMode: PropTypes.string,
  /** Simonyi Tracking State */
  simonyiTrackingState: PropTypes.bool,
  /** Simonyi Tracking Mode */
  simonyiTrackingMode: PropTypes.number,
  /** Simonyi Observation Mode */
  simonyiObsMode: PropTypes.string,
  /** Simonyi Power Source */
  simonyiPower: PropTypes.string,

  /** Auxiliary Telescope Telemetry and Event Data */
  /** Auxiliary Telescope Operation Mode */
  auxtelOperationMode: PropTypes.string,
  /** Auxiliary Telescope Tracking State */
  auxtelTrackingState: PropTypes.bool,
  /** Auxiliary Telescope Tracking Mode */
  auxtelTrackingMode: PropTypes.number,
  /** Auxiliary Telescope Observation Mode */
  auxtelObsMode: PropTypes.string,
  /** Auxiliary Telescope Power Source */
  auxtelPower: PropTypes.string,
};
