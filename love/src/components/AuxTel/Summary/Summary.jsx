/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Summary.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import CurrentTargetValue from '../../GeneralPurpose/CurrentTargetValue/CurrentTargetValue';

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
              <CurrentTargetValue currentValue={90} targetValue={80} isChanging={true} />
              <span className={styles.statusTextLabel}>Mount Az: </span>
              <CurrentTargetValue currentValue={80} targetValue={70} isChanging={true} />
              <span className={styles.statusTextLabel}>Mount El: </span>
              <CurrentTargetValue currentValue={0} targetValue={45} isChanging={true} />
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
                <StatusText status={'ok'}>Nasmyth1</StatusText>
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
                <StatusText status={'ok'}>Nasmyth1</StatusText>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
