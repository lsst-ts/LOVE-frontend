import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Dome.module.css';
// import SkymapGrid from '../Skymap/SkymapGrid';
import DomeTopView from './DomeTopView';
import DomePointing from './DomePointing';
import DomeShutter from './DomeShutter';
import TimeSeriesPlotContainer from '../../GeneralPurpose/TimeSeriesPlot/TimeSeriesPlot.container';
import WindRose from '../../GeneralPurpose/WindRose/WindRose';
import DomeSummaryTable from './DomeSummaryTable/DomeSummaryTable';

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
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    const width = this.props.width;
    const height = this.props.height;
    const currentPointing = {
      az: this.props.mountEncoders ? this.props.mountEncoders.azimuthCalculatedAngle.value : 0,
      el: this.props.mountEncoders ? this.props.mountEncoders.elevationCalculatedAngle.value : 0,
      nasmyth1: this.props.mountEncoders ? this.props.mountEncoders.nasmyth1CalculatedAngle.value : 0,
      nasmyth2: this.props.mountEncoders ? this.props.mountEncoders.nasmyth2CalculatedAngle.value : 0,
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
    const trackID = this.props.target ? this.props.target[0].trackId.value : '';
    const m3State = this.props.m3State ? this.props.m3State[0].value: 2;
    const currentTimesToLimits = this.props.currentTimeToLimits ? this.props.currentTimesToLimits : {};
    
    const isProjected = true;
    let azDiff = Math.abs(domeAz - currentPointing.az);
    if (azDiff > 180) azDiff = azDiff - 360;
    const vignettingDistance = (Math.abs(azDiff) * Math.cos((currentPointing.el * Math.PI) / 180)).toFixed(2);
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
          />
        </div>
        <div className={styles.telemetryTable}>
          <div className={styles.azimuthSection}>
            <h2>Azimuth</h2>
            <div className={styles.azimuthPlot}>
              <div>
                <TimeSeriesPlotContainer
                  dataSources={['Dome Azimuth', 'Dome Target Az', 'Mount Azimuth', 'Mount Target']}
                  // dataSources={['Mount Target']}
                  layers={{
                    'Dome Azimuth': {
                      mark: {
                        interpolate: 'linear',
                      },
                    },
                    'Dome Target Az': {
                      mark: {
                        interpolate: 'step-before',
                        strokeWidth: 1,
                        strokeDash: [8, 8],
                      },
                    },
                    'Mount Azimuth': {
                      mark: {
                        interpolate: 'linear',
                        point: false,
                      },
                    },
                    'Mount Target': {
                      mark: {
                        interpolate: 'step-before',
                        strokeWidth: 1,
                        strokeDash: [8, 8],
                      },
                    },
                  }}
                  encoding={{
                    color: {
                      scale: {
                        domain: ['Dome Azimuth', 'Dome Target Az', 'Mount Azimuth', 'Mount Target'],
                        range: ['hsl(201, 22%, 60%)', 'hsl(201, 22%, 60%)', 'hsl(160, 42%, 60%)', 'hsl(160, 42%, 60%)'],
                      },
                    },
                  }}
                  groupNames={{
                    'Dome Azimuth': 'telemetry-ATDome-1-position',
                    'Dome Target Az': 'event-ATDome-1-azimuthCommandedState',
                    'Mount Azimuth': 'telemetry-ATMCS-1-mountEncoders',
                    'Mount Target': 'event-ATMCS-1-target',
                  }}
                  accessors={{
                    'Dome Azimuth': (data) => data.azimuthPosition.value,
                    'Dome Target Az': (data) =>
                      data[data.length - 1].azimuth ? data[data.length - 1].azimuth.value : undefined,
                    'Mount Azimuth': (data) => data.azimuthCalculatedAngle.value,
                    'Mount Target': (data) =>
                      data[data.length - 1].azimuth ? data[data.length - 1].azimuth.value : undefined,
                  }}
                />
              </div>
            </div>
          </div>

          <div className={styles.elevationSection}>
            <h2>Elevation</h2>
            <div className={styles.elevationPlot}>
              <div>
                <TimeSeriesPlotContainer
                  dataSources={['Mount Elevation', 'Mount Target']}
                  layers={{
                    'Mount Elevation': {
                      mark: {
                        interpolate: 'linear',
                        point: false,
                      },
                    },
                    'Mount Target': {
                      mark: {
                        interpolate: 'step-before',
                      },
                    },
                  }}
                  encoding={{
                    color: {
                      scale: {
                        domain: ['Mount Elevation', 'Mount Target'],
                        range: ['hsl(201, 22%, 40%)', 'white'],
                      },
                    },
                  }}
                  groupNames={{
                    'Mount Elevation': 'telemetry-ATMCS-1-mountEncoders',
                    'Mount Target': 'event-ATMCS-1-target',
                  }}
                  accessors={{
                    'Mount Elevation': (data) =>
                      data.elevationCalculatedAngle ? data.elevationCalculatedAngle.value : 0,
                    'Mount Target': (data) => (data[0].elevation ? data[0].elevation.value : undefined),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
