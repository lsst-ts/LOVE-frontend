import React, { Component } from 'react';
import Skymap from './Skymap';
import styles from './EnvironmentSummary.module.css';
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
      <div ref={this.containerRef} className={styles.telescopes}>
        <Skymap containerNode={this.containerRef?.current} width={100} height={100} className={styles.skymap} />
        <SimonyiTelescope className={styles.simonyi} />
        <AuxTelescope className={styles.auxTel} />
      </div>
    );
  }
}
