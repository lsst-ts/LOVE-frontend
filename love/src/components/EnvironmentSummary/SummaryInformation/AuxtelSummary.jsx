import React, { Component } from 'react';
import styles from './SummaryInformation.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import { schedulerTrackingStateToMap, schedulerTrackingStateToStyle } from 'Config';
import { fixedFloat } from 'Utils';

export default class Simonyi extends Component {
  render() {
    const {
      auxtelTrackingState,
      auxtelAltitude,
      auxtelAzimuth,
      auxtelRotator,
      auxtelDomeAlt,
      auxtelDomeAz,
    } = this.props;
    const auxtelTracking = schedulerTrackingStateToMap[auxtelTrackingState];
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Telescope</Title>
          <Value>
            <StatusText status={schedulerTrackingStateToStyle[auxtelTracking]}>{auxtelTracking}</StatusText>
          </Value>
        </SummaryPanel>
        <div className={styles.mountDomeDiv}>
          <SummaryPanel className={styles.summaryPanel}>
            <Title>Mount</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>{`${fixedFloat(auxtelAltitude, 2)} °`}</Value>
            <Label>Azimuth</Label>
            <Value>{`${fixedFloat(auxtelAzimuth, 2)} °`}</Value>
            <Label>Rotator</Label>
            <Value>{`${fixedFloat(auxtelRotator, 2)} °`}</Value>
          </SummaryPanel>
          <SummaryPanel className={styles.summaryPanel}>
            <Title>Dome</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>{`${fixedFloat(auxtelDomeAlt, 2)} °`}</Value>
            <Label>Azimuth</Label>
            <Value>{`${fixedFloat(auxtelDomeAz, 2)} °`}</Value>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
