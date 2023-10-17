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
import styles from './Summary.module.css';
import {
  stateToStyleMTMountCommander,
  mtMountCommanderStateMap,
  mtMountConnectedStateMap,
  mtMountPowerStateMap,
  mtMountAxisMotionStateMap,
  stateToStyleMTMountConnected,
  stateToStyleMTMountAxisMotionState,
  stateToStyleMTMountPowerState,
  MTMountLimits,
  summaryStateToStyle,
  summaryStateMap,
} from '../../../Config';

import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import { fixedFloat } from 'Utils';
import TemperaturesSummary from '../SummaryInformation/TemperaturesSummary';
import TemperatureIcon from 'components/icons/TemperatureIcon/TemperatureIcon';

export default class Summary extends Component {
  // static propTypes = {
  //   /** Unique target identifier. Echoed from the trackTarget command */
  //   trackId: PropTypes.number,
  //   /** Who controls the low-level controller; a Commander enum. */
  //   commander: PropTypes.number,
  //   /** Is the command (client) socket connected */
  //   connected: PropTypes.bool,
  //   /** State of the balance system. Overall power state of the balancing system; a PowerState enum */
  //   balancing: PropTypes.number,
  //   /** State of the azimuth axis. Power state of each motion controller; a PowerState enum. */
  //   azimuthSystem: PropTypes.number,
  //   /** Azimuth Motion state, as an AxisMotionState enum. */
  //   azimuthMotion: PropTypes.number,
  //   /** Azimuth Limits, as a LimitsMask enum mask. */
  //   azimuthLimits: PropTypes.number,
  //   /** Azimuth Position measured by the encoders */
  //   azimuthActualPosition: PropTypes.number,
  //   /** Azimuth Position computed by the path generator. */
  //   azimuthDemandPosition: PropTypes.number,
  //   /** State of the elevation system. Power state; a PowerState enum */
  //   elevationSystem: PropTypes.number,
  //   /** Motion state of the elevation axis */
  //   elevationMotion: PropTypes.number,
  //   /** Elevation Limits, as a LimitsMask enum mask */
  //   elevationLimits: PropTypes.number,
  //   /** Elevation Position measured by the encoders */
  //   elevationActualPosition: PropTypes.number,
  //   /** Elevation Position computed by the path generator */
  //   elevationDemandPosition: PropTypes.number,
  //   /** Current summary state of MTMount CSC. High level state machine state identifier. */
  //   summaryState: PropTypes.number,
  // };

  // static defaultProps = {
  //   trackId: 0,
  //   commander: 0,
  //   connected: false,
  //   balancing: 0,
  //   azimuthSystem: 0,
  //   azimuthMotion: 0,
  //   azimuthLimits: 0,
  //   azimuthActualPosition: 0,
  //   azimuthDemandPosition: 0,
  //   elevationSystem: 0,
  //   elevationMotion: 0,
  //   elevationLimits: 0,
  //   elevationActualPosition: 0,
  //   elevationDemandPosition: 0,
  //   summaryState: 0,
  // };

  render() {
    const {
      windDirection,
      windSpeed,
      degradation,
      atmosphericTrans,
      airTemp,
      pressure,
      humidity,
      seeing,
      numChannels,
      temperature,
      location,
    } = this.props;

    const temperatures = temperature.slice(0, numChannels);
    const locations = location ? location.split(',') : [];

    return (
      <div className={styles.container}>
        <SummaryPanel className={[styles.summaryPanel, styles.pt].join(' ')}>
          <Label>Env. Degradation</Label>
          <Value>{degradation}</Value>
          <Label>Atm. Transmition</Label>
          <Value>{atmosphericTrans}</Value>
          <Label>Air Temperature</Label>
          <Value>{airTemp}</Value>
          <Label>Pressure</Label>
          <Value>{pressure}</Value>
        </SummaryPanel>

        <SummaryPanel className={[styles.summaryPanel, styles.pt].join(' ')}>
          <Label>Humidity</Label>
          <Value>{humidity}</Value>
          <Label>Wind Speed</Label>
          <Value>{windSpeed}</Value>
          <Label>Wind Direction</Label>
          <Value>{windDirection}</Value>
          <Label>Seeing</Label>
          <Value>{seeing}</Value>
        </SummaryPanel>

        <div className={[styles.pt].join(' ')}>
          <TemperaturesSummary numChannels={numChannels} temperature={temperature} location={location} />
        </div>
      </div>
    );
  }
}
