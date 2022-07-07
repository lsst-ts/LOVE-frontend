import React, { Component } from 'react';
import styles from './MTDomeSummaryTable.module.css';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import CurrentTargetValue from '../../../GeneralPurpose/CurrentTargetValue/CurrentTargetValue';
import PropTypes from 'prop-types';
import Limits from '../../../GeneralPurpose/Limits/Limits';
import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Row from '../../../GeneralPurpose/SummaryPanel/Row';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import ProgressBar from '../../../GeneralPurpose/ProgressBar/ProgressBar';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import {
  mtdomeStatusStatetoStyle,
  mtDomeModeStateMap,
  mtDomeModeStatetoStyle,
  mtDomeAzimuthEnabledStateMap,
  mtDomeAzimuthEnabledStatetoStyle,
  mtdomeElevationEnabledStateToMap,
  mtdomeElevationEnabledStatetoStyle,
  mtdomeMotionStateMap,
  mtdomeMotionStatetoStyle,
  MTMountLimits,
} from '../../../../Config';

export default class MTDomeSummaryTable extends Component {
  render() {
    const trackID = this.props.trackID;
    const domeStatus = CSCDetail.states[this.props.mtdomeSummaryState];
    const modeDomeStatus = mtDomeModeStateMap[this.props.modeDomeStatus];
    const azimuthDomeState = mtDomeAzimuthEnabledStateMap[this.props.azimuthDomeState];
    const azimuthDomeMotion = mtdomeMotionStateMap[this.props.azimuthDomeMotion];
    const elevationDomeState = mtdomeElevationEnabledStateToMap[this.props.elevationDomeState];
    const elevationDomeMotion = mtdomeMotionStateMap[this.props.elevationDomeMotion];

    const domeActualAz = this.props.positionActualDomeAz;
    const domeCommandedAz = this.props.positionCommandedDomeAz;

    const { az: mountActualAz, el: mountActualEl } = this.props.currentPointing;
    const { az: mountCommandedAz, el: mountCommandedEl } = this.props.targetPointing;

    return (
      <div className={styles.divSummary}>
        <SummaryPanel className={styles.summaryTable}>
          <Title>Track ID</Title>
          <Value>{trackID}</Value>
          {/* Dome */}
          <Title>Dome</Title>
          <Value>
            <span className={[domeStatus.class, styles.summaryState].join(' ')}>{domeStatus.name}</span>
          </Value>
          <Label>Mode</Label>
          <Value>
            <StatusText status={mtDomeModeStatetoStyle[modeDomeStatus]}>{modeDomeStatus}</StatusText>
          </Value>
          <Label>Az State</Label>
          <Value>
            <StatusText status={mtDomeAzimuthEnabledStatetoStyle[azimuthDomeState]}>{azimuthDomeState}</StatusText>
          </Value>
          <Label>Az Motion</Label>
          <Value>
            <StatusText status={mtdomeMotionStatetoStyle[azimuthDomeMotion]}>{azimuthDomeMotion}</StatusText>
          </Value>
          <Label>Az</Label>
          <Value>
            <CurrentTargetValue currentValue={domeActualAz} targetValue={domeCommandedAz} isChanging={true} />
          </Value>

          <Title>Mount</Title>
          <Value>
            <span className={[domeStatus.class, styles.summaryState].join(' ')}>{domeStatus.name}</span>
            {/* TODO: insert mount values, same as ATDome */}
          </Value>
          {/* <Value>
            <StatusText status={mtdomeElevationEnabledStatetoStyle[elevationDomeState]}>
              {elevationDomeState}
            </StatusText>
          </Value> */}
          {/* <Value>
            <StatusText status={mtdomeMotionStatetoStyle[elevationDomeMotion]}>{elevationDomeMotion}</StatusText>
          </Value> */}
          <Label>Elevation</Label>
          <Value>
            <CurrentTargetValue currentValue={mountActualEl} targetValue={mountCommandedEl} isChanging={true} />
          </Value>
          <Row>
            <Limits
              lowerLimit={MTMountLimits.elevation.min}
              upperLimit={MTMountLimits.elevation.max}
              currentValue={mountActualEl}
              targetValue={mountCommandedEl}
              height={30}
              displayLabels={false}
              limitWarning={5}
            />
            {/* <span>
              <span>Time to limit: </span>
              <span className={styles.highlight}>{Math.round(130)} min</span>
            </span> */}
          </Row>
          <Label>Azimuth</Label>
          <Value>
            <CurrentTargetValue currentValue={mountActualAz} targetValue={mountCommandedAz} isChanging={true} />
          </Value>
          <Row>
            <Limits
              lowerLimit={MTMountLimits.azimuth.min}
              upperLimit={MTMountLimits.azimuth.max}
              currentValue={mountActualAz}
              targetValue={mountCommandedAz}
              height={30}
              displayLabels={false}
              limitWarning={5}
            />
            {/* <span>
              <span>Time to limit: </span>
              <span className={styles.highlight}>{Math.round(130)} min</span>
            </span> */}
          </Row>
        </SummaryPanel>
        <SummaryPanel className={styles.shutters}>
          <SummaryPanel>
            <Label>Shutters</Label>
          </SummaryPanel>
          <div className={styles.divProgressBars}>
            <ProgressBar
              targetValue={this.props.positionCommandedShutter}
              completed={this.props.positionActualShutter}
            />
            <ProgressBar
              targetValue={this.props.positionCommandedShutter}
              completed={this.props.positionActualShutter}
            />
          </div>
        </SummaryPanel>
      </div>
    );
  }
}
