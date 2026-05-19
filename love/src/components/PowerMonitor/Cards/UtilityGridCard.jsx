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
import { POWER_MONITOR_STATUS_MAPPING } from 'Config';
import { validNumbers } from 'Utils';
import styles from '../PowerMonitor.module.css';

function UtilityGridCard({ status, title, label, voltageLL, voltageLN, frequency, conditions }) {
  const isOk = POWER_MONITOR_STATUS_MAPPING[status] === 'ok';
  const statusClass = isOk ? styles.ok : styles.alert;
  const opacityClass = isOk ? '' : styles.hiddenOpacity;
  return (
    <div className={[styles.card, styles.utilityGridCard, statusClass, opacityClass].join(' ')}>
      <div className={styles.deviceName}>
        <span>{title}</span>
        <span>{label}</span>
        <StatusText status={POWER_MONITOR_STATUS_MAPPING[status]}>{status}</StatusText>
      </div>
      <div className={styles.statsRow}>
        <div className={styles.valueColumn}>
          <div title="Voltage (L1-L2)">V L-L</div>
          <div>{validNumbers(voltageLL) ? `${Math.round(voltageLL)} V` : 'N/A'}</div>
        </div>
        <div className={styles.valueColumn}>
          <div title="Voltage (L1-N)">V L-N</div>
          <div>{validNumbers(voltageLN) ? `${Math.round(voltageLN)} V` : 'N/A'}</div>
        </div>
        <div className={styles.valueColumn}>
          <div>Frequency</div>
          <div>{validNumbers(frequency) ? `${Math.round(frequency)} Hz` : 'N/A'} </div>
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

UtilityGridCard.propTypes = {
  /** The status of the utility grid */
  status: PropTypes.string.isRequired,
  /** The title to show in the card header */
  title: PropTypes.string.isRequired,
  /** The label to show in the card header */
  label: PropTypes.string.isRequired,
  /** The line-to-line voltage of the utility grid in V */
  voltageLL: PropTypes.number,
  /** The line-to-neutral voltage of the utility grid in V */
  voltageLN: PropTypes.number,
  /** The frequency of the utility grid */
  frequency: PropTypes.number,
  /** Additional conditions to show in the card */
  conditions: PropTypes.arrayOf(PropTypes.string),
};

export default UtilityGridCard;
