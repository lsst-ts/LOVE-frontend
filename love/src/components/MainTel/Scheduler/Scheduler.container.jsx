import React from 'react';
import { connect } from 'react-redux';
import Scheduler from './Scheduler';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import {
  getDetailedState,
  getObservingMode,
  getGeneralInfo,
  getFilterSwap,
  getObservatoryStatus,
  getCurrentTargetInfo,
  getSkyMapInfo,
  lastTargetInfo,
  nextTargetInfo,
  predictedTargetsInfo,
  getSurveysInfo,
  getBlocksInfo,
} from '../../../redux/selectors';

export const schema = {
  description: 'Summary view of the Scheduler. Contains general information about the scheduler state',
  defaultSize: [51, 45],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Scheduler',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of Scheduler. 1 for ATScheduler and 2 for Simonyi Scheduler',
      isPrivate: false,
      default: 1,
    },
  },
};

const SchedulerContainer = ({
  subscribeToStream,
  unsubscribeToStream,
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
  blockDef,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <Scheduler
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      subState={subState}
      mode={mode}
      type={type}
      isNigth={isNigth}
      night={night}
      sunset={sunset}
      sunrise={sunrise}
      needSwap={needSwap}
      filterToMount={filterToMount}
      filterToUnmount={filterToUnmount}
      pointingRa={pointingRa}
      pointingDecl={pointingDecl}
      pointingPosAngle={pointingPosAngle}
      pointingParallAngle={pointingParallAngle}
      simonyiTracking={simonyiTracking}
      simonyiAl={simonyiAl}
      simonyiAz={simonyiAz}
      simonyiRot={simonyiRot}
      moonRa={moonRa}
      moonDec={moonDec}
      moonAlt={moonAlt}
      moonAz={moonAz}
      moonDistance={moonDistance}
      moonPhase={moonPhase}
      sunRa={sunRa}
      sunDec={sunDec}
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
      predictedTargetsRa={predictedTargetsRa}
      predictedTargetsDecl={predictedTargetsDecl}
      predictedTargetsRotSkyPos={predictedTargetsRotSkyPos}
      lastTargetId={lastTargetId}
      lastTargetRa={lastTargetRa}
      lastTargetDecl={lastTargetDecl}
      lastTargetRotSkyPos={lastTargetRotSkyPos}
      lastTargetMjd={lastTargetMjd}
      lastTargetExpTime={lastTargetExpTime}
      lastTargetFilter={lastTargetFilter}
      lastTargetNexp={lastTargetNexp}
      lastTargetMoreInfo={lastTargetMoreInfo}
      nextTargetCurrentTime={nextTargetCurrentTime}
      nextTimeWaitTime={nextTimeWaitTime}
      nextTargetRa={nextTargetRa}
      nextTargetDecl={nextTargetDecl}
      nextTargetRotSkyPos={nextTargetRotSkyPos}
      predTargetsNumTargets={predTargetsNumTargets}
      predTargetsRa={predTargetsRa}
      predTargetsDecl={predTargetsDecl}
      predTargetsRotSkyPos={predTargetsRotSkyPos}
      predTargetsMjd={predTargetsMjd}
      predTargetsExpTime={predTargetsExpTime}
      predTargetsInstrConfig={predTargetsInstrConfig}
      predTargetsNexp={predTargetsNexp}
      surveysNumGenProps={surveysNumGenProps}
      surveysGenProps={surveysGenProps}
      surveysNumSeqProps={surveysNumSeqProps}
      surveysSeqProps={surveysSeqProps}
      blockInvId={blockInvId}
      blockInvStatus={blockInvStatus}
      blockId={blockId}
      blockStatusId={blockStatusId}
      blockStatus={blockStatus}
      blockExecCompl={blockExecCompl}
      blockExecTotal={blockExecTotal}
      blockHash={blockHash}
      blockDef={blockDef}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const schedulerState = getDetailedState(state, ownProps?.salindex);
  const observingMode = getObservingMode(state, ownProps?.salindex);
  const generalInfo = getGeneralInfo(state, ownProps?.salindex);
  const filterInfo = getFilterSwap(state, ownProps?.salindex);
  const observatoryStatus = getObservatoryStatus(state, ownProps?.salindex);
  const currentTarget = getCurrentTargetInfo(state, ownProps?.salindex);
  const skyMap = getSkyMapInfo(state, ownProps?.salindex);
  const lastTarget = lastTargetInfo(state, ownProps?.salindex);
  const nextTarget = nextTargetInfo(state, ownProps?.salindex);
  const predictedTargets = predictedTargetsInfo(state, ownProps?.salindex);
  const surveys = getSurveysInfo(state, ownProps?.salindex);
  const blocks = getBlocksInfo(state, ownProps?.salindex);
  return {
    ...schedulerState,
    ...observingMode,
    ...generalInfo,
    ...filterInfo,
    ...observatoryStatus,
    ...currentTarget,
    ...skyMap,
    ...lastTarget,
    ...nextTarget,
    ...predictedTargets,
    ...surveys,
    ...blocks,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    `event-Scheduler-${ownProps?.salindex}-detailedState`,
    `event-Scheduler-${ownProps?.salindex}-observingMode`,
    `event-Scheduler-${ownProps?.salindex}-generalInfo`,
    `event-Scheduler-${ownProps?.salindex}-needFilterSwap`,
    `telemetry-Scheduler-${ownProps?.salindex}-observatoryState`,
    `event-Scheduler-${ownProps?.salindex}-target`,
    `event-Scheduler-${ownProps?.salindex}-observation`,
    `event-Scheduler-${ownProps?.salindex}-predictedSchedule`,
    `event-Scheduler-${ownProps?.salindex}-timeToNextTarget`,
    `event-Scheduler-${ownProps?.salindex}-surveyTopology`,
    `event-Scheduler-${ownProps?.salindex}-blockInventory`,
    `event-Scheduler-${ownProps?.salindex}-blockStatus`,
  ];
  return {
    subscriptions,
    subscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerContainer);
