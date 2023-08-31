import React, { Component } from 'react';
import styles from './DomeSummaryTable.module.css';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import CurrentTargetValue from 'components/GeneralPurpose/CurrentTargetValue/CurrentTargetValue';
import PropTypes from 'prop-types';
import {
  domeAzimuthStateMap,
  dropoutDoorStateMap,
  mainDoorStateMap,
  mountTrackingStateMap,
  stateToStyleDomeAndMount,
} from '../../../../Config';
import Limits from 'components/GeneralPurpose/Limits/Limits';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Row from 'components/GeneralPurpose/SummaryPanel/Row';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import { stateToStyleDome, stateToStyleMount } from '../../../../Config';
import { fixedFloat } from 'Utils';

export default class DomeSummaryTable extends Component {
  static propTypes = {
    currentPointing: PropTypes.object,
    targetPointing: PropTypes.object,
    azimuthPosition: PropTypes.number,
    azimuthCommanded: PropTypes.number,
    azimuthState: PropTypes.number,
    dropoutDoorState: PropTypes.number,
    mainDoorState: PropTypes.number,
    atMountState: PropTypes.number,
    timeAzLim: PropTypes.number,
    timeRotLim: PropTypes.number,
    timeUnobservable: PropTypes.number,
    timeElHighLimit: PropTypes.number,
    maxEl: PropTypes.number,
    maxAz: PropTypes.number,
    maxNas1: PropTypes.number,
    maxNas2: PropTypes.number,
    maxM3: PropTypes.number,
    minEl: PropTypes.number,
    minAz: PropTypes.number,
    minNas1: PropTypes.number,
    minNas2: PropTypes.number,
    minM3: PropTypes.number,
  };

  static defaultProps = {};

  render() {
    const { azimuthPosition, azimuthCommanded } = this.props;
    const { currentPointing, targetPointing } = this.props;

    const domeAz = {
      current: azimuthPosition,
      target: azimuthCommanded,
    };
    const mountAz = {
      current: Math.abs(currentPointing.az),
      target: Math.abs(targetPointing.az),
    };
    const mountEl = {
      current: currentPointing.el,
      target: targetPointing.el,
    };

    const {
      timeAzLim,
      timeRotLim,
      timeUnobservable,
      timeElHighLimit,
      maxEl,
      maxAz,
      maxNas1,
      maxNas2,
      maxM3,
      minEl,
      minAz,
      minNas1,
      minNas2,
      minM3,
    } = this.props;

    const azimuthStateValue = domeAzimuthStateMap[this.props.azimuthState];
    const dropoutDoorStateValue = dropoutDoorStateMap[this.props.dropoutDoorState];
    const mainDoorStateValue = mainDoorStateMap[this.props.mainDoorState];

    const domeInPositionValue = this.props.domeInPosition ?? 0;
    const mountInPositionValue = this.props.mountInPosition ?? 0;
    const mountTrackingStateValue = mountTrackingStateMap[this.props.atMountState] ?? mountTrackingStateMap[0];

    const m3State = this.props.m3State;

    const closestLimit = timeElHighLimit > timeUnobservable && timeElHighLimit > 0 ? 'blind spot' : 'unobservable';
    const timeToElLimit = closestLimit === 'blind spot' ? timeElHighLimit : timeUnobservable;

    const mountRotator =
      m3State === 1
        ? {
            name: '(1)',
            current: Math.abs(currentPointing.nasmyth1),
            target: Math.abs(targetPointing.nasmyth1),
            minRot: minNas1,
            maxRot: maxNas1,
          }
        : {
            name: '(2)',
            current: Math.abs(currentPointing.nasmyth2),
            target: Math.abs(targetPointing.nasmyth2),
            minRot: minNas2,
            maxRot: maxNas2,
          };

    let domeInPositionLabel = 'UNKNOWN';
    if (domeInPositionValue !== 0) domeInPositionLabel = domeInPositionValue ? 'IN POSITION' : 'NOT IN POSITION';
    let mountInPositionLabel = 'UNKNOWN';
    if (mountInPositionValue !== 0) mountInPositionLabel = mountInPositionValue ? 'IN POSITION' : 'NOT IN POSITION';

    return (
      <SummaryPanel className={styles.summaryTable}>
        <Title>Track ID</Title>
        <Value>{this.props.trackID?.toString()}</Value>
        {/* Dome */}
        <Title>Dome</Title>
        <Value>
          <StatusText title={domeInPositionValue} status={stateToStyleDome[domeInPositionLabel]} small>
            {domeInPositionLabel}
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
          <StatusText title={mountInPositionValue} status={stateToStyleMount[mountInPositionLabel]} small>
            {mountInPositionLabel}
          </StatusText>
        </Value>
        <Label>Tracking</Label>
        <Value>
          <StatusText title={mountTrackingStateValue} status={stateToStyleMount[mountTrackingStateValue]} small>
            {mountTrackingStateValue}
          </StatusText>
        </Value>
        <Label>Az</Label>
        <Value>
          <CurrentTargetValue
            currentValue={fixedFloat(mountAz.current, 2)}
            targetValue={fixedFloat(mountAz.target, 2)}
            isChanging={true}
          />
        </Value>

        <Row
          title={`Current value: ${mountAz.current}\nTarget value: ${mountAz.target}\nLimits: [${minAz}º, ${maxAz}º]`}
        >
          <span>
            <Limits
              lowerLimit={0}
              upperLimit={360}
              currentValue={mountAz.current}
              targetValue={mountAz.target}
              height={30}
              displayLabels={false}
            />
          </span>
          <span>
            <span>Time to limit: </span>
            <span className={styles.highlight}>{Math.round(timeAzLim)} min</span>
          </span>
        </Row>
        <Label>El</Label>
        <Value>
          <CurrentTargetValue
            currentValue={fixedFloat(mountEl.current, 2)}
            targetValue={fixedFloat(mountEl.target, 2)}
            isChanging={true}
          />
        </Value>

        <Row
          title={`Current value: ${mountEl.current}\nTarget value: ${mountEl.target}\nLimits: [${minEl}º, ${maxEl}º]`}
        >
          <span>
            <Limits
              lowerLimit={minEl}
              upperLimit={maxEl}
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
            currentValue={fixedFloat(mountRotator.current, 2)}
            targetValue={fixedFloat(mountRotator.target, 2)}
            isChanging={true}
          />
        </Value>
        <Row
          title={`Current value: ${mountRotator.current}\nTarget value: ${mountRotator.target}\nLimits: [${mountRotator.minRot}º, ${mountRotator.maxRot}º]`}
        >
          <span>
            <Limits
              lowerLimit={mountRotator.minRot}
              upperLimit={mountRotator.maxRot}
              currentValue={mountRotator.current}
              targetValue={mountRotator.target}
              height={30}
              displayLabels={false}
            />
          </span>
          <span>
            <span>Time to limit: </span>
            <span className={styles.highlight}>{Math.round(timeRotLim)} min</span>
          </span>
        </Row>
      </SummaryPanel>
    );
  }
}
