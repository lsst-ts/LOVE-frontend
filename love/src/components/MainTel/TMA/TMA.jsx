import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './TMA.module.css';
import Summary from './Summary/Summary';
import MirrorCovers from './MirrorCovers/MirrorCovers';
import Elevation from './Elevation/Elevation';
import Drives from './Drives/Drives';

export default class TMA extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** Unique target identifier. Echoed from the trackTarget command */
    trackId: PropTypes.number,
    /** Who controls the low-level controller; a Commander enum. */
    commander: PropTypes.number,
    /** Is the command (client) socket connected */
    connected: PropTypes.bool,
    /** State of the balance system. Overall power state of the balancing system; a PowerState enum */
    balancing: PropTypes.number,
    /** State of the azimuth axis. Power state of each motion controller; a PowerState enum. */
    azimuthSystem: PropTypes.number,
    /** Azimuth Motion state, as an AxisMotionState enum. */
    azimuthMotion: PropTypes.number,
    /** Azimuth Limits, as a LimitsMask enum mask. */
    azimuthLimits: PropTypes.number,
    /** Azimuth Position measured by the encoders */
    azimuthActualPosition: PropTypes.number,
    /** Azimuth Position computed by the path generator. */
    azimuthDemandPosition: PropTypes.number,
    /** State of the elevation system. Power state; a PowerState enum */
    elevationSystem: PropTypes.number,
    /** Motion state of the elevation axis */
    elevationMotion: PropTypes.number,
    /** Elevation Limits, as a LimitsMask enum mask */
    elevationLimits: PropTypes.number,
    /** Elevation Position measured by the encoders */
    elevationActualPosition: PropTypes.number,
    /** Elevation Position computed by the path generator */
    elevationDemandPosition: PropTypes.number,
    /** Mirror Covers Motion Deployment State */
    mirrorCovers: PropTypes.number,
    /** Array data of Drivers about the azimuth */
    azimuthDrives: PropTypes.arrayOf(PropTypes.number),
    /** Array data of Drivers about the elevation */
    elevationDrives: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    trackId: '',
    commander: 0,
    connected: false,
    balancing: 0,
    azimuthSystem: 0,
    azimuthMotion: 0,
    azimuthLimits: 0,
    azimuthActualPosition: 0,
    azimuthDemandPosition: 0,
    elevationSystem: 0,
    elevationMotion: 0,
    elevationLimits: 0,
    elevationActualPosition: 0,
    elevationDemandPosition: 0,
    mirrorCovers: 0,
    azimuthDrives: [],
    elevationDrives: [],
  };

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const {
      trackId,
      commander,
      connected,
      balancing,
      azimuthSystem,
      azimuthMotion,
      azimuthLimits,
      azimuthActualPosition,
      azimuthDemandPosition,
      elevationSystem,
      elevationMotion,
      elevationLimits,
      elevationActualPosition,
      elevationDemandPosition,
      mirrorCovers,
      azimuthDrives,
      elevationDrives,
    } = this.props;
    return (
      <>
        <div className={styles.summaryContainer}>
          <Summary
            trackId={trackId}
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
          <Drives azimuthDrives={azimuthDrives} elevationDrives={elevationDrives} />
        </div>
      </>
    );
  }
}
