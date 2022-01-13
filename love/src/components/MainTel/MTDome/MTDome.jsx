import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import ManagerInterface, { parseCommanderData } from 'Utils';
// import SkymapGrid from '../Skymap/SkymapGrid';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import TimeSeriesControls from 'components/GeneralPurpose/Plot/TimeSeriesControls/TimeSeriesControls';
import DomeTopView from './MTDomeTopView';
import DomePointing from './MTDomePointing';
import DomeShutter from './MTDomeShutter';
import MountTopView from './MountTopView';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';

import WindRose from '../../icons/WindRose/WindRose';
import DomeSummaryTable from './MTDomeSummaryTable/MTDomeSummaryTable';

import styles from './MTDome.module.css';

export default class Dome extends Component {
  static propTypes = {
    // raftsDetailedState: PropTypes.string,
    // imageReadinessDetailedState: PropTypes.string,
    // calibrationDetailedState: PropTypes.string,
    // shutterDetailedState: PropTypes.string,
    // imageSequence: PropTypes.object,
  };

  static defaultProps = {
    width: 500,
    height: 500,
  };

  constructor(props) {
    super(props);
    this.state = {
      az: 0,
      el: 0,
      timeWindow: 60,
      isLive: true,
      historicalData: [],
    };

    this.azimuthPlotRef = React.createRef();
    this.elevationPlotRef = React.createRef();
  }

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  LOUVERS_AF = [
    {
      field: 'Louvers',
      title: 'Louvers',
    },
    {
      field: 'A1',
      title: 'A1',
    },
    {
      field: 'A2',
      title: 'A2',
    },
    {
      field: 'B1',
      title: 'B1',
    },
    {
      field: 'B2',
      title: 'B2',
    },
    {
      field: 'B3',
      title: 'B3',
    },
    {
      field: 'C1',
      title: 'C1',
    },
    {
      field: 'C2',
      title: 'C2',
    },
    {
      field: 'C3',
      title: 'C3',
    },
    {
      field: 'D1',
      title: 'D1',
    },
    {
      field: 'D2',
      title: 'D2',
    },
    {
      field: 'E1',
      title: 'E1',
    },
    {
      field: 'E2',
      title: 'E2',
    },
    {
      field: 'E3',
      title: 'E3',
    },
    {
      field: 'F1',
      title: 'F1',
    },
    {
      field: 'F2',
      title: 'F2',
    },
    {
      field: 'F3',
      title: 'F3',
    },
  ];

  LOUVERS_GN = [
    {
      field: 'Louvers',
      title: 'Louvers',
    },
    {
      field: 'G1',
      title: 'G1',
    },
    {
      field: 'G2',
      title: 'G2',
    },
    {
      field: 'G3',
      title: 'G3',
    },
    {
      field: 'H1',
      title: 'H1',
    },
    {
      field: 'H2',
      title: 'H2',
    },
    {
      field: 'H3',
      title: 'H3',
    },
    {
      field: 'I1',
      title: 'I1',
    },
    {
      field: 'I2',
      title: 'I2',
    },
    {
      field: 'I3',
      title: 'I3',
    },
    {
      field: 'L1',
      title: 'L1',
    },
    {
      field: 'L2',
      title: 'L2',
    },
    {
      field: 'L3',
      title: 'L3',
    },
    {
      field: 'M1',
      title: 'M1',
    },
    {
      field: 'M2',
      title: 'M2',
    },
    {
      field: 'M3',
      title: 'M3',
    },
    {
      field: 'N1',
      title: 'N1',
    },
    {
      field: 'N2',
      title: 'N2',
    },
  ];

  elevationPlotInputs = {
    'Mount elevation': {
      category: 'telemetry',
      csc: 'ATMCS',
      salindex: '0',
      topic: 'mount_AzEl_Encoders',
      item: 'elevationCalculatedAngle',
      type: 'line',
      accessor: (x) => x[0],
      color: 'hsl(201, 70%, 40%)',
    },
    'Mount target': {
      category: 'event',
      csc: 'ATMCS',
      salindex: '0',
      topic: 'target',
      item: 'elevation',
      type: 'line',
      accessor: (x) => x,
      color: 'white',
      dash: [4, 1],
    },
  };

  azimuthPlotInputs = {
    'Dome Azimuth': {
      category: 'telemetry',
      csc: 'ATDome',
      salindex: 0,
      topic: 'position',
      item: 'azimuthPosition',
      type: 'line',
      accessor: (x) => x,
      color: 'hsl(201, 70%, 40%)',
    },
    'Dome Target Az': {
      category: 'event',
      csc: 'ATDome',
      salindex: 0,
      topic: 'azimuthCommandedState',
      item: 'azimuth',
      type: 'line',
      accessor: (x) => x,
      color: 'hsl(201, 70%, 40%)',
      dash: [4, 1],
    },
    'Mount Azimuth': {
      category: 'telemetry',
      csc: 'ATMCS',
      salindex: 0,
      topic: 'mount_AzEl_Encoders',
      item: 'azimuthCalculatedAngle',
      type: 'line',
      accessor: (x) => x[0],
      color: 'hsl(160, 70%, 40%)',
    },
    'Mount Target': {
      category: 'event',
      csc: 'ATMCS',
      salindex: 0,
      topic: 'target',
      item: 'azimuth',
      type: 'line',
      accessor: (x) => x,
      color: 'hsl(160, 70%, 40%)',
      dash: [4, 1],
    },
  };

