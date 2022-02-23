import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './TMA.module.css';
import Summary from './Summary/Summary';
import MirrorCovers from './MirrorCovers/MirrorCovers';
import Elevation from './Elevation/Elevation';
import Drives from './Drives/Drives';

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
    mirrorCovers: PropTypes.number,
    azimuthDrives: PropTypes.array,
    elevationDrives: PropTypes.array,
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
    const mirrorCovers = this.props.mirrorCovers;
    const azimuthDrives = this.props.azimuthDrives;
    const elevationDrives = this.props.elevationDrives;
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
            <div className={styles.mirrorAndElevationContainer}>
              <div className={styles.mirrorCoversContainer}>
                <MirrorCovers
                  azimuthActualPosition={azimuthActualPosition}
                  azimuthDemandPosition={azimuthDemandPosition}
                  mirrorCovers={mirrorCovers}
                />
              </div>
              <div className={styles.elevationContainer}>
                <Elevation
                  elevationActualPosition={elevationActualPosition}
                  elevationDemandPosition={elevationDemandPosition}
                />
              </div>
            </div>
            
            <div className={styles.drivesContainer}>
              <Drives
                azimuthDrives={azimuthDrives}
                elevationDrives={elevationDrives}
              />
            </div>
          </>
    );
  }
}
