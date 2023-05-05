import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface from '../../../Utils';
import SimpleTable from '../../GeneralPurpose/SimpleTable/SimpleTable';
import LogoIcon from '../../icons/LogoIcon/LogoIcon';
import InriaLogo from '../../icons/InriaLogo/InriaLogo';
import styles from './AboutPanel.module.css';
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
            <span className={styles.version}>LOVE version 27.2.0.1</span>
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam turpis dolor, pellentesque at orci in, porta
            porttitor felis. Aliquam nulla erat, pulvinar ac laoreet sed, laoreet non lectus. Cras id accumsan quam.
            Suspendisse in augue non sapien egestas lobortis. Proin facilisis tempus fringilla.
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
