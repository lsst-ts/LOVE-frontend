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
import { defaultNumberFormatter } from 'Utils';
import { inclinationTelemetrySourceStateMap } from 'Config';
import styles from './Inclinometer.module.css';

export default class Inclinometer extends Component {
  static propTypes = {
    /** Zenith angle is 0 degree when the telescope is at zenith. */
    zenithAngleMeasured: PropTypes.number,
    /** The source of inclination telemetry (onboard or from main telescope mount (MTMount) control system). */
    inclinationTelemetrySource: PropTypes.number,
  };

  static defaultProps = {
    zenithAngleMeasured: 0,
    inclinationTelemetrySource: 1,
  };

  render() {
    const { zenithAngleMeasured, inclinationTelemetrySource } = this.props;
    const inclinationTelemetrySourceValue = inclinationTelemetrySource
      ? inclinationTelemetrySourceStateMap[inclinationTelemetrySource]
      : inclinationTelemetrySourceStateMap[Inclinometer.defaultProps.inclinationTelemetrySource];

    return (
      <div className={styles.container}>
        <p className={styles.title}>Inclination</p>
        <svg className={styles.svgContainer} viewBox="0 0 302 165.85">
          <path className={styles['cls-1']} d="M1,164.85a150,150,0,0,1,300,0" />
          <line className={styles['cls-1']} x1="151" y1="14.85" x2="151" y2="159.46" />
          <rect className={styles['cls-1']} x="1" y="155.62" width="300" height="9.23" />
          <line
            style={{
              transform: `rotate(${zenithAngleMeasured}deg)`,
            }}
            className={styles.marker}
            x1="151"
            y1="3.31"
            x2="151"
            y2="164.85"
          />
          <path className={styles['cls-3']} d="M111,164.85a40,40,0,0,1,80,0" />
          <rect
            style={{
              transform: `rotate(${zenithAngleMeasured}deg)`,
            }}
            className={styles['cls-3']}
            x="104.85"
            y="1"
            width="92.31"
            height="23.08"
          />
          <text className={styles.axisLabel} x="146" y="-5">
            0°
          </text>
        </svg>
        <div className={styles.inclinometerValues}>
          <span>Inclination</span>
          <span className={styles.value}>{defaultNumberFormatter(zenithAngleMeasured, 2)}°</span>
          <span>Source</span>
          <span className={styles.value}>{inclinationTelemetrySourceValue}</span>
        </div>
      </div>
    );
  }
}
