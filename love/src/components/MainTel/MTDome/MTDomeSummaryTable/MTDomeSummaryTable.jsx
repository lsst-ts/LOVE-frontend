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
import {
  mtDomeModeStateMap,
  mtDomeModeStatetoStyle,
  mtDomeAzimuthEnabledStateMap,
  mtDomeAzimuthEnabledStatetoStyle,
  mtdomeElevationEnabledStateToMap,
  mtdomeElevationEnabledStatetoStyle,
  mtdomeMotionStateMap,
  mtdomeMotionStatetoStyle,
} from '../../../../Config';

export default class DomeSummaryTable extends Component {
  static propTypes = {};

  static defaultProps = {};

  render() {
    const modeDomeStatus = mtDomeModeStateMap[this.props.modeDomeStatus];
    const azimuthDomeState = mtDomeAzimuthEnabledStateMap[this.props.azimuthDomeState];
    const azimuthDomeMotion = mtdomeMotionStateMap[this.props.azimuthDomeMotion];
    const elevationDomeState = mtdomeElevationEnabledStateToMap[this.props.elevationDomeState];
    const elevationDomeMotion = mtdomeMotionStateToMap[this.props.elevationDomeMotion];

    // const domeInPositionLabel = domeInPositionValue ? 'IN POSITION' : 'NOT IN POSITION';
    // const mountInPositionLabel = mountInPositionValue ? 'IN POSITION' : 'NOT IN POSITION';
    return (
      <div className={styles.divSummary}>
        <SummaryPanel className={styles.summaryTable}>
          <Title>Track ID</Title>
          <Value>{this.props.trackID ?? 0.0}</Value>
          {/* Dome */}
          <Title>Dome</Title>
          <Value>
            <StatusText>{'undefined'}</StatusText>
          </Value>
          <Label>Mode</Label>
          <Value>
            <StatusText status={mtDomeModeStatetoStyle[modeDomeStatus]}>{modeDomeStatus}</StatusText>
          </Value>
          <Label>Azimuth</Label>
          <Value>
            <StatusText status={mtDomeAzimuthEnabledStatetoStyle[azimuthDomeState]}>{azimuthDomeState}</StatusText>
          </Value>
          <Label>
            <CurrentTargetValue
              currentValue={this.props.positionActualAz}
              targetValue={this.props.azimuthDomeTarget}
              isChanging={true}
            />
          </Label>
          <Value>
            <StatusText status={mtdomeMotionStatetoStyle[azimuthDomeMotion]}>{azimuthDomeMotion}</StatusText>
          </Value>
          <Row
          // title={`Current value: ${50}\nTarget value: ${mountAz.target}\nLimits: [${minAz}º, ${maxAz}º]`}
          >
            <span>
              <Limits
                lowerLimit={50}
                upperLimit={135}
                currentValue={60}
                targetValue={180}
                height={30}
                displayLabels={false}
              />
            </span>
            <span>
              <span>Time to limit: </span>
              <span className={styles.highlight}>{Math.round(165)} min</span>
            </span>
          </Row>
          <Label>Elevation</Label>
          <Value>
            <StatusText status={mtdomeElevationEnabledStatetoStyle[elevationDomeState]}>
              {elevationDomeState}
            </StatusText>
          </Value>
          <Label>
            <CurrentTargetValue
              currentValue={this.props.positionActualLightWindScreen}
              targetValue={this.props.positionCommandedLightWindScreen}
              isChanging={true}
            />
          </Label>
          <Value>
            <StatusText status={mtdomeMotionStatetoStyle[elevationDomeMotion]}>{elevationDomeMotion}</StatusText>
          </Value>
          <Row
          // title={`Current value: ${mountEl.current}\nTarget value: ${mountEl.target}\nLimits: [${minEl}º, ${maxEl}º]`}
          >
            <span>
              <Limits
                lowerLimit={75}
                upperLimit={149}
                currentValue={60}
                targetValue={85}
                height={30}
                displayLabels={false}
              />
            </span>
            <span>
              <span>Time to limit: </span>
              <span className={styles.highlight}>{Math.round(130)} min</span>
            </span>
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
