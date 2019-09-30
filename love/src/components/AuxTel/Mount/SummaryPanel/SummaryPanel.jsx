import React, { Component } from 'react';
// import styles from './SummaryTable.module.css';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import PropTypes from 'prop-types';
import {
  m3RotatorStateMap,
  m3PortSelectedStateMap,
  m3InPositionStateMap,
  m1CoverStateStateMap,
  nasmyth1InPositionStateMap,
  hexpodInPositionStateMap,
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
    // `event-ATMCS-${index}-nasmyth1InPosition`,
    // `event-ATMCS-${index}-nasmyth2InPosition`,

    //ATMCS
    const m3State = m3RotatorStateMap[this.props.m3State];
    const m3PortSelected = m3PortSelectedStateMap[this.props.m3PortSelected];
    const m3InPosition = m3InPositionStateMap[this.props.m3InPosition];
    const nasmyth1InPosition = nasmyth1InPositionStateMap[this.props.nasmyth1InPosition];
    //ATPneumatics
    const m1CoverState = m1CoverStateStateMap[this.props.m1CoverState];
    //Hexapod
    const hexapodInPosition = hexpodInPositionStateMap[this.props.hexapodInPosition];
    console.log(this.props);
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
        <Label>Nasmyth pos.</Label>
        <Value>
          <StatusText status={stateToStyleMount[nasmyth1InPosition]}>{nasmyth1InPosition}</StatusText>
        </Value>
        {/* ATMCS */}
        <Title wide>ATPneumatics</Title>
        <Label>M1 cover</Label>
        <Value>
          <StatusText status={stateToStyleMount[m1CoverState]}>{m1CoverState}</StatusText>
        </Value>
        <Label>Load cell</Label>
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
        <Value>
        {this.props.positionStatus ? this.props.positionStatus.reportedPosition: 'None'}
        </Value>
      </SummaryPanel>
    );
  }
}
