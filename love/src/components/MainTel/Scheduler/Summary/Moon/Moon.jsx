import React, { Component } from 'react';
import styles from './Moon.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../../GeneralPurpose/SummaryPanel/Title';
import MoonCartoon from '../../SkyElements/MoonCartoon/MoonCartoon';

export default class Moon extends Component {
  render() {
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Moon</Title>
          <span></span>
        </SummaryPanel>
        <div className={styles.divContainer}>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Altitude</Label>
            <Value>8.9°</Value>
            <Label>Azimuth</Label>
            <Value>241.30°</Value>
            <Label>Ra</Label>
            <Value>14h 54m 34s</Value>
            <Label>Dec</Label>
            <Value>-18° 7' 43"</Value>
            <Label>Distance</Label>
            <Value>377.202 km</Value>
          </SummaryPanel>
          <div className={styles.divMoonCartoon}>
            <MoonCartoon />
            <span>100%</span>
          </div>
        </div>
      </div>
    );
  }
}
