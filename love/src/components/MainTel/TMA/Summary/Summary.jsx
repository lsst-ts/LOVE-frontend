import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Summary.module.css';
import {
  stateToStyleMTMountCommander,
  mtMountCommanderStateMap,
  mtMountConnectedStateMap,
  mtMountPowerStateMap,
  mtMountAxisMotionStateMap,
  stateToStyleMTMountConnected,
  stateToStyleMTMountAxisMotionState,
  stateToStyleMTMountPowerState,
  MTMountLimits,
} from '../../../../Config';

import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import CurrentTargetValue from '../../../GeneralPurpose/CurrentTargetValue/CurrentTargetValue';
import Row from '../../../GeneralPurpose/SummaryPanel/Row';
import Limits from '../../../GeneralPurpose/Limits/Limits';

export default class Summary extends Component {
  static propTypes = {
    /** Unique target identifier. Echoed from the trackTarget command */
    trackId: PropTypes.number,
    /** Who controls the low-level controller; a Commander enum. */
    commander: PropTypes.number,
    /** Is the command (client) socket connected */
    connected: PropTypes.bool,
    /** State of the balance system. Overall power state of the balancing system; a PowerState enum */
    balancing: PropTypes.number,
    /** State of the azimuth axis. Power state of each motion controller; a PowerState enum. */
    azimuthSystem: PropTypes.number,
    /** Azimuth Motion state, as an AxisMotionState enum. */
    azimuthMotion: PropTypes.number,
    /** Azimuth Limits, as a LimitsMask enum mask. */
    azimuthLimits: PropTypes.number,
    /** Azimuth Position measured by the encoders */
    azimuthActualPosition: PropTypes.number,
    /** Azimuth Position computed by the path generator. */
    azimuthDemandPosition: PropTypes.number,
    /** State of the elevation system. Power state; a PowerState enum */
    elevationSystem: PropTypes.number,
    /** Motion state of the elevation axis */
    elevationMotion: PropTypes.number,
    /** Elevation Limits, as a LimitsMask enum mask */
    elevationLimits: PropTypes.number,
    /** Elevation Position measured by the encoders */
    elevationActualPosition: PropTypes.number,
    /** Elevation Position computed by the path generator */
    elevationDemandPosition: PropTypes.number,
  };

  static defaultProps = {
    trackId: 0,
    commander: 0,
    connected: false,
    balancing: 0,
    azimuthSystem: 0,
    azimuthMotion: 0,
    azimuthLimits: 0,
    azimuthActualPosition: 0,
    azimuthDemandPosition: 0,
    elevationSystem: 0,
    elevationMotion: 0,
    elevationLimits: 0,
    elevationActualPosition: 0,
    elevationDemandPosition: 0,
  };

  render() {
    const {
      trackId,
      azimuthActualPosition,
      azimuthDemandPosition,
      elevationActualPosition,
      elevationDemandPosition,
    } = this.props;

    const commanderValue = mtMountCommanderStateMap[this.props.commander];
    const connectedValue = mtMountConnectedStateMap[this.props.connected];
    const balancingValue = mtMountPowerStateMap[this.props.balancing];
    const azimuthSystemValue = mtMountPowerStateMap[this.props.azimuthSystem];
    const azimuthMotionValue = mtMountAxisMotionStateMap[this.props.azimuthMotion];
    const elevationSystemValue = mtMountPowerStateMap[this.props.elevationSystem];
    const elevationMotionValue = mtMountAxisMotionStateMap[this.props.elevationMotion];

    // AzimuthLimit
    const { min: minAzimuthPosition, max: maxAzimuthPosition } = MTMountLimits.azimuth;
    const timeToAzimuthLimit = 0;

    // ElevationLimit
    const { min: minElevationPosition, max: maxElevationPosition } = MTMountLimits.elevation;
    const timeToElevationLimit = 0;

    return (
      <div className={styles.container}>
        <SummaryPanel>
          <Title>Track ID</Title>
          <Value>{trackId}</Value>
          <Label>Commander</Label>
          <Value>
            <StatusText title={commanderValue} status={stateToStyleMTMountCommander[commanderValue]} small>
              {commanderValue}
            </StatusText>
          </Value>
          <Label>Connected</Label>
          <Value>
            <StatusText title={connectedValue} status={stateToStyleMTMountConnected[connectedValue]} small>
              {connectedValue}
            </StatusText>
          </Value>
          <Label>Balancing</Label>
          <Value>
            <StatusText title={balancingValue} status={stateToStyleMTMountPowerState[balancingValue]} small>
              {balancingValue}
            </StatusText>
          </Value>
        </SummaryPanel>

        <SummaryPanel className={[styles.summaryPanel, styles.pt].join(' ')}>
          <Label>Azimuth</Label>
          <Value>
            <StatusText title={azimuthSystemValue} status={stateToStyleMTMountPowerState[azimuthSystemValue]} small>
              {azimuthSystemValue}
            </StatusText>
          </Value>
          <Label>
            <CurrentTargetValue
              currentValue={azimuthActualPosition}
              targetValue={azimuthDemandPosition}
              isChanging={true}
            />
          </Label>
          <Value>
            <StatusText
              title={azimuthMotionValue}
              status={stateToStyleMTMountAxisMotionState[azimuthMotionValue]}
              small
            >
              {azimuthMotionValue}
            </StatusText>
          </Value>
          <Row
            title={`Current value: ${azimuthActualPosition}\nTarget value: ${azimuthDemandPosition}\nLimits: [${minAzimuthPosition}º, ${maxAzimuthPosition}º]`}
          >
            <span>
              <Limits
                lowerLimit={minAzimuthPosition}
                upperLimit={maxAzimuthPosition}
                currentValue={azimuthActualPosition}
                targetValue={azimuthDemandPosition}
                height={30}
                displayLabels={false}
              />
            </span>
            <span>
              <span>{`Time to limit: `}</span>
              <span className={styles.highlight}>{Math.round(timeToAzimuthLimit)} min</span>
            </span>
          </Row>
        </SummaryPanel>

        <SummaryPanel className={[styles.summaryPanel, styles.pt].join(' ')}>
          <Label>Elevation</Label>
          <Value>
            <StatusText title={elevationSystemValue} status={stateToStyleMTMountPowerState[elevationSystemValue]} small>
              {elevationSystemValue}
            </StatusText>
          </Value>
          <Label>
            <CurrentTargetValue
              currentValue={elevationActualPosition}
              targetValue={elevationDemandPosition}
              isChanging={true}
            />
          </Label>
          <Value>
            <StatusText
              title={elevationMotionValue}
              status={stateToStyleMTMountAxisMotionState[elevationMotionValue]}
              small
            >
              {elevationMotionValue}
            </StatusText>
          </Value>
          <Row
            title={`Current value: ${elevationActualPosition}\nTarget value: ${elevationDemandPosition}\nLimits: [${minElevationPosition}º, ${maxElevationPosition}º]`}
          >
            <span>
              <Limits
                lowerLimit={minElevationPosition}
                upperLimit={maxElevationPosition}
                currentValue={elevationActualPosition}
                targetValue={elevationDemandPosition}
                height={30}
                displayLabels={false}
              />
            </span>
            <span>
              <span>{`Time to limit: `}</span>
              <span className={styles.highlight}>{Math.round(timeToElevationLimit)} min</span>
            </span>
          </Row>
        </SummaryPanel>
      </div>
    );
  }
}
