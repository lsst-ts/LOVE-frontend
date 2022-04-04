import React, { Component } from 'react';
import styles from './CameraHexapod.module.css';
import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import {
  hexapodCommandableByDDSStateMap,
  hexapodCommandableByDDSStatetoStyle,
  hexapodCompensationModeStateMap,
  hexapodCompensationModeStatetoStyle,
  hexapodInterlockStateMap,
  hexapodControllerStateMap,
  hexapodControllerStateOfflineSubStateMap,
  hexapodControllerStateEnabledSubstateMap,
  hexapodMTInPositionStateMap,
  hexapodMTInPositionStatetoStyle,
  hexapodConnectedStateMap,
  hexapodConnectedStatetoStyle,
  hexapodStatusStatetoStyle,
  hexapodControllerStatetoStyle,
} from 'Config';
class CameraHexapod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedCommandEvent: false,
      connectedTelemetryEvent: false,
    };
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  HEADERS_HEXAPOD = [
    {
      field: 'hexapodApplication',
      title: 'Hexapod Position',
      className: styles.firstColumn,
    },
    {
      field: 'x',
      title: 'x',
      className: styles.columns,
    },
    {
      field: 'y',
      title: 'y',
      className: styles.columns,
    },
    {
      field: 'z',
      title: 'z',
      className: styles.columns,
    },
    {
      field: 'u',
      title: 'u',
      className: styles.columns,
    },
    {
      field: 'v',
      title: 'v',
      className: styles.columns,
    },
    {
      field: 'w',
      title: 'w',
      className: styles.columns,
    },
  ];

  HEADERS_STRUT = [
    {
      field: 'strutLength',
      title: 'Strut Length',
      className: styles.firstColumn,
    },
    {
      field: '1',
      title: '1',
      className: styles.columns,
    },
    {
      field: '2',
      title: '2',
      className: styles.columns,
    },
    {
      field: '3',
      title: '3',
      className: styles.columns,
    },
    {
      field: '4',
      title: '4',
      className: styles.columns,
    },
    {
      field: '5',
      title: '5',
      className: styles.columns,
    },
    {
      field: '6',
      title: '6',
      className: styles.columns,
    },
  ];

  hoverToConnectedStatus = () => {
    const commandState = this.state.connectedCommandEvent;
    const telemetryState = this.state.connectedTelemetryEvent;

    const command = this.state.connectedCommandEvent ? 'Connected' : 'Disconnected';
    const telemetry = this.state.connectedTelemetryEvent ? 'Connected' : 'Disconnected';

    const connectedCommand = this.props.hexapodConnectedCommand;
    const connectedTelemetry = this.props.hexapodConnectedTelemetry;
    const pass = connectedCommand && connectedTelemetry;

    const connectedStyle = hexapodConnectedStateMap[pass];

    return (
      <div styles={{ position: 'relative' }}>
        <Hoverable top={true} bottom={true} center={true} left={true} right={true} inside={true}>
          <StatusText status={hexapodConnectedStatetoStyle[connectedStyle]}>{connectedStyle}</StatusText>
          <div className={styles.hover}>
            <StatusText className={commandState ? styles.ok : styles.alert}>Commander {command}</StatusText>
            <br></br>
            <StatusText className={telemetryState ? styles.ok : styles.alert}>Telemetry {telemetry}</StatusText>
          </div>
        </Hoverable>
      </div>
    );
  };

  render() {
    // Hexapod Position Table
    const defaultValues = { x: 0, y: 0, z: 0, u: 0, v: 0, w: 0 };
    const dataHexapod = [
      { hexapodApplication: 'Commanded [um, deg]', ...defaultValues },
      { hexapodApplication: 'Actual[um, deg]', ...defaultValues },
      { hexapodApplication: 'Compensation Offset[um, deg]', ...defaultValues },
    ];

    for (let i = 0; i < this.props.hexapodApplicationDemand.length; i++) {
      const axis = ['x', 'y', 'z', 'u', 'v', 'w'];
      dataHexapod[0][axis[i]] = this.props.hexapodApplicationDemand[i];
    }

    for (let i = 0; i < this.props.hexapodApplicationPosition.length; i++) {
      const axis = ['x', 'y', 'z', 'u', 'v', 'w'];
      dataHexapod[1][axis[i]] = this.props.hexapodApplicationPosition[i];
    }

    dataHexapod[2].x = this.props.hexapodCompensationOffsetX;
    dataHexapod[2].y = this.props.hexapodCompensationOffsetY;
    dataHexapod[2].z = this.props.hexapodCompensationOffsetZ;
    dataHexapod[2].u = this.props.hexapodCompensationOffsetU;
    dataHexapod[2].v = this.props.hexapodCompensationOffsetV;
    dataHexapod[2].w = this.props.hexapodCompensationOffsetZ;

    const compensation = this.props.hexapodCompensationMode;
    const newDataHexapod = dataHexapod.filter((val, index) => index !== 2 || (index === 2 && compensation === true));

    // Strut Length Table
    const defaultsValues = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const dataStrut = [{ strutLength: 'Actual [um]', ...defaultsValues }];

    for (let i = 0; i < this.props.hexapodActuatorsCalibrated.length; i++) {
      const axis = ['1', '2', '3', '4', '5', '6'];
      dataStrut[0][axis[i]] = this.props.hexapodActuatorsCalibrated[i];
    }

    // Hexapod status and Readiness summary
    const hexapodStatus = CSCDetail.states[this.props.hexapodSummaryState];
    const compensationStatus = hexapodCompensationModeStateMap[this.props.hexapodCompensationMode];
    const controllerState = hexapodControllerStateMap[this.props.hexapodControllerState];
    const interlockState = hexapodInterlockStateMap[this.props.hexapodInterlock];

    const commandableByDDS = hexapodCommandableByDDSStateMap[this.props.hexapodCommandableByDDS];

    // controllerState
    let controllerSubstate = '';
    if (controllerState.value === 3) {
      controllerSubstate = hexapodControllerStateOfflineSubStateMap[this.props.hexapodControllerStateOfflineSubstate];
    }
    if (controllerState.value === 2) {
      controllerSubstate = hexapodControllerStateEnabledSubstateMap[this.props.hexapodConstrollerStateEnabledSubstate];
    } else {
      controllerSubstate = 'Offline';
    }

    const inPosition = hexapodMTInPositionStateMap[this.props.hexapodInPosition];

    return (
      <div>
        <div className={styles.hexapodContainer}>
          <SummaryPanel className={styles.summaryPanel}>
            <Title wide>Hexapod Status</Title>
            <Label>Hexapod Status</Label>
            <Value>
              <StatusText status={hexapodStatusStatetoStyle[hexapodStatus.name]}>{hexapodStatus.name}</StatusText>
            </Value>
            <Label>Compensation</Label>
            <Value>
              <StatusText status={hexapodCompensationModeStatetoStyle[compensationStatus]}>
                {compensationStatus}
              </StatusText>
            </Value>
            <Label>ControllerSubstate</Label>
            <Value>
              <span className={styles.transformText}>{controllerSubstate}</span>
            </Value>
            <Label>Interlock state</Label>
            <Value>
              <span className={styles.transformText}>{interlockState}</span>
            </Value>
          </SummaryPanel>
          <SummaryPanel className={styles.summaryPanel}>
            <Title wide className={styles.titles}>
              Readiness Summary
            </Title>
            <Label>Connected</Label>
            <Value>{this.hoverToConnectedStatus()}</Value>
            <Label>Commandable By DDS</Label>
            <Value>
              {/* <StatusText
                className={
                  commandableByDDS.name === 'COMMANDABLE'
                    ? [commandableByDDS.class, styles.commandableText].join(' ')
                    : [commandableByDDS.class, styles.notCommandableText].join(' ')
                }
              >
                {commandableByDDS.name}
              </StatusText> */}
              <StatusText status={hexapodCommandableByDDSStatetoStyle[commandableByDDS]}>{commandableByDDS}</StatusText>
            </Value>
            <Label>ControllerState</Label>
            <Value>
              <StatusText status={hexapodControllerStatetoStyle[controllerState]}>{controllerState}</StatusText>
            </Value>
            <Label>Hexapod in Position</Label>
            <Value>
              <StatusText status={hexapodMTInPositionStatetoStyle[inPosition]}>{inPosition}</StatusText>
            </Value>
          </SummaryPanel>
        </div>
        <div className={styles.divTables}>
          <SimpleTable headers={this.HEADERS_HEXAPOD} data={newDataHexapod} />
          <SimpleTable headers={this.HEADERS_STRUT} data={dataStrut} />
        </div>
      </div>
    );
  }
}

export default CameraHexapod;
