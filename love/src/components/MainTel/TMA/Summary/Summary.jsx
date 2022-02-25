import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Summary.module.css';
import { stateToStyleMTMountCommander,
  mtMountCommanderStateMap,
  mtMountPowerStateMap,
  mtMountAxisMotionStateMap,
  stateToStyleMTMountAxisMotionState,
  stateToStyleMTMountPowerState,
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
      trackID: PropTypes.string,
      commander: PropTypes.number,
      connected: PropTypes.bool,
      balancing: PropTypes.number,
      azimuthSystem: PropTypes.number,
      azimuthMotion: PropTypes.number,
      azimuthLimits: PropTypes.number,
      azimuthActualPosition: PropTypes.number,
      azimuthDemandPosition: PropTypes.number,
      elevationSystem: PropTypes.number,
      elevationMotion: PropTypes.number,
      elevationLimits: PropTypes.number,
      elevationActualPosition: PropTypes.number,
      elevationDemandPosition: PropTypes.number,
    };
    
    static defaultProps = {
      trackID: '',
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
        const trackID = this.props.trackID ? this.props.trackID : '' ;
        const commanderValue = this.props.commander ? mtMountCommanderStateMap[this.props.commander] : mtMountCommanderStateMap[0];
        const connected = this.props.connected ? true : false;
        const balancingValue = this.props.balancing ? mtMountPowerStateMap[this.props.balancing] : mtMountPowerStateMap[0];

        const azimuthSystemValue = this.props.azimuthSystem ? mtMountPowerStateMap[this.props.azimuthSystem] : mtMountPowerStateMap[0];
        const azimuthMotionValue = this.props.azimuthMotion ? mtMountAxisMotionStateMap[this.props.azimuthMotion] : mtMountAxisMotionStateMap[0];
        const azimuthActualPosition = this.props.azimuthActualPosition ? this.props.azimuthActualPosition : 0;
        const azimuthDemandPosition = this.props.azimuthDemandPosition ? this.props.azimuthDemandPosition : 0;
        const azimuthLimits = this.azimuthLimits ? this.azimuthLimits : 0;

        // AzimuthLimit
        const minAzimuthPosition = 0;
        const maxAzimuthPosition = 360;
        const timeToAzimuthLimit = 0;
        // const closestAzimuthLimit = 90;

        const elevationSystemValue = this.props.elevationSystem ? mtMountPowerStateMap[this.props.elevationSystem] : mtMountPowerStateMap[0];
        const elevationMotionValue = this.props.elevationMotion ? mtMountAxisMotionStateMap[this.props.elevationMotion] : mtMountAxisMotionStateMap[0];
        const elevationActualPosition = this.props.elevationActualPosition ? this.props.elevationActualPosition : 0;
        const elevationDemandPosition = this.props.elevationDemandPosition ? this.props.elevationDemandPosition : 0;
        const elevationLimits = this.elevationLimits ? this.elevationLimits : 0;

        // ElevationLimit
        const minElevationPosition = -60;
        const maxElevationPosition = 60;
        const timeToElevationLimit = 0;
        // const closestElevationLimit = 90;

        return (
            <div className={styles.container}>
                <SummaryPanel>
                    <Title>Track ID</Title>
                    <Value>{trackID}</Value>
                    <Label>Commander</Label>
                    <Value>
                        <StatusText
                            title={commanderValue}
                            status={stateToStyleMTMountCommander[commanderValue]}
                            small
                        >
                            {commanderValue}
                        </StatusText>
                    </Value>
                    <Label>Connected</Label>
                    <Value>
                        <StatusText
                            title={connected ? 'CONNECTED' : 'DISABLED'}
                            status={connected ? 'ok' : 'invalid'}
                            small
                        >
                            {connected ? 'CONNECTED' : 'DISABLED'}
                        </StatusText>
                    </Value>
                    <Label>Balancing</Label>
                    <Value>
                        <StatusText
                            title={balancingValue}
                            status={stateToStyleMTMountPowerState[balancingValue]}
                            small
                        >
                            {balancingValue}
                        </StatusText>
                    </Value>
                </SummaryPanel>

                <SummaryPanel className={[styles.summaryPanel, styles.pt].join(' ')}>
                    <Label>Azimuth</Label>
                    <Value>
                        <StatusText
                            title={azimuthSystemValue}
                            status={stateToStyleMTMountPowerState[azimuthSystemValue]}
                            small
                        >
                            {azimuthSystemValue}
                        </StatusText>
                    </Value>
                    <Label>
                        <CurrentTargetValue
                            currentValue={azimuthActualPosition?.toFixed(2)}
                            targetValue={azimuthDemandPosition?.toFixed(2)}
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
                        <StatusText
                            title={elevationSystemValue}
                            status={stateToStyleMTMountPowerState[elevationSystemValue]}
                            small
                        >
                            {elevationSystemValue}
                        </StatusText>
                    </Value>
                    <Label>
                        <CurrentTargetValue
                            currentValue={elevationActualPosition?.toFixed(2)}
                            targetValue={elevationDemandPosition?.toFixed(2)}
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