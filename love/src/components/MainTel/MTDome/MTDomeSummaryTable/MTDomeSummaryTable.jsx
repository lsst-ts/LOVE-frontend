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
  summaryStateMap,
  mtdomeStatusStatetoStyle,
  summaryStateToStyle,
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
  static propTypes = {
    /** Unique target identifier. Echoed from the trackTarget command */
    trackId: PropTypes.number,
    /** High level state machine state identifier */
    mtDomeSummaryState: PropTypes.number,
    /** High level state machine state identifier */
    mtMountSummaryState: PropTypes.number,
    /** Enabled state; an EnabledState enum */
    azimuthDomeState: PropTypes.number,
    /** The motion state; a MotionState enum */
    azimuthDomeMotion: PropTypes.number,
    /** Target position; nan for the crawlAz command */
    azimuthDomeTarget: PropTypes.number,
    /** Enabled state; an EnabledState enum */
    elevationDomeState: PropTypes.number,
    /** The motion state; a MotionState enum */
    elevationDomeMotion: PropTypes.number,
    /** Target position; nan for the crawlEl command */
    elevationDomeTarget: PropTypes.number,
    /** Operational mode; an OperationalMode enum */
    modeDomeStatus: PropTypes.number,
    /** Position measured by the encoders */
    currentPointingAz: PropTypes.number,
    /** Position computed by the path generator */
    targetPointingAz: PropTypes.number,
    /** Position measured by the encoders */
    currentPointingEl: PropTypes.number,
    /** Position computed by the path generator */
    targetPointingEl: PropTypes.number,
  };

  static defaultProps = {
    trackId: 0,
    mtDomeSummaryState: 0,
    mtMountSummaryState: 0,
    azimuthDomeState: 0,
    azimuthDomeMotion: 0,
    azimuthDomeTarget: 0,
    elevationDomeState: 0,
    elevationDomeMotion: 0,
    elevationDomeTarget: 0,
    modeDomeStatus: 0,
    currentPointingAz: 0,
    targetPointingAz: 0,
    currentPointingEl: 0,
    targetPointingEl: 0,
  };

  render() {
    const trackID = this.props.trackID;
    // const domeStatus = CSCDetail.states[this.props.mtdomeSummaryState];
    const mtDomeStatus = summaryStateMap[this.props.mtDomeSummaryState];
    const modeDomeStatus = mtDomeModeStateMap[this.props.modeDomeStatus];
    const azimuthDomeState = mtDomeAzimuthEnabledStateMap[this.props.azimuthDomeState];
    const azimuthDomeMotion = mtdomeMotionStateMap[this.props.azimuthDomeMotion];
    const elevationDomeState = mtdomeElevationEnabledStateToMap[this.props.elevationDomeState];
    const elevationDomeMotion = mtdomeMotionStateMap[this.props.elevationDomeMotion];
    const mtMountStatus = summaryStateMap[this.props.mtMountSummaryState];

    const domeActualAz = this.props.positionActualDomeAz;
    const domeCommandedAz = this.props.positionCommandedDomeAz;

    const { az: mountActualAz, el: mountActualEl } = this.props.currentPointing;
    const { az: mountCommandedAz, el: mountCommandedEl } = this.props.targetPointing;

    return (
      <div className={styles.divSummary}>
        <SummaryPanel className={styles.summaryTable}>
          <Title>Track ID</Title>
          <Value>{trackID?.toString()}</Value>
          <Title>Dome</Title>
          <Value>
            <StatusText status={mtdomeStatusStatetoStyle[mtDomeStatus]}>{mtDomeStatus}</StatusText>
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
            <StatusText status={summaryStateToStyle[mtMountStatus]}>{mtMountStatus}</StatusText>
          </Value>
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
