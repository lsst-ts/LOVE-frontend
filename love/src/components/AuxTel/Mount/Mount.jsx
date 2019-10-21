import React, { Component } from 'react';
import LightPathContainer from './LightPath.container';
import SummaryPanelContainer from './SummaryPanel/SummaryPanel.container';
import styles from './Mount.module.css';
import MotorTableContainer from './MotorTable/MotorTable.container';

export default class Mount extends Component {
  render() {
    return (
      <div className={styles.container}>
        <LightPathContainer></LightPathContainer>
        <SummaryPanelContainer></SummaryPanelContainer>
        <MotorTableContainer></MotorTableContainer>
      </div>
    );
  }
}
