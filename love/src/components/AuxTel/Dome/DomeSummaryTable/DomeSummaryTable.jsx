import React, { Component } from 'react';
import styles from './DomeSummaryTable.module.css';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import CurrentTargetValue from '../../../GeneralPurpose/CurrentTargetValue/CurrentTargetValue';
import PropTypes from 'prop-types';
import {
  domeAzimuthStateMap,
  dropoutDoorStateMap,
  mainDoorStateMap,
  mountTrackingStateMap,
  m3RotatorStateMap,
  m3PortStateMap,
  stateToStyleDomeAndMount,
} from '../../../../Config';

export default class DomeSummaryTable extends Component {
  static propTypes = {
    currentPointing: PropTypes.object,
    targetPointing: PropTypes.object,
    domeAz: PropTypes.number,
    domeTargetAz: PropTypes.number,
    azimuthState: PropTypes.number,
    dropoutDoorState: PropTypes.number,
    mainDoorState: PropTypes.number,
    mountTrackingState: PropTypes.number,
  };

  static defaultProps = {};

  render() {
    const domeAz = {
      current: this.props.domeAz,
      target: this.props.domeTargetAz,
    };
    const mountAz = {
      current: this.props.currentPointing.az,
      target: this.props.targetPointing.az,
    };
    const mountEl = {
      current: this.props.currentPointing.el,
      target: this.props.targetPointing.el,
    };

    const azimuthStateValue = domeAzimuthStateMap[this.props.azimuthState];
    const dropoutDoorStateValue = dropoutDoorStateMap[this.props.dropoutDoorState];
    const mainDoorStateValue = mainDoorStateMap[this.props.mainDoorState];
    const mountTrackingStateValue = mountTrackingStateMap[this.props.mountTrackingState];

    return (
      <div className={styles.summaryTable}>
        <span className={styles.title}>Track ID</span>
        <span className={styles.value}>####</span>
        {/* Dome */}
        <span className={styles.title}>Dome</span>
        <span className={styles.value} />
        <span className={styles.label}>Az</span>
        <span className={styles.value}>
          <CurrentTargetValue currentValue={domeAz.current} targetValue={domeAz.target} isChanging={true} />
        </span>
        <span className={styles.label}>Azimuth</span>
        <span className={styles.value}>
          <StatusText title={azimuthStateValue} status={stateToStyleDomeAndMount[azimuthStateValue]}>
            {azimuthStateValue}
          </StatusText>
        </span>
        <span className={styles.label}>Dropout door</span>
        <span className={styles.value}>
          <StatusText title={dropoutDoorStateValue} status={stateToStyleDomeAndMount[dropoutDoorStateValue]}>
            {dropoutDoorStateValue}
          </StatusText>
        </span>
        <span className={styles.label}>Main door</span>
        <span className={styles.value}>
          <StatusText title={mainDoorStateValue} status={stateToStyleDomeAndMount[mainDoorStateValue]}>
            {mainDoorStateValue}
          </StatusText>
        </span>
        {/* Mount */}
        <span className={styles.title}>Mount</span>
        <span className={styles.value} />
        <span className={styles.label}>Az</span>
        <span className={styles.value}>
          <CurrentTargetValue currentValue={mountAz.current} targetValue={mountAz.target} isChanging={true} />
        </span>
        <span className={styles.label}>El</span>
        <span className={styles.value}>
          <CurrentTargetValue currentValue={mountEl.current} targetValue={mountEl.target} isChanging={true} />
        </span>
        <span className={styles.label}>Tracking</span>
        <span className={styles.value}>
          <StatusText title={mountTrackingStateValue} status={stateToStyleDomeAndMount[mountTrackingStateValue]}>
            {mountTrackingStateValue}
          </StatusText>
        </span>
        {/* <span className={styles.label}>M3 rot</span>
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
        </span> */}

        {/* <StatusText title={stateLabel} status={stateStyle}>{stateLabel}</StatusText> */}
      </div>
    );
  }
}
