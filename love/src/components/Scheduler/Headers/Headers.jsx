import React, { Component } from 'react';
import styles from './Headers.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import GearIcon from 'components/icons/ScriptQueue/GearIcon/GearIcon.jsx';
import Sun from '../SkyElements/SunCartoon/SunCartoon';
import Stars from '../SkyElements/Stars/Stars';
import Moment from 'moment';
import { formatSecondsToDigital } from 'Utils';
import { summaryStateMap, summaryStateToStyle, schedulerDetailedStateToMap, schedulerDetailedStateToStyle } from 'Config';

export default class Headers extends Component {
  render() {
    const { schedulerState, subState, mode, type, isNigth, night, sunset, sunrise } = this.props;

    const current_time = Moment();
    const diffSunset = Moment.unix(sunset).diff(current_time, 'seconds');
    const diffSunrise = Moment.unix(sunrise).diff(current_time, 'seconds');
    const diffSunsetDigital = formatSecondsToDigital(diffSunset);
    const diffSunriseDigital = formatSecondsToDigital(diffSunrise);

    // states on summary state section
    const schedulerSummaryState = summaryStateMap[schedulerState];
    const schedulerDetailedState = schedulerDetailedStateToMap[subState];

    return (
      <div className={styles.container}>
        <div className={styles.leftDivs}>
          <div className={styles.headersLeft}>
            <SummaryPanel className={styles.summaryPanel1}>
              <Title>Summary State</Title>
              <Value>
                <StatusText status={summaryStateToStyle[schedulerSummaryState]}>{schedulerSummaryState}</StatusText>
              </Value>
              <GearIcon className={styles.gearIcon} />
              <Value>
                <StatusText status={schedulerDetailedStateToStyle[schedulerDetailedState]}>{schedulerDetailedState}</StatusText>
              </Value>
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
              <span>Night #{night} - {diffSunriseDigital} till Sunrise</span>
            </div>
          ) : (
            <div className={styles.dayDiv}>
              <div className={styles.iconSun}>
                <Sun />
              </div>
              <span>Day - {diffSunsetDigital} till Sunset</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
