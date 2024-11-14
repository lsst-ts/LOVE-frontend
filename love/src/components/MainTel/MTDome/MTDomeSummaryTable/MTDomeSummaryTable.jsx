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
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import CurrentTargetValue from 'components/GeneralPurpose/CurrentTargetValue/CurrentTargetValue';
import Limits from 'components/GeneralPurpose/Limits/Limits';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Row from 'components/GeneralPurpose/SummaryPanel/Row';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import ProgressBar from 'components/GeneralPurpose/ProgressBar/ProgressBar';
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
} from 'Config';
import { formatHoursToDigital, degreesToDMS, degrees, defaultNumberFormatter } from 'Utils';
import styles from './MTDomeSummaryTable.module.css';

export default class MTDomeSummaryTable extends Component {
  static propTypes = {
    /** Unique target identifier. Echoed from the trackTarget command */
    trackId: PropTypes.number,
    /** Summary state of the MTDome CSC */
    mtDomeSummaryState: PropTypes.number,
    /** Summary state of the MTMount CSC */
    mtMountSummaryState: PropTypes.number,
    /** Azimuth dome state */
    azimuthDomeState: PropTypes.number,
    /** Azimuth dome motion */
    azimuthDomeMotion: PropTypes.number,
    /** Operational dome mode */
    modeDomeStatus: PropTypes.number,
    /** Actual dome azimuth position */
    positionActualDomeAz: PropTypes.number,
    /** Commanded dome azimuth position */
    positionCommandedDomeAz: PropTypes.number,
    /** Telescope current pointing */
    currentPointing: PropTypes.object,
    /** Telescope target pointing */
    targetPointing: PropTypes.object,
    /** Actual shutter position */
    positionActualShutter: PropTypes.array,
    /** Commanded shutter position */
    positionCommandedShutter: PropTypes.array,
    /** Telescope current RA in hours */
    telescopeRAHour: PropTypes.number,
    /** Telescope current RA in degrees */
    telescopeRADeg: PropTypes.number,
    /** Telescope current Dec in degrees */
    telescopeDecDeg: PropTypes.number,
    /** Telescope rotator position in rad */
    telescopeRotatorRad: PropTypes.number,
    /** Whether to display the RA and DEC in hour format */
    raDecHourFormat: PropTypes.bool,
  };

  static defaultProps = {
    trackId: 0,
    mtDomeSummaryState: 0,
    mtMountSummaryState: 0,
    azimuthDomeState: 0,
    azimuthDomeMotion: 0,
    modeDomeStatus: 0,
    positionActualDomeAz: 0,
    positionCommandedDomeAz: 0,
    currentPointing: { az: 0, el: 0 },
    targetPointing: { az: 0, el: 0 },
    positionActualShutter: [],
    positionCommandedShutter: [],
  };

  render() {
    const {
      trackId,
      mtDomeSummaryState,
      mtMountSummaryState,
      azimuthDomeState,
      azimuthDomeMotion,
      modeDomeStatus,
      positionActualDomeAz,
      positionCommandedDomeAz,
      currentPointing,
      targetPointing,
      positionActualShutter,
      positionCommandedShutter,
      targetName,
      telescopeRAHour,
      telescopeRADeg,
      telescopeDecDeg,
      telescopeRotatorRad,
      raDecHourFormat,
    } = this.props;

    const mtDomeStatusText = summaryStateMap[mtDomeSummaryState];
    const modeDomeStatusText = mtDomeModeStateMap[modeDomeStatus];
    const azimuthDomeStateText = mtDomeAzimuthEnabledStateMap[azimuthDomeState];
    const azimuthDomeMotionText = mtdomeMotionStateMap[azimuthDomeMotion];
    const mtMountStatusText = summaryStateMap[mtMountSummaryState];

    const { az: mountActualAz, el: mountActualEl } = currentPointing;
    const { az: mountCommandedAz, el: mountCommandedEl } = targetPointing;

    const shutterPositionActual1 = Math.round(positionActualShutter[0] ?? 0);
    const shutterPositionCommanded1 = Math.round(positionCommandedShutter[0] ?? 0);
    const shutterPositionActual2 = Math.round(positionActualShutter[1] ?? 0);
    const shutterPositionCommanded2 = Math.round(positionCommandedShutter[1] ?? 0);

    const parsedTelescopeRAHour = formatHoursToDigital(telescopeRAHour);
    const parsedTelescopeDecHour = degreesToDMS(telescopeDecDeg);
    const parsedTelescopeRADeg = defaultNumberFormatter(telescopeRADeg, 2) + '°';
    const parsedTelescopeDecDeg = defaultNumberFormatter(telescopeDecDeg, 2) + '°';
    const parsedTelescopeRotatorDeg = defaultNumberFormatter(degrees(telescopeRotatorRad), 2) + '°';
    const telescopeRAText = raDecHourFormat ? parsedTelescopeRAHour : parsedTelescopeRADeg;
    const telescopeDecText = raDecHourFormat ? parsedTelescopeDecHour : parsedTelescopeDecDeg;

    return (
      <div className={styles.divSummary}>
        <SummaryPanel className={styles.summaryTable}>
          <Title>Track ID</Title>
          <Value>{trackId?.toString()}</Value>
          <Label>Target Name</Label>
          <Value>{targetName}</Value>
          <Label>Telescope RA</Label>
          <Value>{telescopeRAText}</Value>
          <Label>Telescope Dec</Label>
          <Value>{telescopeDecText}</Value>
          <Label>Rotator</Label>
          <Value>{parsedTelescopeRotatorDeg}</Value>
          <Title>MTDome CSC</Title>
          <Value>
            <StatusText status={summaryStateToStyle[mtDomeStatusText]}>{mtDomeStatusText}</StatusText>
          </Value>
          <Label>Mode</Label>
          <Value>
            <StatusText status={mtDomeModeStatetoStyle[modeDomeStatusText]}>{modeDomeStatusText}</StatusText>
          </Value>
          <Label>Az State</Label>
          <Value>
            <StatusText status={mtDomeAzimuthEnabledStatetoStyle[azimuthDomeStateText]}>
              {azimuthDomeStateText}
            </StatusText>
          </Value>
          <Label>Az Motion</Label>
          <Value>
            <StatusText status={mtdomeMotionStatetoStyle[azimuthDomeMotionText]}>{azimuthDomeMotionText}</StatusText>
          </Value>
          <Label>Az</Label>
          <Value>
            <CurrentTargetValue
              currentValue={positionActualDomeAz}
              targetValue={positionCommandedDomeAz}
              isChanging={true}
            />
          </Value>

          <Title>MTMount CSC</Title>
          <Value>
            <StatusText status={summaryStateToStyle[mtMountStatusText]}>{mtMountStatusText}</StatusText>
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
          <Title>Shutters</Title>
          <div className={styles.divProgressBars}>
            <ProgressBar targetValue={shutterPositionCommanded1} completed={shutterPositionActual1} />
            <ProgressBar targetValue={shutterPositionCommanded2} completed={shutterPositionActual2} />
          </div>
        </SummaryPanel>
      </div>
    );
  }
}
