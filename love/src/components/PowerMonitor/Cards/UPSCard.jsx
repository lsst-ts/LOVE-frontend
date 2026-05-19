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
import ProgressBar from 'components/GeneralPurpose/ProgressBar/ProgressBar';
import SegmentedProgressBar from 'components/GeneralPurpose/ProgressBar/SegmentedProgressBar';
import { formatSecondsToDigital, validNumbers } from 'Utils';
import { POWER_MONITOR_STATUS_MAPPING } from 'Config';
import DeviceStatus from '../DeviceStatus';
import styles from '../PowerMonitor.module.css';

function UPSCard({
  status,
  cscState,
  cscIndex,
  title,
  label,
  inputVoltage,
  inputFrequency,
  outputVoltage,
  outputFrequency,
  power,
  load,
  battery,
  batteryTimeRemaining,
  conditions,
}) {
  const batteryBarClass =
    battery >= 60 ? styles.segmentedBarOk : battery >= 30 ? styles.segmentedBarWarning : styles.segmentedBarCritical;
  const statusClass = POWER_MONITOR_STATUS_MAPPING[status] === 'ok' ? styles.ok : styles.alert;
  const batteryTimeRemainingText = validNumbers(batteryTimeRemaining)
    ? formatSecondsToDigital(batteryTimeRemaining).slice(0, -3)
    : 'N/A';
  return (
    <div className={[styles.card, styles.upsCard, statusClass].join(' ')}>
      <div className={styles.deviceName}>
        <span>{title}</span>
        <span>{label}</span>
        <DeviceStatus status={status} cscState={cscState} cscIndex={cscIndex} />
      </div>
      <div className={styles.statsRow}>
        <div className={styles.valueColumn}>
          <div>Input</div>
          <div>
            {validNumbers(inputVoltage) ? `${Math.round(inputVoltage)} V` : 'N/A'} |{' '}
            {validNumbers(inputFrequency) ? `${Math.round(inputFrequency)} Hz` : 'N/A'}
          </div>
        </div>
        <div className={styles.valueColumn}>
          <div>Output</div>
          <div>
            {validNumbers(outputVoltage) ? `${Math.round(outputVoltage)} V` : 'N/A'} |{' '}
            {validNumbers(outputFrequency) ? `${Math.round(outputFrequency)} Hz` : 'N/A'}
          </div>
        </div>
        <div className={styles.valueColumn}>
          <div>Power</div>
          <div>{validNumbers(power) ? `${Math.round(power)} kW` : 'N/A'}</div>
        </div>
      </div>
      <div>
        <div className={styles.valueRow}>
          <div>Load</div>
          <div>{validNumbers(load) ? `${Math.round(load)} %` : 'N/A'}</div>
        </div>
        <ProgressBar
          hideCompleted={true}
          height={10}
          completed={load}
          containerClassName={styles.progressBarContainer}
          fillerClassName={styles.progressBar}
        />
      </div>
      <div>
        <div className={styles.batteryInfoContainer}>
          <div className={styles.valueRow}>
            <div>Battery</div>
            <div>{validNumbers(battery) ? `${Math.round(battery)} %` : 'N/A'}</div>
          </div>
          <div className={styles.valueRow}>
            <div>Battery Time Remaining</div>
            <div>{batteryTimeRemainingText}</div>
          </div>
        </div>
        <SegmentedProgressBar percentage={battery} fillerClassName={batteryBarClass} />
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

UPSCard.propTypes = {
  /** The status of the UPS */
  status: PropTypes.string.isRequired,
  /** The CSC state to determine the color of the status indicator */
  cscState: PropTypes.string,
  /** The CSC index to determine the color of the status indicator */
  cscIndex: PropTypes.number,
  /** The title to show in the card header */
  title: PropTypes.string.isRequired,
  /** The label to show in the card header */
  label: PropTypes.string.isRequired,
  /** The input voltage of the UPS in V */
  inputVoltage: PropTypes.number,
  /** The input frequency of the UPS in Hz */
  inputFrequency: PropTypes.number,
  /** The output voltage of the UPS in V */
  outputVoltage: PropTypes.number,
  /** The output frequency of the UPS in Hz */
  outputFrequency: PropTypes.number,
  /** The power being drawn from the UPS in kW */
  power: PropTypes.number,
  /** The load percentage of the UPS (0-100) */
  load: PropTypes.number,
  /** The battery percentage of the UPS (0-100) */
  battery: PropTypes.number,
  /** The estimated time remaining on the battery in seconds */
  batteryTimeRemaining: PropTypes.number,
  /** Additional conditions to show in the card */
  conditions: PropTypes.arrayOf(PropTypes.string),
};

export default UPSCard;
