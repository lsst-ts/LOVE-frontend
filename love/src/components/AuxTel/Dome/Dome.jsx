import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Dome.module.css';
import SkymapGrid from '../Skymap/SkymapGrid';
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
      az: this.props.mountEncoders ? this.props.mountEncoders.azimuthCalculatedAngle : 0,
      el: this.props.mountEncoders ? this.props.mountEncoders.elevationCalculatedAngle : 0,
    };
    const targetPointing = {
      az: this.props.target ? this.props.target.azimuth : 0,
      el: this.props.target ? this.props.target.elevation : 0,
    };
    const isProjected = true;
    // console.log(currentPointing)
    return (
      <div className={styles.domeContainer}>
        {/* <h2>TOP VIEW</h2> */}
        <div className={styles.topRow}>
          <DomeSummaryTable />
          <div className={styles.skymapGridContainer}>
            {/* <SkymapGrid width={width} height={height} isProjected={isProjected} /> */}
            <div className={styles.windRoseContainer}>
              <WindRose />
            </div>
            <DomeTopView width={width} height={height} />
            <DomeShutter
              width={width}
              height={height}
              azimuthPosition={this.props.azimuthPosition}
              dropoutDoorOpeningPercentage={this.props.dropoutDoorOpeningPercentage}
              mainDoorOpeningPercentage={this.props.mainDoorOpeningPercentage}
              targetAzimuthPosition={this.props.azimuthCommandedState ? this.props.azimuthCommandedState.azimuth : 0}
            />
            <DomePointing
              width={width}
              height={height}
              currentPointing={currentPointing}
              targetPointing={targetPointing}
              isProjected={isProjected}
            />
          </div>
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
