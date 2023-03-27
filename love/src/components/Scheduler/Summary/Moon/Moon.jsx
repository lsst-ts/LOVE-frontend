import React, { Component } from 'react';
import styles from './Moon.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import MoonCartoon from '../../SkyElements/MoonCartoon/MoonCartoon';

export default class Moon extends Component {
  render() {
    const { moonRa, moonDec, moonAlt, moonAz, moonDistance, moonPhase, } = this.props;
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Moon</Title>
          <span></span>
        </SummaryPanel>
        <div className={styles.divContainer}>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Altitude</Label>
            <Value>{moonAlt}</Value>
            <Label>Azimuth</Label>
            <Value>{moonAz}</Value>
            <Label>Ra</Label>
            <Value>{moonRa}</Value>
            <Label>Dec</Label>
            <Value>{moonDec}</Value>
            <Label>Distance</Label>
            <Value>{moonDistance}</Value>
          </SummaryPanel>
          <div className={styles.divMoonCartoon}>
            <MoonCartoon />
            <span>{moonPhase}</span>
          </div>
        </div>
      </div>
    );
  }
}
