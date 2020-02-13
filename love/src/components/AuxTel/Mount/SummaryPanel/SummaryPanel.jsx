import React, { Component } from 'react';
// import styles from './SummaryTable.module.css';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import PropTypes from 'prop-types';
import {
  m3RotatorStateMap,
  m3PortSelectedStateMap,
  m3InPositionStateMap,
  m1CoverStateStateMap,
  nasmythRotatorInPositionStateMap,
  hexapodInPositionStateMap,
  stateToStyleMount,
} from '../../../../Config';
import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';

export default class SummaryTable extends Component {
  static propTypes = {
    currentPointing: PropTypes.object,
    targetPointing: PropTypes.object,
    domeAz: PropTypes.number,
    domeTargetAz: PropTypes.number,
    azimuthState: PropTypes.number,
    dropoutDoorState: PropTypes.number,
    mainDoorState: PropTypes.number,
    mountTrackingState: PropTypes.number,
  };

  static defaultProps = {};

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    // `event-ATHexapod-${index}-inPosition`,
    // `event-ATHexapod-${index}-readyForCommand`,
    // `telemetry-ATHexapod-${index}-positionStatus`,
    // //ATPneumatics
    // `event-ATPneumatics-${index}-m1CoverLimitSwitches`,
    // `event-ATPneumatics-${index}-m1VentsLimitSwitches`,
    // `telemetry-ATPneumatics-${index}-loadCell`,
    // `telemetry-ATPneumatics-${index}-m1AirPressure`,
    // //ATMCS
    // `event-ATMCS-${index}-m3InPosition`,
    // `event-ATMCS-${index}-m3State`,
    // `event-ATMCS-${index}-m3PortSelected`,
    // `event-ATMCS-${index}-nasmyth1RotatorInPosition`,
    // `event-ATMCS-${index}-nasmyth2RotatorInPosition`,

    //ATMCS
    const m3State = m3RotatorStateMap[this.props.m3State] || m3RotatorStateMap[0];
    const m3PortSelected = m3PortSelectedStateMap[this.props.m3PortSelected] || m3PortSelectedStateMap[0];
    const m3InPosition = m3InPositionStateMap[this.props.m3InPosition ? 1 : 0];
    const nasmyth1RotatorInPosition = nasmythRotatorInPositionStateMap[this.props.nasmyth1RotatorInPosition];
    const nasmyth2RotatorInPosition = nasmythRotatorInPositionStateMap[this.props.nasmyth2RotatorInPosition];
    //ATPneumatics
    const m1CoverState = m1CoverStateStateMap[this.props.m1CoverState] || m1CoverStateStateMap[0];
    //Hexapod
    const hexapodInPosition = hexapodInPositionStateMap[this.props.hexapodInPosition ? 1 : 0];
    return (
      <SummaryPanel>
        {/* Dome */}
        <Title wide>ATMCS</Title>
        <Label>M3 state</Label>
        <Value>
          <StatusText status={stateToStyleMount[m3State]}>{m3State}</StatusText>
        </Value>
        <Label>Port selected</Label>
        <Value>
          <StatusText status={stateToStyleMount[m3PortSelected]}>{m3PortSelected}</StatusText>
        </Value>
        <Label>M3 position</Label>
        <Value>
          <StatusText status={stateToStyleMount[m3InPosition]}>{m3InPosition}</StatusText>
        </Value>
        {this.props.m3PortSelected === 1 ? (
          <>
            <Label>Nasmyth 1 pos.</Label>
            <Value>
              <StatusText status={stateToStyleMount[nasmyth1RotatorInPosition]}>{nasmyth1RotatorInPosition}</StatusText>
            </Value>
          </>
        ) : null}
        {this.props.m3PortSelected === 2 ? (
          <>
            <Label>Nasmyth 2 pos.</Label>
            <Value>
              <StatusText status={stateToStyleMount[nasmyth2RotatorInPosition]}>{nasmyth2RotatorInPosition}</StatusText>
            </Value>
          </>
        ) : null}
        {/* ATMCS */}
        <Title wide>ATPneumatics</Title>
        <Label>M1 cover</Label>
        <Value>
          <StatusText status={stateToStyleMount[m1CoverState]}>{m1CoverState}</StatusText>
        </Value>
        <Label>Cell load</Label>
        <Value>{this.props.loadCell}</Value>
        <Label>M1 Air pressure</Label>
        <Value>{this.props.m1AirPressure}</Value>
        {/* Hexapod */}
        <Title wide>Hexapod</Title>
        <Label>Position state</Label>
        <Value>
          <StatusText status={stateToStyleMount[hexapodInPosition]}>{hexapodInPosition}</StatusText>
        </Value>
        <Label>Position value</Label>
        <Value>{this.props.hexapodReportedPosition}</Value>
      </SummaryPanel>
    );
  }
}
