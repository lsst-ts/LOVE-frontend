import React, { Component } from 'react';
import styles from './Simonyi.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../../GeneralPurpose/SummaryPanel/Title';
import StatusText from '../../../../GeneralPurpose/StatusText/StatusText';
import { schedulerDomeTrackingStateToMap, schedulerDomeTrackingStateToStyle } from 'Config';

export default class Simonyi extends Component {
  render() {
    const { simonyiAl, simonyiAz, simonyiRot, domeAlt, domeAz } = this.props;
    const simonyiTrackingState = schedulerDomeTrackingStateToMap[this.props.simonyiTracking];
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Simonyi</Title>
          <Value>
            <StatusText status={schedulerDomeTrackingStateToStyle[simonyiTrackingState]}>{simonyiTrackingState}</StatusText>
          </Value>
        </SummaryPanel>
        <div className={styles.mountDomeDiv}>
          <SummaryPanel className={styles.summaryPanel}>
            <Title>Mount</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>{simonyiAl}</Value>
            <Label>Azimuth</Label>
            <Value>{simonyiAz}</Value>
            <Label>Rotator</Label>
            <Value>{simonyiRot}</Value>
          </SummaryPanel>
          <SummaryPanel className={styles.summaryPanel}>
            <Title>Dome</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>{domeAlt}</Value>
            <Label>Azimuth</Label>
            <Value>{domeAz}</Value>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
