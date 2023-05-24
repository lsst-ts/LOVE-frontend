import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Summary.module.css';
import {
  stateToStylePumpReady,
  stateToStyleMTMountCommander,
  mtMountCommanderStateMap,
  mtMountConnectedStateMap,
  mtMountPowerStateMap,
  mtMountAxisMotionStateMap,
  stateToStyleMTMountConnected,
  stateToStyleMTMountAxisMotionState,
  stateToStyleMTMountPowerState,
  MTMountLimits,
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
  };

  static defaultProps = {
    ready: false,
    running: false,
    forwardCommanded: false,
    forwardRotating: false,
    accelerating: false,
    decelerating: false,
    faulted: false,
    mainFrequencyControlled: false,
    operationCommandControlled: false,
    parametersLocked: false,
    errorCode: 0,
  };

  glycolPumpBooltoState = (ready, running) => {
    if (running) {
      return 'RUNNING';
    } else if (ready) {
      return 'READY';
    } else {
      return 'NOT READY';
    }
  };

  StatusToStyle = (bool, statusArray) => {
    if (bool) {
      return statusArray[0];
    } else {
      return statusArray[1];
    }
  };

  render() {
    const {
      ready,
      running,
      forwardCommanded,
      forwardRotating,
      accelerating,
      decelerating,
      faulted,
      mainFrequencyControlled,
      operationCommandControlled,
      parametersLocked,
      errorCode,
      errorReport,
    } = this.props;

    console.log(this.props);

    //const commanderValue = mtMountCommanderStateMap[this.props.commander];

    // AzimuthLimit
    //const { min: minAzimuthPosition, max: maxAzimuthPosition } = MTMountLimits.azimuth;
    //const timeToAzimuthLimit = 0;

    // ElevationLimit
    //const { min: minElevationPosition, max: maxElevationPosition } = MTMountLimits.elevation;
    //const timeToElevationLimit = 0;

    return (
      <div className={styles.container}>
        <SummaryPanel>
          <Title>Glycol Pump</Title>
          <Value>
            <StatusText title={ready} status={running ? 'ok' : ready ? 'ok' : 'invalid'} small>
              {this.glycolPumpBooltoState(ready, running)}
            </StatusText>
          </Value>
          <Label wide>{faulted ? 'Error ' + errorCode + ': ' + errorReport : 'No Errors detected'}</Label>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanel}>
          <Label>Command</Label>
          <Value>
            <StatusText
              title={operationCommandControlled}
              status={this.StatusToStyle(operationCommandControlled, ['ok', 'warning'])}
              small
            >
              {operationCommandControlled ? 'Controlled' : 'Disabled'}
            </StatusText>
          </Value>
          <Label>Direction</Label>
          <Value>
            <StatusText title={forwardCommanded} status="ok" small>
              {forwardCommanded ? 'Forward' : 'Backward'}
            </StatusText>
          </Value>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanel}>
          <Label>Main Freq</Label>
          <Value>
            <StatusText
              title={mainFrequencyControlled}
              status={this.StatusToStyle(mainFrequencyControlled, ['ok', 'invalid'])}
              small
            >
              {mainFrequencyControlled ? 'Controlled' : 'Not Controlled'}
            </StatusText>
          </Value>
          <Label>Rotation</Label>
          <Value>
            <StatusText
              title={mainFrequencyControlled}
              status={this.StatusToStyle(mainFrequencyControlled, ['ok', 'ok'])}
              small
            >
              {forwardRotating ? 'Forward' : 'Rotation'}
            </StatusText>
          </Value>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanel}>
          <Label>Parameters</Label>
          <Value>
            <StatusText title={parametersLocked} status={this.StatusToStyle(parametersLocked, ['ok', 'warning'])} small>
              {parametersLocked ? 'Locked' : 'Unlocked'}
            </StatusText>
          </Value>
          <Label>Speed</Label>
          <Value>
            <StatusText title={accelerating} status={this.StatusToStyle(mainFrequencyControlled, ['ok', 'ok'])} small>
              {accelerating ? 'Accelerating' : 'Decelerating'}
            </StatusText>
          </Value>
        </SummaryPanel>
      </div>
    );
  }
}
