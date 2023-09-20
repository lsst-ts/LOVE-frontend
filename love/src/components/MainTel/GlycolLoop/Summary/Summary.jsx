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
import PropTypes from 'prop-types';
import styles from './Summary.module.css';
import {
  glycolLoopFaultStateMap,
  glycolLoopRunningStateMap,
  glycolLoopReadyStateMap,
  glycolLoopCommandStateMap,
  glycolLoopMainFreqStateMap,
  glycolLoopParametersStateMap,
  glycolLoopDirectionStateMap,
  glycolLoopAcceleratingStateMap,
  glycolLoopDeceleratingStateMap,
  stateToStyleGlycolLoopPumpStateMap,
  stateToStyleGlycolLoopCommandStateMap,
  stateToStyleGlycolLoopMainFreqStateMap,
  stateToStyleGlycolLoopParametersStateMap,
  stateToStyleGlycolLoopDirectionStateMap,
  stateToStyleGlycolLoopRotationStateMap,
  stateToStyleGlycolLoopSpeedStateMap,
} from '../../../../Config';

import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';

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
    ready: undefined,
    running: undefined,
    forwardCommanded: undefined,
    forwardRotating: undefined,
    accelerating: undefined,
    decelerating: undefined,
    faulted: undefined,
    mainFrequencyControlled: undefined,
    operationCommandControlled: undefined,
    parametersLocked: undefined,
    errorCode: '',
    errorReport: 'No data is being recieved',
  };

  render() {
    const faulted = glycolLoopFaultStateMap[this.props.faulted];
    const ready = glycolLoopReadyStateMap[this.props.ready];
    const running = glycolLoopRunningStateMap[this.props.running];
    const pump = faulted ? 'FAULT' : running ? 'RUNNING' : ready;
    const operationCommandControlled = glycolLoopCommandStateMap[this.props.operationCommandControlled];
    const mainFrequencyControlled = glycolLoopMainFreqStateMap[this.props.mainFrequencyControlled];
    const parametersLocked = glycolLoopParametersStateMap[this.props.parametersLocked];

    const forwardCommanded = glycolLoopDirectionStateMap[this.props.forwardCommanded];
    const forwardRotating = glycolLoopDirectionStateMap[this.props.forwardRotating];
    const accelerating = glycolLoopAcceleratingStateMap[this.props.accelerating];
    const decelerating = glycolLoopDeceleratingStateMap[this.props.decelerating];

    const speed = accelerating ? 'ACCELERATING' : decelerating ? 'DECELERATING' : 'UNKNOWN';

    const { errorCode, errorReport } = this.props;

    return (
      <div className={styles.container}>
        <SummaryPanel>
          <Title>Glycol Pump</Title>
          <Value>
            <StatusText title={ready} status={stateToStyleGlycolLoopPumpStateMap[pump]} small>
              {pump}
            </StatusText>
          </Value>
          <Label wide>{this.props.faulted ? 'Error ' + errorCode + ': ' + errorReport : 'No Errors detected'}</Label>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanel}>
          <Label>Command</Label>
          <Value>
            <StatusText
              title={operationCommandControlled}
              status={stateToStyleGlycolLoopCommandStateMap[operationCommandControlled]}
              small
            >
              {operationCommandControlled}
            </StatusText>
          </Value>
          <Label>Direction</Label>
          <Value>
            <StatusText
              title={forwardCommanded}
              status={stateToStyleGlycolLoopDirectionStateMap[forwardCommanded]}
              small
            >
              {forwardCommanded}
            </StatusText>
          </Value>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanel}>
          <Label>Main Freq</Label>
          <Value>
            <StatusText
              title={mainFrequencyControlled}
              status={stateToStyleGlycolLoopMainFreqStateMap[mainFrequencyControlled]}
              small
            >
              {mainFrequencyControlled}
            </StatusText>
          </Value>
          <Label>Rotation</Label>
          <Value>
            <StatusText title={forwardRotating} status={stateToStyleGlycolLoopRotationStateMap[forwardRotating]} small>
              {forwardRotating}
            </StatusText>
          </Value>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanel}>
          <Label>Parameters</Label>
          <Value>
            <StatusText
              title={parametersLocked}
              status={stateToStyleGlycolLoopParametersStateMap[parametersLocked]}
              small
            >
              {parametersLocked}
            </StatusText>
          </Value>
          <Label>Speed</Label>
          <Value>
            <StatusText title={accelerating} status={stateToStyleGlycolLoopSpeedStateMap[speed]} small>
              {speed}
            </StatusText>
          </Value>
        </SummaryPanel>
      </div>
    );
  }
}
