import React, { Component } from 'react';
import styles from './SummaryInformation.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import { fixedFloat } from 'Utils';

export default class TemperaturesSummary extends Component {
  render() {
    const { numChannels, temperature, location } = this.props;

    const temperatures = temperature.slice(0, numChannels);
    const locations = location ? location.split(',') : [];
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Temperatures summmary</Title>
        </SummaryPanel>
        <div className={styles.summaryPanelDetail}>
          {temperatures.map((t, i) => (
            <SummaryPanel className={styles.summaryPanel}>
              <Label>{locations[i]}</Label>
              <Value>{`${fixedFloat(t, 2)} °`}</Value>
            </SummaryPanel>
          ))}
        </div>
      </div>
    );
  }
}