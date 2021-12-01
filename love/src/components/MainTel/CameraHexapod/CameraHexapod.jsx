import React, { Component } from 'react';
import styles from './CameraHexapod.module.css';
import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import CSCDetailStyles from 'components/CSCSummary/CSCDetail/CSCDetail.module.css';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
import {
  hexapodCommandableByDDSStateMap,
  hexapodCommandableByDDSStatetoStyle,
  hexapodCompensationModeStateMap,
  hexapodCompensationModeStatetoStyle,
  hexapodInterlockStateMap,
  hexapodControllerStateOfflineSubStateMap,
  hexapodControllerStateEnabledSubstateMap,
  hexapodMTInPositionStateMap,
  hexapodMTInPositionStatetoStyle,
  hexapodConnectedStateMap,
  hexapodConnectedStatetoStyle,
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
      className: styles.th,
    },
    {
      field: 'x',
      title: 'x',
    },
    {
      field: 'y',
      title: 'y',
    },
    {
      field: 'z',
      title: 'z',
    },
    {
      field: 'u',
      title: 'u',
    },
    {
      field: 'v',
      title: 'v',
    },
    {
      field: 'w',
      title: 'w',
    },
  ];

  HEADERS_STRUT = [
    {
      field: 'strutLength',
      title: 'Strut Length',
      className: styles.th,
    },
    {
      field: '1',
      title: '1',
    },
    {
      field: '2',
      title: '2',
    },
    {
      field: '3',
      title: '3',
    },
    {
      field: '4',
      title: '4',
    },
    {
      field: '5',
      title: '5',
    },
    {
      field: '6',
      title: '6',
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

    const connectedStyle = CSCDetailStyles[hexapodConnectedStatetoStyle[hexapodConnectedStateMap[pass]]];

    return (
      <div styles={{ position: 'relative' }}>
        <Hoverable top={true} bottom={true} center={true} left={true} right={true} inside={true}>
          <span className={[connectedStyle, styles.summaryState].join(' ')}>{hexapodConnectedStateMap[pass]}</span>
          <div className={styles.hover}>
            <span className={commandState ? styles.ok : styles.alert}>Commander {command}</span>
            <br></br>
            <span className={telemetryState ? styles.ok : styles.alert}>Telemetry {telemetry}</span>
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
    const compensationStatus = {
      name: hexapodCompensationModeStateMap[this.props.hexapodCompensationMode],
      class:
        CSCDetailStyles[
          hexapodCompensationModeStatetoStyle[hexapodCompensationModeStateMap[this.props.hexapodCompensationMode]]
        ],
    };
    const controllerState = CSCDetail.states[this.props.hexapodControllerStateCommand];
    const interlockState = {
      name: hexapodInterlockStateMap[this.props.hexapodInterlock],
    };

    const commandableByDDS = {
      name: hexapodCommandableByDDSStateMap[this.props.hexapodCommandableByDDS],
      class:
        CSCDetailStyles[
          hexapodCommandableByDDSStatetoStyle[hexapodCommandableByDDSStateMap[this.props.hexapodCommandableByDDS]]
        ],
    };

    let controllerSubstate = '';
    if (controllerState.value === 1) {
      controllerSubstate = hexapodControllerStateOfflineSubStateMap[this.props.hexapodControllerStateOfflineSubstate];
    }
    if (controllerState.value === 2) {
      controllerSubstate = hexapodControllerStateEnabledSubstateMap[this.props.hexapodConstrollerStateEnabledSubstate];
    } else {
      controllerSubstate = 'UNKNOWN';
    }

    const inPosition = {
      name: hexapodMTInPositionStateMap[this.props.hexapodInPosition],
      class:
        CSCDetailStyles[hexapodMTInPositionStatetoStyle[hexapodMTInPositionStateMap[this.props.hexapodInPosition]]],
    };

    return (
      <div>
        <div className={styles.hexapodContainer}>
          <SummaryPanel className={styles.summaryPanel}>
            <Title wide>Hexapod Status</Title>
            <Label>Hexapod Status</Label>
            <Value>
              <span className={[hexapodStatus.class, styles.summaryState].join(' ')}>{hexapodStatus.name}</span>
            </Value>
            <Label>Compensation</Label>
            <Value>
              <span className={[compensationStatus.class, styles.summaryState].join(' ')}>
                {compensationStatus.name}
              </span>
            </Value>
            <Label>ControllerSubstate</Label>
            <Value>
              <span>{controllerSubstate}</span>
            </Value>
            <Label>Interlock state</Label>
            <Value>
              <span>{interlockState.name}</span>
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
              <span
                className={
                  commandableByDDS.name === 'COMMANDABLE'
                    ? [commandableByDDS.class, styles.commandableText].join(' ')
                    : [commandableByDDS.class, styles.notCommandableText].join(' ')
                }
              >
                {commandableByDDS.name}
              </span>
            </Value>
            <Label>ControllerState</Label>
            <Value>
              <span className={[controllerState.class, styles.summaryState].join(' ')}>{controllerState.name}</span>
            </Value>
            <Label>Hexapod in Position</Label>
            <Value>
              <span className={[inPosition.class, styles.summaryState].join(' ')}>{inPosition.name}</span>
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
