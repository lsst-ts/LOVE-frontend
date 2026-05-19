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
import { POWER_MONITOR_STATUS_MAPPING } from 'Config';
import { validNumbers } from 'Utils';
import DeviceStatus from '../DeviceStatus';
import styles from '../PowerMonitor.module.css';

function GeneratorCard({ status, cscState, cscIndex, title, label, activePower, load, fuel, mode, conditions }) {
  const fuelBarClass =
    fuel > 50 ? styles.segmentedBarOk : fuel > 20 ? styles.segmentedBarWarning : styles.segmentedBarCritical;
  const isOk = POWER_MONITOR_STATUS_MAPPING[status] === 'ok';
  const statusClass = isOk ? styles.ok : '';
  const opacityClass = isOk ? '' : styles.hiddenOpacity;
  const roundedLoad = validNumbers(load) ? `${Math.round(load)} %` : 'N/A';
  return (
    <div className={[styles.card, styles.generatorCard, statusClass, opacityClass].join(' ')}>
      <div className={styles.deviceName}>
        <span>{title}</span>
        <span>{label}</span>
        <DeviceStatus status={status} cscState={cscState} cscIndex={cscIndex} />
      </div>
      <div className={styles.statsRow}>
        <div className={styles.valueColumn}>
          <div>Power</div>
          <div>{activePower} kW</div>
        </div>
        <div className={styles.valueColumn}>
          <div>Mode</div>
          <div>{mode}</div>
        </div>
      </div>
      <div>
        <div className={styles.valueRow}>
          <div>Load</div>
          <div>{roundedLoad}</div>
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
        <div className={styles.valueRow}>
          <div>Fuel</div>
          <div>{fuel} %</div>
        </div>
        <SegmentedProgressBar percentage={fuel} fillerClassName={fuelBarClass} />
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

GeneratorCard.propTypes = {
  /** The status of the generator, which will be mapped to a human-readable status text */
  status: PropTypes.string.isRequired,
  /** The state of the CSC, which will determine whether to show the device status or not */
  cscState: PropTypes.string.isRequired,
  /** The index of the CSC, used for the heartbeat icon tooltip */
  cscIndex: PropTypes.number.isRequired,
  /** The title to show in the card header */
  title: PropTypes.string.isRequired,
  /** The label to show in the card header */
  label: PropTypes.string.isRequired,
  /** The active power of the generator in kW */
  activePower: PropTypes.number,
  /** The load of the generator as a percentage (0-100) */
  load: PropTypes.number,
  /** The fuel level of the generator as a percentage */
  fuel: PropTypes.number,
  /** The operating mode of the generator */
  mode: PropTypes.string,
  /** Additional conditions to show in the card */
  conditions: PropTypes.arrayOf(PropTypes.string),
};

export default GeneratorCard;
