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
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import InputPresent from '../InputPresent';
import {
  POWER_MONITOR_STATUS_MAPPING,
  POWER_MONITOR_CRITICALITY_MAPPING,
  POWER_MONITOR_STABILITY_MAPPING,
} from 'Config';
import { validNumbers } from 'Utils';
import styles from '../PowerMonitor.module.css';

function LoadCard({
  status,
  title,
  label,
  power,
  criticality,
  usage,
  voltageStdDev,
  conditions,
  hovered,
  onMouseEnter,
  onMouseLeave,
}) {
  const inputPresent = POWER_MONITOR_STATUS_MAPPING[status] === 'ok';
  const inputTitle = inputPresent ? 'Input present' : 'Input not present';
  const statusClass = POWER_MONITOR_STATUS_MAPPING[status] === 'ok' ? styles.ok : styles.alert;
  const usageText = usage > 80 ? 'HIGH' : usage > 50 ? 'MEDIUM' : 'LOW';
  const stabilityText = voltageStdDev >= 8 ? 'HIGHLY UNSTABLE' : voltageStdDev >= 6 ? 'UNSTABLE' : 'STABLE';
  const roundedVoltageStdDev = validNumbers(voltageStdDev) ? `${voltageStdDev.toFixed(2)} V` : 'N/A';
  const opacityClass = hovered == null || hovered ? '' : styles.hiddenOpacity;
  return (
    <div
      className={[styles.card, styles.loadCard, statusClass, opacityClass].join(' ')}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.deviceName}>
        <span>{title}</span>
        <span>{label}</span>
        <div>
          {inputPresent && (
            <StatusText
              title={`Voltage Std Dev: ${roundedVoltageStdDev}`}
              status={POWER_MONITOR_STABILITY_MAPPING[stabilityText]}
            >
              {stabilityText}
            </StatusText>
          )}
          <InputPresent present={inputPresent} title={inputTitle} />
        </div>
      </div>
      <div className={styles.statsRow}>
        <div className={styles.valueColumn}>
          <div>Power</div>
          <div>{validNumbers(power) ? `${Math.round(power)} kW` : 'N/A'}</div>
        </div>
        <div className={styles.valueColumn}>
          <div>Criticality</div>
          <div className={styles.statusValue}>
            <StatusText status={POWER_MONITOR_CRITICALITY_MAPPING[criticality]}>{criticality}</StatusText>
          </div>
        </div>
        <div className={styles.valueColumn}>
          <div>Usage</div>
          <div className={styles.statusValue}>
            <StatusText status={POWER_MONITOR_CRITICALITY_MAPPING[usageText]}>{usageText}</StatusText>
          </div>
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

LoadCard.propTypes = {
  /** The status of the load. */
  status: PropTypes.string.isRequired,
  /** The title to show in the card header. */
  title: PropTypes.string.isRequired,
  /** The label to show in the card header. */
  label: PropTypes.string.isRequired,
  /** The power of the load in kW. */
  power: PropTypes.number,
  /** The criticality level of the load (e.g., "High", "Medium", "Low"). */
  criticality: PropTypes.string,
  /** The usage percentage of the load. */
  usage: PropTypes.number,
  /** The standard deviation of the voltage, used to assess stability. */
  voltageStdDev: PropTypes.number,
  /** Additional conditions to show in the card. */
  conditions: PropTypes.arrayOf(PropTypes.string),
};

export default LoadCard;
