import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Summary.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';

export default class Summary extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // };

  render() {
    return (
      <div className={styles.summaryContainer}>
        <div className={styles.summaryComponentWrapper}>
          <div className={styles.summaryComponent}>
            <div className={styles.summaryComponentTitle}>POSITIONS</div>
            <div className={styles.statusGroupWrapper}>
              <span className={styles.statusTextLabel}>Dome Az: </span>
              <span className={styles.statusTextWrapper}>
                <span className={styles.telemetryValue}>90º</span>
                <span className={styles.arrow}>&#8594;</span>
                <span className={styles.telemetryValue}>80º</span>
              </span>
              <span className={styles.statusTextLabel}>Mount Az: </span>
              <span className={styles.statusTextWrapper}>
                <span className={styles.telemetryValue}>80º</span>
                <span className={styles.arrow}>&#8594;</span>
                <span className={styles.telemetryValue}>70º</span>
              </span>
              <span className={styles.statusTextLabel}>Mount El: </span>
              <span className={styles.statusTextWrapper}>
                <span className={styles.telemetryValue}>0º</span>
                <span className={styles.arrow}>&#8594;</span>
                <span className={styles.telemetryValue}>45º</span>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.summaryComponentWrapper}>
          <div className={styles.summaryComponent}>
            <div className={styles.summaryComponentTitle}>DOME</div>
            <div className={styles.statusGroupWrapper}>
              <span className={styles.statusTextLabel}>Az state: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'running'} title={`Current status: MovingCW\nCommanded: ${'GoToPosition'}`}>
                  MovingCW
                </StatusText>
              </div>
              <span className={styles.statusTextLabel}>Shutter: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'ok'} title={`Current status: MovingCW\nCommanded: ${'Open'}`}>
                  Opened
                </StatusText>
              </div>
              <span className={styles.statusTextLabel}>Dropout: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'ok'} title={`Current status: MovingCW\nCommanded: ${'Close'}`}>
                  Closed
                </StatusText>
              </div>
              {/* <span className={styles.statusTextLabel}>Az: </span>
              <span className={styles.statusTextWrapper}>
                <span className={styles.telemetryValue}>90º</span>
                <span className={styles.arrow}>&#8594;</span>
                <span className={styles.telemetryValue}>80º</span>
              </span> */}
            </div>
          </div>
        </div>
        <div className={styles.summaryComponentWrapper}>
          <div className={styles.summaryComponent}>
            <div className={styles.summaryComponentTitle}>ATMCS</div>
            <div className={styles.statusGroupWrapper}>
              <span className={styles.statusTextLabel}>Mount: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'running'}>Tracking</StatusText>
              </div>
              <span className={styles.statusTextLabel}>M3 Rotator: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'running'}>InMotion</StatusText>
              </div>
              <span className={styles.statusTextLabel}>M3 Port: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'ok'}>Nasmith1</StatusText>
              </div>
              {/* <span className={styles.statusTextLabel}>Az: </span>
              <span className={styles.statusTextWrapper}>
                <span className={styles.telemetryValue}>130º</span>
                <span className={styles.arrow}>&#8594;</span>
                <span className={styles.telemetryValue}>70º</span>
              </span>
              <span className={styles.statusTextLabel}>El: </span>
              <span className={styles.statusTextWrapper}>
                <span className={styles.telemetryValue}>0º</span>
                <span className={styles.arrow}>&#8594;</span>
                <span className={styles.telemetryValue}>45º</span>
              </span> */}
            </div>
          </div>
        </div>
        <div className={styles.summaryComponentWrapper}>
          <div className={styles.summaryComponent}>
            <div className={styles.summaryComponentTitle}>LATISS - Camera</div>
            <div className={styles.statusGroupWrapper}>
              <span className={styles.statusTextLabel}>State: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'running'}>Integrating</StatusText>
              </div>
              <span className={styles.statusTextLabel}>Shutter: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'ok'}>Open</StatusText>
              </div>
              <span className={styles.statusTextLabel}>Rafts: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'running'}>Clearing</StatusText>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.summaryComponentWrapper}>
          <div className={styles.summaryComponent}>
            <div className={styles.summaryComponentTitle}>LATISS - Spectrograph</div>
            <div className={styles.statusGroupWrapper}>
              <span className={styles.statusTextLabel}>State: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'running'}>Homing</StatusText>
              </div>
              <span className={styles.statusTextLabel}>Filter position: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'ok'}>Filter 0</StatusText>
              </div>
              <span className={styles.statusTextLabel}>Disperser position: </span>
              <div className={styles.statusTextWrapper}>
                <StatusText status={'ok'}>Nasmith1</StatusText>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
