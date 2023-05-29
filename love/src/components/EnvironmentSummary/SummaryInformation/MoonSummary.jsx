import React, { Component } from 'react';
import styles from './SummaryInformation.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';

export default class Moon extends Component {
  render() {
    const { simonyiMoonRa, simonyiMoonDec } = this.props;
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Moon</Title>
          <span></span>
        </SummaryPanel>
        <div className={styles.divContainer}>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Ra</Label>
            <Value>{`${fixedFloat(simonyiMoonRa, 2)} °`}</Value>
            <Label>Dec</Label>
            <Value>{`${fixedFloat(simonyiMoonDec, 2)} °`}</Value>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
