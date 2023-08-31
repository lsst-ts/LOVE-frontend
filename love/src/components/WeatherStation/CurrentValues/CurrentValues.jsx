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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TemperatureIcon from '../../icons/TemperatureIcon/TemperatureIcon';
import HumidityIcon from '../../icons/HumidityIcon/HumidityIcon';
import PressureIcon from '../../icons/PressureIcon/PressureIcon';
import WindIcon from '../../icons/WindIcon/WindIcon';
import styles from './CurrentValues.module.css';

export default class CurrentValues extends Component {
  static propTypes = {
    currentTemperature: PropTypes.number,
    currentHumidity: PropTypes.number,
    currentPressure: PropTypes.number,
    currentWindSpeed: PropTypes.number,
    currentWindSpeedUnits: PropTypes.string,
  };

  static defaultProps = {
    currentTemperature: undefined,
    currentHumidity: undefined,
    currentPressure: undefined,
    currentWindSpeed: undefined,
    currentWindSpeedUnits: undefined,
  };

  render() {
    const { currentTemperature, currentHumidity, currentPressure, currentWindSpeed, currentWindSpeedUnits } =
      this.props;

    return (
      <div className={styles.fullSection}>
        <div className={styles.sectionTitle}>Current values</div>
        <div className={styles.summary}>
          <div className={styles.summaryVariable}>
            <div className={styles.summaryLabel}>Temperature</div>
            <div className={styles.iconWrapper}>
              <TemperatureIcon className={styles.icon} />
            </div>
            <div className={styles.summaryValue}>
              {currentTemperature !== undefined ? `${currentTemperature} ºC` : '-'}
            </div>
          </div>
          <div className={styles.summaryVariable}>
            <div className={styles.summaryLabel}>Humidity</div>
            <div className={styles.iconWrapper}>
              <HumidityIcon className={styles.icon} />
            </div>
            <div className={styles.summaryValue}>{currentHumidity !== undefined ? `${currentHumidity}%` : '-'}</div>
          </div>
          <div className={styles.summaryVariable}>
            <div className={styles.summaryLabel}>Pressure</div>
            <div className={styles.iconWrapper}>
              <PressureIcon className={styles.icon} />
            </div>
            <div className={styles.summaryValue}>{currentPressure !== undefined ? `${currentPressure} pa` : '-'}</div>
          </div>
          <div className={styles.summaryVariable}>
            <div className={styles.summaryLabel}>Wind speed</div>
            <div className={styles.iconWrapper}>
              <WindIcon className={styles.icon} />
            </div>
            <div className={styles.summaryValue}>
              {currentWindSpeed !== undefined
                ? `${currentWindSpeed} ${currentWindSpeedUnits !== 'unitless' ? currentWindSpeedUnits : ''}`
                : '-'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
