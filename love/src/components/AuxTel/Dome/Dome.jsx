import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Dome.module.css';
// import SkymapGrid from '../Skymap/SkymapGrid';
import DomeTopView from './DomeTopView';
import DomePointing from './DomePointing';
import DomeShutter from './DomeShutter';
import MountTopView from './MountTopView';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import WindRose from '../../GeneralPurpose/WindRose/WindRose';
import DomeSummaryTable from './DomeSummaryTable/DomeSummaryTable';
import TimeSeriesControls from 'components/TimeSeries/TimeSeriesControls/TimeSeriesControls';
import ManagerInterface, { parseCommanderData } from 'Utils';

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
    console.log('Dome');
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

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

    // console.log(currentPointing)
    return (
      <div className={styles.domeContainer}>
        {/* <h2>TOP VIEW</h2> */}
        <div className={styles.topRow}>
          <div className={styles.skymapGridContainer}>
            {/* <SkymapGrid width={width} height={height} isProjected={isProjected} /> */}
            <div className={styles.windRoseContainer}>
              <WindRose />
            </div>

            <DomeTopView width={width} height={height} />
            <MountTopView currentPointing={currentPointing} />
            <DomeShutter
              width={width}
              height={height}
              azimuthPosition={domeAz}
              dropoutDoorOpeningPercentage={dropoutDoorOpeningPercentage}
              mainDoorOpeningPercentage={mainDoorOpeningPercentage}
              targetAzimuthPosition={domeTargetAz}
            />
            <DomePointing
              width={width}
              height={height}
              currentPointing={currentPointing}
              targetPointing={targetPointing}
              isProjected={isProjected}
            />
            <div
              className={styles.vignettingDistanceContainer}
              title="Difference between telescope and dome azimuth, multiplied by cos(telescope altitude)"
            >
              <span>Vignetting distance: </span>
              <span className={styles.value}>{vignettingDistance}º</span>
            </div>
          </div>
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
        {this.props.controls && (
          <div>
            <TimeSeriesControls
              setTimeWindow={(timeWindow) => this.setState({ timeWindow })}
              timeWindow={this.state.timeWindow}
              setLiveMode={(isLive) => this.setState({ isLive })}
              isLive={this.state.isLive}
              setHistoricalData={this.setHistoricalData}
            />
          </div>
        )}
        <div className={styles.telemetryTable}>
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
        </div>
      </div>
    );
  }
}
