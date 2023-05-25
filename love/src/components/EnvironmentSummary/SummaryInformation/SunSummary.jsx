import React, { Component } from 'react';
import styles from './SummaryInformation.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import { fixedFloat, formatSecondsToDigital } from 'Utils';

export default class Sun extends Component {
  render() {
    const { simonyiSunRa, simonyiSunDec } = this.props;
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Sun</Title>
          <span></span>
        </SummaryPanel>
        <div className={styles.divContainer}>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Ra</Label>
            <Value>{`${fixedFloat(simonyiSunRa, 2)} °`}</Value>
            <Label>Dec</Label>
            <Value>{`${fixedFloat(simonyiSunDec, 2)} °`}</Value>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
