import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Dome.module.css';
import SkymapGrid from '../Skymap/SkymapGrid';
import DomePointing from './DomePointing';
import DomeShutter from './DomeShutter';
import CurrentTargetValue from '../../GeneralPurpose/CurrentTargetValue/CurrentTargetValue';
import TimeSeriesPlotContainer from '../../GeneralPurpose/TimeSeriesPlot/TimeSeriesPlot.container';

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
      az: this.props.mountEncoders.azimuthCalculatedAngle,
      el: this.props.mountEncoders.elevationCalculatedAngle,
    };
    const targetPointing = {
      az: this.props.target.azimuth,
      el: this.props.target.elevation,
    };
    const isProjected = true;
    return (
      <div className={styles.domeContainer}>
        {/* <h2>TOP VIEW</h2> */}
        <div className={styles.skymapGridContainer}>
          <DomePointing
            width={width}
            height={height}
            currentPointing={currentPointing}
            targetPointing={targetPointing}
            isProjected={isProjected}
          />
          <SkymapGrid width={width} height={height} isProjected={isProjected} />
          <DomeShutter
            width={width}
            height={height}
            azimuthPosition={this.props.azimuthPosition}
            dropoutDoorOpeningPercentage={this.props.dropoutDoorOpeningPercentage}
            mainDoorOpeningPercentage={this.props.mainDoorOpeningPercentage}
            targetAzimuthPosition={this.props.azimuthCommandedState.azimuth}
          />
        </div>
        <div className={styles.telemetryTable}>
          <div className={styles.azimuthSection}>
            <h2>Azimuth</h2>
            <div className={styles.azimuthValues}>
              <span>Mount az: </span>
              <CurrentTargetValue
                currentValue={Math.floor(currentPointing.az)}
                targetValue={Math.floor(targetPointing.az)}
                isChanging={true}
              />
              <span>Dome az: </span>
              <CurrentTargetValue
                currentValue={Math.floor(this.props.azimuthPosition)}
                targetValue={Math.floor(this.props.azimuthCommandedState.azimuth)}
                isChanging={true}
              />
            </div>
          </div>

          <div className={styles.azimuthPlot}>
            <h2 />
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

          <div className={styles.elevationSection}>
            <h2>Elevation</h2>
            <span>Mount el: </span>
            <CurrentTargetValue
              currentValue={Math.floor(currentPointing.el)}
              targetValue={Math.floor(targetPointing.el)}
              isChanging={true}
            />
          </div>

          {/* Plots */}

          <div className={styles.elevationPlot}>
            <h2 />
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
                  'Mount Elevation': (data) => data.elevationCalculatedAngle.value,
                  'Mount Target': (data) => (data[0].elevation ? data[0].elevation.value : undefined),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
