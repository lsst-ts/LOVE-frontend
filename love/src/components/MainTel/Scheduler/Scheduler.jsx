import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Scheduler.module.css';
import Headers from './Headers/Headers';
import Filters from './Filters/Filters';
import Pointing from './Summary/Pointing/Pointing';
import Simonyi from './Summary/Simonyi/Simonyi';
import Moon from './Summary/Moon/Moon';
import Sun from './Summary/Sun/Sun';
import CurrentTarget from './CurrentTarget/CurrentTarget';
import SkyMap from './SkyMap/SkyMap';
import Plots from './Plots/Plots';
import AccordionSummary from './AccordionSummary/AccordionSummary';

export default class Scheduler extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** MT azimuth actual position telemetry */
    azimuthActualPosition: PropTypes.number,
    /** MT elevation actual position telemetry*/
    elevationActualPosition: PropTypes.number,
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.props.subscribeToStream();
    this.skyMap = <SkyMap></SkyMap>;
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  render() {
    const {  
      subState,
      mode,
      type,
      isNigth,
      night,
      sunset,
      sunrise,
      needSwap,
      filterToMount,
      filterToUnmount,
      pointingRa,
      pointingDecl,
      pointingPosAngle,
      pointingParallAngle,
      simonyiTracking,
      simonyiAl,
      simonyiAz,
      simonyiRot,
      moonRa,
      moonDec,
      moonAlt,
      moonAz,
      moonDistance,
      moonPhase,
      sunRa,
      sunDec,
      sunAlt,
      sunAz,
      solarElong,
      currentTargetId,
      currentRequestTime,
      currentRequestMjd,
      currentRa,
      currentDecl,
      currentSkyAngle,
      currentFilter,
      currentNumExposures,
      currentExposureTimes,
      currentSlewTime,
      currentOffsetX,
      currentOffsetY,
      currentNumProposals,
      currentProposalId,
      currentSequenceDuration,
      rotSkyPos,
      predictedTargetsRa,
      predictedTargetsDecl,
      predictedTargetsRotSkyPos,
      lastTargetId,
      lastTargetRa,
      lastTargetDecl,
      lastTargetRotSkyPos,
      lastTargetMjd,
      lastTargetExpTime,
      lastTargetFilter,
      lastTargetNexp,
      lastTargetMoreInfo,
      nextTargetCurrentTime,
      nextTimeWaitTime,
      nextTargetRa,
      nextTargetDecl,
      nextTargetRotSkyPos,
      predTargetsNumTargets,
      predTargetsRa,
      predTargetsDecl,
      predTargetsRotSkyPos,
      predTargetsMjd,
      predTargetsExpTime,
      predTargetsInstrConfig,
      predTargetsNexp,
      surveysNumGenProps,
      surveysGenProps,
      surveysNumSeqProps,
      surveysSeqProps,
      blockInvId,
      blockInvStatus,
      blockId,
      blockStatusId,
      blockStatus,
      blockExecCompl,
      blockExecTotal,
      blockHash,
      blockDef } = this.props;
    return (
      <div className={styles.container}>
        <Headers subState={subState} mode={mode} type={type} moonPhase={moonPhase} isNigth={isNigth} night={night} sunset={sunset} sunrise={sunrise} />
        <div className={styles.allComponentes}>
          {/* column 1 */}
          <div className={styles.leftDiv}>
            <Filters needSwap={needSwap} filterToMount={filterToMount} filterToUnmount={filterToUnmount} />
            <Pointing pointingRa={pointingRa} pointingDecl={pointingDecl} pointingPosAngle={pointingPosAngle} pointingParallAngle={pointingParallAngle} />
            <Simonyi simonyiTracking={simonyiTracking} simonyiAl={simonyiAl} simonyiAz={simonyiAz} simonyiRot={simonyiRot} />
            <Moon moonRa={moonRa} moonDec={moonDec} moonAlt={moonAlt} moonAz={moonAz} moonDistance={moonDistance} moonPhase={moonPhase} />
            <Sun sunRa={sunRa} sunDec={sunDec} sunset={sunset} sunrise={sunrise} sunAlt={sunAlt} sunAz={sunAz} solarElong={solarElong} />
          </div>
          {/* column 2 */}
          <div className={styles.middleDiv}>
            <CurrentTarget 
              currentTargetId={currentTargetId}
              currentRequestTime={currentRequestTime}
              currentRequestMjd={currentRequestMjd}
              currentRa={currentRa}
              currentDecl={currentDecl}
              currentSkyAngle={currentSkyAngle}
              currentFilter={currentFilter}
              currentNumExposures={currentNumExposures}
              currentExposureTimes={currentExposureTimes}
              currentSlewTime={currentSlewTime}
              currentOffsetX={currentOffsetX}
              currentOffsetY={currentOffsetY}
              currentNumProposals={currentNumProposals}
              currentProposalId={currentProposalId}
              currentSequenceDuration={currentSequenceDuration}
              rotSkyPos={rotSkyPos}
              filterToMount={filterToMount}
            />
            {this.skyMap ?? ''}
            <Plots />
          </div>
          {/* column 3 */}
          <div className={styles.rigthDiv}>
            <AccordionSummary />
          </div>
        </div>
      </div>
    );
  }
}
