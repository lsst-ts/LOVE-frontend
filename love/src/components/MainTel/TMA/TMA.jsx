import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './TMA.module.css';
import Summary from './Summary/Summary';
import MirrorCovers from './MirrorCovers/MirrorCovers';
import Elevation from './Elevation/Elevation';
import Drivers from './Drivers/Drivers';

export default class TMA extends Component {
  static propTypes = {
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
    trackID: PropTypes.string,
    commander: PropTypes.number,
    connected: PropTypes.bool,
    balancing: PropTypes.number,
    azimuthSystem: PropTypes.number,
    azimuthMotion: PropTypes.number,
    azimuthLimits: PropTypes.number,
    azimuthActualPosition: PropTypes.number,
    azimuthDemandPosition: PropTypes.number,
    elevationSystem: PropTypes.number,
    elevationMotion: PropTypes.number,
    elevationLimits: PropTypes.number,
    elevationActualPosition: PropTypes.number,
    elevationDemandPosition: PropTypes.number,
  };

  static defaultProps = {
    width: 500,
    height: 500,
  };

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const trackID = this.props.trackID;
    const commander = this.props.commander;
    const connected = this.props.connected;
    const balancing = this.props.balancing;
    const azimuthSystem = this.props.azimuthSystem;
    const azimuthMotion = this.props.azimuthMotion;
    const azimuthLimits = this.props.azimuthLimits;
    const azimuthActualPosition = this.props.azimuthActualPosition;
    const azimuthDemandPosition = this.props.azimuthDemandPosition;
    const elevationSystem = this.props.elevationSystem;
    const elevationMotion = this.props.elevationMotion;
    const elevationLimits = this.props.elevationLimits;
    const elevationActualPosition = this.props.elevationActualPosition;
    const elevationDemandPosition = this.props.elevationDemandPosition;

    return (
          <>
            <div className={styles.summaryContainer}>
              <Summary
                trackID={trackID}
                commander={commander}
                connected={connected}
                balancing={balancing}
                azimuthSystem={azimuthSystem}
                azimuthMotion={azimuthMotion}
                azimuthLimits={azimuthLimits}
                azimuthActualPosition={azimuthActualPosition}
                azimuthDemandPosition={azimuthDemandPosition}
                elevationSystem={elevationSystem}
                elevationMotion={elevationMotion}
                elevationLimits={elevationLimits}
                elevationActualPosition={elevationActualPosition}
                elevationDemandPosition={elevationDemandPosition}
              />
            </div>
            <div className={styles.mirrorCoversContainer}>
              <MirrorCovers />
            </div>
            <div className={styles.elevationContainer}>
              <Elevation />
            </div>
            <div className={styles.driversContainer}>
              <Drivers />
            </div>
          </>
    );
  }
}
