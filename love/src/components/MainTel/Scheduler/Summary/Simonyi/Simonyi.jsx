import React, { Component } from 'react';
import styles from './Simonyi.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../../GeneralPurpose/SummaryPanel/Title';

export default class Simonyi extends Component {
  render() {
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Simonyi</Title>
          <Value>TRACKING</Value>
        </SummaryPanel>
        <div className={styles.mountDomeDiv}>
          <SummaryPanel className={styles.summaryPanel}>
            <Title>Mount</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>45.00°</Value>
            <Label>Azimuth</Label>
            <Value>273.00°</Value>
            <Label>Rotator</Label>
            <Value>64.91°</Value>
          </SummaryPanel>
          <SummaryPanel className={styles.summaryPanel}>
            <Title>Dome</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>45.00°</Value>
            <Label>Azimuth</Label>
            <Value>273.00°</Value>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
