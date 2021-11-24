import React, { Component } from 'react';
import styles from './CameraHexapod.module.css';
import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import Hoverable from 'components/GeneralPurpose/Hoverable/Hoverable';
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
    // if (this.props.hexapodConnectedCommand) {
    //   this.setState({connectedCommandEvent: true});
    //   return this.props.hexapodConnectedCommand.name;
    // }
    // if (this.props.hexapodConnectedTelemetry){
    //   this.setState({connectedTelemetryEvent: true});
    //   return this.props.hexapodConnectedTelemetry.name;
    // }

    if (
      (!this.props.hexapodConnectedCommand && !this.props.hexapodConnectedTelemtry) ||
      !this.props.hexapodConnectedCommand ||
      !this.props.hexapodConnectedTelemtry
    ) {
      return 'alert'; //acá debe ir el hover
    } else if (!this.props.hexapodConnectedCommand) {
      //los otros casos con alert y actualizar los states y el hover
      return 'alert';
    } else {
      return 'connected'; //hover
    }
  };

  render() {
    // const dummyApplicationCommanded = [-19, -45, 9, -0.001, -0.001, -0.001];
    // const dummyApplicationActual = [-19, -40, 9, -0.003, -0.001, -0.001];
    // const dummyActuators = [31, 10, 10, 4, 30, 16];

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

    const axis = ['x', 'y', 'z', 'u', 'v', 'w'];
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
    const compensationStatus = CSCDetail.states[this.props.hexapodCompensationMode];
    const controllerSubstate = CSCDetail.states[this.props.hexapodConstrollerStateEnabledSubstate];
    const interlockState = CSCDetail.states[this.props.hexapodInterlock];
    const connectedCommand = CSCDetail.states[this.props.hexapodConnectedCommand];
    const connectedTelemetry = CSCDetail.states[this.props.hexapodConnectedTelemtry];
    const commandableByDDS = CSCDetail.states[this.props.hexapodCommandableByDDS];
    const controllerState = CSCDetail.states[this.props.hexapodControllerStateCommand];
    const inPosition = CSCDetail.states[this.props.hexapodInPosition];

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
              <span className={[controllerSubstate.class, styles.summaryState].join(' ')}>
                {controllerSubstate.name}
              </span>
            </Value>
            <Label>Interlock state</Label>
            <Value>
              <span className={[interlockState.class, styles.summaryState].join(' ')}>{interlockState.name}</span>
            </Value>
          </SummaryPanel>
          <SummaryPanel className={styles.summaryPanel}>
            <Title wide className={styles.titles}>
              Readiness Summary
            </Title>
            <Label>Connected</Label>
            <Value>
              <span className={[connectedStatus.class, styles.summaryState].join(' ')}>
                {this.hoverToConnectedStatus()}
                <Hoverable top={true} center={true} inside={true}>
                  <div className={styles.hover}>Commander {this.state.connectedCommandEvent}</div>
                  <div className={styles.hover}>Telemetry {this.state.connectedTelemetryEvent}</div>
                </Hoverable>
              </span>
            </Value>
            <Label>Commandable By DDS</Label>
            <Value>
              <span className={[commandableByDDS.class, styles.summaryState].join(' ')}>{commandableByDDS.name}</span>
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
