import React, { Component } from 'react';
import styles from './CameraHexapod.module.css';
import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
class CameraHexapod extends Component {
  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  HEADERS_HEXAPOD = [
    {
      field: 'hexapodPosition',
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

  render() {
    // const dataHexapod = [
    //   { hexapodPosition: 'Commanded [um, deg]', x: -19, y: -45, z: 9, u: -0.001, v: -0.001, w: -0.001 },
    //   { hexapodPosition: 'Actual [um, deg]', x: -19, y: -40, z: 9, u: -0.003, v: -0.001, w: -0.001 },
    // ];

    // Hexapod Position Table
    const dataHexapod = [
      { hexapodApplication: 'Commanded [um, deg]' },
      { hexapodApplication: 'Actual[um, deg]' },
      { hexapodApplication: 'Compensation Offset[um, deg]' },
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
    dataHexapod[2][axis[0]] = this.props.hexapodCompensationOffsetX;
    dataHexapod[2][axis[1]] = this.props.hexapodCompensationOffsetY;
    dataHexapod[2][axis[2]] = this.props.hexapodCompensationOffsetZ;
    dataHexapod[2][axis[3]] = this.props.hexapodCompensationOffsetU;
    dataHexapod[2][axis[4]] = this.props.hexapodCompensationOffsetV;
    dataHexapod[2][axis[5]] = this.props.hexapodCompensationOffsetZ;

    const compensation = this.props.hexapodCompensationMode;
    const newDataHexapod = dataHexapod.filter((val, index) => index !== 2 || (index === 2 && compensation === true));

    // Strut Length Table
    const dataStrut = [{ strutLength: 'Actual [um]' }];

    for (let i = 0; i < this.props.hexapodActuatorsCalibrated.length; i++) {
      const axis = ['1', '2', '3', '4', '5', '6'];
      dataStrut[0][axis[i]] = this.props.hexapodActuatorsCalibrated[i];
    }

    // Hexapod status and Readiness summary
    const hexapodStatus = CSCDetail.states[this.props.hexapodSummaryState];
    const compensationStatus = CSCDetail.states[this.props.hexapodCompensationMode];
    const controllerSubstate = CSCDetail.states[this.props.hexapodConstrollerStateEnabledSubstate];
    const interlockState = CSCDetail.states[this.props.hexapodInterlock];
    const connectedStatus = CSCDetail.states[this.props.hexapodConnectedCommand];
    const commandableByDDS = CSCDetail.states[this.props.hexapodCommandableByDDS];
    const controllerState = CSCDetail.states[this.props.hexapodControllerStateCommand];
    const inPosition = CSCDetail.states[this.props.hexapodInPosition];
    console.log(this.props);

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
          <SummaryPanel>
            <Title wide>Readiness Summary</Title>
            <Label>Connected</Label>
            <Value>
              <span className={[connectedStatus.class, styles.summaryState].join(' ')}>{connectedStatus.name}</span>
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
