import React, { Component } from 'react';
import styles from './Headers.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import GearIcon from 'components/icons/ScriptQueue/GearIcon/GearIcon.jsx';
import Sun from '../SkyElements/SunCartoon/SunCartoon';
import Stars from '../SkyElements/Stars/Stars';
import Moment from 'moment';
import diffHours from 'Utils';
import formatSecondsToDigital from 'Utils';

export default class Headers extends Component {
  render() {
    const current_time = Moment().format('h:mm:ss');
    console.log(current_time);
    const { subState, mode, type, isNigth, night, sunset, sunrise } = this.props;
    console.log(isNigth, sunset, sunrise);
    const formatSunset = Moment(sunset).format('h:mm:ss');
    console.log(formatSunset);
    // const diffToSunrise = diffHours(sunrise, current_time);
    // console.log(diffHours(sunrise, current_time));
    // const diffToSunset = diffHours(sunset, current_time);
    // console.log(diffToSunset);
    return (
      <div className={styles.container}>
        <div className={styles.leftDivs}>
          <div className={styles.headersLeft}>
            <SummaryPanel className={styles.summaryPanel1}>
              <Title>Summary State</Title>
              <Value>ENABLED</Value>
              <GearIcon className={styles.gearIcon} />
              <Value>RUNNING</Value>
            </SummaryPanel>
          </div>
          <div className={styles.headersCenter}>
            <SummaryPanel className={styles.summaryPanel2}>
              <Label>Obs. Mode</Label>
              <Value>{mode}</Value>
              <Label>Obs. Type</Label>
              <Value>{type}</Value>
            </SummaryPanel>
          </div>
        </div>
        <div className={styles.headersRigth}>
          {isNigth ? (
            <div className={styles.nightDiv}>
              <div className={styles.iconStars}>
                <Stars />
              </div>
              <span>Night #{night} - {sunrise} till Sunrise</span>
            </div>
          ) : (
            <div className={styles.dayDiv}>
              <div className={styles.iconSun}>
                <Sun />
              </div>
              <span>Day-{sunset} till Sunset</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
