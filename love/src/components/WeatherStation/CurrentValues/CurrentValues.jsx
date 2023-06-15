import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TemperatureIcon from '../../icons/TemperatureIcon/TemperatureIcon';
import HumidityIcon from '../../icons/HumidityIcon/HumidityIcon';
import PressureIcon from '../../icons/PressureIcon/PressureIcon';
import WindIcon from '../../icons/WindIcon/WindIcon';
import styles from './CurrentValues.module.css';



export default class CurrentValues extends Component{
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
    const {
      currentTemperature,
      currentHumidity,
      currentPressure,
      currentWindSpeed,
      currentWindSpeedUnits,
    } = this.props;

    return (
      <div className={styles.fullSection}>
        <div className={styles.sectionTitle}>Current values</div>
        <div className={styles.summary}>
          <div className={styles.summaryVariable}>
            <div className={styles.summaryLabel}>Temperature</div>
            <div className={styles.iconWrapper}>
              <TemperatureIcon className={styles.icon}/>
            </div>
            <div className={styles.summaryValue}>
              {currentTemperature !== undefined ? `${currentTemperature} ºC` : '-'}
            </div>
          </div>
          <div className={styles.summaryVariable}>
            <div className={styles.summaryLabel}>Humidity</div>
            <div className={styles.iconWrapper}>
              <HumidityIcon className={styles.icon}/>
            </div>
            <div className={styles.summaryValue}>{currentHumidity !== undefined ? `${currentHumidity}%` : '-'}</div>
          </div>
          <div className={styles.summaryVariable}>
            <div className={styles.summaryLabel}>Pressure</div>
            <div className={styles.iconWrapper}>
              <PressureIcon className={styles.icon}/>
            </div>
            <div className={styles.summaryValue}>{currentPressure !== undefined ? `${currentPressure} pa` : '-'}</div>
          </div>
          <div className={styles.summaryVariable}>
            <div className={styles.summaryLabel}>Wind speed</div>
            <div className={styles.iconWrapper}>
              <WindIcon className={styles.icon}/>
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