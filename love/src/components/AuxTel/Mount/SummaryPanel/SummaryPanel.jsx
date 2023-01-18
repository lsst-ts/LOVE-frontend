import React, { Component } from 'react';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import PropTypes from 'prop-types';
import {
  m3RotatorStateMap,
  m3PortSelectedStateMap,
  m3InPositionStateMap,
  m1CoverStateStateMap,
  mainValveStateMap,
  instrumentStateMap,
  nasmythRotatorInPositionStateMap,
  hexapodInPositionStateMap,
  ataosCorrectionsStateMap,
  ataosCorrectionsStateToStyle,
  stateToStyleMount,
  ATPneumaticsLimits,
} from '../../../../Config';
import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Row from '../../../GeneralPurpose/SummaryPanel/Row';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import SimpleTable from '../../../GeneralPurpose/SimpleTable/SimpleTable';
import Limits from '../../../GeneralPurpose/Limits/Limits';
import styles from './SummaryPanel.module.css';

const M3PORTNASMYTH1 = 1;
const M3PORTNASMYTH2 = 2;

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
    const nasmyth1RotatorInPosition = nasmythRotatorInPositionStateMap[this.props.nasmyth1RotatorInPosition];
    const nasmyth2RotatorInPosition = nasmythRotatorInPositionStateMap[this.props.nasmyth2RotatorInPosition];

    let m3InPositionState = 0; // UNKNOWN
    if (this.props.m3InPosition !== 0) {
      m3InPositionState = this.props.m3InPosition ? 2 : 1; // IN POSITION : NOT READY
    }
    const m3InPositionText = m3InPositionStateMap[m3InPositionState];

    //ATPneumatics
    const m1CoverState = m1CoverStateStateMap[this.props.m1CoverState] || m1CoverStateStateMap[0];
    const mainValveState = mainValveStateMap[this.props.mainValveStateMap] || mainValveStateMap[0];
    const instrumentState = instrumentStateMap[this.props.instrumentStateMap] || instrumentStateMap[0];

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
      : ['-', '-', '-', '-', '-', '-'];

    const hexapodPosAndOffset = Array.isArray(this.props.hexapodReportedPosition.value)
      ? this.props.hexapodReportedPosition.value.map((pos, i) => [pos, offset[i]])
      : this.props.hexapodReportedPosition;

    // ATAOS
    const {
      atspectrograph: atSpectrographCorrections,
      hexapod: hexapodCorrections,
      m1: m1Corrections,
      m2: m2Corrections,
    } = this.props.correctionEnabled;

    const atSpectrographCorrectionsState = ataosCorrectionsStateMap[atSpectrographCorrections?.value];
    const hexapodCorrectionsState = ataosCorrectionsStateMap[hexapodCorrections?.value];
    const m1CorrectionsState = ataosCorrectionsStateMap[m1Corrections?.value];
    const m2CorrectionsState = ataosCorrectionsStateMap[m2Corrections?.value];

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
          <StatusText status={stateToStyleMount[m3InPositionText]}>{m3InPositionText}</StatusText>
        </Value>
        {this.props.m3PortSelected === M3PORTNASMYTH1 ? (
          <>
            <Label>Nasmyth 1 pos.</Label>
            <Value>
              <StatusText status={stateToStyleMount[nasmyth1RotatorInPosition]}>{nasmyth1RotatorInPosition}</StatusText>
            </Value>
          </>
        ) : null}
        {this.props.m3PortSelected === M3PORTNASMYTH2 ? (
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
        <Label>Main Air Valve</Label>
        <Value>
          <StatusText status={stateToStyleMount[mainValveState]}>{mainValveState}</StatusText>
        </Value>
        <Label>Instrument Valve</Label>
        <Value>
          <StatusText status={stateToStyleMount[instrumentState]}>{instrumentState}</StatusText>
        </Value>

        <Label>Cell load</Label>
        <Value>{this.props.loadCell}</Value>
        <Row>
            <Limits
              lowerLimit={ATPneumaticsLimits.cellLoad.min}
              upperLimit={ATPneumaticsLimits.cellLoad.max}
              currentValue={this.props.loadCell}
              targetValue="Unknown"
              height={30}
              displayLabels={true}
              displayLabelsUnit=" kg"
              limitWarning={4.2}
            />
        </Row>

        <Label>M1 Air pressure</Label>
        <Value>{this.props.m1AirPressure}</Value>
        <Row>
            <Limits
              lowerLimit={ATPneumaticsLimits.pressure.min}
              upperLimit={ATPneumaticsLimits.pressure.max}
              currentValue={this.props.m1AirPressure}
              targetValue={this.props.m1SetPressure}
              height={30}
              displayLabels={true}

              displayLabelsUnit=" Pa"
              limitWarning={5000}
            />
        </Row>

        {/* Hexapod */}
        <Title wide>ATHexapod</Title>
        <Label>Position state</Label>
        <Value>
          <StatusText status={stateToStyleMount[hexapodInPosition]}>{hexapodInPosition}</StatusText>
        </Value>
        {/* Table */}
        <div style={{ gridColumnStart: '1', gridColumnEnd: '3' }} className={styles.panelTable}>
          <SimpleTable headers={headers} data={simpleTableData} />
        </div>
        <Title wide>ATCorrections</Title>
        <Label>M1</Label>
        <Value>
          <StatusText status={ataosCorrectionsStateToStyle[m1CorrectionsState]}>{m1CorrectionsState}</StatusText>
        </Value>
        <Label>M2</Label>
        <Value>
          <StatusText status={ataosCorrectionsStateToStyle[m2CorrectionsState]}>{m2CorrectionsState}</StatusText>
        </Value>
        <Label>Hexapod</Label>
        <Value>
          <StatusText status={ataosCorrectionsStateToStyle[hexapodCorrectionsState]}>
            {hexapodCorrectionsState}
          </StatusText>
        </Value>
        <Label>Spectrograph</Label>
        <Value>
          <StatusText status={ataosCorrectionsStateToStyle[atSpectrographCorrectionsState]}>
            {atSpectrographCorrectionsState}
          </StatusText>
        </Value>
      </SummaryPanel>
    );
  }
}
