import React, { Component } from 'react';
import Skymap from './Skymap';
import styles from './EnvironmentSummary.module.css';
import SimonyiTelescope from './Cartoons/SimonyiTelescope';
import AuxTelescope from './Cartoons/AuxTelescope';

export default class EnvironmentSummary extends Component {
  render() {
    return (
      <div>
        <div>
          <Skymap />
        </div>
        <div className={styles.telescopes}>
          <SimonyiTelescope className={styles.simonyi} />
          <AuxTelescope />
        </div>
      </div>
    );
  }
}
