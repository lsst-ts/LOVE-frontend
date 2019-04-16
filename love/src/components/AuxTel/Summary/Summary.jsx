import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Summary.module.css';

export default class Summary extends Component {
  static propTypes = {
    // prop: PropTypes
  };

  render() {
    return (
      <div className={styles.summaryContainer}>
        <div className={styles.summaryComponentWrapper}>
          <div className={styles.summaryComponent}>
            <div className={styles.summaryComponentTitle}>POSITIONS</div>
            <div>
              <div>
                <span>Dome Az: </span>
                <span className={styles.telemetryValue}>90º</span>
                <span className={styles.arrow}>&#8594;</span>
                <span className={styles.telemetryValue}>80º</span>
              </div>
              <div>
                <span>Mount Az: </span>
                <span className={styles.telemetryValue}>80º</span>
                <span className={styles.arrow}>&#8594;</span>
                <span className={styles.telemetryValue}>70º</span>
              </div>
              <div>
                <span>Mount El: </span>
                <span className={styles.telemetryValue}>0º</span>
                <span className={styles.arrow}>&#8594;</span>
                <span className={styles.telemetryValue}>45º</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.summaryComponentWrapper}>
          <div className={styles.summaryComponent}>
            <div className={styles.summaryComponentTitle}>DOME</div>
          </div>
        </div>
        <div className={styles.summaryComponentWrapper}>
          <div className={styles.summaryComponent}>
            <div className={styles.summaryComponentTitle}>ATMCS</div>
          </div>
        </div>
        <div className={styles.summaryComponentWrapper}>
          <div className={styles.summaryComponent}>
            <div className={styles.summaryComponentTitle}>LATISS</div>
          </div>
        </div>
      </div>
    );
  }
}
