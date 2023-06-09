import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Skymap from './Skymap/Skymap';
import styles from './EnvironmentSummary.module.css';
import WindRose from 'components/icons/WindRose/WindRose';
import SimonyiTelescope from './Cartoons/SimonyiTelescope';
import AuxTelescope from './Cartoons/AuxTelescope';
import BeachIcon from 'components/icons/BeachIcon/BeachIcon';
import MountainIcon from 'components/icons/MountainIcon/MountainIcon';
import TemperatureIcon from 'components/icons/TemperatureIcon/TemperatureIcon';
import WindDirection from './Cartoons/WindDirection';

export default class EnvironmentSummary extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** Is the simonyi telescope tracking? */
    // simonyiTrackingState,
    // /** Simonyi telescope altitude */
    // simonyiAltitude,
    // /** Simonyi telescope azimuth */
    // simonyiAzimuth,
    // /** Simonyi telescope rotator position */
    // simonyiRotator,
    // /** Simonyi dome altitude position */
    // simonyiDomeAlt,
    // /** Simonyi dome azimuth position */
    // simonyiDomeAz,
    // /** Expected RA of the moon */
    // simonyiMoonRa,
    // /** Expected Dec of the moon */
    // simonyiMoonDec,
    // /** Expected moon phase/illumination (0-1) */
    // simonyiMoonPhase,
    // /** Expected sun RA */
    // simonyiSunRa,
    // /** Expected sun dec. */
    // simonyiSunDec,
    // /** Is the auxiliary telescope tracking? */
    // auxtelTrackingState,
    // /** Auxiliary telescope altitude */
    // auxtelAltitude,
    // /** Auxiliary telescope azimuth */
    // auxtelAzimuth,
    // /** Auxiliary telescope rotator position */
    // auxtelRotator,
    // /** Auxiliary dome altitude position */
    // auxtelDomeAlt,
    // /** Auxiliary dome azimuth position */
    // auxtelDomeAz,
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ test: 1 });
  }

  render() {
    const {
      simonyiTrackingState,
      simonyiAltitude,
      simonyiAzimuth,
      simonyiRotator,
      simonyiDomeAlt,
      simonyiDomeAz,
      simonyiMoonRa,
      simonyiMoonDec,
      simonyiMoonPhase,
      simonyiSunRa,
      simonyiSunDec,
      auxtelTrackingState,
      auxtelAltitude,
      auxtelAzimuth,
      auxtelRotator,
      auxtelDomeAlt,
      auxtelDomeAz,
    } = this.props;
    return (
      <div>
        <div className={styles.windDirection}>
          <WindDirection></WindDirection>
          <div>flecha</div>
        </div>
        <div className={styles.windRoseContainer}>
          <WindRose />
        </div>
        <div className={styles.iconLeft}>
          <BeachIcon />
        </div>
        <div ref={this.containerRef} className={styles.telescopes}>
          <Skymap
            containerNode={this.containerRef?.current}
            className={styles.skymap}
            simonyiMoonRa={simonyiMoonRa}
            simonyiMoonDec={simonyiMoonDec}
            simonyiSunRa={simonyiSunRa}
            simonyiSunDec={simonyiSunDec}
            simonyiMoonPhase={simonyiMoonPhase}
          />
          <SimonyiTelescope
            className={styles.simonyi}
            simonyiTrackingState={simonyiTrackingState}
            simonyiAltitude={simonyiAltitude}
            simonyiAzimuth={simonyiAzimuth}
            simonyiRotator={simonyiRotator}
            simonyiDomeAlt={simonyiDomeAlt}
            simonyiDomeAz={simonyiDomeAz}
          />
          <div className={styles.iconCenter}>
            <MountainIcon />
          </div>
          <AuxTelescope
            className={styles.auxTel}
            auxtelTrackingState={auxtelTrackingState}
            auxtelAltitude={auxtelAltitude}
            auxtelAzimuth={auxtelAzimuth}
            auxtelRotator={auxtelRotator}
            auxtelDomeAlt={auxtelDomeAlt}
            auxtelDomeAz={auxtelDomeAz}
          />
        </div>
        <div className={styles.iconRight}>
          <TemperatureIcon />
        </div>
      </div>
    );
  }
}
