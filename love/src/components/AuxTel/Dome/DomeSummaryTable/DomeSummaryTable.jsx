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
import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Row from '../../../GeneralPurpose/SummaryPanel/Row';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';

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
            name: '(1)',
            current: this.props.currentPointing.nasmyth1,
            target: this.props.targetPointing.nasmyth1,
          }
        : {
            name: '(2)',
            current: this.props.currentPointing.nasmyth2,
            target: this.props.targetPointing.nasmyth2,
          };
    const timesToLimit = this.props.currentTimesToLimits;
    const timeToAzLimit = timesToLimit.timeToAzlim ? timesToLimit.timeToAzlim.value : 0;
    const timeToRotLimit = timesToLimit.timeToRotlim ? timesToLimit.timeToRotlim.value : 0;
    const timeToUnobservable = timesToLimit.timeToUnobservable ? timesToLimit.timeToUnobservable.value : 0;
    const timeToBlindSpot = timesToLimit.timeToBlindSpot ? timesToLimit.timeToBlindSpot.value : 0;
    const closestLimit = timeToBlindSpot > timeToUnobservable && timeToBlindSpot > 0 ? 'blind spot' : 'unobservable';
    const timeToElLimit = closestLimit === 'blind spot' ? timeToBlindSpot : timeToUnobservable;

    return (
      <SummaryPanel className={styles.summaryTable}>
        <Title>Track ID</Title>
        <Value>{this.props.trackID}</Value>
        {/* Dome */}
        <Title>Dome</Title>
        <Value>
          <StatusText
            title={domeInPositionValue ? 'true' : 'false'}
            status={domeInPositionValue ? 'ok' : 'warning'}
            small
          >
            {domeInPositionValue ? 'In Position' : 'Not in Position'}
          </StatusText>
        </Value>

        <Label>Azimuth</Label>
        <Value>
          <StatusText title={azimuthStateValue} status={stateToStyleDomeAndMount[azimuthStateValue]} small>
            {azimuthStateValue}
          </StatusText>
        </Value>
        <Label>Dropout door</Label>
        <Value>
          <StatusText title={dropoutDoorStateValue} status={stateToStyleDomeAndMount[dropoutDoorStateValue]} small>
            {dropoutDoorStateValue}
          </StatusText>
        </Value>
        <Label>Main door</Label>
        <Value>
          <StatusText title={mainDoorStateValue} status={stateToStyleDomeAndMount[mainDoorStateValue]} small>
            {mainDoorStateValue}
          </StatusText>
        </Value>
        <Label>Az</Label>
        <Value>
          <CurrentTargetValue currentValue={domeAz.current} targetValue={domeAz.target} isChanging={true} />
        </Value>
        {/* <span className={[styles.subRow, styles.wide].join(' ')} title={`Time to limit: ${2} min`}>
          <span>
            <Limits
              lowerLimit={0}
              upperLimit={360}
              currentValue={domeAz.current}
              targetValue={domeAz.target}
              height={30}
              displayLabels={false}
            />
          </span>
          <span>
            <span>Time to limit: </span>
            <span className={styles.highlight}>2 min</span>
          </span>
        </span> */}
        {/* Mount */}
        <Title>Mount</Title>
        <Value>
          <StatusText
            title={mountInPositionValue ? 'true' : 'false'}
            status={mountInPositionValue ? 'ok' : 'warning'}
            small
          >
            {mountInPositionValue ? 'In Position' : 'Not in Position'}
          </StatusText>
        </Value>
        <Label>Tracking</Label>
        <Value>
          <StatusText title={mountTrackingStateValue} status={stateToStyleDomeAndMount[mountTrackingStateValue]} small>
            {mountTrackingStateValue}
          </StatusText>
        </Value>
        <Label>Az</Label>
        <Value>
          <CurrentTargetValue
            currentValue={mountAz.current.toFixed(2)}
            targetValue={mountAz.target.toFixed(2)}
            isChanging={true}
          />
        </Value>

        <Row title={`Current value: ${mountAz.current}\nTarget value: ${mountAz.target}\nLimits: [-270º, 270º]`}>
          <span>
            <Limits
              lowerLimit={-270}
              upperLimit={270}
              currentValue={mountAz.current}
              targetValue={mountAz.target}
              height={30}
              displayLabels={false}
            />
          </span>
          <span>
            <span>Time to limit: </span>
            <span className={styles.highlight}>{Math.round(timeToAzLimit)} min</span>
          </span>
        </Row>
        <Label>El</Label>
        <Value>
          <CurrentTargetValue
            currentValue={mountEl.current.toFixed(2)}
            targetValue={mountEl.target.toFixed(2)}
            isChanging={true}
          />
        </Value>

        <Row title={`Current value: ${mountEl.current}\nTarget value: ${mountEl.target}\nLimits: [15º, 90º]`}>
          <span>
            <Limits
              lowerLimit={15}
              upperLimit={90}
              currentValue={mountEl.current}
              targetValue={mountEl.target}
              height={30}
              displayLabels={false}
            />
          </span>
          <span>
            <span>{`Time to ${closestLimit}: `}</span>
            <span className={styles.highlight}>{Math.round(timeToElLimit)} min</span>
          </span>
        </Row>
        <Label>
          Nasmyth <span className={styles.highlight}>{mountRotator.name}</span>
        </Label>
        <Value>
          <CurrentTargetValue
            currentValue={mountRotator.current.toFixed(2)}
            targetValue={mountRotator.target.toFixed(2)}
            isChanging={true}
          />
        </Value>
        <Row
          title={`Current value: ${mountRotator.current}\nTarget value: ${mountRotator.target}\nLimits: [-175º, 175º]`}
        >
          <span>
            <Limits
              lowerLimit={-175}
              upperLimit={175}
              currentValue={mountRotator.current}
              targetValue={mountRotator.target}
              height={30}
              displayLabels={false}
            />
          </span>
          <span>
            <span>Time to limit: </span>
            <span className={styles.highlight}>{Math.round(timeToRotLimit)} min</span>
          </span>
        </Row>
      </SummaryPanel>
    );
  }
}
