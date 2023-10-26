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
  dynaleneDetailedStateMap,
  dynaleneDetailedStateToStyle,
  dynaleneTankLevelDetailedStateMap,
  dynaleneTankLevelToStyle,
} from '../../../Config';
import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';

export default class Summary extends Component {
  static propTypes = {
    /** True if the pump can be started */
    ready: PropTypes.bool,
    /** True if the pump is running */
    running: PropTypes.bool,
    /** True if pump motor is commanded to run forward, false for backward command */
    forwardCommanded: PropTypes.bool,
    /** True if pump motor is rotating forward, false for backward rotation. */
    forwardRotating: PropTypes.bool,
    /** True if motor is accelerating */
    accelerating: PropTypes.bool,
    /** True if motor is decelerating */
    decelerating: PropTypes.bool,
    /** True if motor faulted */
    faulted: PropTypes.bool,
    /** True if main frequency is controlled by the active communication. */
    mainFrequencyControlled: PropTypes.bool,
    /** True if pump motor operation is controlled by the active communication. */
    operationCommandControlled: PropTypes.bool,
    /** True if pump motor parameters are locked. */
    parametersLocked: PropTypes.bool,
    /** Motor controller error code. Please see VFD documentation for details. */
    errorCode: PropTypes.number,
    /** Motor controller error report. */
    errorReport: PropTypes.string,
  };

  static defaultProps = {
    dynaleneState: undefined,
    exhAirAvrgTemp: undefined,
    faulted: false,
    errorReport: undefined,
    dynPierFansOnOff: undefined,
  };

  render() {
    const {
      dynaleneState,
      exhAirAvrgTemp,
      dynAmbientDeltaModeStatus,
      dynExhaustAirBackupModeStatus,
      dynRemoteLocalModeStatus,
      dynPierFansOnOff,
      dynaleneTankLevel,
      errorArray,
    } = this.props;

    const dynaleneStateText = dynaleneDetailedStateMap[dynaleneState];
    const dynaleneStateStyle = dynaleneDetailedStateToStyle[dynaleneStateText];

    const dynaleneTankLevelText = dynaleneTankLevelDetailedStateMap[dynaleneTankLevel];
    const dynaleneTankLevelStyle = dynaleneTankLevelToStyle[dynaleneTankLevelText];

    const errorReport = [
      'System Fault',
      'System Warning',
      'TMA Alarm',
      'Test Area Alarm',
      'Main Grid Alarm',
      'Main Grid Failure Flag',
      'Safety Reset Flag',
    ];

    const matchedErrors = errorArray.map((value, index) => (value ? errorReport[index] : null));

    return (
      <div className={styles.container}>
        <SummaryPanel>
          <Title>Dynalene</Title>
          <Value>
            <StatusText title={dynaleneStateText} status={dynaleneStateStyle} small>
              {dynaleneStateText}
            </StatusText>
          </Value>
          <Label wide>
            {this.props.faulted
              ? 'Errors: ' + matchedErrors.filter(Boolean).map((error, index) => error)
              : 'No Errors detected'}
          </Label>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanel}>
          <Label>Exh. Air Backup</Label>
          <Value>
            <StatusText status={dynExhaustAirBackupModeStatus ? 'ok' : 'invalid'} small>
              {dynExhaustAirBackupModeStatus ? 'On' : 'Off'}
            </StatusText>
          </Value>
          <Label>{''}</Label>
          <Value>{exhAirAvrgTemp === 'undefined' ? 'No Data' : exhAirAvrgTemp + ' ºC'}</Value>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanel}>
          <Label>Tank Level</Label>
          <Value>
            <StatusText status={dynaleneTankLevelStyle} small>
              {dynaleneTankLevelText}
            </StatusText>
          </Value>
          <Label>Pier Fans</Label>
          <Value>
            <StatusText status={dynPierFansOnOff ? 'ok' : 'invalid'} small>
              {dynPierFansOnOff ? 'On' : 'Off'}
            </StatusText>
          </Value>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanel}>
          <Label>Ambient Delta</Label>
          <Value>
            <StatusText status={dynAmbientDeltaModeStatus ? 'ok' : 'invalid'} small>
              {dynAmbientDeltaModeStatus ? 'On' : 'Off'}
            </StatusText>
          </Value>
          <Label>Remote Local</Label>
          <Value>
            <StatusText status={dynRemoteLocalModeStatus ? 'ok' : 'invalid'} small>
              {dynRemoteLocalModeStatus ? 'On' : 'Off'}
            </StatusText>
          </Value>
        </SummaryPanel>
      </div>
    );
  }
}
