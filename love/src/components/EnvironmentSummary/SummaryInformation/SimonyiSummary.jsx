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
      simonyiTrackingState,
      simonyiAltitude,
      simonyiAzimuth,
      simonyiRotator,
      simonyiDomeAlt,
      simonyiDomeAz,
    } = this.props;
    const simonyiTracking = schedulerTrackingStateToMap[simonyiTrackingState];
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Simonyi Enclosure</Title>
          <Value>
            <StatusText status={schedulerTrackingStateToStyle[simonyiTracking]}>{simonyiTracking}</StatusText>
          </Value>
        </SummaryPanel>
        <div className={styles.mountDomeDiv}>
          <SummaryPanel className={styles.summaryPanel}>
            <Title>Mount</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>{`${fixedFloat(simonyiAltitude, 2)} °`}</Value>
            <Label>Azimuth</Label>
            <Value>{`${fixedFloat(simonyiAzimuth, 2)} °`}</Value>
            <Label>Rotator</Label>
            <Value>{`${fixedFloat(simonyiRotator, 2)} °`}</Value>
          </SummaryPanel>
          <SummaryPanel className={styles.summaryPanel}>
            <Title>Dome</Title>
            <span></span>
            <Label>Altitude</Label>
            <Value>{`${fixedFloat(simonyiDomeAlt, 2)} °`}</Value>
            <Label>Azimuth</Label>
            <Value>{`${fixedFloat(simonyiDomeAz, 2)} °`}</Value>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
