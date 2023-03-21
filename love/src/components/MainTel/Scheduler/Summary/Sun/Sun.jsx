import React, { Component } from 'react';
import styles from './Sun.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../../GeneralPurpose/SummaryPanel/Title';
import Sky from '../../SkyElements/Sky/Sky';

export default class Sun extends Component {
  render() {
    const { sunRa, sunDec, sunAlt, sunAz, solarElong } = this.props;
    console.log(sunRa, sunDec, sunAlt, sunAz, solarElong);
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Sun</Title>
          <span></span>
        </SummaryPanel>
        <div className={styles.divContainer}>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Altitude</Label>
            <Value>{sunAlt}</Value>
            <Label>Azimuth</Label>
            <Value>{sunAz}</Value>
            <Label>Ra</Label>
            <Value>{sunRa}</Value>
            <Label>Dec</Label>
            <Value>{sunDec}</Value>
            <Label>Elongation</Label>
            <Value>{solarElong}</Value>
          </SummaryPanel>
          <div className={styles.sunCartoon}>
            <Sky />
            <span>03:21:52</span>
          </div>
        </div>
      </div>
    );
  }
}
