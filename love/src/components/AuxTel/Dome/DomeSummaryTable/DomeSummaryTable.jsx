import React, { Component } from 'react';
import styles from './DomeSummaryTable.module.css'
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import CurrentTargetValue from '../../../GeneralPurpose/CurrentTargetValue/CurrentTargetValue';

export default class DomeSummaryTable extends Component {
  render() {
    return (
      <div className={styles.summaryTable}>
        <span className={styles.title}>Track ID</span>
        <span className={styles.value}>####</span>
        {/* Dome */}
        <span className={styles.title}>Dome</span>
        <span className={styles.value} />
        <span className={styles.label}>Az</span>
        <span className={styles.value}>
          <CurrentTargetValue currentValue={0} targetValue={45} isChanging={true} />
        </span>
        <span className={styles.label}>Azimuth</span>
        <span className={styles.value}>
          <StatusText title={'stateLabel'} status={'ok'}>
            {'stateLabel'}
          </StatusText>
        </span>
        <span className={styles.label}>Dropout door</span>
        <span className={styles.value}>
          <StatusText title={'stateLabel'} status={'ok'}>
            {'stateLabel'}
          </StatusText>
        </span>
        <span className={styles.label}>Main door</span>
        <span className={styles.value}>
          <StatusText title={'stateLabel'} status={'ok'}>
            {'stateLabel'}
          </StatusText>
        </span>
        {/* Mount */}
        <span className={styles.title}>Mount</span>
        <span className={styles.value} />
        <span className={styles.label}>Az</span>
        <span className={styles.value}>
          <CurrentTargetValue currentValue={0} targetValue={45} isChanging={true} />
        </span>
        <span className={styles.label}>El</span>
        <span className={styles.value}>
          <CurrentTargetValue currentValue={0} targetValue={45} isChanging={true} />
        </span>
        <span className={styles.label}>Tracking</span>
        <span className={styles.value}>
          <StatusText title={'stateLabel'} status={'ok'}>
            {'stateLabel'}
          </StatusText>
        </span>
        <span className={styles.label}>M3 rot</span>
        <span className={styles.value}>
          <StatusText title={'stateLabel'} status={'ok'}>
            {'stateLabel'}
          </StatusText>
        </span>
        <span className={styles.label}>M3 port</span>
        <span className={styles.value}>
          <StatusText title={'stateLabel'} status={'ok'}>
            {'stateLabel'}
          </StatusText>
        </span>

        {/* <StatusText title={stateLabel} status={stateStyle}>{stateLabel}</StatusText> */}
      </div>
    );
  }
}
