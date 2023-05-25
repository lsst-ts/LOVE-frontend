import React, { Component } from 'react';
import Skymap from './Skymap/Skymap';
import styles from './EnvironmentSummary.module.css';
import WindRose from 'components/icons/WindRose/WindRose';
import SimonyiTelescope from './Cartoons/SimonyiTelescope';
import AuxTelescope from './Cartoons/AuxTelescope';
import BeachIcon from 'components/icons/BeachIcon/BeachIcon';
import MountainIcon from 'components/icons/MountainIcon/MountainIcon';
import TemperatureIcon from 'components/icons/TemperatureIcon/TemperatureIcon';

export default class EnvironmentSummary extends Component {
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
