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
import SimpleTable from '../../../GeneralPurpose/SimpleTable/SimpleTable';
import styles from './SummaryPanel.module.css';

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
    //ATMCS
    const m3State = m3RotatorStateMap[this.props.m3State] || m3RotatorStateMap[0];
    const m3PortSelected = m3PortSelectedStateMap[this.props.m3PortSelected] || m3PortSelectedStateMap[0];
    const m3InPosition = m3InPositionStateMap[this.props.m3InPosition ? 1 : 0];
    const nasmyth1RotatorInPosition = nasmythRotatorInPositionStateMap[this.props.nasmyth1RotatorInPosition];
    const nasmyth2RotatorInPosition = nasmythRotatorInPositionStateMap[this.props.nasmyth2RotatorInPosition];
    //ATPneumatics
    const m1CoverState = m1CoverStateStateMap[this.props.m1CoverState] || m1CoverStateStateMap[0];
    //Hexapod
    let hexapodInPositionState = 0;
    if (this.props.hexapodInPosition !== 0) {
      hexapodInPositionState = this.props.hexapodInPosition ? 1 : 2;
    }
    const hexapodInPosition = hexapodInPositionStateMap[hexapodInPositionState];
    const offset = ['x', 'y', 'z', 'u', 'v', 'w'].map((k) => {
      return this.props.correctionOffsets[k] ? this.props.correctionOffsets[k].value : ' - ';
    });

    const position = Array.isArray(this.props.hexapodReportedPosition.value)
      ? this.props.hexapodReportedPosition.value
      : ['-','-','-','-','-','-'];

    const hexapodPosAndOffset = Array.isArray(this.props.hexapodReportedPosition.value)
      ? this.props.hexapodReportedPosition.value.map((pos, i) => [pos, offset[i]])
      : this.props.hexapodReportedPosition;

    //Hexapod Table data
    const hexapodTableData = {
      x: {
        name: { val: 'x', unit: 'mm' },
        position: position[0],
        offset: offset[0],
      },
      y: {
        name: { val: 'y', unit: 'mm' },
        position: position[1],
        offset: offset[1],
      },
      z: {
        name: { val: 'z', unit: 'mm' },
        position: position[2],
        offset: offset[2],
      },
      u: {
        name: { val: 'u', unit: 'deg' },
        position: position[3],
        offset: offset[3],
      },
      v: {
        name: { val: 'v', unit: 'deg' },
        position: position[4],
        offset: offset[4],
      },
      w: {
        name: { val: 'w', unit: 'deg' },
        position: position[5],
        offset: offset[5],
      },
    };

    const simpleTableData = Object.values(hexapodTableData);
    const defaultFormatter = (value) => {
      if (isNaN(value)) return value;
      return Number.isInteger(value) ? value : value.toFixed(3);
    };

    const headers = [
      {
        field: 'name',
        title: '',
        render: (value) => `${value.val} [${value.unit}]`,
      },
      {
        field: 'position',
        title: <>Position</>,
        type: 'number',
        render: defaultFormatter,
      },
      {
        field: 'offset',
        title: <>ATAOS Offset</>,
        type: 'number',
        render: defaultFormatter,
      },
    ];

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
        {/* Table */}
        <div style={{ gridColumnStart: '1', gridColumnEnd: '3' }} className={styles.panelTable}>
          <SimpleTable headers={headers} data={simpleTableData} />
        </div>
      </SummaryPanel>
    );
  }
}
