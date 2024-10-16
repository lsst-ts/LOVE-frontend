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
import styles from './MTDomeSummaryTable.module.css';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import CurrentTargetValue from '../../../GeneralPurpose/CurrentTargetValue/CurrentTargetValue';
import PropTypes from 'prop-types';
import Limits from '../../../GeneralPurpose/Limits/Limits';
import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Row from '../../../GeneralPurpose/SummaryPanel/Row';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import ProgressBar from '../../../GeneralPurpose/ProgressBar/ProgressBar';
import {
  summaryStateMap,
  summaryStateToStyle,
  mtDomeModeStateMap,
  mtDomeModeStatetoStyle,
  mtDomeAzimuthEnabledStateMap,
  mtDomeAzimuthEnabledStatetoStyle,
  mtdomeMotionStateMap,
  mtdomeMotionStatetoStyle,
  MTMountLimits,
  mtDomeTrackingStateMap,
  mtDomeTrackingStatetoStyle,
} from '../../../../Config';

export default class MTDomeSummaryTable extends Component {
  static propTypes = {
    /** Unique target identifier. Echoed from the trackTarget command */
    trackId: PropTypes.number,
    /** High level state machine state identifier */
    mtDomeSummaryState: PropTypes.number,
    /** High level state machine state identifier */
    mtMountSummaryState: PropTypes.number,
    /** Enabled state; an EnabledState enum */
    azimuthDomeState: PropTypes.number,
    /** The motion state; a MotionState enum */
    azimuthDomeMotion: PropTypes.number,
    /** Target position; nan for the crawlAz command */
    azimuthDomeTarget: PropTypes.number,
    /** Operational mode; an OperationalMode enum */
    modeDomeStatus: PropTypes.number,
    /** Position measured by the encoders */
    currentPointingAz: PropTypes.number,
    /** Position computed by the path generator */
    targetPointingAz: PropTypes.number,
    /** Position measured by the encoders */
    currentPointingEl: PropTypes.number,
    /** Position computed by the path generator */
    targetPointingEl: PropTypes.number,
  };

  static defaultProps = {
    trackId: 0,
    mtDomeSummaryState: 0,
    mtMountSummaryState: 0,
    azimuthDomeState: 0,
    azimuthDomeMotion: 0,
    azimuthDomeTarget: 0,
    elevationDomeTarget: 0,
    modeDomeStatus: 0,
    currentPointingAz: 0,
    targetPointingAz: 0,
    currentPointingEl: 0,
    targetPointingEl: 0,
  };

  render() {
    const trackID = this.props.trackID;
    const mtDomeStatus = summaryStateMap[this.props.mtDomeSummaryState];
    const modeDomeStatus = mtDomeModeStateMap[this.props.modeDomeStatus];
    const azimuthDomeState = mtDomeAzimuthEnabledStateMap[this.props.azimuthDomeState];
    const azimuthDomeMotion = mtdomeMotionStateMap[this.props.azimuthDomeMotion];
    const mtMountStatus = summaryStateMap[this.props.mtMountSummaryState];
    const mtDomeTrackingName = mtDomeTrackingStateMap[this.props.domeTracking];
    const mtDomeTrackingStyle = mtDomeTrackingStatetoStyle[mtDomeTrackingName];

    const domeActualAz = this.props.positionActualDomeAz;
    const domeCommandedAz = this.props.positionCommandedDomeAz;

    const { az: mountActualAz, el: mountActualEl } = this.props.currentPointing;
    const { az: mountCommandedAz, el: mountCommandedEl } = this.props.targetPointing;

    return (
      <div className={styles.divSummary}>
        <SummaryPanel className={styles.summaryTable}>
          <Title>Track ID</Title>
          <Value>{trackID?.toString()}</Value>
          <Title>MTDome CSC</Title>
          <Value>
            <StatusText status={summaryStateToStyle[mtDomeStatus]}>{mtDomeStatus}</StatusText>
          </Value>
          <Label>Mode</Label>
          <Value>
            <StatusText status={mtDomeModeStatetoStyle[modeDomeStatus]}>{modeDomeStatus}</StatusText>
          </Value>
          <Label>Tracking</Label>
          <Value>
            <StatusText status={mtDomeTrackingStyle}>{mtDomeTrackingName}</StatusText>
          </Value>
          <Label>Az State</Label>
          <Value>
            <StatusText status={mtDomeAzimuthEnabledStatetoStyle[azimuthDomeState]}>{azimuthDomeState}</StatusText>
          </Value>
          <Label>Az Motion</Label>
          <Value>
            <StatusText status={mtdomeMotionStatetoStyle[azimuthDomeMotion]}>{azimuthDomeMotion}</StatusText>
          </Value>
          <Label>Az</Label>
          <Value>
            <CurrentTargetValue currentValue={domeActualAz} targetValue={domeCommandedAz} isChanging={true} />
          </Value>

          <Title>MTMount CSC</Title>
          <Value>
            <StatusText status={summaryStateToStyle[mtMountStatus]}>{mtMountStatus}</StatusText>
          </Value>
          <Label>Elevation</Label>
          <Value>
            <CurrentTargetValue currentValue={mountActualEl} targetValue={mountCommandedEl} isChanging={true} />
          </Value>
          <Row>
            <Limits
              lowerLimit={MTMountLimits.elevation.min}
              upperLimit={MTMountLimits.elevation.max}
              currentValue={mountActualEl}
              targetValue={mountCommandedEl}
              height={30}
              displayLabels={false}
              limitWarning={5}
            />
          </Row>
          <Label>Azimuth</Label>
          <Value>
            <CurrentTargetValue currentValue={mountActualAz} targetValue={mountCommandedAz} isChanging={true} />
          </Value>
          <Row>
            <Limits
              lowerLimit={MTMountLimits.azimuth.min}
              upperLimit={MTMountLimits.azimuth.max}
              currentValue={mountActualAz}
              targetValue={mountCommandedAz}
              height={30}
              displayLabels={false}
              limitWarning={5}
            />
          </Row>
        </SummaryPanel>
        <SummaryPanel className={styles.shutters}>
          <SummaryPanel>
            <Label>Shutters</Label>
          </SummaryPanel>
          <div className={styles.divProgressBars}>
            <ProgressBar
              targetValue={this.props.positionCommandedShutter}
              completed={this.props.positionActualShutter}
            />
            <ProgressBar
              targetValue={this.props.positionCommandedShutter}
              completed={this.props.positionActualShutter}
            />
          </div>
        </SummaryPanel>
      </div>
    );
  }
}
