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
  stateToStyleDomeAndMount,
} from '../../../../Config';
import Limits from '../../../GeneralPurpose/Limits/Limits';

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
    const domeInPositionValue = this.props.domeInPosition ? this.props.domeInPosition[0].inPosition.value : 0;
    const mountInPositionValue = this.props.mountInPosition ? this.props.mountInPosition[0].inPosition.value : 0;
    const mountTrackingStateValue = mountTrackingStateMap[this.props.mountTrackingState];
    const m3State = this.props.m3State;
    const mountRotator =
      m3State === 1
        ? {
            name: 'Nasmyth1',
            current: this.props.currentPointing.nasmyth1,
            target: this.props.targetPointing.nasmyth1,
          }
        : {
            name: 'Nasmyth2',
            current: this.props.currentPointing.nasmyth2,
            target: this.props.targetPointing.nasmyth2,
          };

    return (
      <div className={styles.summaryTable}>
        <span className={styles.title}>Track ID</span>
        <span className={styles.value}>{this.props.trackID}</span>
        {/* Dome */}
        <span className={styles.title}>Dome</span>
        <span className={styles.value}>
          <StatusText title={domeInPositionValue ? 'true' : 'false'} status={domeInPositionValue ? 'ok' : 'warning'}>
            {domeInPositionValue ? 'In Position' : 'Not in Position'}
          </StatusText>
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
        <span className={styles.label}>Az</span>
        <span className={styles.value}>
          <CurrentTargetValue currentValue={domeAz.current} targetValue={domeAz.target} isChanging={true} />
        </span>
        {/* Mount */}
        <span className={styles.title}>Mount</span>
        <span className={styles.value}>
          <StatusText title={mountInPositionValue ? 'true' : 'false'} status={mountInPositionValue ? 'ok' : 'warning'}>
            {mountInPositionValue ? 'In Position' : 'Not in Position'}
          </StatusText>
        </span>
        <span className={styles.label}>Tracking</span>
        <span className={styles.value}>
          <StatusText title={mountTrackingStateValue} status={stateToStyleDomeAndMount[mountTrackingStateValue]}>
            {mountTrackingStateValue}
          </StatusText>
        </span>
        <span className={styles.label}>Az</span>
        <span className={styles.value}>
          <CurrentTargetValue
            currentValue={mountAz.current.toFixed(2)}
            targetValue={mountAz.target.toFixed(2)}
            isChanging={true}
          />
        </span>
        <span className={styles.wide}>
          <Limits lowerLimit={-270} upperLimit={270} currentValue={mountAz.current} targetValue={mountAz.target} />
        </span>
        <span className={styles.label}>El</span>
        <span className={styles.value}>
          <CurrentTargetValue
            currentValue={mountEl.current.toFixed(2)}
            targetValue={mountEl.target.toFixed(2)}
            isChanging={true}
          />
        </span>
        <span className={styles.wide}>
          <Limits lowerLimit={15} upperLimit={90} currentValue={mountEl.current} targetValue={mountEl.target} />
        </span>

        <span className={styles.label}>{mountRotator.name}</span>
        <span className={styles.value}>
          <CurrentTargetValue
            currentValue={mountRotator.current.toFixed(2)}
            targetValue={mountRotator.target.toFixed(2)}
            isChanging={true}
          />
        </span>
        <span className={styles.wide}>
          <Limits lowerLimit={-175} upperLimit={175} currentValue={mountRotator.current} targetValue={mountRotator.target} />
        </span>
      </div>
    );
  }
}
