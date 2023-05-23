import React, { Component } from 'react';
import LogoIcon from '../../icons/LogoIcon/LogoIcon';
import InriaLogo from '../../icons/InriaLogo/InriaLogo';
import styles from './AboutPanel.module.css';

import packageJson from '../../../../package.json';

export default class AboutPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
    };
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <LogoIcon className={styles.logo} title="Love" />
        <div className={styles.textWrapper}>
          <div>
            <span>You are currently running on</span>
            <span className={styles.version}>LOVE frontend version {packageJson.version}</span>
          </div>
          <div>
            <span>
              L.O.V.E, the LSST Operators Visualization Environment, is a cutting-edge GUI, Graphic User Interface,
              which with it's intuitive interface and powerful tools enables observing specialist, scientists, and
              anywone with access, to monitor to efficiently navigate, monitor, and explore the current status of the
              observatory's state-of-the-art instruments.
            </span>
          </div>
          <div className={styles.version}>Created with love by Inria.</div>
        </div>
        <div className={styles.inriaLogo}>
          <InriaLogo className={styles.logo} title="Love" />
        </div>
      </div>
    );
  }
}
