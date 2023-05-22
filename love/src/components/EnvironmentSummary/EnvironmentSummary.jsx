import React, { Component } from 'react';
import Skymap from './Skymap';
import styles from './EnvironmentSummary.module.css';
import WindRose from 'components/icons/WindRose/WindRose';
import SimonyiTelescope from './Cartoons/SimonyiTelescope';
import AuxTelescope from './Cartoons/AuxTelescope';

export default class EnvironmentSummary extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {}

  render() {
    // console.log(this.containerRef);
    return (
      <div>
        <div className={styles.windRoseContainer}>
          <WindRose />
        </div>
        <div ref={this.containerRef} className={styles.telescopes}>
          <Skymap containerNode={this.containerRef?.current} width={300} height={300} className={styles.skymap} />
          <SimonyiTelescope className={styles.simonyi} />
          <AuxTelescope className={styles.auxTel} />
        </div>
      </div>
    );
  }
}
