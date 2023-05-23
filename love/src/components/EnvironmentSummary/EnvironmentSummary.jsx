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
    console.log(this.containerRef);
    return (
      <div>
        <div className={styles.windRoseContainer}>
          <WindRose />
        </div>
        <div className={styles.iconLeft}>
          <BeachIcon />
        </div>
        <div ref={this.containerRef} className={styles.telescopes}>
          <Skymap containerNode={this.containerRef?.current} className={styles.skymap} />
          <SimonyiTelescope className={styles.simonyi} />
          <div className={styles.iconCenter}>
            <MountainIcon />
          </div>
          <AuxTelescope className={styles.auxTel} />
        </div>
        <div className={styles.iconRight}>
          <TemperatureIcon />
        </div>
      </div>
    );
  }
}
