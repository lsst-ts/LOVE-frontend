import React, { Component } from 'react';
import styles from './Sun.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import Sky from '../../SkyElements/Sky/Sky';
import Moment from 'moment';
import { fixedFloat, formatSecondsToDigital } from 'Utils';

export default class Sun extends Component {
  render() {
    const { sunRa, sunDec, sunAlt, sunAz, solarElong, sunset, sunrise, isNigth } = this.props;
    const current_time = Moment();
    const diffSunset = Moment.unix(sunset).diff(current_time, 'seconds');
    const diffSunrise = Moment.unix(sunrise).diff(current_time, 'seconds');
    const diffSunsetDigital = formatSecondsToDigital(diffSunset);
    const diffSunriseDigital = formatSecondsToDigital(diffSunrise);
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title>Sun</Title>
          <span></span>
        </SummaryPanel>
        <div className={styles.divContainer}>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Altitude</Label>
            <Value>{`${fixedFloat(sunAlt, 2)} °`}</Value>
            <Label>Azimuth</Label>
            <Value>{`${fixedFloat(sunAz, 2)} °`}</Value>
            <Label>Ra</Label>
            <Value>{`${fixedFloat(sunRa, 2)} °`}</Value>
            <Label>Dec</Label>
            <Value>{`${fixedFloat(sunDec, 2)} °`}</Value>
            <Label>Elongation</Label>
            <Value>{`${fixedFloat(solarElong, 2)} °`}</Value>
          </SummaryPanel>
          <div className={styles.sunCartoon}>
            <Sky />
            {isNigth ? 
              (<span>{diffSunriseDigital}</span>):
              (<span>{diffSunsetDigital}</span>)
            }
          </div>
        </div>
      </div>
    );
  }
}