  setHistoricalData = (startDate, timeWindow) => {
    const cscs = {
      ATDome: {
        0: {
          position: ['azimuthPosition'],
          azimuthCommandedState: ['azimuth'],
        },
      },
      ATMCS: {
        0: {
          mount_AzEl_Encoders: ['azimuthCalculatedAngle', 'elevationCalculatedAngle'],
          target: ['azimuth', 'elevation'],
        },
      },
    };
    const parsedDate = startDate.format('YYYY-MM-DDTHH:mm:ss');
    // historicalData
    ManagerInterface.getEFDTimeseries(parsedDate, timeWindow, cscs, '1min').then((data) => {
      const parsedPlotData = parseCommanderData(data, 'x', 'y');
      this.setState({ historicalData: parsedPlotData });
    });
  };

  render() {
    const width = this.props.width;
    const height = this.props.height;
    const currentPointing = {
      az: this.props.azElMountEncoders ? this.props.azElMountEncoders.azimuthCalculatedAngle.value[0] : 0,
      el: this.props.azElMountEncoders ? this.props.azElMountEncoders.elevationCalculatedAngle.value[0] : 0,
      nasmyth1: this.props.nasmythMountEncoders ? this.props.nasmythMountEncoders.nasmyth1CalculatedAngle.value[0] : 0,
      nasmyth2: this.props.nasmythMountEncoders ? this.props.nasmythMountEncoders.nasmyth2CalculatedAngle.value[0] : 0,
    };
    const targetPointing = {
      az: this.props.target ? this.props.target[this.props.target.length - 1].azimuth.value : 0,
      el: this.props.target ? this.props.target[this.props.target.length - 1].elevation.value : 0,
      nasmyth1: this.props.target ? this.props.target[this.props.target.length - 1].nasmyth1RotatorAngle.value : 0,
      nasmyth2: this.props.target ? this.props.target[this.props.target.length - 1].nasmyth2RotatorAngle.value : 0,
    };
    const domeAz = this.props.azimuthPosition ? this.props.azimuthPosition.value : 0;
    const domeTargetAz = this.props.azimuthCommandedState
      ? this.props.azimuthCommandedState[this.props.azimuthCommandedState.length - 1].azimuth.value
      : 0;
    const mountTrackingState = this.props.atMountState
      ? this.props.atMountState[this.props.atMountState.length - 1].state.value
      : 0;
    const azimuthState = this.props.azimuthState
      ? this.props.azimuthState[this.props.azimuthState.length - 1].state.value
      : 0;
    const dropoutDoorState = this.props.dropoutDoorState
      ? this.props.dropoutDoorState[this.props.dropoutDoorState.length - 1].state.value
      : 0;
    const mainDoorState = this.props.mainDoorState
      ? this.props.mainDoorState[this.props.mainDoorState.length - 1].state.value
      : 0;
    const domeInPosition = this.props.domeInPosition;
    const mountInPosition = this.props.mountInPosition;

    const dropoutDoorOpeningPercentage = this.props.dropoutDoorOpeningPercentage
      ? this.props.dropoutDoorOpeningPercentage.value
      : 0;
    const mainDoorOpeningPercentage = this.props.dropoutDoorOpeningPercentage
      ? this.props.dropoutDoorOpeningPercentage.value
      : 0;
    const trackID = this.props.target ? this.props.target[this.props.target.length - 1].trackId.value : '';
    const m3State = this.props.m3State ? this.props.m3State[this.props.m3State.length - 1].value : 2;
    const currentTimesToLimits = this.props.currentTimesToLimits ? this.props.currentTimesToLimits : {};
    const positionLimits = this.props.positionLimits
      ? this.props.positionLimits[this.props.positionLimits.length - 1]
      : {};

    const isProjected = true;
    let azDiff = Math.abs(domeAz - currentPointing.az);
    if (azDiff > 180) azDiff = azDiff - 360;
    const vignettingDistance = (Math.abs(azDiff) * Math.cos((currentPointing.el * Math.PI) / 180)).toFixed(2);

    const timeSeriesControlsProps = {
      timeWindow: this.state.timeWindow,
      isLive: this.state.isLive,
      historicalData: this.state.historicalData,
    };

    const dataLouversAF = [
      {
        Louvers: 'Open [%]',
        A1: '0%',
        A2: '0%',
        B1: '0%',
        B2: '0%',
        B3: '0%',
        C1: '0%',
        C2: '0%',
        C3: '0%',
        D1: '0%',
        D2: '0%',
        D3: '0%',
        E1: '0%',
        E2: '0%',
        E3: '0%',
        F1: '0%',
        F2: '0%',
        F3: '0%',
      },
      {
        Louvers: 'Cmd. [%]',
        A1: '-',
        A2: '-',
        B1: '-',
        B2: '-',
        B3: '-',
        C1: '-',
        C2: '-',
        C3: '-',
        D1: '-',
        D2: '-',
        D3: '-',
        E1: '-',
        E2: '-',
        E3: '-',
        F1: '-',
        F2: '-',
        F3: '-',
      },
    ];

    const dataLouversGN = [
      {
        Louvers: 'Open [%]',
        G1: '0%',
        G2: '0%',
        G3: '0%',
        H1: '0%',
        H2: '0%',
        H3: '0%',
        I1: '0%',
        I2: '0%',
        I3: '0%',
        L1: '0%',
        L2: '0%',
        L3: '0%',
        E2: '0%',
        E3: '0%',
        F1: '0%',
        F2: '0%',
        F3: '0%',
      },
      {
        Louvers: 'Cmd. [%]',
        G1: '-',
        G2: '-',
        G3: '-',
        H1: '-',
        H2: '-',
        H3: '-',
        I1: '-',
        I2: '-',
        I3: '-',
        L1: '-',
        L2: '-',
        L3: '-',
        M1: '-',
        M2: '-',
        M3: '-',
        N1: '-',
        N2: '-',
      },
    ];

    // console.log(currentPointing)
    return (
      <div className={styles.domeContainer}>
        {/* <h2>TOP VIEW</h2> */}
        <div className={styles.topRow}>
          <div className={styles.windRoseContainer}>
            <WindRose />
          </div>
          {/* <div className={styles.skymapGridContainer}> */}
          {/* <SkymapGrid width={width} height={height} isProjected={isProjected} /> */}
          {/* <div className={styles.windRoseContainer}>
              <WindRose />
            </div> */}

          {/* <DomeTopView width={width} height={height} />
            <MountTopView currentPointing={currentPointing} /> */}
          {/* <DomeShutter
              width={width}
              height={height}
              azimuthPosition={domeAz}
              dropoutDoorOpeningPercentage={dropoutDoorOpeningPercentage}
              mainDoorOpeningPercentage={mainDoorOpeningPercentage}
              targetAzimuthPosition={domeTargetAz}
            /> */}

          {/* <DomePointing
              width={width}
              height={height}
              currentPointing={currentPointing}
              targetPointing={targetPointing}
              isProjected={isProjected}
            /> */}
          {/* <div
              className={styles.vignettingDistanceContainer}
              title="Difference between telescope and dome azimuth, multiplied by cos(telescope altitude)"
            >
              <span>Vignetting distance: </span>
              <span className={styles.value}>{vignettingDistance}º</span>
            </div> */}
          {/* </div> */}
          <DomeSummaryTable
            currentPointing={currentPointing}
            targetPointing={targetPointing}
            domeAz={domeAz}
            domeTargetAz={domeTargetAz}
            domeInPosition={domeInPosition}
            azimuthState={azimuthState}
            dropoutDoorState={dropoutDoorState}
            mainDoorState={mainDoorState}
            mountTrackingState={mountTrackingState}
            trackID={trackID}
            mountInPosition={mountInPosition}
            m3State={m3State}
            currentTimesToLimits={currentTimesToLimits}
            positionLimits={positionLimits}
          />
        </div>
        {/* {this.props.controls && (
          <div>
            <TimeSeriesControls
              setTimeWindow={(timeWindow) => this.setState({ timeWindow })}
              timeWindow={this.state.timeWindow}
              setLiveMode={(isLive) => this.setState({ isLive })}
              isLive={this.state.isLive}
              setHistoricalData={this.setHistoricalData}
            />
          </div>
        )} */}
        {/* <div className={styles.telemetryTable}>
          <div className={styles.azimuthSection}>
            <h2>Azimuth</h2>
            <div ref={this.azimuthPlotRef} className={styles.azimuthPlot}>
              <div>
                <PlotContainer
                  inputs={this.azimuthPlotInputs}
                  containerNode={this.azimuthPlotRef?.current}
                  xAxisTitle="Time"
                  yAxisTitle="Azimuth"
                  timeSeriesControlsProps={timeSeriesControlsProps}
                />
              </div>
            </div>
          </div>

          <div className={styles.elevationSection}>
            <h2>Elevation</h2>
            <div ref={this.elevationPlotRef} className={styles.elevationPlot}>
              <div>
                <PlotContainer
                  inputs={this.elevationPlotInputs}
                  containerNode={this.elevationPlotRef?.current}
                  xAxisTitle="Time"
                  yAxisTitle="Elevation"
                  timeSeriesControlsProps={timeSeriesControlsProps}
                />
              </div>
            </div>
          </div>
        </div> */}
        <SimpleTable headers={this.LOUVERS_AF} data={dataLouversAF} />
        <SimpleTable headers={this.LOUVERS_GN} data={dataLouversGN} />
      </div>
    );
  }
}
