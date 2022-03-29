import React, { Component } from 'react';
import styles from './MTDomeSummaryTable.module.css';
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
import { stateToStyleDome, stateToStyleMount } from '../../../../Config';
import ProgressBar from '../../../GeneralPurpose/ProgressBar/ProgressBar';

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
    // Replace them for the correct MTDome subscriptions. This was added for first testing purposes only.
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

    // Replace them for the correct MTDome subscriptions. This was added for first testing purposes only.
    const azimuthStateValue = domeAzimuthStateMap[this.props.azimuthState];
    const dropoutDoorStateValue = dropoutDoorStateMap[this.props.dropoutDoorState];
    const mainDoorStateValue = mainDoorStateMap[this.props.mainDoorState];
    const domeInPositionValue = this.props.domeInPosition ? this.props.domeInPosition[0].inPosition.value : 0;
    const mountInPositionValue = this.props.mountInPosition ? this.props.mountInPosition[0].inPosition.value : 0;
    const mountTrackingStateValue = mountTrackingStateMap[this.props.mountTrackingState];
    const m3State = this.props.m3State;
    const { positionLimits } = this.props;
    const timesToLimit = this.props.currentTimesToLimits;
    const timeToAzLimit = timesToLimit.timeToAzlim ? timesToLimit.timeToAzlim.value : 0;
    const timeToRotLimit = timesToLimit.timeToRotlim ? timesToLimit.timeToRotlim.value : 0;
    const timeToUnobservable = timesToLimit.timeToUnobservable ? timesToLimit.timeToUnobservable.value : 0;
    const timeToBlindSpot = timesToLimit.timeToBlindSpot ? timesToLimit.timeToBlindSpot.value : 0;
    const closestLimit = timeToBlindSpot > timeToUnobservable && timeToBlindSpot > 0 ? 'blind spot' : 'unobservable';
    const timeToElLimit = closestLimit === 'blind spot' ? timeToBlindSpot : timeToUnobservable;

    const { maximum, minimum } = positionLimits;
    let [maxEl, maxAz, maxNas1, maxNas2, maxM3] = maximum ? maximum.value : [];
    let [minEl, minAz, minNas1, minNas2, minM3] = minimum ? minimum.value : [];
    [maxEl, maxAz, maxNas1, maxNas2, maxM3] = [
      maxEl ? maxEl : 90,
      maxAz ? maxAz : 270,
      maxNas1 ? maxNas1 : 165,
      maxNas2 ? maxNas2 : 165,
      maxM3 ? maxM3 : 180,
    ];
    [minEl, minAz, minNas1, minNas2, minM3] = [
      minEl ? minEl : 5,
      minAz ? minAz : -270,
      minNas1 ? minNas1 : -165,
      minNas2 ? minNas2 : -165,
      minM3 ? minM3 : 0,
    ];
    const mountRotator =
      m3State === 1
        ? {
            name: '(1)',
            current: this.props.currentPointing.nasmyth1,
            target: this.props.targetPointing.nasmyth1,
            minRot: minNas1,
            maxRot: maxNas1,
          }
        : {
            name: '(2)',
            current: this.props.currentPointing.nasmyth2,
            target: this.props.targetPointing.nasmyth2,
            minRot: minNas2,
            maxRot: maxNas2,
          };
    const domeInPositionLabel = domeInPositionValue ? 'IN POSITION' : 'NOT IN POSITION';
    const mountInPositionLabel = mountInPositionValue ? 'IN POSITION' : 'NOT IN POSITION';
    return (
      <div className={styles.divSummary}>
        <SummaryPanel className={styles.summaryTable}>
          <Title>Track ID</Title>
          <Value>{this.props.trackID}</Value>
          {/* Dome */}
          <Title>Dome</Title>
          <Value>
            <StatusText
              title={domeInPositionValue ? 'true' : 'false'}
              status={stateToStyleDome[domeInPositionLabel]}
              medium
            >
              {domeInPositionLabel}
            </StatusText>
          </Value>
          <Label>Mode</Label>
          <Value>
            <StatusText title={azimuthStateValue} status={stateToStyleDomeAndMount[azimuthStateValue]} medium>
              {azimuthStateValue}
            </StatusText>
          </Value>
          <Label>Azimuth</Label>
          <Value>
            <StatusText title={azimuthStateValue} status={stateToStyleDomeAndMount[azimuthStateValue]} medium>
              {azimuthStateValue}
            </StatusText>
          </Value>
          <Label>
            <CurrentTargetValue
              currentValue={mountAz.current.toFixed(2)}
              targetValue={mountAz.target.toFixed(2)}
              isChanging={true}
            />
          </Label>
          <Value>
            <StatusText title={azimuthStateValue} status={stateToStyleDomeAndMount[azimuthStateValue]} medium>
              {azimuthStateValue}
            </StatusText>
          </Value>
          <Row
            title={`Current value: ${mountAz.current}\nTarget value: ${mountAz.target}\nLimits: [${minAz}º, ${maxAz}º]`}
          >
            <span>
              <Limits
                lowerLimit={minAz}
                upperLimit={maxAz}
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
          <Label>Elevation</Label>
          {/* to do: add elevation state value */}
          <Value>
            <StatusText title={azimuthStateValue} status={stateToStyleDomeAndMount[azimuthStateValue]} medium>
              {azimuthStateValue}
            </StatusText>
          </Value>
          <Label>
            <CurrentTargetValue
              currentValue={mountEl.current.toFixed(2)}
              targetValue={mountEl.target.toFixed(2)}
              isChanging={true}
            />
          </Label>
          <Value>
            <StatusText title={azimuthStateValue} status={stateToStyleDomeAndMount[azimuthStateValue]} medium>
              {azimuthStateValue}
            </StatusText>
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
              <span>Time to limit: </span>
              <span className={styles.highlight}>{Math.round(timeToElLimit)} min</span>
            </span>
          </Row>
        </SummaryPanel>
        {/* completed value from subscriptions */}
        <SummaryPanel className={styles.shutters}>
          <SummaryPanel>
            <Label>Shutters</Label>
          </SummaryPanel>
          <div className={styles.divProgressBars}>
            <ProgressBar bgcolor={'var(--second-quaternary-background-color)'} completed={25} />
            <ProgressBar bgcolor={'var(--second-quaternary-background-color)'} completed={25} />
          </div>
          {/* </div> */}
        </SummaryPanel>
      </div>
    );
  }
}
