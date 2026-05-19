/** 
This file is part of LOVE-frontend.

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
import React from 'react';
import PropTypes from 'prop-types';
import { validNumbers } from 'Utils';
import { POWER_MONITOR_STATUS_MAPPING } from 'Config';
import DeviceStatus from '../DeviceStatus';
import styles from '../PowerMonitor.module.css';

function ATSCard({
  status,
  cscState,
  cscIndex,
  title,
  label,
  currentSource,
  utilityInput,
  generatorInput,
  conditions,
  outputUPS,
  mode,
  power,
}) {
  const statusClass = POWER_MONITOR_STATUS_MAPPING[status] === 'ok' ? styles.ok : styles.alert;
  return (
    <div className={[styles.card, styles.atsCard, statusClass].join(' ')}>
      <div className={styles.deviceName}>
        <span>{title}</span>
        <span>{label}</span>
        <DeviceStatus status={status} cscState={cscState} cscIndex={cscIndex} />
      </div>
      <div className={styles.statsRow}>
        <div className={styles.valueColumn}>
          <div>Current Source</div>
          <div>{currentSource}</div>
        </div>
        <div className={styles.valueColumn}>
          <div>Utility Input</div>
          <div>{utilityInput}</div>
        </div>
        <div className={styles.valueColumn}>
          <div>Generator Input</div>
          <div>{generatorInput}</div>
        </div>
        <div className={styles.valueColumn}>
          <div>Output to UPS</div>
          <div>{outputUPS}</div>
        </div>
        <div className={styles.valueColumn}>
          <div>Mode</div>
          <div>{mode}</div>
        </div>
        <div className={styles.valueColumn}>
          <div>Power</div>
          <div>{validNumbers(power) ? `${Math.round(power)} kW` : 'N/A'}</div>
        </div>
      </div>
      <div>
        <div className={styles.conditions}>
          {conditions.map((condition, index) => (
            <div key={`condition-${title}-${index}`}>{condition}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

ATSCard.propTypes = {
  /** The status of the ATS, which will be mapped to a human-readable status text and used for styling */
  status: PropTypes.string.isRequired,
  /** The state of the CSC, which will determine whether to show the device status or not */
  cscState: PropTypes.string.isRequired,
  /** The index of the CSC, used for the heartbeat icon tooltip */
  cscIndex: PropTypes.number.isRequired,
  /** The title to show in the card header */
  title: PropTypes.string.isRequired,
  /** The label to show in the card header */
  label: PropTypes.string.isRequired,
  /** The current source of the ATS */
  currentSource: PropTypes.string.isRequired,
  /** The utility input status of the ATS */
  utilityInput: PropTypes.string.isRequired,
  /** The generator input status of the ATS */
  generatorInput: PropTypes.string.isRequired,
  /** The output to UPS status of the ATS */
  outputUPS: PropTypes.string.isRequired,
  /** The mode of the ATS */
  mode: PropTypes.string.isRequired,
  /** The ATS power in kW */
  power: PropTypes.number,
  /** Additional conditions to show in the card */
  conditions: PropTypes.arrayOf(PropTypes.string),
};

export default ATSCard;
