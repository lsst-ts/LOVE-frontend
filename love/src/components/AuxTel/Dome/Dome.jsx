import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Dome.module.css';
import SkymapGrid from '../Skymap/SkymapGrid';
import DomePointing from './DomePointing';
import DomeShutter from './DomeShutter';
import CurrentTargetValue from '../../GeneralPurpose/CurrentTargetValue/CurrentTargetValue';

export default class Camera extends Component {
  static propTypes = {
    // raftsDetailedState: PropTypes.string,
    // imageReadinessDetailedState: PropTypes.string,
    // calibrationDetailedState: PropTypes.string,
    // shutterDetailedState: PropTypes.string,
    // imageSequence: PropTypes.object,
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
    const width = 500;
    const height = 500;
    const currentPointing = {
      az: this.props.ATMCS_mountEncoders.azimuthCalculatedAngle,
      el: this.props.ATMCS_mountEncoders.elevationCalculatedAngle,
    };
    const targetPointing = {
      az: this.props.target.azimuth,
      el: this.props.target.elevation,
    };
    const isProjected = true;
    return (
      <div className={styles.domeContainer}>
        <h2>TOP VIEW</h2>
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
          <span>Mount az: </span>
          <CurrentTargetValue
            currentValue={Math.floor(currentPointing.az)}
            targetValue={Math.floor(targetPointing.az)}
            isChanging={true}
          />
          <span>Mount el: </span>
          <CurrentTargetValue
            currentValue={Math.floor(currentPointing.el)}
            targetValue={Math.floor(targetPointing.el)}
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
    );
  }
}
