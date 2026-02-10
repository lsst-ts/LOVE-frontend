/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scheduler from './Scheduler';
import { addGroup, removeGroup, requestSALCommand } from '../../redux/actions/ws';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

import RatioDisplay from 'components/MainTel/RatioDisplay/RatioDisplay';
import EFDQuery from 'components/GeneralPurpose/EFDQuery/EFDQuery';
import { ISO_STRING_DATE_TIME_FORMAT, TOPIC_TIMESTAMP_ATTRIBUTE } from 'Config';
import ManagerInterface, { getEFDInstanceForHost, parseCommanderData } from 'Utils';
import {
  getSchedulerSummaryState,
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
} from '../../redux/selectors';

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
      description: 'Salindex of Scheduler. 1 for Simonyi Scheduler and 2 for ATScheduler',
      isPrivate: false,
      default: 1,
    },
  },
};

const SchedulerContainer = ({
  subscribeToStream,
  unsubscribeToStream,
  requestSALCommand,
  schedulerState,
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
  domeAlt,
  domeAz,
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
  currentSequenceNVisits,
  currentSequenceVisits,
  airmass,
  skyBrightness,
  cloud,
  seeing,
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
  salindex,
  ...props
}) => {
  const [response, setResponse] = useState(null);

  const efdManagerInterface = (startDate) => {
    const cscInputs = {
      MTMount: {
        0: {
          azimuth: ['actualPosition'],
        },
      },
      MTDome: {
        0: {
          azimuth: ['positionActual'],
        },
      },
    };

    const parsedStartDate = startDate.format(ISO_STRING_DATE_TIME_FORMAT);
    return ManagerInterface.getEFDTimeseries(parsedStartDate, 60 * 12, cscInputs, '1min', 'summit_efd').then(
      (response) => {
        setResponse(parseCommanderData(response));
      },
    );
  };

  const dateToQuery = '2026-01-17T23:00:00.000Z';
  useEffect(() => {
    efdManagerInterface(moment(dateToQuery));
  }, []);

  // const timeSeriesData = [
  //   { timestamp: '2026-02-10T10:00:00', outerAzimuth: 0, innerAzimuth: 120.3 },
  //   { timestamp: '2026-02-10T10:01:00', outerAzimuth: 50, innerAzimuth: 121.1 },
  //   { timestamp: '2026-02-10T10:02:00', outerAzimuth: 80, innerAzimuth: 122.5 },
  //   { timestamp: '2026-02-10T10:03:00', outerAzimuth: 90, innerAzimuth: 123.8 },
  // ];

  const timeSeriesData = [];
  if (response) {
    for (let i = 0; i < response['MTMount-0-azimuth']['actualPosition'].length; i++) {
      timeSeriesData.push({
        timestamp: response['MTMount-0-azimuth']['actualPosition'][i].x.toISO(),
        innerAzimuth: response['MTMount-0-azimuth']['actualPosition'][i].y,
        outerAzimuth: response['MTDome-0-azimuth']['positionActual'][i].y,
      });
    }
  }

  console.log('Time Series Data:', timeSeriesData);
  return <RatioDisplay timeSeriesData={timeSeriesData} />;
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <Scheduler
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      requestSALCommand={requestSALCommand}
      schedulerState={schedulerState}
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
      domeAlt={domeAlt}
      domeAz={domeAz}
      moonRa={moonRa}
      moonDec={moonDec}
      moonAlt={moonAlt}
      moonAz={moonAz}
      moonDistance={moonDistance}
      moonPhase={moonPhase}
      sunRa={sunRa}
      sunDec={sunDec}
      sunAlt={sunAlt}
      sunAz={sunAz}
      solarElong={solarElong}
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
      currentSequenceNVisits={currentSequenceNVisits}
      currentSequenceVisits={currentSequenceVisits}
      airmass={airmass}
      skyBrightness={skyBrightness}
      cloud={cloud}
      seeing={seeing}
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
      salindex={salindex}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const schedulerSummaryState = getSchedulerSummaryState(state, ownProps?.salindex);
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
    ...schedulerSummaryState,
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
    `event-Scheduler-${ownProps?.salindex}-summaryState`,
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
    requestSALCommand: (cmd) => {
      dispatch(
        requestSALCommand({
          ...cmd,
        }),
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerContainer);
