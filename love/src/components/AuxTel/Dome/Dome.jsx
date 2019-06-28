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
    };
    const targetPointing = {
      az: this.props.target ? this.props.target[this.props.target.length-1].azimuth.value : 0,
      el: this.props.target ? this.props.target[this.props.target.length-1].elevation.value : 0,
    };
    const domeAz = this.props.azimuthPosition ? this.props.azimuthPosition.value : 0;
    const domeTargetAz = this.props.azimuthCommandedState ? this.props.azimuthCommandedState[this.props.azimuthCommandedState.length-1].azimuth.value : 0;
    const mountTrackingState = this.props.atMountState ? this.props.atMountState[this.props.atMountState.length-1].state.value : 0;
    const azimuthState = this.props.azimuthState ? this.props.azimuthState[this.props.azimuthState.length-1].state.value : 0;
    const dropoutDoorState = this.props.dropoutDoorState ? this.props.dropoutDoorState[this.props.dropoutDoorState.length-1].state.value : 0;
    const mainDoorState = this.props.mainDoorState ? this.props.mainDoorState[this.props.mainDoorState.length-1].state.value : 0;

    const dropoutDoorOpeningPercentage = this.props.dropoutDoorOpeningPercentage ? this.props.dropoutDoorOpeningPercentage.value : 0;
    const mainDoorOpeningPercentage = this.props.dropoutDoorOpeningPercentage ? this.props.dropoutDoorOpeningPercentage.value : 0;
    const trackID = this.props.target ? this.props.target[0].trackId.value : '';
    const isProjected = true;
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
          </div>
          <DomeSummaryTable
            currentPointing={currentPointing}
            targetPointing={targetPointing}
            domeAz={domeAz}
            domeTargetAz={domeTargetAz}
            azimuthState={azimuthState}
            dropoutDoorState={dropoutDoorState}
            mainDoorState={mainDoorState}
            mountTrackingState={mountTrackingState}
            trackID={trackID}
          />
        </div>
        <div className={styles.telemetryTable}>
          <div className={styles.azimuthSection}>
            <h2>Azimuth</h2>
            <div className={styles.azimuthPlot}>
              <div>
                <TimeSeriesPlotContainer
                  dataSources={['Dome Azimuth', 'Mount Azimuth', 'Mount Target']}
                  // dataSources={['Mount Target']}
                  layers={{
                    'Dome Azimuth': {
                      mark: {
                        interpolate: 'linear',
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
                      },
                    },
                  }}
                  encoding={{
                    color: {
                      scale: {
                        domain: ['Dome Azimuth', 'Mount Azimuth', 'Mount Target'],
                        range: ['hsl(201, 22%, 40%)', 'hsl(160, 42%, 40%)', 'white'],
                      },
                    },
                  }}
                  groupNames={{
                    'Dome Azimuth': 'telemetry-ATDome-position',
                    'Mount Azimuth': 'telemetry-ATMCS-mountEncoders',
                    'Mount Target': 'event-ATMCS-target',
                  }}
                  accessors={{
                    'Dome Azimuth': (data) => data.azimuthPosition.value,
                    'Mount Azimuth': (data) => data.azimuthCalculatedAngle.value,
                    'Mount Target': (data) => (data[0].azimuth ? data[0].azimuth.value : undefined),
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
                    'Mount Elevation': 'telemetry-ATMCS-mountEncoders',
                    'Mount Target': 'event-ATMCS-target',
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
