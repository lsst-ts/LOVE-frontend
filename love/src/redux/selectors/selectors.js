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

import { createCachedSelector } from 're-reselect';
import { TOPIC_TIMESTAMP_ATTRIBUTE } from 'Config';
import { flatMap, arrayRandomBoolean } from 'Utils';

export const getToken = (state) => state.auth.token;

export const getUsername = (state) => state.auth.username;

export const getUserFullName = (state) => `${state.auth.first_name} ${state.auth.last_name}`;

export const getTaiToUtc = (state) => state.time.server_time.tai_to_utc;

export const getServerTimeRequest = (state) => state.time.request_time;

export const getServerTimeReceive = (state) => state.time.receive_time;

export const getServerTime = (state) => ({ ...state.time.server_time });

export const getConfig = (state) => (state.auth.config ? state.auth.config : null);

export const getCamFeeds = (state) => getConfig(state)?.content?.camFeeds;

export const getAlarmConfig = (state) => getConfig(state)?.content?.alarms;

export const getEfdConfig = (state) => getConfig(state)?.content?.efd;

export const getSALConfig = (state) => getConfig(state)?.content?.sal;

export const getSurveyConfig = (state) => getConfig(state)?.content?.survey;

export const getControlLocation = (state) => ({
  controlLocation: state.observatoryState.controlLocation,
  lastUpdated: state.observatoryState.lastUpdated,
});

export const getAllTime = (state) => ({ ...state.time });

export const getClock = (state) => ({ ...state.time.clock });

export const getPermCmdExec = (state) => state.auth.permissions.cmd_exec;

export const getTokenStatus = (state) => state.auth.status;

export const getTokenSwapStatus = (state) => state.auth.swapStatus;

export const getConnectionStatus = (state) => state.ws.connectionState;

export const getWebSocket = (state) => state.ws.socket;

export const getSubscriptionsStatus = (state) => state.ws.subscriptionsState;

export const getSubscription = (state, groupName) => {
  return state.ws.subscriptions.find((subscription) => subscription.groupName === groupName);
};

export const getSubscriptions = (state) => state.ws.subscriptions;

export const getTopicsFieldsInfo = (state) => state.salinfo.topicsFieldsInfo;

export const getStreamsData = (state, groupNames) => {
  if (state.ws === undefined) return undefined;

  const filteredList = state.ws.subscriptions.filter((s) => groupNames.includes(s.groupName));
  const dict = {};

  filteredList.forEach((s) => {
    dict[s.groupName] = s.data;
  });
  return dict;
};

export const getStreamData = (state, groupName) => {
  return getStreamsData(state, [groupName])[groupName];
};

export const getTimestampedStreamData = (state, groupName) => {
  if (state.ws === undefined) return undefined;
  const filteredElement = state.ws.subscriptions.filter((s) => s.groupName === groupName)[0];
  const data = filteredElement ? filteredElement.data : undefined;
  const timestamp = filteredElement ? filteredElement.timestamp : undefined;
  return {
    data,
    timestamp,
  };
};

export const getCameraState = (state) => {
  return state.camera;
};

export const getLastSALCommand = (state) => {
  return state.ws.lastSALCommand;
};

// Optical Alignment Alarm
export const getAlignmentState = (state) => {
  //This is a mock event that returns a parameter that does not yet exist.
  //Whenever OAS is implemented and a CSC or Topic is published for it
  //this selector should be updated and connected to the proper CSC
  return {
    alignment: 0,
  };
};

// MTM1M3 selectors
export const getM1M3ActuatorsState = (state) => {
  const subscriptions = [
    'event-MTM1M3-0-forceActuatorInfo',
    'event-MTM1M3-0-forceActuatorState',
    'event-MTM1M3-0-enabledForceActuators',
  ];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    xPosition: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.xPosition?.value ?? [],
    yPosition: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.yPosition?.value ?? [],
    zPosition: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.zPosition?.value ?? [],
    actuatorReferenceId: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.referenceId?.value ?? [],
    actuatorType: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.actuatorType?.value ?? [],
    actuatorOrientation: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.actuatorOrientation?.value ?? [],
    actuatorModbusSubnet: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.modbusSubnet?.value ?? [],
    actuatorModbusAddress: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.modbusAddress?.value ?? [],
    actuatorIlcUniqueId: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.ilcUniqueId?.value ?? [],
    actuatorIlcApplicationType: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.ilcApplicationType?.value ?? [],
    actuatorIlcSelectedOptions: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.ilcSelectedOptions?.value ?? [],
    actuatorNetworkNodeType: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.networkNodeType?.value ?? [],
    actuatorMayorRevision: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.majorRevision?.value ?? [],
    actuatorMinorRevision: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.minorRevision?.value ?? [],
    actuatorAdcScanRate: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.adcScanRate?.value ?? [],
    actuatorMezzanineUniqueId: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.mezzanineUniqueId?.value ?? [],
    actuatorMezzanineFirmwareType:
      m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.mezzanineFirmwareType?.value ?? [],
    actuatorMezzanineMajorRevision:
      m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.mezzanineMajorRevision?.value ?? [],
    actuatorMezzanineMinorRevision:
      m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.mezzanineMinorRevision?.value ?? [],
    actuatorIlcState: m1m3Data['event-MTM1M3-0-forceActuatorState']?.[0]?.ilcState?.value ?? [],
    actuatorEnabled: m1m3Data['event-MTM1M3-0-enabledForceActuators']?.[0]?.forceActuatorEnabled?.value ?? [],
  };
};

export const getM1M3ForceControllerState = (state) => {
  const subscriptions = ['event-MTM1M3-0-forceControllerState'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    balanceForcesApplied:
      m1m3Data['event-MTM1M3-0-forceControllerState']?.[0]?.balanceForcesApplied?.value ?? undefined,
  };
};

export const getM1M3ActuatorsData = (state) => {
  const subscriptions = ['telemetry-MTM1M3-0-forceActuatorData'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    actuatorsFx: m1m3Data['telemetry-MTM1M3-0-forceActuatorData']?.fx?.value ?? 0,
    actuatorsFy: m1m3Data['telemetry-MTM1M3-0-forceActuatorData']?.fy?.value ?? 0,
    actuatorsFz: m1m3Data['telemetry-MTM1M3-0-forceActuatorData']?.fz?.value ?? 0,
    actuatorsMx: m1m3Data['telemetry-MTM1M3-0-forceActuatorData']?.mx?.value ?? 0,
    actuatorsMy: m1m3Data['telemetry-MTM1M3-0-forceActuatorData']?.my?.value ?? 0,
    actuatorsMz: m1m3Data['telemetry-MTM1M3-0-forceActuatorData']?.mz?.value ?? 0,
    actuatorsForceMagnitude: m1m3Data['telemetry-MTM1M3-0-forceActuatorData']?.forceMagnitude?.value ?? 0,
  };
};

export const getM1M3HardpointActuatorData = (state) => {
  const subscriptions = ['telemetry-MTM1M3-0-hardpointActuatorData'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    hardpointsFx: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.fx?.value ?? 0,
    hardpointsFy: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.fy?.value ?? 0,
    hardpointsFz: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.fz?.value ?? 0,
    hardpointsMx: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.mx?.value ?? 0,
    hardpointsMy: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.my?.value ?? 0,
    hardpointsMz: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.mz?.value ?? 0,
    hardpointsForceMagnitude: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.forceMagnitude?.value ?? 0,
    hardpointsXPosition: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.xPosition?.value ?? 0,
    hardpointsYPosition: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.yPosition?.value ?? 0,
    hardpointsZPosition: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.zPosition?.value ?? 0,
    hardpointsXRotation: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.xRotation?.value ?? 0,
    hardpointsYRotation: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.yRotation?.value ?? 0,
    hardpointsZRotation: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.zRotation?.value ?? 0,
    hardpointsStepsQueued: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.stepsQueued?.value ?? [],
    hardpointsStepsCommanded: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.stepsCommanded?.value ?? [],
    hardpointsEncoder: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.encoder?.value ?? [],
    hardpointsMeasuredForce: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.measuredForce?.value ?? [],
    hardpointsDisplacement: m1m3Data['telemetry-MTM1M3-0-hardpointActuatorData']?.displacement?.value ?? [],
  };
};

export const getM1M3HardpointActuatorState = (state) => {
  const subscriptions = ['event-MTM1M3-0-hardpointActuatorState', 'event-MTM1M3-0-hardpointActuatorInfo'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    hardpointIlcState: m1m3Data['event-MTM1M3-0-hardpointActuatorState']?.[0]?.ilcState?.value ?? [],
    hardpointMotionState: m1m3Data['event-MTM1M3-0-hardpointActuatorState']?.[0]?.motionState?.value ?? [],
    hardpointIlcUniqueId: m1m3Data['event-MTM1M3-0-hardpointActuatorInfo']?.[0]?.ilcUniqueId?.value ?? [],
    hardpointReferenceId: [1, 2, 3, 4, 5, 6],
    hardpointMinorRevision: m1m3Data['event-MTM1M3-0-hardpointActuatorInfo']?.[0]?.minorRevision?.value ?? [],
    hardpointMayorRevision: m1m3Data['event-MTM1M3-0-hardpointActuatorInfo']?.[0]?.majorRevision?.value ?? [],
  };
};

export const getM1M3HardpointActuatorSettings = (state) => {
  const subscriptions = ['event-MTM1M3-0-hardpointActuatorSettings'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    hardpointMeasuredForceWarningHigh:
      m1m3Data['event-MTM1M3-0-hardpointActuatorSettings']?.[0]?.hardpointMeasuredForceWarningHigh?.value ?? 0,
    hardpointMeasuredForceWarningLow:
      m1m3Data['event-MTM1M3-0-hardpointActuatorSettings']?.[0]?.hardpointMeasuredForceWarningLow?.value ?? 0,
    hardpointMeasuredForceFaultHigh:
      m1m3Data['event-MTM1M3-0-hardpointActuatorSettings']?.[0]?.hardpointMeasuredForceFaultHigh?.value ?? 0,
    hardpointMeasuredForceFaultLow:
      m1m3Data['event-MTM1M3-0-hardpointActuatorSettings']?.[0]?.hardpointMeasuredForceFaultLow?.value ?? 0,
    hardpointMeasuredForceFSBWarningHigh:
      m1m3Data['event-MTM1M3-0-hardpointActuatorSettings']?.[0]?.hardpointMeasuredForceFSBWarningHigh?.value ?? 0,
    hardpointMeasuredForceFSBWarningLow:
      m1m3Data['event-MTM1M3-0-hardpointActuatorSettings']?.[0]?.hardpointMeasuredForceFSBWarningLow?.value ?? 0,
    hardpointBreakawayFaultLow:
      m1m3Data['event-MTM1M3-0-hardpointActuatorSettings']?.[0]?.hardpointBreakawayFaultLow?.value ?? 0,
    hardpointBreakawayFaultHigh:
      m1m3Data['event-MTM1M3-0-hardpointActuatorSettings']?.[0]?.hardpointBreakawayFaultHigh?.value ?? 0,
  };
};

export const getM1M3HardpointMonitorData = (state) => {
  const subscriptions = ['telemetry-MTM1M3-0-hardpointMonitorData'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    hardpointsBreakawayLVDT: m1m3Data['telemetry-MTM1M3-0-hardpointMonitorData']?.breakawayLVDT?.value ?? [],
    hardpointsDisplacementLVDT: m1m3Data['telemetry-MTM1M3-0-hardpointMonitorData']?.displacementLVDT?.value ?? [],
    hardpointsBreakawayPressure: m1m3Data['telemetry-MTM1M3-0-hardpointMonitorData']?.breakawayPressure?.value ?? [],
    hardpointsPressureSensor1: m1m3Data['telemetry-MTM1M3-0-hardpointMonitorData']?.pressureSensor1?.value ?? [],
    hardpointsPressureSensor2: m1m3Data['telemetry-MTM1M3-0-hardpointMonitorData']?.pressureSensor2?.value ?? [],
    hardpointsPressureSensor3: m1m3Data['telemetry-MTM1M3-0-hardpointMonitorData']?.pressureSensor3?.value ?? [],
    referenceHardpointId: [1, 2, 3, 4, 5, 6],
  };
};

export const getM1M3HardpointActuatorWarningData = (state) => {
  const subscriptions = ['event-MTM1M3-0-hardpointActuatorWarning'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    hardpointsMajorFault: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.majorFault?.value ?? [],
    hardpointsMinorFault: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.minorFault?.value ?? [],
    hardpointsFaultOverride: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.faultOverride?.value ?? [],
    hardpointsMainCalibrationError:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.mainCalibrationError?.value ?? [],
    hardpointsBackupCalibrationError:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.backupCalibrationError?.value ?? [],
    hardpointsLimitSwitch1Operated:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.limitSwitch1Operated?.value ?? [],
    hardpointsLimitSwitch2Operated:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.limitSwitch2Operated?.value ?? [],
    hardpointsLowProximityWarning:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.lowProximityWarning?.value ?? [],
    hardpointsHighProximityWarning:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.highProximityWarning?.value ?? [],
    hardpointsLowAirPressureFault:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.lowAirPressureFault?.value ?? [],
    hardpointsHighAirPressureFault:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.highAirPressureFault?.value ?? [],
    hardpointsUniqueIdCRCError: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.uniqueIdCRCError?.value ?? [],
    hardpointsApplicationTypeMismatch:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.applicationTypeMismatch?.value ?? [],
    hardpointsApplicationMissing:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.applicationMissing?.value ?? [],
    hardpointsApplicationCRCMismatch:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.applicationCRCMismatch?.value ?? [],
    hardpointsOneWireMissing: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.oneWireMissing?.value ?? [],
    hardpointsOneWire1Mismatch: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.oneWire1Mismatch?.value ?? [],
    hardpointsOneWire2Mismatch: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.oneWire2Mismatch?.value ?? [],
    hardpointsWatchdogReset: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.watchdogReset?.value ?? [],
    hardpointsBrownOut: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.brownOut?.value ?? [],
    hardpointsEventTrapReset: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.eventTrapReset?.value ?? [],
    hardpointsMotorDriverFault: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.motorDriverFault?.value ?? [],
    hardpointsSsrPowerFault: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.ssrPowerFault?.value ?? [],
    hardpointsAuxPowerFault: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.auxPowerFault?.value ?? [],
    hardpointsSmcPowerFault: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.smcPowerFault?.value ?? [],
    hardpointsIlcFault: m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.ilcFault?.value ?? [],
    hardpointsBroadcastCounterWarning:
      m1m3Data['event-MTM1M3-0-hardpointActuatorWarning']?.[0]?.broadcastCounterWarning?.value ?? [],
  };
};

export const getM1M3IMSData = (state) => {
  const subscriptions = ['telemetry-MTM1M3-0-imsData'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    imsXPosition: m1m3Data['telemetry-MTM1M3-0-imsData']?.xPosition?.value ?? 0,
    imsYPosition: m1m3Data['telemetry-MTM1M3-0-imsData']?.yPosition?.value ?? 0,
    imsZPosition: m1m3Data['telemetry-MTM1M3-0-imsData']?.zPosition?.value ?? 0,
    imsXRotation: m1m3Data['telemetry-MTM1M3-0-imsData']?.xRotation?.value ?? 0,
    imsYRotation: m1m3Data['telemetry-MTM1M3-0-imsData']?.yRotation?.value ?? 0,
    imsZRotation: m1m3Data['telemetry-MTM1M3-0-imsData']?.zRotation?.value ?? 0,
  };
};

export const getM1M3AppliedForces = (state) => {
  const subscriptions = ['telemetry-MTM1M3-0-appliedForces'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    appliedFx: m1m3Data['telemetry-MTM1M3-0-appliedForces']?.fx?.value ?? 0,
    appliedFy: m1m3Data['telemetry-MTM1M3-0-appliedForces']?.fy?.value ?? 0,
    appliedFz: m1m3Data['telemetry-MTM1M3-0-appliedForces']?.fz?.value ?? 0,
    appliedMx: m1m3Data['telemetry-MTM1M3-0-appliedForces']?.mx?.value ?? 0,
    appliedMy: m1m3Data['telemetry-MTM1M3-0-appliedForces']?.my?.value ?? 0,
    appliedMz: m1m3Data['telemetry-MTM1M3-0-appliedForces']?.mz?.value ?? 0,
    appliedForceMagnitude: m1m3Data['telemetry-MTM1M3-0-appliedForces']?.forceMagnitude?.value ?? 0,
  };
};

export const getM1M3State = (state) => {
  const subscriptions = ['event-MTM1M3-0-summaryState', 'event-MTM1M3-0-detailedState'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    summaryState: m1m3Data['event-MTM1M3-0-summaryState']?.[0].summaryState?.value ?? 0,
    detailedState: m1m3Data['event-MTM1M3-0-detailedState']?.[0].detailedState?.value ?? 0,
  };
};

export const getM1M3ActuatorForces = (state) => {
  const subscriptions = [
    'telemetry-MTM1M3-0-forceActuatorData',
    'telemetry-MTM1M3-0-appliedAccelerationForces',
    'telemetry-MTM1M3-0-appliedAzimuthForces',
    'telemetry-MTM1M3-0-appliedBalanceForces',
    'telemetry-MTM1M3-0-appliedCylinderForces',
    'telemetry-MTM1M3-0-appliedElevationForces',
    'telemetry-MTM1M3-0-appliedForces',
    'telemetry-MTM1M3-0-appliedThermalForces',
    'telemetry-MTM1M3-0-appliedVelocityForces',
    'event-MTM1M3-0-enabledForceActuators',
    'event-MTM1M3-0-forceActuatorInfo',
    'event-MTM1M3-0-forceActuatorState',
    'event-MTM1M3-0-appliedActiveOpticForces',
    'event-MTM1M3-0-appliedOffsetForces',
    'event-MTM1M3-0-appliedStaticForces',
    'event-MTM1M3-0-preclippedAccelerationForces',
    'event-MTM1M3-0-preclippedActiveOpticForces',
    'event-MTM1M3-0-preclippedAzimuthForces',
    'event-MTM1M3-0-preclippedBalanceForces',
    'event-MTM1M3-0-preclippedCylinderForces',
    'event-MTM1M3-0-preclippedElevationForces',
    'event-MTM1M3-0-preclippedForces',
    'event-MTM1M3-0-preclippedOffsetForces',
    'event-MTM1M3-0-preclippedStaticForces',
    'event-MTM1M3-0-preclippedThermalForces',
    'event-MTM1M3-0-preclippedVelocityForces',
    'event-MTM1M3-0-raisingLoweringInfo',
    'event-MTM1M3-0-forceActuatorWarning',
    'event-MTM1M3-0-forceActuatorForceWarning',
    'event-MTM1M3-0-forceActuatorFollowingErrorCounter',
    'event-MTM1M3-0-forceSetpointWarning',
    'event-MTM1M3-0-forceActuatorBumpTestStatus',
  ];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    forceActuatorData: m1m3Data['telemetry-MTM1M3-0-forceActuatorData'] ?? {},
    appliedAccelerationForces: m1m3Data['telemetry-MTM1M3-0-appliedAccelerationForces'] ?? {},
    appliedAzimuthForces: m1m3Data['telemetry-MTM1M3-0-appliedAzimuthForces'] ?? {},
    appliedBalanceForces: m1m3Data['telemetry-MTM1M3-0-appliedBalanceForces'] ?? {},
    appliedCylinderForces: m1m3Data['telemetry-MTM1M3-0-appliedCylinderForces'] ?? {},
    appliedElevationForces: m1m3Data['telemetry-MTM1M3-0-appliedElevationForces'] ?? {},
    appliedForces: m1m3Data['telemetry-MTM1M3-0-appliedForces'] ?? {},
    appliedThermalForces: m1m3Data['telemetry-MTM1M3-0-appliedThermalForces'] ?? {},
    appliedVelocityForces: m1m3Data['telemetry-MTM1M3-0-appliedVelocityForces'] ?? {},
    enabledForceActuators: m1m3Data['event-MTM1M3-0-enabledForceActuators']?.[0] ?? {},
    forceActuatorInfo: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0] ?? {},
    forceActuatorState: m1m3Data['event-MTM1M3-0-forceActuatorState']?.[0] ?? {},
    appliedActiveOpticForces: m1m3Data['event-MTM1M3-0-appliedActiveOpticForces']?.[0] ?? {},
    appliedOffsetForces: m1m3Data['event-MTM1M3-0-appliedOffsetForces']?.[0] ?? {},
    appliedStaticForces: m1m3Data['event-MTM1M3-0-appliedStaticForces']?.[0] ?? {},
    preclippedAccelerationForces: m1m3Data['event-MTM1M3-0-preclippedAccelerationForces']?.[0] ?? {},
    preclippedActiveOpticForces: m1m3Data['event-MTM1M3-0-preclippedActiveOpticForces']?.[0] ?? {},
    preclippedAzimuthForces: m1m3Data['event-MTM1M3-0-preclippedAzimuthForces']?.[0] ?? {},
    preclippedBalanceForces: m1m3Data['event-MTM1M3-0-preclippedBalanceForces']?.[0] ?? {},
    preclippedCylinderForces: m1m3Data['event-MTM1M3-0-preclippedCylinderForces']?.[0] ?? {},
    preclippedElevationForces: m1m3Data['event-MTM1M3-0-preclippedElevationForces']?.[0] ?? {},
    preclippedForces: m1m3Data['event-MTM1M3-0-preclippedForces']?.[0] ?? {},
    preclippedOffsetForces: m1m3Data['event-MTM1M3-0-preclippedOffsetForces']?.[0] ?? {},
    preclippedStaticForces: m1m3Data['event-MTM1M3-0-preclippedStaticForces']?.[0] ?? {},
    preclippedThermalForces: m1m3Data['event-MTM1M3-0-preclippedThermalForces']?.[0] ?? {},
    preclippedVelocityForces: m1m3Data['event-MTM1M3-0-preclippedVelocityForces']?.[0] ?? {},
    raisingLoweringInfo: m1m3Data['event-MTM1M3-0-raisingLoweringInfo']?.[0] ?? {},
    forceActuatorWarning: m1m3Data['event-MTM1M3-0-forceActuatorWarning']?.[0] ?? {},
    forceActuatorForceWarning: m1m3Data['event-MTM1M3-0-forceActuatorForceWarning']?.[0] ?? {},
    forceActuatorFollowingErrorCounter: m1m3Data['event-MTM1M3-0-forceActuatorFollowingErrorCounter']?.[0] ?? {},
    forceSetpointWarning: m1m3Data['event-MTM1M3-0-forceSetpointWarning']?.[0] ?? {},
    forceActuatorBumpTestStatus: m1m3Data['event-MTM1M3-0-forceActuatorBumpTestStatus']?.[0] ?? {},
  };
};

// MTM1M3TS selectors
export const getM1M3TSMixingState = (state) => {
  const subscriptions = ['telemetry-MTM1M3TS-0-mixingValve'];
  const m1m3tsData = getStreamsData(state, subscriptions);
  return {
    valvePosition: m1m3tsData['telemetry-MTM1M3TS-0-mixingValve']?.valvePosition?.value ?? 0,
    rawValvePosition: m1m3tsData['telemetry-MTM1M3TS-0-mixingValve']?.rawValvePosition?.value ?? 0,
  };
};

export const getM1M3TSWarningState = (state) => {
  const subscriptions = ['event-MTM1M3TS-0-thermalWarning'];
  const m1m3tsData = getStreamsData(state, subscriptions);
  return {
    majorFault: m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].majorFault?.value ?? arrayRandomBoolean(96),
    minorFault:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].minorFault?.value ?? Array.from({ length: 96 }, () => false),
    faultOverride:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].faultOverride?.value ??
      Array.from({ length: 96 }, () => false),
    refResistorError:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].refResistorError?.value ??
      Array.from({ length: 96 }, () => false),
    rtdError:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].rtdError?.value ?? Array.from({ length: 96 }, () => false),
    breakerHeater1Error:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].breakerHeater1Error?.value ??
      Array.from({ length: 96 }, () => false),
    breakerFan2Error:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].breakerFan2Error?.value ??
      Array.from({ length: 96 }, () => false),
    uniqueIdCRCError:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].uniqueIdCRCError?.value ??
      Array.from({ length: 96 }, () => false),
    applicationTypeMismatch:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].applicationTypeMismatch?.value ??
      Array.from({ length: 96 }, () => false),
    applicationMissing:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].applicationMissing?.value ??
      Array.from({ length: 96 }, () => false),
    applicationCRCMismatch:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].applicationCRCMismatch?.value ??
      Array.from({ length: 96 }, () => false),
    oneWireMissing:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].oneWireMissing?.value ??
      Array.from({ length: 96 }, () => false),
    oneWire1Mismatch:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].oneWire1Mismatch?.value ??
      Array.from({ length: 96 }, () => false),
    oneWire2Mismatch:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].oneWire2Mismatch?.value ??
      Array.from({ length: 96 }, () => false),
    watchdogReset:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].watchdogReset?.value ??
      Array.from({ length: 96 }, () => false),
    brownOut:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].brownOut?.value ?? Array.from({ length: 96 }, () => false),
    eventTrapReset:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].eventTrapReset?.value ??
      Array.from({ length: 96 }, () => false),
    ssrPowerFault:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].ssrPowerFault?.value ??
      Array.from({ length: 96 }, () => false),
    auxPowerFault:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].auxPowerFault?.value ??
      Array.from({ length: 96 }, () => false),
    ilcFault:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].ilcFault?.value ?? Array.from({ length: 96 }, () => false),
    broadcastWarning:
      m1m3tsData['event-MTM1M3TS-0-thermalWarning']?.[0].broadcastCounterWarning?.value ??
      Array.from({ length: 96 }, () => false),
  };
};

// M1M3TS Selector
export const getM1M3TSState = (state) => {
  const subscriptions = ['event-MTM1M3TS-0-summaryState', 'event-MTM1M3TS-0-powerStatus'];
  const m1m3tsData = getStreamsData(state, subscriptions);
  return {
    summaryState: m1m3tsData['event-MTM1M3TS-0-summaryState']?.[0].summaryState?.value ?? 0,
    fanHeaters: m1m3tsData['event-MTM1M3TS-0-powerStatus']?.[0].fanCoilsHeatersOn?.value ?? false,
    coolantPump: m1m3tsData['event-MTM1M3TS-0-powerStatus']?.[0].coolantPumpOn?.value ?? false,
    // fanHeatersCommanded: m1m3tsData['event-MTM1M3TS-0-powerStatus']?.[0].fanCoilsHeatersCommandedOn?.value ?? false,
    // coolantPumpCommanded: m1m3tsData['event-MTM1M3TS-0-powerStatus']?.[0].coolantPumpCommandedOn?.value ?? false,
  };
};

export const getM1M3TSThermalState = (state) => {
  const subscriptions = [
    'event-MTM1M3TS-0-enabledILC',
    'event-MTM1M3TS-0-thermalInfo',
    'event-MTM1M3TS-0-thermalSettings',
    'telemetry-MTM1M3TS-0-thermalData',
  ];
  const m1m3tsData = getStreamsData(state, subscriptions);
  return {
    ilcFCU: m1m3tsData['event-MTM1M3TS-0-enabledILC']?.[0].enabledFCU?.value ?? Array.from({ length: 96 }, () => false),
    // enabledFCU: m1m3tsData['event-MTM1M3TS-0-thermalSettings']?.[0].enabledFCU?.value ?? Array.from({length: 96}, () => false),
    referenceId: m1m3tsData['event-MTM1M3TS-0-thermalInfo']?.[0].referenceId?.value ?? [],
    absoluteTemperature: m1m3tsData['telemetry-MTM1M3TS-0-thermalData']?.absoluteTemperature?.value ?? [],
    differentialTemperature: m1m3tsData['telemetry-MTM1M3TS-0-thermalData']?.differentialTemperature?.value ?? [],
    fanRPM: m1m3tsData['telemetry-MTM1M3TS-0-thermalData']?.fanRPM?.value ?? [],
    fanBreaker: m1m3tsData['telemetry-MTM1M3TS-0-thermalData']?.fanBreaker?.value ?? [],
    heaterDisabled: m1m3tsData['telemetry-MTM1M3TS-0-thermalData']?.heaterDisabled?.value ?? [],
  };
};

export const getM1M3TSTemperatureState = (state) => {
  const subscriptions = ['event-MTM1M3TS-0-appliedSetpoint'];
  const m1m3tsData = getStreamsData(state, subscriptions);
  return {
    setpoint: m1m3tsData['event-MTM1M3TS-0-appliedSetpoint']?.[0].setpoint?.value ?? 0,
  };
};

// M1M3 Glycol Loop Events
export const getGlycolPumpStatus = (state) => {
  const subscriptions = ['event-MTM1M3TS-0-glycolPumpStatus'];
  const glycolPumpData = getStreamsData(state, subscriptions);
  return {
    ready: glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].ready?.value ?? undefined,
    running: glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].running?.value ?? undefined,
    forwardCommanded: glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].forwardCommanded?.value ?? undefined,
    forwardRotating: glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].forwardRotating?.value ?? undefined,
    accelerating: glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].accelerating?.value ?? undefined,
    decelerating: glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].decelerating?.value ?? undefined,
    faulted: glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].faulted?.value ?? undefined,
    mainFrequencyControlled:
      glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].mainFrequencyControlled?.value ?? undefined,
    operationCommandControlled:
      glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].operationCommandControlled?.value ?? undefined,
    parametersLocked: glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].parametersLocked?.value ?? undefined,
    errorCode: glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].errorCode?.value ?? undefined,
    errorReport: glycolPumpData['event-MTM1M3TS-0-glycolPumpStatus']?.[0].errorReport?.value ?? undefined,
  };
};

// M1M3 Glycol Loop Telemetry
export const getGlycolTemps = (state) => {
  const subscriptions = ['telemetry-MTM1M3TS-0-glycolLoopTemperature'];
  const glycolTempData = getStreamsData(state, subscriptions);
  return {
    aboveMirrorTemperature:
      glycolTempData['telemetry-MTM1M3TS-0-glycolLoopTemperature']?.aboveMirrorTemperature?.value ?? 0,
    insideCellTemperature1:
      glycolTempData['telemetry-MTM1M3TS-0-glycolLoopTemperature']?.insideCellTemperature1?.value ?? 0,
    insideCellTemperature2:
      glycolTempData['telemetry-MTM1M3TS-0-glycolLoopTemperature']?.insideCellTemperature2?.value ?? 0,
    insideCellTemperature3:
      glycolTempData['telemetry-MTM1M3TS-0-glycolLoopTemperature']?.insideCellTemperature3?.value ?? 0,
    telescopeCoolantSupplyTemperature:
      glycolTempData['telemetry-MTM1M3TS-0-glycolLoopTemperature']?.telescopeCoolantSupplyTemperature?.value ?? 0,
    telescopeCoolantReturnTemperature:
      glycolTempData['telemetry-MTM1M3TS-0-glycolLoopTemperature']?.telescopeCoolantReturnTemperature?.value ?? 0,
    mirrorCoolantSupplyTemperature:
      glycolTempData['telemetry-MTM1M3TS-0-glycolLoopTemperature']?.mirrorCoolantSupplyTemperature?.value ?? 0,
    mirrorCoolantReturnTemperature:
      glycolTempData['telemetry-MTM1M3TS-0-glycolLoopTemperature']?.mirrorCoolantReturnTemperature?.value ?? 0,
  };
};

// MTM2 selectors
export const getM2State = (state) => {
  const subscriptions = [
    'event-MTM2-0-summaryState',
    'event-MTM2-0-commandableByDDS',
    'event-MTM2-0-forceBalanceSystemStatus',
    'event-MTM2-0-m2AssemblyInPosition',
  ];
  const m2Data = getStreamsData(state, subscriptions);
  return {
    summaryState: m2Data['event-MTM2-0-summaryState']?.[0].summaryState?.value ?? 0,
    commandableByDDS: m2Data['event-MTM2-0-commandableByDDS']?.[0].state?.value ?? false,
    forceBalanceSystemStatus: m2Data['event-MTM2-0-forceBalanceSystemStatus']?.[0].status?.value ?? false,
    m2AssemblyInPosition: m2Data['event-MTM2-0-m2AssemblyInPosition']?.[0].state?.value ?? false,
  };
};

export const getM2Inclinometer = (state) => {
  const subscriptions = ['telemetry-MTM2-0-zenithAngle', 'event-MTM2-0-inclinationTelemetrySource'];
  const m2InclinometerData = getStreamsData(state, subscriptions);
  return {
    zenithAngleMeasured: m2InclinometerData['telemetry-MTM2-0-zenithAngle']?.measured?.value ?? 0,
    inclinationTelemetrySource: m2InclinometerData['event-MTM2-0-inclinationTelemetrySource']?.[0].source?.value ?? 1,
  };
};

export const getM2Actuator = (state) => {
  const subscriptions = [
    'telemetry-MTM2-0-ilcData',
    'telemetry-MTM2-0-axialActuatorSteps',
    'telemetry-MTM2-0-axialEncoderPositions',
    'telemetry-MTM2-0-tangentActuatorSteps',
    'telemetry-MTM2-0-tangentEncoderPositions',
  ];
  const m2ActuatorsData = getStreamsData(state, subscriptions);
  return {
    actuatorIlcState: m2ActuatorsData['telemetry-MTM2-0-ilcData']?.status?.value ?? [],
    axialActuatorSteps: m2ActuatorsData['telemetry-MTM2-0-axialActuatorSteps']?.steps?.value ?? [],
    axialEncoderPositions: m2ActuatorsData['telemetry-MTM2-0-axialEncoderPositions']?.positions?.value ?? [],
    tangentActuatorSteps: m2ActuatorsData['telemetry-MTM2-0-tangentActuatorSteps']?.steps?.value ?? [],
    tangentEncoderPositions: m2ActuatorsData['telemetry-MTM2-0-tangentEncoderPositions']?.positions?.value ?? [],
  };
};

export const getM2ActuatorForce = (state) => {
  const subscriptions = ['telemetry-MTM2-0-axialForce', 'telemetry-MTM2-0-tangentForce'];
  const m2ActuatorsData = getStreamsData(state, subscriptions);
  return {
    axialForceApplied: m2ActuatorsData['telemetry-MTM2-0-axialForce']?.applied?.value ?? [],
    axialForceMeasured: m2ActuatorsData['telemetry-MTM2-0-axialForce']?.measured?.value ?? [],
    tangentForceApplied: m2ActuatorsData['telemetry-MTM2-0-tangentForce']?.applied?.value ?? [],
    tangentForceMeasured: m2ActuatorsData['telemetry-MTM2-0-tangentForce']?.measured?.value ?? [],
  };
};

export const getM2ActuatorForceTopics = (state) => {
  const subscriptions = [
    'telemetry-MTM2-0-axialActuatorSteps',
    'telemetry-MTM2-0-axialEncoderPositions',
    'telemetry-MTM2-0-axialForce',
    'telemetry-MTM2-0-tangentActuatorSteps',
    'telemetry-MTM2-0-tangentEncoderPositions',
    'telemetry-MTM2-0-tangentForce',
  ];
  const data = getStreamsData(state, subscriptions);
  return {
    axialActuatorSteps: data['telemetry-MTM2-0-axialActuatorSteps'] ?? {},
    axialEncoderPositions: data['telemetry-MTM2-0-axialEncoderPositions'] ?? {},
    axialForce: data['telemetry-MTM2-0-axialForce'] ?? {},
    tangentActuatorSteps: data['telemetry-MTM2-0-tangentActuatorSteps'] ?? {},
    tangentEncoderPositions: data['telemetry-MTM2-0-tangentEncoderPositions'] ?? {},
    tangentForce: data['telemetry-MTM2-0-tangentForce'] ?? {},
  };
};

export const getM2ActuatorTable = (state) => {
  const subscriptions = [
    'telemetry-MTM2-0-forceBalance',
    'telemetry-MTM2-0-netForcesTotal',
    'telemetry-MTM2-0-netMomentsTotal',
    'telemetry-MTM2-0-position',
    'telemetry-MTM2-0-positionIMS',
  ];
  const m2ActuatorsData = getStreamsData(state, subscriptions);
  return {
    forceBalanceFx: m2ActuatorsData['telemetry-MTM2-0-forceBalance']?.fx?.value ?? 0,
    forceBalanceFy: m2ActuatorsData['telemetry-MTM2-0-forceBalance']?.fy?.value ?? 0,
    forceBalanceFz: m2ActuatorsData['telemetry-MTM2-0-forceBalance']?.fz?.value ?? 0,
    forceBalanceMx: m2ActuatorsData['telemetry-MTM2-0-forceBalance']?.mx?.value ?? 0,
    forceBalanceMy: m2ActuatorsData['telemetry-MTM2-0-forceBalance']?.my?.value ?? 0,
    forceBalanceMz: m2ActuatorsData['telemetry-MTM2-0-forceBalance']?.mz?.value ?? 0,
    netForcesFx: m2ActuatorsData['telemetry-MTM2-0-netForcesTotal']?.fx?.value ?? 0,
    netForcesFy: m2ActuatorsData['telemetry-MTM2-0-netForcesTotal']?.fy?.value ?? 0,
    netForcesFz: m2ActuatorsData['telemetry-MTM2-0-netForcesTotal']?.fz?.value ?? 0,
    netMomentsMx: m2ActuatorsData['telemetry-MTM2-0-netMomentsTotal']?.mx?.value ?? 0,
    netMomentsMy: m2ActuatorsData['telemetry-MTM2-0-netMomentsTotal']?.my?.value ?? 0,
    netMomentsMz: m2ActuatorsData['telemetry-MTM2-0-netMomentsTotal']?.mz?.value ?? 0,
    positionX: m2ActuatorsData['telemetry-MTM2-0-position']?.x?.value ?? 0,
    positionY: m2ActuatorsData['telemetry-MTM2-0-position']?.y?.value ?? 0,
    positionZ: m2ActuatorsData['telemetry-MTM2-0-position']?.z?.value ?? 0,
    positionXRot: m2ActuatorsData['telemetry-MTM2-0-position']?.xRot?.value ?? 0,
    positionYRot: m2ActuatorsData['telemetry-MTM2-0-position']?.yRot?.value ?? 0,
    positionZRot: m2ActuatorsData['telemetry-MTM2-0-position']?.zRot?.value ?? 0,
    positionIMSX: m2ActuatorsData['telemetry-MTM2-0-positionIMS']?.x?.value ?? 0,
    positionIMSY: m2ActuatorsData['telemetry-MTM2-0-positionIMS']?.y?.value ?? 0,
    positionIMSZ: m2ActuatorsData['telemetry-MTM2-0-positionIMS']?.z?.value ?? 0,
    positionIMSXRot: m2ActuatorsData['telemetry-MTM2-0-positionIMS']?.xRot?.value ?? 0,
    positionIMSYRot: m2ActuatorsData['telemetry-MTM2-0-positionIMS']?.yRot?.value ?? 0,
    positionIMSZRot: m2ActuatorsData['telemetry-MTM2-0-positionIMS']?.zRot?.value ?? 0,
  };
};

export const getM2PowerState = (state) => {
  const subscriptions = ['event-MTM2-0-powerSystemState'];
  const data = getStreamsData(state, subscriptions);
  return {
    powerType: data['event-MTM2-0-powerSystemState']?.[0].powerType?.value ?? 0,
    powerState: data['event-MTM2-0-powerSystemState']?.[0].state?.value ?? 0,
  };
};

export const getDomeState = (state) => {
  const domeSubscriptions = [
    'telemetry-ATDome-0-position',
    'event-ATDome-0-azimuthState',
    'event-ATDome-0-azimuthCommandedState',
    'event-ATDome-0-dropoutDoorState',
    'event-ATDome-0-mainDoorState',
    'event-ATDome-0-allAxesInPosition',
    'event-ATDome-0-summaryState',
  ];
  const domeData = getStreamsData(state, domeSubscriptions);
  return {
    dropoutDoorOpeningPercentage: domeData['telemetry-ATDome-0-position']?.dropoutDoorOpeningPercentage?.value ?? 0,
    mainDoorOpeningPercentage: domeData['telemetry-ATDome-0-position']?.mainDoorOpeningPercentage?.value ?? 0,
    azimuthPosition: domeData['telemetry-ATDome-0-position']?.azimuthPosition?.value ?? 0,
    azimuthState: domeData['event-ATDome-0-azimuthState']?.[0].state?.value ?? 0,
    azimuthCommanded: domeData['event-ATDome-0-azimuthCommandedState']?.[0].azimuth?.value ?? 0,
    domeInPosition: domeData['event-ATDome-0-allAxesInPosition']?.[0].inPosition?.value ?? 0,
    dropoutDoorState: domeData['event-ATDome-0-dropoutDoorState']?.[0].state?.value ?? 0,
    mainDoorState: domeData['event-ATDome-0-mainDoorState']?.[0].state?.value ?? 0,
    atDomeSummaryState: domeData['event-ATDome-0-summaryState']?.[0].summaryState?.value ?? 0,
  };
};

export const getATMCSState = (state) => {
  const subscriptions = [
    'telemetry-ATMCS-0-mount_AzEl_Encoders',
    'telemetry-ATMCS-0-mount_Nasmyth_Encoders',
    'event-ATMCS-0-atMountState',
    'event-ATMCS-0-target',
    'event-ATMCS-0-allAxesInPosition',
    'event-ATMCS-0-m3State',
    'event-ATMCS-0-positionLimits',
    'event-ATMCS-0-summaryState',
    'event-ATPtg-0-timesOfLimits',
  ];
  const data = getStreamsData(state, subscriptions);
  const [minEl, minAz, minNas1, minNas2, minM3] = data['event-ATMCS-0-positionLimits']?.[0].minimum?.value ?? [
    25, -270, -165, -165, 0,
  ];
  const [maxEl, maxAz, maxNas1, maxNas2, maxM3] = data['event-ATMCS-0-positionLimits']?.[0].maximum?.value ?? [
    86, 270, 165, 165, 180,
  ];

  return {
    atMountState: data['event-ATMCS-0-atMountState']?.[0].state?.value ?? 0,
    ATMCSSummaryState: data['event-ATMCS-0-summaryState']?.[0].summaryState?.value ?? 0,
    mountInPosition: data['event-ATMCS-0-allAxesInPosition']?.[0].inPosition?.value ?? false,
    trackID: data['event-ATMCS-0-target']?.[0].trackId?.value ?? 0,
    targetAzimuth: data['event-ATMCS-0-target']?.[0].azimuth?.value ?? 0,
    targetElevation: data['event-ATMCS-0-target']?.[0].elevation?.value ?? 0,
    targetNasmyth1: data['event-ATMCS-0-target']?.[0].nasmyth1RotatorAngle?.value ?? 0,
    targetNasmyth2: data['event-ATMCS-0-target']?.[0].nasmyth2RotatorAngle?.value ?? 0,
    m3State: data['event-ATMCS-0-m3State']?.[0].state?.value ?? 2,
    minEl,
    minAz,
    minNas1,
    minNas2,
    minM3,
    maxEl,
    maxAz,
    maxNas1,
    maxNas2,
    maxM3,
    currentPointingAz: data['telemetry-ATMCS-0-mount_AzEl_Encoders']?.azimuthCalculatedAngle?.value?.[0],
    currentPointingEl: data['telemetry-ATMCS-0-mount_AzEl_Encoders']?.elevationCalculatedAngle?.value?.[0],
    currentPointingNasmyth1: data['telemetry-ATMCS-0-mount_Nasmyth_Encoders']?.nasmyth1CalculatedAngle?.value?.[0],
    currentPointingNasmyth2: data['telemetry-ATMCS-0-mount_Nasmyth_Encoders']?.nasmyth2CalculatedAngle?.value?.[0],
    timeAzLim: data['event-ATPtg-0-timesOfLimits']?.[0].timeAzLim?.value ?? 0,
    timeRotLim: data['event-ATPtg-0-timesOfLimits']?.[0].timeRotLim?.value ?? 0,
    timeUnobservable: data['event-ATPtg-0-timesOfLimits']?.[0].timeUnobservable?.value ?? 0,
    timeElHighLimit: data['event-ATPtg-0-timesOfLimits']?.[0].timeElHighLimit?.value ?? 0,
  };
};

export const getAuxiliaryTelescopeState = (state) => {
  const subscriptions = [
    'telemetry-ATPtg-0-mountStatus',
    'telemetry-ATPtg-0-mountPositions',
    'event-ATPtg-0-currentTarget',
  ];
  const data = getStreamsData(state, subscriptions);
  return {
    telescopeRAHour: data['telemetry-ATPtg-0-mountStatus']?.mountRA?.value ?? 0,
    telescopeRADeg: data['telemetry-ATPtg-0-mountPositions']?.ra?.value[0] ?? 0,
    telescopeDecDeg: data['telemetry-ATPtg-0-mountStatus']?.mountDec?.value ?? 0,
    telescopeRotatorDeg: data['telemetry-ATPtg-0-mountStatus']?.mountRot?.value ?? 0,
    targetName: data['event-ATPtg-0-currentTarget']?.[0].targetName?.value ?? 'Unknown',
  };
};

export const getMountSubscriptions = (index) => {
  return [
    // ATHexapod
    `event-ATHexapod-${index}-inPosition`,
    `event-ATHexapod-${index}-readyForCommand`,
    `telemetry-ATHexapod-${index}-positionStatus`,
    // ATPneumatics
    `event-ATPneumatics-${index}-m1CoverState`,
    `event-ATPneumatics-${index}-m1SetPressure`,
    `event-ATPneumatics-${index}-mainValveState`,
    `event-ATPneumatics-${index}-instrumentState`,
    `event-ATPneumatics-${index}-m1CoverLimitSwitches`,
    `event-ATPneumatics-${index}-m1VentsLimitSwitches`,
    `telemetry-ATPneumatics-${index}-mainAirSourcePressure`,
    // ATMCS
    `event-ATMCS-${index}-m3InPosition`,
    `event-ATMCS-${index}-m3State`,
    `event-ATMCS-${index}-m3PortSelected`,
    `event-ATMCS-${index}-nasmyth1RotatorInPosition`,
    `event-ATMCS-${index}-nasmyth2RotatorInPosition`,
    `event-ATMCS-${index}-nasmyth1LimitSwitchCCW`,
    `event-ATMCS-${index}-nasmyth1LimitSwitchCW`,
    `event-ATMCS-${index}-nasmyth2LimitSwitchCCW`,
    `event-ATMCS-${index}-nasmyth2LimitSwitchCW`,
    `event-ATMCS-${index}-target`,
    `event-ATMCS-${index}-positionLimits`,
    `telemetry-ATMCS-${index}-mountEncoders`,
    // ATAOS
    `event-ATAOS-${index}-correctionOffsets`,
    `event-ATAOS-${index}-correctionEnabled`,
  ];
};

export const getMountState = (state, index) => {
  const mountSubscriptions = getMountSubscriptions(index);
  const mountData = getStreamsData(state, mountSubscriptions);
  const m3InPosition = mountData[`event-ATMCS-${index}-m3InPosition`];
  const nasmyth1RotatorInPosition = mountData[`event-ATMCS-${index}-nasmyth1RotatorInPosition`];
  const nasmyth2RotatorInPosition = mountData[`event-ATMCS-${index}-nasmyth2RotatorInPosition`];
  const m3State = mountData[`event-ATMCS-${index}-m3State`];
  const m3PortSelected = mountData[`event-ATMCS-${index}-m3PortSelected`];
  const nasmyth1LimitSwitchCCW = mountData[`event-ATMCS-${index}-nasmyth1LimitSwitchCCW`];
  const nasmyth1LimitSwitchCW = mountData[`event-ATMCS-${index}-nasmyth1LimitSwitchCW`];
  const nasmyth2LimitSwitchCCW = mountData[`event-ATMCS-${index}-nasmyth2LimitSwitchCCW`];
  const nasmyth2LimitSwitchCW = mountData[`event-ATMCS-${index}-nasmyth2LimitSwitchCW`];
  const target = mountData[`event-ATMCS-${index}-target`];
  const positionLimits = mountData[`event-ATMCS-${index}-positionLimits`];
  const mountEncoders = mountData[`telemetry-ATMCS-${index}-mountEncoders`];
  const hexapodInPosition = mountData[`event-ATHexapod-${index}-inPosition`];
  const m1CoverState = mountData[`event-ATPneumatics-${index}-m1CoverState`];
  const mainValveState = mountData[`event-ATPneumatics-${index}-mainValveState`];
  const instrumentState = mountData[`event-ATPneumatics-${index}-instrumentState`];
  const hexapodReadyForCommand = mountData[`event-ATPneumatics-${index}-readyForCommand`];
  const m1VentsLimitSwitches = mountData[`event-ATPneumatics-${index}-m1VentsLimitSwitches`];
  const m1CoverLimitSwitches = mountData[`event-ATPneumatics-${index}-m1CoverLimitSwitches`];
  const systemAirPressure = mountData[`telemetry-ATPneumatics-${index}-mainAirSourcePressure`];
  const correctionOffsets = mountData[`event-ATAOS-${index}-correctionOffsets`];
  const correctionEnabled = mountData[`event-ATAOS-${index}-correctionEnabled`];

  return {
    // ATHexapod
    hexapodInPosition: hexapodInPosition ? hexapodInPosition[hexapodInPosition.length - 1].inPosition.value : 0,
    hexapodReadyForCommand: hexapodReadyForCommand
      ? hexapodReadyForCommand[hexapodReadyForCommand.length - 1].ready
      : 0,
    hexapodReportedPosition: mountData[`telemetry-ATHexapod-${index}-positionStatus`]
      ? mountData[`telemetry-ATHexapod-${index}-positionStatus`].reportedPosition
      : 'Unknown',
    // ATPneumatics
    m1CoverState: m1CoverState ? m1CoverState[m1CoverState.length - 1].state.value : 0,

    m1SetPressure: mountData[`event-ATPneumatics-${index}-m1SetPressure`]
      ? mountData[`event-ATPneumatics-${index}-m1SetPressure`][0].pressure.value
      : 'Unknown',

    mainValveState: mainValveState ? mainValveState[mainValveState.length - 1].state.value : 0,
    instrumentState: instrumentState ? instrumentState[instrumentState.length - 1].state.value : 0,
    m1CoverLimitSwitches: m1CoverLimitSwitches ? m1CoverLimitSwitches[m1CoverLimitSwitches.length - 1] : {},
    m1VentsLimitSwitches: m1VentsLimitSwitches ? m1VentsLimitSwitches[m1VentsLimitSwitches.length - 1] : {},
    systemAirPressure: systemAirPressure?.pressure ?? {},
    // ATMCS
    m3InPosition: m3InPosition ? m3InPosition[m3InPosition.length - 1].inPosition.value : 0,
    nasmyth1RotatorInPosition: nasmyth1RotatorInPosition
      ? nasmyth1RotatorInPosition[nasmyth1RotatorInPosition.length - 1].inPosition.value
      : 0,
    nasmyth2RotatorInPosition: nasmyth2RotatorInPosition
      ? nasmyth2RotatorInPosition[nasmyth2RotatorInPosition.length - 1].inPosition.value
      : 0,
    m3State: m3State ? m3State[m3State.length - 1].state.value : 0,
    m3PortSelected: m3PortSelected ? m3PortSelected[m3PortSelected.length - 1].selected.value : 0,
    nasmyth1LimitSwitchCCW: nasmyth1LimitSwitchCCW
      ? nasmyth1LimitSwitchCCW[nasmyth1LimitSwitchCCW.length - 1].active.value
      : 'Unknown',
    nasmyth1LimitSwitchCW: nasmyth1LimitSwitchCW
      ? nasmyth1LimitSwitchCW[nasmyth1LimitSwitchCW.length - 1].active.value
      : 'Unknown',
    nasmyth2LimitSwitchCCW: nasmyth2LimitSwitchCCW
      ? nasmyth2LimitSwitchCCW[nasmyth2LimitSwitchCCW.length - 1].active.value
      : 'Unknown',
    nasmyth2LimitSwitchCW: nasmyth2LimitSwitchCW
      ? nasmyth2LimitSwitchCW[nasmyth2LimitSwitchCW.length - 1].active.value
      : 'Unknown',
    target: target ? target[target.length - 1] : {},
    positionLimits: positionLimits ? positionLimits[positionLimits.length - 1] : {},
    mountEncoders: mountEncoders || {},
    // ATAOS
    correctionOffsets: correctionOffsets
      ? correctionOffsets[correctionOffsets.length - 1]
      : {
          x: { value: '-' },
          y: { value: '-' },
          z: { value: '-' },
          u: { value: '-' },
          v: { value: '-' },
          w: { value: '-' },
        },
    correctionEnabled: correctionEnabled ? correctionEnabled[correctionEnabled.length - 1] : {},
  };
};

/** Returns all the ATMCS motor subscriptions */
export const getMountMotorsSubscriptions = (index) => {
  return [
    // Status
    `event-ATMCS-${index}-azimuthDrive1Status`,
    `event-ATMCS-${index}-azimuthDrive2Status`,
    `event-ATMCS-${index}-elevationDriveStatus`,
    `event-ATMCS-${index}-nasmyth1DriveStatus`,
    `event-ATMCS-${index}-nasmyth2DriveStatus`,
    `event-ATMCS-${index}-m3DriveStatus`,
    // Brakes
    `event-ATMCS-${index}-azimuthBrake1`,
    `event-ATMCS-${index}-azimuthBrake2`,
    `event-ATMCS-${index}-elevationBrake`,
    `event-ATMCS-${index}-nasmyth1Brake`,
    `event-ATMCS-${index}-nasmyth2Brake`,
    // Motors
    `telemetry-ATMCS-${index}-measuredMotorVelocity`,
    `telemetry-ATMCS-${index}-measuredTorque`,
    `telemetry-ATMCS-${index}-mountEncoders`,
    `telemetry-ATMCS-${index}-mountMotorEncoders`,
    `telemetry-ATMCS-${index}-torqueDemand`,
  ];
};

/**
 * Returns events related to the motors and drives in the AT Mount.
 *
 * @param {obj} state
 * @param {integer} salindex
 */
export const getMountMotorsState = (state, index) => {
  const mountMotorSubscriptions = getMountMotorsSubscriptions(index);
  const mountMotorData = getStreamsData(state, mountMotorSubscriptions);
  // Status
  const azimuthDrive1Status = mountMotorData[`event-ATMCS-${index}-azimuthDrive1Status`];
  const azimuthDrive2Status = mountMotorData[`event-ATMCS-${index}-azimuthDrive2Status`];
  const elevationDriveStatus = mountMotorData[`event-ATMCS-${index}-elevationDriveStatus`];
  const nasmyth1DriveStatus = mountMotorData[`event-ATMCS-${index}-nasmyth1DriveStatus`];
  const nasmyth2DriveStatus = mountMotorData[`event-ATMCS-${index}-nasmyth2DriveStatus`];
  const m3DriveStatus = mountMotorData[`event-ATMCS-${index}-m3DriveStatus`];
  // Brakes
  const azimuthBrake1 = mountMotorData[`event-ATMCS-${index}-azimuthBrake1`];
  const azimuthBrake2 = mountMotorData[`event-ATMCS-${index}-azimuthBrake2`];
  const elevationBrake = mountMotorData[`event-ATMCS-${index}-elevationBrake`];
  const nasmyth1Brake = mountMotorData[`event-ATMCS-${index}-nasmyth1Brake`];
  const nasmyth2Brake = mountMotorData[`event-ATMCS-${index}-nasmyth2Brake`];
  // Motors
  const measuredMotorVelocity = mountMotorData[`telemetry-ATMCS-${index}-measuredMotorVelocity`];
  const measuredTorque = mountMotorData[`telemetry-ATMCS-${index}-measuredTorque`];
  const mountEncoders = mountMotorData[`telemetry-ATMCS-${index}-mountEncoders`];
  const mountMotorEncoders = mountMotorData[`telemetry-ATMCS-${index}-mountMotorEncoders`];
  const torqueDemand = mountMotorData[`telemetry-ATMCS-${index}-torqueDemand`];

  return {
    // Status
    azimuthDrive1Status: azimuthDrive1Status
      ? azimuthDrive1Status[azimuthDrive1Status.length - 1].enable.value
      : 'Unknown',
    azimuthDrive2Status: azimuthDrive2Status
      ? azimuthDrive2Status[azimuthDrive2Status.length - 1].enable.value
      : 'Unknown',
    elevationDriveStatus: elevationDriveStatus
      ? elevationDriveStatus[elevationDriveStatus.length - 1].enable.value
      : 'Unknown',
    nasmyth1DriveStatus: nasmyth1DriveStatus
      ? nasmyth1DriveStatus[nasmyth1DriveStatus.length - 1].enable.value
      : 'Unknown',
    nasmyth2DriveStatus: nasmyth2DriveStatus
      ? nasmyth2DriveStatus[nasmyth2DriveStatus.length - 1].enable.value
      : 'Unknown',
    m3DriveStatus: m3DriveStatus ? m3DriveStatus[m3DriveStatus.length - 1].enable.value : 'Unknown',
    // Brakes
    azimuthBrake1: azimuthBrake1 ? azimuthBrake1[azimuthBrake1.length - 1].engaged.value : 'Unknown',
    azimuthBrake2: azimuthBrake2 ? azimuthBrake2[azimuthBrake2.length - 1].engaged.value : 'Unknown',
    elevationBrake: elevationBrake ? elevationBrake[elevationBrake.length - 1].engaged.value : 'Unknown',
    nasmyth1Brake: nasmyth1Brake ? nasmyth1Brake[nasmyth1Brake.length - 1].engaged.value : 'Unknown',
    nasmyth2Brake: nasmyth2Brake ? nasmyth2Brake[nasmyth2Brake.length - 1].engaged.value : 'Unknown',
    // Motors
    measuredMotorVelocity: measuredMotorVelocity || {},
    measuredTorque: measuredTorque || {},
    mountEncoders: mountEncoders || {},
    mountMotorEncoders: mountMotorEncoders || {},
    torqueDemand: torqueDemand || {},
  };
};

// CCW
export const getCCWState = (state) => {
  const subscriptions = ['event-MTMount-0-cameraCableWrapState', 'event-MTMount-0-summaryState'];
  const ccwData = getStreamsData(state, subscriptions);
  return {
    cameraCableWrapState: ccwData['event-MTMount-0-cameraCableWrapState']
      ? ccwData['event-MTMount-0-cameraCableWrapState'][0].state.value
      : 0,
    mountSummaryState: ccwData['event-MTMount-0-summaryState']
      ? ccwData['event-MTMount-0-summaryState'][0].summaryState.value
      : 0,
  };
};

export const getCCWPosition = (state) => {
  const subscriptions = ['telemetry-MTMount-0-cameraCableWrap'];
  const ccwData = getStreamsData(state, subscriptions);
  return {
    ccwPosition: ccwData['telemetry-MTMount-0-cameraCableWrap']
      ? ccwData['telemetry-MTMount-0-cameraCableWrap'].actualPosition.value
      : 0,
  };
};

export const getRotatorState = (state) => {
  const subscriptions = ['event-MTRotator-0-summaryState'];
  const rotatorData = getStreamsData(state, subscriptions);
  return {
    rotatorSummaryState: rotatorData['event-MTRotator-0-summaryState']
      ? rotatorData['event-MTRotator-0-summaryState'][0].summaryState.value
      : 0,
  };
};

export const getRotatorPosition = (state) => {
  const subscriptions = ['telemetry-MTRotator-0-rotation', 'event-MTRotator-0-inPosition'];
  const rotatorData = getStreamsData(state, subscriptions);
  return {
    rotatorPosition: rotatorData['telemetry-MTRotator-0-rotation']
      ? rotatorData['telemetry-MTRotator-0-rotation'].actualPosition.value
      : 0,
    inPosition: rotatorData['event-MTRotator-0-inPosition']
      ? rotatorData['event-MTRotator-0-inPosition'][0].inPosition.value
      : 0,
  };
};

export const getCCWFollowingError = (state) => {
  const subscriptions = [
    'telemetry-MTRotator-0-ccwFollowingError',
    'event-MTMount-0-cameraCableWrapFollowing',
    'event-MTRotator-0-interlock',
  ];
  const ccwErrorData = getStreamsData(state, subscriptions);
  return {
    ccwFollowingError: ccwErrorData['telemetry-MTRotator-0-ccwFollowingError']
      ? ccwErrorData['telemetry-MTRotator-0-ccwFollowingError'].positionError.value
      : 0,
    cameraCableWrapFollowing: ccwErrorData['event-MTMount-0-cameraCableWrapFollowing']
      ? ccwErrorData['event-MTMount-0-cameraCableWrapFollowing'][0].enabled.value
      : 0,
    interlock: ccwErrorData['event-MTRotator-0-interlock']
      ? ccwErrorData['event-MTRotator-0-interlock'][0].detail.value
      : 0,
  };
};

////////////////////////
// Simonyi LightPath //
//////////////////////

export const getMTLightPathStatus = (state) => {
  const subscriptions = [
    //M2
    `event-M2-0-m2AssemblyInPosition`,
    `telemetry-M2-0-position`,
    //M1M3
    `event-MTM1M3-0-detailedState`,
    //MirrorCovers
    `event-MTMount-0-mirrorCoversMotionState`,
    //ComCamera
    `event-CCCamera-0-imageReadinessDetailedState`,
    `event-CCCamera-0-shutterDetailedState`,
    `event-CCCamera-0-filterChangerDetailedState`,
    `event-CCCamera-0-endSetFilter`,
    //MTCamera
    `event-MTCamera-0-imageReadinessDetailedState`,
    `event-MTCamera-0-shutterDetailedState`,
    `event-MTCamera-0-filterChangerDetailedState`,
    `event-MTCamera-0-endSetFilter`,
  ];
  const mTLightPathStatusData = getStreamsData(state, subscriptions);
  return {
    //M2
    m2AssemblyInPosition: mTLightPathStatusData['event-MTM2-0-m2AssemblyInPosition']?.[0].state?.value ?? false,
    m2PositionX: mTLightPathStatusData['telemetry-MTM2-0-position']?.x?.value ?? 0,
    m2PositionY: mTLightPathStatusData['telemetry-MTM2-0-position']?.y?.value ?? 0,
    m2PositionZ: mTLightPathStatusData['telemetry-MTM2-0-position']?.z?.value ?? 0,
    m2PositionXRot: mTLightPathStatusData['telemetry-MTM2-0-position']?.xRot?.value ?? 0,
    m2PositionYRot: mTLightPathStatusData['telemetry-MTM2-0-position']?.yRot?.value ?? 0,
    m2PositionZRot: mTLightPathStatusData['telemetry-MTM2-0-position']?.zRot?.value ?? 0,
    //M1M3
    m1m3DetailedState: mTLightPathStatusData['event-MTM1M3-0-detailedState']?.[0].detailedState?.value ?? 0,
    //MirrorCovers
    mirrorCoversState: mTLightPathStatusData['event-MTMount-0-mirrorCoversMotionState']?.[0]?.elementsState?.value ?? [
      0, 0, 0, 0,
    ],
    //ComCamera
    cCameraImageState: mTLightPathStatusData['event-CCCamera-0-imageReadinessDetailedState']?.[0].substate?.value ?? 0,
    cCameraShutterState: mTLightPathStatusData['event-CCCamera-0-shutterDetailedState']?.[0].substate?.value ?? 0,
    cCameraFilterState: mTLightPathStatusData['event-CCCamera-0-filterChangerDetailedState']?.[0].substate?.value ?? 0,
    cCameraFilter: mTLightPathStatusData['event-CCCamera-0-endSetFilter']?.[0].filterName?.value ?? 'Unknown',

    //MTCamera
  };
};

// MTHexapod
export const getHexapodStatus = (state, salindex) => {
  const subscriptions = [
    `event-MTHexapod-${salindex}-commandableByDDS`,
    `event-MTHexapod-${salindex}-compensationMode`,
    `event-MTHexapod-${salindex}-connected`,
    `event-MTHexapod-${salindex}-controllerState`,
    `event-MTHexapod-${salindex}-inPosition`,
    `event-MTHexapod-${salindex}-interlock`,
    `event-MTHexapod-${salindex}-summaryState`,
  ];
  const hexapodStatusData = getStreamsData(state, subscriptions);
  return {
    hexapodCommandableByDDS: hexapodStatusData[`event-MTHexapod-${salindex}-commandableByDDS`]
      ? hexapodStatusData[`event-MTHexapod-${salindex}-commandableByDDS`][0].state.value
      : false,
    hexapodCompensationMode: hexapodStatusData[`event-MTHexapod-${salindex}-compensationMode`]
      ? hexapodStatusData[`event-MTHexapod-${salindex}-compensationMode`][0].enabled.value
      : false,
    hexapodConnected: hexapodStatusData[`event-MTHexapod-${salindex}-connected`]
      ? hexapodStatusData[`event-MTHexapod-${salindex}-connected`][0].connected.value
      : false,
    hexapodControllerState: hexapodStatusData[`event-MTHexapod-${salindex}-controllerState`]
      ? hexapodStatusData[`event-MTHexapod-${salindex}-controllerState`][0].controllerState.value
      : 0,
    hexapodConstrollerStateEnabledSubstate: hexapodStatusData[`event-MTHexapod-${salindex}-controllerState`]
      ? hexapodStatusData[`event-MTHexapod-${salindex}-controllerState`][0].enabledSubstate.value
      : 0,
    hexapodControllerStateApplicationStatus: hexapodStatusData[`event-MTHexapod-${salindex}-controllerState`]
      ? hexapodStatusData[`event-MTHexapod-${salindex}-controllerState`][0].applicationStatus.value
      : 0,
    hexapodInPosition: hexapodStatusData[`event-MTHexapod-${salindex}-inPosition`]
      ? hexapodStatusData[`event-MTHexapod-${salindex}-inPosition`][0].inPosition.value
      : false,
    hexapodInterlock: hexapodStatusData[`event-MTHexapod-${salindex}-interlock`]
      ? hexapodStatusData[`event-MTHexapod-${salindex}-interlock`][0].engaged.value
      : false,
    hexapodSummaryState: hexapodStatusData[`event-MTHexapod-${salindex}-summaryState`]
      ? hexapodStatusData[`event-MTHexapod-${salindex}-summaryState`][0].summaryState.value
      : 0,
  };
};

export const getHexapodTables = (state, salindex) => {
  const subscriptions = [
    `telemetry-MTHexapod-${salindex}-actuators`,
    `telemetry-MTHexapod-${salindex}-application`,
    `event-MTHexapod-${salindex}-compensationOffset`,
  ];
  const hexapodTablesData = getStreamsData(state, subscriptions);
  return {
    hexapodActuatorsCalibrated: hexapodTablesData[`telemetry-MTHexapod-${salindex}-actuators`]
      ? hexapodTablesData[`telemetry-MTHexapod-${salindex}-actuators`].calibrated.value
      : [],
    hexapodActuatorsRaw: hexapodTablesData[`telemetry-MTHexapod-${salindex}-actuators`]
      ? hexapodTablesData[`telemetry-MTHexapod-${salindex}-actuators`].raw.value
      : [],
    hexapodActuatorsTimestamp: hexapodTablesData[`telemetry-MTHexapod-${salindex}-actuators`]
      ? hexapodTablesData[`telemetry-MTHexapod-${salindex}-actuators`].timestamp.value
      : 0,
    hexapodApplicationDemand: hexapodTablesData[`telemetry-MTHexapod-${salindex}-application`]
      ? hexapodTablesData[`telemetry-MTHexapod-${salindex}-application`].demand.value
      : [],
    hexapodApplicationPosition: hexapodTablesData[`telemetry-MTHexapod-${salindex}-application`]
      ? hexapodTablesData[`telemetry-MTHexapod-${salindex}-application`].position.value
      : [],
    hexapodApplicationError: hexapodTablesData[`telemetry-MTHexapod-${salindex}-application`]
      ? hexapodTablesData[`telemetry-MTHexapod-${salindex}-application`].error.value
      : [],
    hexapodCompensationOffsetElevation: hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`]
      ? hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`][0].elevation.value
      : 0,
    hexapodCompensationOffsetAzimuth: hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`]
      ? hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`][0].azimuth.value
      : 0,
    hexapodCompensationOffsetRotation: hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`]
      ? hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`][0].rotation.value
      : 0,
    hexapodCompensationOffsetTemperature: hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`]
      ? hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`][0].temperature.value
      : 0,
    hexapodCompensationOffsetX: hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`]
      ? hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`][0].x.value
      : 0,
    hexapodCompensationOffsetY: hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`]
      ? hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`][0].y.value
      : 0,
    hexapodCompensationOffsetZ: hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`]
      ? hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`][0].z.value
      : 0,
    hexapodCompensationOffsetU: hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`]
      ? hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`][0].u.value
      : 0,
    hexapodCompensationOffsetV: hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`]
      ? hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`][0].v.value
      : 0,
    hexapodCompensationOffsetW: hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`]
      ? hexapodTablesData[`event-MTHexapod-${salindex}-compensationOffset`][0].w.value
      : 0,
  };
};

// MTDome
export const getApertureShutter = (state) => {
  const subscriptions = ['telemetry-MTDome-0-apertureShutter'];
  const apertureShutter = getStreamsData(state, subscriptions);
  return {
    positionActualShutter: apertureShutter['telemetry-MTDome-0-apertureShutter']
      ? apertureShutter['telemetry-MTDome-0-apertureShutter'].positionActual.value
      : 0,
    positionCommandedShutter: apertureShutter['telemetry-MTDome-0-apertureShutter']
      ? apertureShutter['telemetry-MTDome-0-apertureShutter'].positionCommanded.value
      : 0,
    powerDrawShutter: apertureShutter['telemetry-MTDome-0-apertureShutter']
      ? apertureShutter['telemetry-MTDome-0-apertureShutter']
      : {},
  };
};

export const getDomeAzimuth = (state) => {
  const subscriptions = ['telemetry-MTDome-0-azimuth'];
  const domeAzimuth = getStreamsData(state, subscriptions);
  return {
    positionActualDomeAz: domeAzimuth['telemetry-MTDome-0-azimuth']
      ? domeAzimuth['telemetry-MTDome-0-azimuth'].positionActual.value
      : 0,
    positionCommandedDomeAz: domeAzimuth['telemetry-MTDome-0-azimuth']
      ? domeAzimuth['telemetry-MTDome-0-azimuth'].positionCommanded.value
      : 0,
  };
};

export const getLightWindScreen = (state) => {
  const subscriptions = ['telemetry-MTDome-0-lightWindScreen'];
  const ligthWindScreen = getStreamsData(state, subscriptions);
  return {
    positionActualLightWindScreen: ligthWindScreen['telemetry-MTDome-0-lightWindScreen']
      ? ligthWindScreen['telemetry-MTDome-0-lightWindScreen'].positionActual.value
      : 0,
    positionCommandedLightWindScreen: ligthWindScreen['telemetry-MTDome-0-lightWindScreen']
      ? ligthWindScreen['telemetry-MTDome-0-lightWindScreen'].positionCommanded.value
      : 0,
    powerDrawLWS: ligthWindScreen['telemetry-MTDome-0-lightWindScreen']
      ? ligthWindScreen['telemetry-MTDome-0-lightWindScreen']
      : {},
  };
};

export const getPointingStatus = (state) => {
  const subscriptions = ['telemetry-MTMount-0-azimuth', 'telemetry-MTMount-0-elevation'];
  const pointingStatus = getStreamsData(state, subscriptions);
  return {
    currentPointingAz: pointingStatus['telemetry-MTMount-0-azimuth']
      ? pointingStatus['telemetry-MTMount-0-azimuth'].actualPosition.value
      : 0,
    targetPointingAz: pointingStatus['telemetry-MTMount-0-azimuth']
      ? pointingStatus['telemetry-MTMount-0-azimuth'].demandPosition.value
      : 0,
    currentPointingEl: pointingStatus['telemetry-MTMount-0-elevation']
      ? pointingStatus['telemetry-MTMount-0-elevation'].actualPosition.value
      : 0,
    targetPointingEl: pointingStatus['telemetry-MTMount-0-elevation']
      ? pointingStatus['telemetry-MTMount-0-elevation'].demandPosition.value
      : 0,
  };
};

export const getLouversStatus = (state) => {
  const subscriptions = ['telemetry-MTDome-0-louvers', 'telemetry-ATDome-0-position'];
  const louvers = getStreamsData(state, subscriptions);
  return {
    actualPositionLouvers: louvers['telemetry-MTDome-0-louvers']
      ? louvers['telemetry-MTDome-0-louvers'].positionActual.value
      : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    commandedPositionLouvers: louvers['telemetry-MTDome-0-louvers']
      ? louvers['telemetry-MTDome-0-louvers'].positionCommanded.value
      : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    powerDrawLouvers: louvers['telemetry-MTDome-0-louvers'] ? louvers['telemetry-MTDome-0-louvers'] : {},
    atDomePosition: louvers['telemetry-ATDome-0-position'] ? louvers['telemetry-ATDome-0-position'] : {},
  };
};

export const getDomeStatus = (state) => {
  const subscriptions = [
    'event-MTMount-0-target',
    'event-MTMount-0-summaryState',
    'event-MTDome-0-summaryState',
    'event-MTDome-0-azEnabled',
    'event-MTDome-0-azMotion',
    'event-MTDome-0-azTarget',
    'event-MTDome-0-operationalMode',
  ];
  const domeStatus = getStreamsData(state, subscriptions);
  return {
    trackId: domeStatus['event-MTMount-0-target']?.[0]?.trackId?.value ?? 0,
    mtDomeSummaryState: domeStatus['event-MTDome-0-summaryState']?.[0]?.summaryState?.value ?? 0,
    azimuthDomeState: domeStatus['event-MTDome-0-azEnabled']?.[0]?.state?.value ?? 0,
    azimuthDomeMotion: domeStatus['event-MTDome-0-azMotion']?.[0]?.state?.value ?? 0,
    azimuthDomeTarget: domeStatus['event-MTDome-0-azTarget']?.[0]?.position?.value ?? 0,
    modeDomeStatus: domeStatus['event-MTDome-0-operationalMode']?.[0]?.operationalMode?.value ?? 0,
    mtMountSummaryState: domeStatus['event-MTMount-0-summaryState']?.[0]?.summaryState?.value ?? 0,
  };
};

export const getMainTelescopeState = (state) => {
  const subscriptions = [
    'telemetry-MTPtg-0-mountStatus',
    'telemetry-MTPtg-0-mountPosition',
    'event-MTPtg-0-currentTarget',
  ];
  const data = getStreamsData(state, subscriptions);
  return {
    telescopeRAHour: data['telemetry-MTPtg-0-mountStatus']?.mountRA?.value ?? 0,
    telescopeRADeg: data['telemetry-MTPtg-0-mountPosition']?.ra?.value ?? 0,
    telescopeDecDeg: data['telemetry-MTPtg-0-mountStatus']?.mountDec?.value ?? 0,
    telescopeRotatorDeg: data['telemetry-MTPtg-0-mountStatus']?.mountRot?.value ?? 0,
    targetName: data['event-MTPtg-0-currentTarget']?.[0].targetName?.value ?? 'Unknown',
  };
};

// MTDome Power Draw
export const getMtDomePowerDraw = (state) => {
  const subscriptions = [
    'telemetry-MTDome-0-apertureShutter',
    'telemetry-MTDome-0-lightWindScreen',
    'telemetry-MTDome-0-louvers',
    'telemetry-MTDome-0-rearAccessDoor',
    'telemetry-ESS-301-temperature',
  ];
  const mtDomePowerDraw = getStreamsData(state, subscriptions);
  return {
    powerDrawRAD: mtDomePowerDraw['telemetry-MTDome-0-rearAccessDoor']?.powerDraw?.value ?? undefined,
    timestampRAD: mtDomePowerDraw['telemetry-MTDome-0-rearAccessDoor']?.timestamp?.value ?? undefined,
    powerDrawLouvers: mtDomePowerDraw['telemetry-MTDome-0-louvers']?.powerDraw?.value ?? undefined,
    timestampLouvers: mtDomePowerDraw['telemetry-MTDome-0-louvers']?.timestamp?.value ?? undefined,
    powerDrawShutter: mtDomePowerDraw['telemetry-MTDome-0-apertureShutter']?.powerDraw?.value ?? undefined,
    timestampShutter: mtDomePowerDraw['telemetry-MTDome-0-apertureShutter']?.timestamp?.value ?? undefined,

    //TODO: Once telemetries are created, add them here.
    powerDrawCalibration: undefined,
    timestampCalibration: undefined,
    powerDrawOBC: undefined,
    timestampOBC: undefined,
    powerDrawFans: undefined,
    timestampFans: undefined,
    powerDrawLWS: undefined,
    timestampLWS: undefined,
    powerDrawElectronics: undefined,
    timestampElectronics: undefined,
  };
};

// MTMount
/**
 * Selects the TMA status for summary view
 * @param {object} state
 */
export const getTMASummary = (state) => {
  const subscriptions = [
    'event-MTMount-0-target',
    'event-MTMount-0-commander',
    'event-MTMount-0-connected',
    'event-MTMount-0-balanceSystemState',
    'event-MTMount-0-summaryState',
  ];
  const summaryData = getStreamsData(state, subscriptions);
  return {
    trackId: summaryData['event-MTMount-0-target']?.[0]?.trackId?.value ?? 0,
    commander: summaryData['event-MTMount-0-commander']?.[0]?.commander?.value ?? 0,
    connected: summaryData['event-MTMount-0-connected']?.[0]?.connected?.value ?? undefined,
    balancing: summaryData['event-MTMount-0-balanceSystemState']?.[0]?.powerState?.value ?? 15,
    summaryState: summaryData['event-MTMount-0-summaryState']?.[0]?.summaryState?.value ?? 0,
  };
};

/**
 * Selects the Azimuth status for summary view
 * @param {object} state
 */
export const getAzimuthState = (state) => {
  const subscriptions = [
    'event-MTMount-0-azimuthSystemState',
    'event-MTMount-0-azimuthMotionState',
    'event-MTMount-0-azimuthLimits',
    'telemetry-MTMount-0-azimuth',
  ];
  const summaryData = getStreamsData(state, subscriptions);
  return {
    azimuthSystem: summaryData['event-MTMount-0-azimuthSystemState']?.[0]?.powerState?.value ?? 15,
    azimuthMotion: summaryData['event-MTMount-0-azimuthMotionState']?.[0]?.state?.value ?? undefined,
    azimuthLimits: summaryData['event-MTMount-0-azimuthLimits']?.[0]?.limits?.value ?? 0,
    azimuthActualPosition: summaryData['telemetry-MTMount-0-azimuth']?.actualPosition?.value ?? 0.0,
    azimuthDemandPosition: summaryData['telemetry-MTMount-0-azimuth']?.demandPosition?.value ?? 0.0,
  };
};

/**
 * Selects the Elevation status for summary view
 * @param {object} state
 */
export const getElevationState = (state) => {
  const subscriptions = [
    'event-MTMount-0-elevationSystemState',
    'event-MTMount-0-elevationMotionState',
    'event-MTMount-0-elevationLimits',
    'telemetry-MTMount-0-elevation',
  ];
  const summaryData = getStreamsData(state, subscriptions);
  return {
    elevationSystem: summaryData['event-MTMount-0-elevationSystemState']?.[0]?.powerState?.value ?? 15,
    elevationMotion: summaryData['event-MTMount-0-elevationMotionState']?.[0]?.state?.value ?? undefined,
    elevationLimits: summaryData['event-MTMount-0-elevationLimits']?.[0]?.limits?.value ?? 0,
    elevationActualPosition: summaryData['telemetry-MTMount-0-elevation']?.actualPosition?.value ?? 0.0,
    elevationDemandPosition: summaryData['telemetry-MTMount-0-elevation']?.demandPosition?.value ?? 0.0,
  };
};

/**
 * Selects the data of the drives of azimuth and elevation
 * @param {object} state
 */
export const getDrivesAzimuthElevationState = (state) => {
  const subscriptions = ['telemetry-MTMount-0-azimuthDrives', 'telemetry-MTMount-0-elevationDrives'];
  const drivesData = getStreamsData(state, subscriptions);
  return {
    azimuthDrives: drivesData['telemetry-MTMount-0-azimuthDrives']?.current?.value ?? [],
    elevationDrives: drivesData['telemetry-MTMount-0-elevationDrives']?.current?.value ?? [],
  };
};

/**
 * Selects the Mirror Covers status for Mirror Covers view
 * @param {object} state
 */
export const getMirrorCoversMotionState = (state) => {
  const subscriptions = ['event-MTMount-0-mirrorCoversMotionState', 'telemetry-MTMount-0-mirrorCover'];
  const summaryData = getStreamsData(state, subscriptions);
  return {
    mirrorCoversState: summaryData['event-MTMount-0-mirrorCoversMotionState']?.[0]?.elementsState?.value ?? [
      0, 0, 0, 0,
    ],
    mirrorCoversPosition: summaryData['telemetry-MTMount-0-mirrorCover']?.actualPosition?.value ?? [0, 0, 0, 0],
  };
};

export const getAircraftTracker = (state) => {
  const subscriptions = ['telemetry-AircraftTracker-0-data'];
  const data = getStreamsData(state, subscriptions);

  const aircraftId = data['telemetry-AircraftTracker-0-data']?.id?.value ?? [
    'SKU271',
    'LAN512',
    'LAN020',
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  const latitude = data['telemetry-AircraftTracker-0-data']?.latitude?.value ?? [
    -29.9604, -29.69192, -31.7404, 0, 0, 0, 0, 0, 0, 0,
  ];
  const longitude = data['telemetry-AircraftTracker-0-data']?.longitude?.value ?? [
    -70.33709, -72.05715, -70.8, 0, 0, 0, 0, 0, 0, 0,
  ];
  const altitude = data['telemetry-AircraftTracker-0-data']?.altitude?.value ?? [
    1013.2, 1020.34, 980.15, 0, 0, 0, 0, 0, 0, 0,
  ];
  const track = data['telemetry-AircraftTracker-0-data']?.track?.value ?? [180, 105, 350, 0, 0, 0, 0, 0, 0, 0];
  const distance = data['telemetry-AircraftTracker-0-data']?.distance?.value ?? [98, 146, 188, 0, 0, 0, 0, 0, 0, 0];
  const speed = data['telemetry-AircraftTracker-0-data']?.speed?.value ?? [800, 900, 1100, 0, 0, 0, 0, 0, 0, 0];

  let aircrafts = aircraftId.map((id, index) => {
    return {
      id: id,
      latitude: latitude[index],
      longitude: longitude[index],
      altitude: altitude[index],
      track: track[index],
      distance: distance[index],
      speed: speed[index],
    };
  });

  return {
    status: data['telemetry-AircraftTracker-0-data']?.status?.value ?? 0,
    aircrafts: aircrafts,
  };
};

// GIS
export const getRawStatus = (state) => {
  const subscriptions = ['event-GIS-0-rawStatus'];
  const interlocksData = getStreamsData(state, subscriptions);
  return {
    interlocksStatus: interlocksData['event-GIS-0-rawStatus']
      ? interlocksData['event-GIS-0-rawStatus'][0]?.status?.value
      : '0'.repeat(464),
  };
};

// MTIS
export const getMTIS = (state) => {
  const subscriptions = [
    'event-MTMount-0-safetyInterlocks',
    'event-MTDome-0-interlocks',
    'event-MTM1M3-0-interlockWarning',
  ];
  const mtInterlocksData = getStreamsData(state, subscriptions);
  return {
    mtMountSubcausesEmergencyStop:
      mtInterlocksData['event-MTMount-0-safetyInterlock']?.[0]?.subcausesEmergencyStop?.value ?? false,
    mtMountSubcausesLimitSwitch:
      mtInterlocksData['event-MTMount-0-safetyInterlock']?.[0]?.subcausesLimitSwitch?.value ?? false,
    mtMountSubcausesDeployablePlatform:
      mtInterlocksData['event-MTMount-0-safetyInterlock']?.[0]?.subcausesDeployablePlatform?.value ?? false,
    mtMountSubcausesDoorHatchLadder:
      mtInterlocksData['event-MTMount-0-safetyInterlock']?.[0]?.subcausesDoorHatchLadder?.value ?? false,
    mtMountSubcausesMirrorCover:
      mtInterlocksData['event-MTMount-0-safetyInterlock']?.[0]?.subcausesMirrorCover?.value ?? false,
    mtMountSubcausesLockingPin:
      mtInterlocksData['event-MTMount-0-safetyInterlock']?.[0]?.subcausesLockingPin?.value ?? false,
    mtMountSubcausesCapacitorDoor:
      mtInterlocksData['event-MTMount-0-safetyInterlock']?.[0]?.subcausesCapacitorDoor?.value ?? false,
    mtMountSubcausesBrakesFailed:
      mtInterlocksData['event-MTMount-0-safetyInterlock']?.[0]?.subcausesBrakesFailed?.value ?? false,
    mtDome: mtInterlocksData['event-MTDome-0-interlocks']?.[0]?.data?.value ?? '0'.repeat(16),
    mtM1m3HeartbeatStateOutputMismatch:
      mtInterlocksData['event-MTM1M3-0-interlockWarning']?.[0]?.heartbeatStateOutputMismatch?.value ?? false,
    mtM1m3AuxPowerNetworksOff:
      mtInterlocksData['event-MTM1M3-0-interlockWarning']?.[0]?.auxPowerNetworksOff?.value ?? false,
    mtM1m3ThermalEquipmentOff:
      mtInterlocksData['event-MTM1M3-0-interlockWarning']?.[0]?.thermalEquipmentOff?.value ?? false,
    mtM1m3AirSupplyOff: mtInterlocksData['event-MTM1M3-0-interlockWarning']?.[0]?.airSupplyOff?.value ?? false,
    mtM1m3TmaMotionStop: mtInterlocksData['event-MTM1M3-0-interlockWarning']?.[0]?.tmaMotionStop?.value ?? false,
    mtM1m3GisHeartbeatLost: mtInterlocksData['event-MTM1M3-0-interlockWarning']?.[0]?.gisHeartbeatLost?.value ?? false,
    mtM1m3CabinetDoorOpen: mtInterlocksData['event-MTM1M3-0-interlockWarning']?.[0]?.cabinetDoorOpen?.value ?? false,
  };
};

// Scheduler
export const getSchedulerSummaryState = (state, salindex) => {
  const subscriptions = [`event-Scheduler-${salindex}-summaryState`];
  const schedulerSummaryState = getStreamsData(state, subscriptions);
  return {
    schedulerState: schedulerSummaryState[`event-Scheduler-${salindex}-summaryState`]?.[0]?.summaryState?.value ?? 0,
  };
};

export const getDetailedState = (state, salindex) => {
  const subscriptions = [`event-Scheduler-${salindex}-detailedState`];
  const summaryData = getStreamsData(state, subscriptions);
  return {
    subState: summaryData[`event-Scheduler-${salindex}-detailedState`]?.[0]?.substate?.value ?? 0,
  };
};

export const getObservingMode = (state, salindex) => {
  const subscriptions = [`event-Scheduler-${salindex}-observingMode`];
  const observingMode = getStreamsData(state, subscriptions);
  return {
    mode: observingMode[`event-Scheduler-${salindex}-observingMode`]?.[0]?.mode?.value ?? 'No obs. mode',
    type: observingMode[`event-Scheduler-${salindex}-observingMode`]?.[0]?.type?.value ?? 'No type obs.',
  };
};

export const getGeneralInfo = (state, salindex) => {
  const subscriptions = [`event-Scheduler-${salindex}-generalInfo`];
  const generalInfo = getStreamsData(state, subscriptions);
  return {
    isNigth: generalInfo[`event-Scheduler-${salindex}-generalInfo`]?.[0]?.isNigth?.value ?? false,
    night: generalInfo[`event-Scheduler-${salindex}-generalInfo`]?.[0]?.nigth?.value ?? 0,
    sunset: generalInfo[`event-Scheduler-${salindex}-generalInfo`]?.[0]?.sunset?.value ?? 0,
    sunrise: generalInfo[`event-Scheduler-${salindex}-generalInfo`]?.[0]?.sunrise?.value ?? 0,
  };
};

export const getFilterSwap = (state, salindex) => {
  const subscriptions = [`event-Scheduler-${salindex}-needFilterSwap`];
  const filterSwap = getStreamsData(state, subscriptions);
  return {
    needSwap: filterSwap[`event-Scheduler-${salindex}-needFilterSwap`]?.[0]?.needSwap?.value ?? false,
    filterToMount: filterSwap[`event-Scheduler-${salindex}-needFilterSwap`]?.[0]?.filterToMount?.value ?? '',
    filterToUnmount: filterSwap[`event-Scheduler-${salindex}-needFilterSwap`]?.[0]?.filterToUnmount?.value ?? '',
  };
};

export const getObservatoryStatus = (state, salindex) => {
  const subscriptions = [`telemetry-Scheduler-${salindex}-observatoryState`, `event-Scheduler-${salindex}-target`];
  const observatoryStatus = getStreamsData(state, subscriptions);
  return {
    pointingRa: observatoryStatus[`telemetry-Scheduler-${salindex}-observatoryState`]?.ra?.value ?? 0.0,
    pointingDecl: observatoryStatus[`telemetry-Scheduler-${salindex}-observatoryState`]?.declination?.value ?? 0.0,
    pointingPosAngle:
      observatoryStatus[`telemetry-Scheduler-${salindex}-observatoryState`]?.positionAngle?.value ?? 0.0,
    pointingParallAngle:
      observatoryStatus[`telemetry-Scheduler-${salindex}-observatoryState`]?.parallacticAngle?.value ?? 0.0,
    simonyiTracking: observatoryStatus[`telemetry-Scheduler-${salindex}-observatoryState`]?.tacking?.value ?? false,
    simonyiAl: observatoryStatus[`telemetry-Scheduler-${salindex}-observatoryState`]?.telescopeAltitude?.value ?? 0.0,
    simonyiAz: observatoryStatus[`telemetry-Scheduler-${salindex}-observatoryState`]?.telescopeAzimuth?.value ?? 0.0,
    simonyiRot: observatoryStatus[`telemetry-Scheduler-${salindex}-observatoryState`]?.telescopeRotator?.value ?? 0.0,
    domeAlt: observatoryStatus[`telemetry-Scheduler-${salindex}-observatoryState`]?.domeAltitude?.value ?? 0.0,
    domeAz: observatoryStatus[`telemetry-Scheduler-${salindex}-observatoryState`]?.domeAzimuth?.value ?? 0,
    moonRa: observatoryStatus[`event-Scheduler-${salindex}-target`]?.[0]?.moonRa?.value ?? 0.0,
    moonDec: observatoryStatus[`event-Scheduler-${salindex}-target`]?.[0]?.moonDec?.value ?? 0.0,
    moonAlt: observatoryStatus[`event-Scheduler-${salindex}-target`]?.[0]?.moonAlt?.value ?? 0.0,
    moonAz: observatoryStatus[`event-Scheduler-${salindex}-target`]?.[0]?.moonAz?.value ?? 0.0,
    moonDistance: observatoryStatus[`event-Scheduler-${salindex}-target`]?.[0]?.moonDistance?.value ?? 0.0,
    moonPhase: observatoryStatus[`event-Scheduler-${salindex}-target`]?.[0]?.moonPhase?.value ?? 0.0,
    sunRa: observatoryStatus[`event-Scheduler-${salindex}-target`]?.[0]?.sunRa?.value ?? 0.0,
    sunDec: observatoryStatus[`event-Scheduler-${salindex}-target`]?.[0]?.sunDec?.value ?? 0.0,
    sunAlt: observatoryStatus[`event-Scheduler-${salindex}-target`]?.[0]?.sunAlt?.value ?? 0.0,
    sunAz: observatoryStatus[`event-Scheduler-${salindex}-target`]?.[0]?.sunAz?.value ?? 0.0,
    solarElong: observatoryStatus[`event-Scheduler-${salindex}-target`]?.[0]?.solarElong?.value ?? 0.0,
  };
};

export const getCurrentTargetInfo = (state, salindex) => {
  const subscriptions = [`event-Scheduler-${salindex}-target`];
  const currentTarget = getStreamsData(state, subscriptions);
  return {
    currentTargetId: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.targetId?.value ?? 0.0,
    currentRequestTime: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.requestTime?.value ?? 0.0,
    currentRequestMjd: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.requestMjd?.value ?? 0.0,
    currentRa: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.ra?.value ?? 0.0,
    currentDecl: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.decl?.value ?? 0.0,
    currentSkyAngle: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.skyAngle?.value ?? 0.0,
    currentFilter: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.filter?.value ?? 'No filter selected',
    currentNumExposures: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.numExposures?.value ?? 0.0,
    currentExposureTimes: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.exposureTimes?.value ?? [],
    currentSlewTime: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.slewTime?.value ?? 0.0,
    currentOffsetX: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.offsetX?.value ?? 0.0,
    currentOffsetY: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.offsetY?.value ?? 0.0,
    currentNumProposals: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.numProposals?.value ?? 0.0,
    currentProposalId: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.proposalId?.value ?? [],
    currentSequenceDuration: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.sequenceDuration?.value ?? 0.0,
    currentSequenceNVisits: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.sequenceNVisits?.value ?? 0.0,
    currentSequenceVisits: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.sequenceVisits?.value ?? 0.0,
    airmass: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.airmass?.value ?? 0.0,
    skyBrightness: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.skyBrightness?.value ?? 0.0,
    cloud: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.cloud?.value ?? 0.0,
    seeing: currentTarget[`event-Scheduler-${salindex}-target`]?.[0]?.seeing?.value ?? 0.0,
  };
};

export const getSkyMapInfo = (state, salindex) => {
  const subscriptions = [
    [`event-Scheduler-${salindex}-observation`],
    [`event-Scheduler-${salindex}-predictedSchedule`],
  ];
  const skyMapInfo = getStreamsData(state, subscriptions);
  return {
    rotSkyPos: skyMapInfo[`event-Scheduler-${salindex}-observation`]?.[0]?.rotSkyPos?.value ?? 0,
    predictedTargetsRa: skyMapInfo[`event-Scheduler-${salindex}-predictedSchedule`]?.[0]?.ra?.value ?? [],
    predictedTargetsDecl: skyMapInfo[`event-Scheduler-${salindex}-predictedSchedule`]?.[0]?.decl?.value ?? [],
    predictedTargetsRotSkyPos: skyMapInfo[`event-Scheduler-${salindex}-predictedSchedule`]?.[0]?.rotSkyPos?.value ?? [],
  };
};

export const lastTargetInfo = (state, salindex) => {
  const subscriptions = [`event-Scheduler-${salindex}-observation`];
  const lastTarget = getStreamsData(state, subscriptions);
  return {
    lastTargetId: lastTarget[`event-Scheduler-${salindex}-observation`]?.[0]?.targetId?.value ?? 0,
    lastTargetRa: lastTarget[`event-Scheduler-${salindex}-observation`]?.[0]?.ra?.value ?? 0.0,
    lastTargetDecl: lastTarget[`event-Scheduler-${salindex}-observation`]?.[0]?.decl?.value ?? 0.0,
    lastTargetRotSkyPos: lastTarget[`event-Scheduler-${salindex}-observation`]?.[0]?.rotSkyPos?.value ?? 0.0,
    lastTargetMjd: lastTarget[`event-Scheduler-${salindex}-observation`]?.[0]?.mjd?.value ?? 0.0,
    lastTargetExpTime: lastTarget[`event-Scheduler-${salindex}-observation`]?.[0]?.exptime?.value ?? 0.0,
    lastTargetFilter: lastTarget[`event-Scheduler-${salindex}-observation`]?.[0]?.filter?.value ?? 'No filter selected',
    lastTargetNexp: lastTarget[`event-Scheduler-${salindex}-observation`]?.[0]?.nexp?.value ?? 0,
    lastTargetMoreInfo:
      lastTarget[`event-Scheduler-${salindex}-observation`]?.[0]?.additionalInformation?.value ?? 'Without information',
  };
};

export const nextTargetInfo = (state, salindex) => {
  const subscriptions = [`event-Scheduler-${salindex}-timeToNextTarget`];
  const nextTarget = getStreamsData(state, subscriptions);
  return {
    nextTargetCurrentTime: nextTarget[`event-Scheduler-${salindex}-timeToNextTarget`]?.[0]?.currentTime?.value ?? 0.0,
    nextTimeWaitTime: nextTarget[`event-Scheduler-${salindex}-timeToNextTarget`]?.[0]?.waitTime?.value ?? 0.0,
    nextTargetRa: nextTarget[`event-Scheduler-${salindex}-timeToNextTarget`]?.[0]?.ra?.value ?? 0.0,
    nextTargetDecl: nextTarget[`event-Scheduler-${salindex}-timeToNextTarget`]?.[0]?.decl?.value ?? 0.0,
    nextTargetRotSkyPos: nextTarget[`event-Scheduler-${salindex}-timeToNextTarget`]?.[0]?.rotSkyPos?.value ?? 0.0,
  };
};

export const predictedTargetsInfo = (state, salindex) => {
  const subscriptions = [`event-Scheduler-${salindex}-predictedSchedule`];
  const predictedTargets = getStreamsData(state, subscriptions);
  return {
    predTargetsNumTargets:
      predictedTargets[`event-Scheduler-${salindex}-predictedSchedule`]?.[0]?.numberOfTargets?.value ?? 0,
    predTargetsRa: predictedTargets[`event-Scheduler-${salindex}-predictedSchedule`]?.[0]?.ra?.value ?? [],
    predTargetsDecl: predictedTargets[`event-Scheduler-${salindex}-predictedSchedule`]?.[0]?.decl?.value ?? [],
    predTargetsRotSkyPos:
      predictedTargets[`event-Scheduler-${salindex}-predictedSchedule`]?.[0]?.rotSkyPos?.value ?? [],
    predTargetsMjd: predictedTargets[`event-Scheduler-${salindex}-predictedSchedule`]?.[0]?.mjd?.value ?? [],
    predTargetsExpTime: predictedTargets[`event-Scheduler-${salindex}-predictedSchedule`]?.[0]?.exptime?.value ?? [],
    predTargetsInstrConfig:
      predictedTargets[`event-Scheduler-${salindex}-predictedSchedule`]?.[0]?.instrumentConfiguration?.value ??
      'No instrument conf.',
    predTargetsNexp: predictedTargets[`event-Scheduler-${salindex}-predictedSchedule`]?.[0]?.nexp?.value ?? [],
  };
};

export const getSurveysInfo = (state, salindex) => {
  const subscriptions = [`event-Scheduler-${salindex}-surveyTopology`];
  const surveys = getStreamsData(state, subscriptions);
  return {
    surveysNumGenProps: surveys[`event-Scheduler-${salindex}-surveyTopology`]?.[0]?.numGeneralProps?.value ?? 0,
    surveysGenProps: surveys[`event-Scheduler-${salindex}-surveyTopology`]?.[0]?.generalPropos?.value ?? '',
    surveysNumSeqProps: surveys[`event-Scheduler-${salindex}-surveyTopology`]?.[0]?.numSeqProps?.value ?? 0,
    surveysSeqProps: surveys[`event-Scheduler-${salindex}-surveyTopology`]?.[0]?.sequencePropos?.value ?? '',
  };
};

export const getBlocksInfo = (state, salindex) => {
  const subscriptions = [`event-Scheduler-${salindex}-blockInventory`, `event-Scheduler-${salindex}-blockStatus`];
  const blocks = getStreamsData(state, subscriptions);
  return {
    blockInvId: blocks[`event-Scheduler-${salindex}-blockInventory`]?.[0]?.ids?.value ?? '',
    blockInvStatus: blocks[`event-Scheduler-${salindex}-blockInventory`]?.[0]?.status?.value ?? '',
    blockId: blocks[`event-Scheduler-${salindex}-blockStatus`]?.[0]?.id?.value ?? '',
    blockStatusId: blocks[`event-Scheduler-${salindex}-blockStatus`]?.[0]?.statusId?.value ?? 0,
    blockStatus: blocks[`event-Scheduler-${salindex}-blockStatus`]?.[0]?.status?.value ?? '',
    blockExecCompl: blocks[`event-Scheduler-${salindex}-blockStatus`]?.[0]?.executionsCompleted?.value ?? 0,
    blockExecTotal: blocks[`event-Scheduler-${salindex}-blockStatus`]?.[0]?.executionsTotal?.value ?? 0,
    blockHash: blocks[`event-Scheduler-${salindex}-blockStatus`]?.[0]?.hash?.value ?? '',
    blockDef: blocks[`event-Scheduler-${salindex}-blockStatus`]?.[0]?.definition?.value ?? '',
  };
};

// CCCamera Summary Detail
export const getCCCameraSummary = (state) => {
  const subscriptions = [
    'event-CCCamera-0-summaryState',
    'event-CCCamera-0-ccsCommandState',
    'event-CCCamera-0-calibrationDetailedState',
    'event-CCCamera-0-offlineDetailedState',
    'event-CCCamera-0-imageReadinessDetailedState',
    'event-CCCamera-0-shutterDetailedState',
    'event-CCCamera-0-filterChangerDetailedState',
    'event-CCCamera-0-raftsDetailedState',
  ];
  const summaryData = getStreamsData(state, subscriptions);
  return {
    cccameraSummaryState: summaryData['event-CCCamera-0-summaryState']?.[0]?.summaryState.value ?? 0,
    cccameraCcsCmdState: summaryData['event-CCCamera-0-ccsCommandState']?.[0]?.substate.value ?? 0,
    cccameraCalibrationDetailedStatus:
      summaryData['event-CCCamera-0-calibrationDetailedState']?.[0]?.substate.value ?? 0,
    cccameraOffLineDetailedState: summaryData['event-CCCamera-0-offlineDetailedState']?.[0]?.substate.value ?? 0,
    cccameraImageReadinessDetailedState:
      summaryData['event-CCCamera-0-imageReadinessDetailedState']?.[0]?.substate.value ?? 0,
    ccCameraShutterDetailedState: summaryData['event-CCCamera-0-shutterDetailedState']?.[0]?.substate.value ?? 0,
    ccCameraFilterChangerDetailedState:
      summaryData['event-CCCamera-0-filterChangerDetailedState']?.[0]?.substate.value ?? 0,
    ccCameraRaftsDetailedState: summaryData['event-CCCamera-0-raftsDetailedState']?.[0]?.substate.value ?? 0,
  };
};

// CCCamera
export const getCCStartIntegration = (state) => {
  const subscriptions = ['event-CCCamera-0-startIntegration'];
  const startIntegrationData = getStreamsData(state, subscriptions);
  return {
    imagesInSequence: startIntegrationData['event-CCCamera-0-startIntegration']?.[0]?.imagesInSequence.value ?? 0,
    imageName: startIntegrationData['event-CCCamera-0-startIntegration']?.[0]?.imageName.value ?? '',
    imageIndex: startIntegrationData['event-CCCamera-0-startIntegration']?.[0]?.imageIndex.value ?? 0,
    imageSource: startIntegrationData['event-CCCamera-0-startIntegration']?.[0]?.imageSource.value ?? '',
    imageController: startIntegrationData['event-CCCamera-0-startIntegration']?.[0]?.imageController.value ?? '',
    imageDate: startIntegrationData['event-CCCamera-0-startIntegration']?.[0]?.imageDate.value ?? '',
    imageNumber: startIntegrationData['event-CCCamera-0-startIntegration']?.[0]?.imageNumber.value ?? 0,
    timestampAcquisitionStart:
      startIntegrationData['event-CCCamera-0-startIntegration']?.[0]?.timestampAcquisitionStart.value ?? 0,
    exposureTime: startIntegrationData['event-CCCamera-0-startIntegration']?.[0]?.exposureTime.value ?? '',
    mode: startIntegrationData['event-CCCamera-0-startIntegration']?.[0]?.mode.value ?? '',
    timeout: startIntegrationData['event-CCCamera-0-startIntegration']?.[0]?.timeout.value ?? 0,
  };
};

export const getCCStartReadout = (state) => {
  const subscriptions = ['event-CCCamera-0-startReadout'];
  const startReadOutData = getStreamsData(state, subscriptions);
  return {
    imagesInSequenceSReadout: startReadOutData['event-CCCamera-0-startReadout']?.[0]?.imagesInSequence.value ?? 0,
    imageNameSReadout: startReadOutData['event-CCCamera-0-startReadout']?.[0]?.imageName.value ?? '',
    imageIndexSReadout: startReadOutData['event-CCCamera-0-startReadout']?.[0]?.imageIndex.value ?? 0,
    imageSourceSReadout: startReadOutData['event-CCCamera-0-startReadout']?.[0]?.imageSource.value ?? '',
    imageControllerSReadout: startReadOutData['event-CCCamera-0-startReadout']?.[0]?.imageController.value ?? '',
    imageDateSReadout: startReadOutData['event-CCCamera-0-startReadout']?.[0]?.imageDate.value ?? '',
    imageNumberSReadout: startReadOutData['event-CCCamera-0-startReadout']?.[0]?.imageNumber.value ?? 0,
    timestampAcquisitionStartSReadout:
      startReadOutData['event-CCCamera-0-startReadout']?.[0]?.timestampAcquisitionStart.value ?? 0,
    exposureTimeSReadout: startReadOutData['event-CCCamera-0-startReadout']?.[0]?.exposureTime.value ?? 0,
    timestampStartOfReadoutSReadout:
      startReadOutData['event-CCCamera-0-startReadout']?.[0]?.timestampStartOfReadout.value ?? 0,
  };
};

export const getCCEndReadout = (state) => {
  const subscriptions = ['event-CCCamera-0-endReadout'];
  const endReadOutData = getStreamsData(state, subscriptions);
  return {
    imagesInSequenceEReadout: endReadOutData['event-CCCamera-0-endReadout']?.[0]?.imagesInSequence.value ?? 0,
    imageNameEReadout: endReadOutData['event-CCCamera-0-endReadout']?.[0]?.imageName.value ?? '',
    imageIndexEReadout: endReadOutData['event-CCCamera-0-endReadout']?.[0]?.imageIndex.value ?? 0,
    imageSourceEReadout: endReadOutData['event-CCCamera-0-endReadout']?.[0]?.imageSource.value ?? '',
    imageControllerEReadout: endReadOutData['event-CCCamera-0-endReadout']?.[0]?.imageController.value ?? '',
    imageDateEReadout: endReadOutData['event-CCCamera-0-endReadout']?.[0]?.imageDate.value ?? '',
    imageNumberEReadout: endReadOutData['event-CCCamera-0-endReadout']?.[0]?.imageNumber.value ?? 0,
    timestampAcquisitionStartEReadout:
      endReadOutData['event-CCCamera-0-endReadout']?.[0]?.timestampAcquisitionStart.value ?? 0,
    requestedExposureTimeEReadout: endReadOutData['event-CCCamera-0-endReadout']?.[0]?.requestedExposureTime.value ?? 0,
    timestampEndOfReadoutEReadout: endReadOutData['event-CCCamera-0-endReadout']?.[0]?.timestampEndOfReadout.value ?? 0,
  };
};

export const getCCEndOfImageTelemetry = (state) => {
  const subscriptions = ['event-CCCamera-0-endOfImageTelemetry'];
  const endOfImageTelemetryData = getStreamsData(state, subscriptions);
  return {
    imagesInSequenceTelemetry:
      endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.imagesInSequence.value ?? 0,
    imageNameTelemetry: endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.imageName.value ?? '',
    imageIndexTelemetry: endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.imageIndex.value ?? 0,
    imageSourceTelemetry: endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.imageSource.value ?? '',
    imageControllerTelemetry:
      endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.imageController.value ?? '',
    imageDateTelemetry: endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.imageDate.value ?? '',
    imageNumberTelemetry: endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.imageNumber.value ?? 0,
    timestampAcquisitionStartTelemetry:
      endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.timestampAcquisitionStart.value ?? 0,
    exposureTimeTelemetry:
      endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.exposureTime.value ?? 0,
    imageTagTelemetry: endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.imageTag.value ?? '',
    timestampDateObsTelemetry:
      endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.timestampDateObs.value ?? 0,
    timestampDateEndTelemetry:
      endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.timestampDateEnd.value ?? 0,
    measuredShutterOpenTimeTelemetry:
      endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.measuredShutterOpenTime.value ?? 0,
    darkTimeTelemetry: endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.darkTime.value ?? 0,
    emulatedImageTelemetry:
      endOfImageTelemetryData['event-CCCamera-0-endOfImageTelemetry']?.[0]?.emulatedImage.value ?? '',
  };
};

export const getCCTempControlStatus = (state) => {
  const subscriptions = ['event-CCCamera-0-focal_plane_Raft_RaftTempControlStatusConfiguration'];
  const tempControlData = getStreamsData(state, subscriptions);
  return {
    tempControlActive:
      tempControlData['event-CCCamera-0-focal_plane_Raft_RaftTempControlStatusConfiguration']?.[0]?.tempcontrol_active
        .value ?? [],
  };
};

export const getCCFocalPlaneReb = (state) => {
  const subscriptions = ['telemetry-CCCamera-0-focal_plane_Reb'];
  const focalPlaneReb = getStreamsData(state, subscriptions);
  return {
    hVBiasSwitch: focalPlaneReb['telemetry-CCCamera-0-focal_plane_Reb']?.hVBiasSwitch.value ?? [],
    anaV: focalPlaneReb['telemetry-CCCamera-0-focal_plane_Reb']?.anaV.value ?? [],
    power: focalPlaneReb['telemetry-CCCamera-0-focal_plane_Reb']?.power.value ?? [],
  };
};

export const getCCFocalPlaneCCD = (state) => {
  const subscriptions = ['telemetry-CCCamera-0-focal_plane_Ccd'];
  const focalPlaneCCD = getStreamsData(state, subscriptions);
  return {
    gDV: focalPlaneCCD['telemetry-CCCamera-0-focal_plane_Ccd']?.gDV.value ?? [],
    oDV: focalPlaneCCD['telemetry-CCCamera-0-focal_plane_Ccd']?.oDV.value ?? [],
    oGV: focalPlaneCCD['telemetry-CCCamera-0-focal_plane_Ccd']?.oGV.value ?? [],
    rDV: focalPlaneCCD['telemetry-CCCamera-0-focal_plane_Ccd']?.rDV.value ?? [],
    temp: focalPlaneCCD['telemetry-CCCamera-0-focal_plane_Ccd']?.temp.value ?? [],
  };
};

//MTCamera
export const getMTCameraSummary = (state) => {
  const subscriptions = [
    'event-MTCamera-0-summaryState',
    'event-MTCamera-0-ccsCommandState',
    'event-MTCamera-0-calibrationDetailedState',
    'event-MTCamera-0-offlineDetailedState',
    'event-MTCamera-0-imageReadinessDetailedState',
    'event-MTCamera-0-shutterDetailedState',
    'event-MTCamera-0-filterChangerDetailedState',
    'event-MTCamera-0-raftsDetailedState',
  ];
  const summaryData = getStreamsData(state, subscriptions);
  return {
    mtcameraSummaryState: summaryData['event-MTCamera-0-summaryState']?.[0]?.summaryState.value ?? 0,
    mtcameraCcsCmdState: summaryData['event-MTCamera-0-ccsCommandState']?.[0]?.substate.value ?? 0,
    mtcameraCalibrationDetailedStatus:
      summaryData['event-MTCamera-0-calibrationDetailedState']?.[0]?.substate.value ?? 0,
    mtcameraOffLineDetailedState: summaryData['event-MTCamera-0-offlineDetailedState']?.[0]?.substate.value ?? 0,
    mtcameraImageReadinessDetailedState:
      summaryData['event-MTCamera-0-imageReadinessDetailedState']?.[0]?.substate.value ?? 0,
    mtCameraShutterDetailedState: summaryData['event-MTCamera-0-shutterDetailedState']?.[0]?.substate.value ?? 0,
    mtCameraFilterChangerDetailedState:
      summaryData['event-MTCamera-0-filterChangerDetailedState']?.[0]?.substate.value ?? 0,
    mtCameraRaftsDetailedState: summaryData['event-MTCamera-0-raftsDetailedState']?.[0]?.substate.value ?? 0,
  };
};

export const getStartIntegration = (state) => {
  const subscriptions = ['event-MTCamera-0-startIntegration'];
  const startIntegrationData = getStreamsData(state, subscriptions);
  return {
    imagesInSequenceInt: startIntegrationData['event-MTCamera-0-startIntegration']?.[0]?.imagesInSequence.value ?? 0,
    imageNameInt: startIntegrationData['event-MTCamera-0-startIntegration']?.[0]?.imageName.value ?? '',
    imageIndexInt: startIntegrationData['event-MTCamera-0-startIntegration']?.[0]?.imageIndex.value ?? 0,
    imageSourceInt: startIntegrationData['event-MTCamera-0-startIntegration']?.[0]?.imageSource.value ?? '',
    imageControllerInt: startIntegrationData['event-MTCamera-0-startIntegration']?.[0]?.imageController.value ?? '',
    imageDateInt: startIntegrationData['event-MTCamera-0-startIntegration']?.[0]?.imageDate.value ?? '',
    imageNumberInt: startIntegrationData['event-MTCamera-0-startIntegration']?.[0]?.imageNumber.value ?? 0,
    timestampAcquisitionStartInt:
      startIntegrationData['event-MTCamera-0-startIntegration']?.[0]?.timestampAcquisitionStart.value ?? 0,
    exposureTimeInt: startIntegrationData['event-MTCamera-0-startIntegration']?.[0]?.exposureTime.value ?? '',
    modeInt: startIntegrationData['event-MTCamera-0-startIntegration']?.[0]?.mode.value ?? '',
    timeoutInt: startIntegrationData['event-MTCamera-0-startIntegration']?.[0]?.timeout.value ?? 0,
  };
};

export const getStartReadout = (state) => {
  const subscriptions = ['event-MTCamera-0-startReadout'];
  const startReadOutData = getStreamsData(state, subscriptions);
  return {
    imagesInSequenceSReadout: startReadOutData['event-MTCamera-0-startReadout']?.[0]?.imagesInSequence.value ?? 0,
    imageNameSReadout: startReadOutData['event-MTCamera-0-startReadout']?.[0]?.imageName.value ?? '',
    imageIndexSReadout: startReadOutData['event-MTCamera-0-startReadout']?.[0]?.imageIndex.value ?? 0,
    imageSourceSReadout: startReadOutData['event-MTCamera-0-startReadout']?.[0]?.imageSource.value ?? '',
    imageControllerSReadout: startReadOutData['event-MTCamera-0-startReadout']?.[0]?.imageController.value ?? '',
    imageDateSReadout: startReadOutData['event-MTCamera-0-startReadout']?.[0]?.imageDate.value ?? '',
    imageNumberSReadout: startReadOutData['event-MTCamera-0-startReadout']?.[0]?.imageNumber.value ?? 0,
    timestampAcquisitionStartSReadout:
      startReadOutData['event-MTCamera-0-startReadout']?.[0]?.timestampAcquisitionStart.value ?? 0,
    exposureTimeSReadout: startReadOutData['event-MTCamera-0-startReadout']?.[0]?.exposureTime.value ?? 0,
    timestampStartOfReadoutSReadout:
      startReadOutData['event-MTCamera-0-startReadout']?.[0]?.timestampStartOfReadout.value ?? 0,
  };
};

export const getEndReadout = (state) => {
  const subscriptions = ['event-MTCamera-0-endReadout'];
  const endReadOutData = getStreamsData(state, subscriptions);
  return {
    imagesInSequenceEReadout: endReadOutData['event-MTCamera-0-endReadout']?.[0]?.imagesInSequence.value ?? 0,
    imageNameEReadout: endReadOutData['event-MTCamera-0-endReadout']?.[0]?.imageName.value ?? '',
    imageIndexEReadout: endReadOutData['event-MTCamera-0-endReadout']?.[0]?.imageIndex.value ?? 0,
    imageSourceEReadout: endReadOutData['event-MTCamera-0-endReadout']?.[0]?.imageSource.value ?? '',
    imageControllerEReadout: endReadOutData['event-MTCamera-0-endReadout']?.[0]?.imageController.value ?? '',
    imageDateEReadout: endReadOutData['event-MTCamera-0-endReadout']?.[0]?.imageDate.value ?? '',
    imageNumberEReadout: endReadOutData['event-MTCamera-0-endReadout']?.[0]?.imageNumber.value ?? 0,
    timestampAcquisitionStartEReadout:
      endReadOutData['event-MTCamera-0-endReadout']?.[0]?.timestampAcquisitionStart.value ?? 0,
    requestedExposureTimeEReadout: endReadOutData['event-MTCamera-0-endReadout']?.[0]?.requestedExposureTime.value ?? 0,
    timestampEndOfReadoutEReadout: endReadOutData['event-MTCamera-0-endReadout']?.[0]?.timestampEndOfReadout.value ?? 0,
  };
};

export const getEndOfImageTelemetry = (state) => {
  const subscriptions = ['event-MTCamera-0-endOfImageTelemetry'];
  const endOfImageTelemetryData = getStreamsData(state, subscriptions);
  return {
    imagesInSequenceTelemetry:
      endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.imagesInSequence.value ?? 0,
    imageNameTelemetry: endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.imageName.value ?? '',
    imageIndexTelemetry: endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.imageIndex.value ?? 0,
    imageSourceTelemetry: endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.imageSource.value ?? '',
    imageControllerTelemetry:
      endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.imageController.value ?? '',
    imageDateTelemetry: endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.imageDate.value ?? '',
    imageNumberTelemetry: endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.imageNumber.value ?? 0,
    timestampAcquisitionStartTelemetry:
      endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.timestampAcquisitionStart.value ?? 0,
    exposureTimeTelemetry:
      endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.exposureTime.value ?? 0,
    imageTagTelemetry: endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.imageTag.value ?? '',
    timestampDateObsTelemetry:
      endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.timestampDateObs.value ?? 0,
    timestampDateEndTelemetry:
      endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.timestampDateEnd.value ?? 0,
    measuredShutterOpenTimeTelemetry:
      endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.measuredShutterOpenTime.value ?? 0,
    darkTimeTelemetry: endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.darkTime.value ?? 0,
    emulatedImageTelemetry:
      endOfImageTelemetryData['event-MTCamera-0-endOfImageTelemetry']?.[0]?.emulatedImage.value ?? '',
  };
};

export const getTempControlStatus = (state) => {
  const subscriptions = ['event-MTCamera-0-focal_plane_Raft_RaftTempControlStatusConfiguration'];
  const tempControlData = getStreamsData(state, subscriptions);
  return {
    tempControlActive:
      tempControlData['event-MTCamera-0-focal_plane_Raft_RaftTempControlStatusConfiguration']?.[0]?.tempcontrol_active
        .value ?? [],
  };
};

export const getFocalPlaneReb = (state) => {
  const subscriptions = ['telemetry-MTCamera-0-focal_plane_Reb'];
  const focalPlaneReb = getStreamsData(state, subscriptions);
  return {
    hVBiasSwitch: focalPlaneReb['telemetry-MTCamera-0-focal_plane_Reb']?.hVBiasSwitch.value ?? [],
    anaV: focalPlaneReb['telemetry-MTCamera-0-focal_plane_Reb']?.anaV.value ?? [],
    power: focalPlaneReb['telemetry-MTCamera-0-focal_plane_Reb']?.power.value ?? [],
  };
};

export const getFocalPlaneCCD = (state) => {
  const subscriptions = ['telemetry-MTCamera-0-focal_plane_Ccd'];
  const focalPlaneCCD = getStreamsData(state, subscriptions);
  return {
    gDV: focalPlaneCCD['telemetry-MTCamera-0-focal_plane_Ccd']?.gDV.value ?? [],
    oDI: focalPlaneCCD['telemetry-MTCamera-0-focal_plane_Ccd']?.oDI.value ?? [],
    oDV: focalPlaneCCD['telemetry-MTCamera-0-focal_plane_Ccd']?.oDV.value ?? [],
    oGV: focalPlaneCCD['telemetry-MTCamera-0-focal_plane_Ccd']?.oGV.value ?? [],
    rDV: focalPlaneCCD['telemetry-MTCamera-0-focal_plane_Ccd']?.rDV.value ?? [],
    temp: focalPlaneCCD['telemetry-MTCamera-0-focal_plane_Ccd']?.temp.value ?? [],
  };
};

/**
 * Selects the Weather Forecast State for Weather Forecat view
 * @param {object} state
 */
export const getWeatherForecastState = (state) => {
  const subscriptions = ['event-WeatherForecast-0-summaryState'];
  const summaryData = getStreamsData(state, subscriptions);
  return {
    weatherForecastState: summaryData['event-WeatherForecast-0-summaryState']?.[0]?.summaryState.value ?? 0,
  };
};

/**
 * Selects the Weather Forecast Daily Trend
 * @param {object} state
 */
export const getInfoHeaderDailyTrend = (state) => {
  const subscriptions = ['telemetry-WeatherForecast-0-dailyTrend'];
  const dailyTrendData = getStreamsData(state, subscriptions);
  return {
    timestamp: dailyTrendData['telemetry-WeatherForecast-0-dailyTrend']?.timestamp.value ?? [],
    pictocode: dailyTrendData['telemetry-WeatherForecast-0-dailyTrend']?.pictocode.value ?? [],
    temperatureMax: dailyTrendData['telemetry-WeatherForecast-0-dailyTrend']?.temperatureMax.value ?? [],
    temperatureMin: dailyTrendData['telemetry-WeatherForecast-0-dailyTrend']?.temperatureMin.value ?? [],
    predictability: dailyTrendData['telemetry-WeatherForecast-0-dailyTrend']?.predictability.value ?? [],
    predictabilityClass: dailyTrendData['telemetry-WeatherForecast-0-dailyTrend']?.predictabilityClass.value ?? [],
  };
};

/**
 * Selects the Weather Forecast sHourly Trend
 * @param {object} state
 */
export const getInfoHeaderHourlyTrend = (state) => {
  const subscriptions = ['telemetry-WeatherForecast-0-hourlyTrend'];
  const hourlyTrendData = getStreamsData(state, subscriptions);
  return {
    timestamp: hourlyTrendData['telemetry-WeatherForecast-0-hourlyTrend']?.timestamp.value ?? [],
    pictocode: hourlyTrendData['telemetry-WeatherForecast-0-hourlyTrend']?.pictocode.value ?? [],
    temperature: hourlyTrendData['telemetry-WeatherForecast-0-hourlyTrend']?.temperature.value ?? [],
    temperatureSpread: hourlyTrendData['telemetry-WeatherForecast-0-hourlyTrend']?.temperatureSpread.value ?? [],
  };
};

/**
 * Returns events related to the LATISS instrument in the state.
 *
 * @param {obj} state
 */
export const getLATISSState = (state) => {
  const latissSubscriptions = [
    // Spectrograph
    'event-ATSpectrograph-0-reportedFilterPosition',
    'event-ATSpectrograph-0-reportedDisperserPosition',
    'event-ATSpectrograph-0-reportedLinearStagePosition',
    'event-ATSpectrograph-0-lsState',
    'event-ATSpectrograph-0-fwState',
    'event-ATSpectrograph-0-gwState',
    // Camera
    'event-ATCamera-0-shutterDetailedState',
    'event-ATCamera-0-raftsDetailedState',
  ];
  const latissData = getStreamsData(state, latissSubscriptions);
  const reportedFilterPosition = latissData['event-ATSpectrograph-0-reportedFilterPosition'];
  const reportedDisperserPosition = latissData['event-ATSpectrograph-0-reportedDisperserPosition'];
  const reportedLinearStagePosition = latissData['event-ATSpectrograph-0-reportedLinearStagePosition'];
  const lsState = latissData['event-ATSpectrograph-0-lsState'];
  const fwState = latissData['event-ATSpectrograph-0-fwState'];
  const gwState = latissData['event-ATSpectrograph-0-gwState'];
  const shutterDetailedState = latissData['event-ATCamera-0-shutterDetailedState'];
  const raftsDetailedState = latissData['event-ATCamera-0-raftsDetailedState'];

  return {
    reportedFilterPosition: reportedFilterPosition ? reportedFilterPosition[0].slot.value : 0,
    reportedFilterName: reportedFilterPosition ? reportedFilterPosition[0].name.value : '',
    reportedDisperserPosition: reportedDisperserPosition ? reportedDisperserPosition[0].slot.value : 0,
    reportedDisperserName: reportedDisperserPosition ? reportedDisperserPosition[0].name.value : '',
    reportedLinearStagePosition: reportedLinearStagePosition ? reportedLinearStagePosition[0].position.value : 0,
    lsState: lsState ? lsState[0].state.value : 0,
    fwState: fwState ? fwState[0].state.value : 0,
    gwState: gwState ? gwState[0].state.value : 0,
    shutterDetailedState: shutterDetailedState ? shutterDetailedState[0].substate.value : 0,
    raftsDetailedState: raftsDetailedState ? raftsDetailedState[0].substate.value : 0,
  };
};

/////////////////
/// DYNALENE ///
///////////////

// Dynalene Events
export const getDynaleneStatus = (state) => {
  const subscriptions = [
    'event-HVAC-0-dynaleneState',
    'event-HVAC-0-dynAmbientDeltaModeStatus',
    'event-HVAC-0-dynCH1PressRemoteSP',
    'event-HVAC-0-dynCH2PressRemoteSP',
    'event-HVAC-0-dynExhaustAirBackupModeStatus',
    'event-HVAC-0-dynExtAirRemoteSP',
    'event-HVAC-0-dynMainGridAlarm',
    'event-HVAC-0-dynMainGridAlarmCMD',
    'event-HVAC-0-dynMainGridFailureFlag',
    'event-HVAC-0-dynPierFansOnOff',
    'event-HVAC-0-dynRemoteLocalModeStatus',
    'event-HVAC-0-dynSafetyResetFlag',
    'event-HVAC-0-dynSysFault',
    'event-HVAC-0-dynSysOK',
    'event-HVAC-0-dynSysWarning',
    'event-HVAC-0-dynSystOnOff',
    'event-HVAC-0-dynTAalarm',
    'event-HVAC-0-dynTAalarmCMD',
    'event-HVAC-0-dynTAalarmMonitor',
    'event-HVAC-0-dynTMAalarm',
    'event-HVAC-0-dynTMAalarmCMD',
    'event-HVAC-0-dynTMAalarmMonitor',
    'event-HVAC-0-dynTaRemoteSP',
    'event-HVAC-0-dynTankLevelAlarmCMD',
    'event-HVAC-0-dynTelemetryEnable',
    'event-HVAC-0-dynTmaRemoteSP',
    'event-HVAC-0-dynaleneTankLevel',
  ];
  const dynaleneData = getStreamsData(state, subscriptions);
  return {
    dynaleneState: dynaleneData['event-HVAC-0-dynaleneState']?.[0].state?.value ?? 9,
    dynAmbientDeltaModeStatus: dynaleneData['event-HVAC-0-dynAmbientDeltaModeStatus']?.[0].state?.value ?? undefined,
    dynCH1PressRemoteSP: dynaleneData['event-HVAC-0-dynCH1PressRemoteSP']?.[0].dynCH1PressRemoteSP?.value ?? undefined,
    dynCH2PressRemoteSP: dynaleneData['event-HVAC-0-dynCH2PressRemoteSP']?.[0].dynCH2PressRemoteSP?.value ?? undefined,
    dynExhaustAirBackupModeStatus:
      dynaleneData['event-HVAC-0-dynExhaustAirBackupModeStatus']?.[0].state?.value ?? undefined,
    dynExtAirRemoteSP: dynaleneData['event-HVAC-0-dynExtAirRemoteSP']?.[0].dynExtAirRemoteSP?.value ?? undefined,
    dynMainGridAlarm: dynaleneData['event-HVAC-0-dynMainGridAlarm']?.[0].state?.value ?? undefined,
    dynMainGridAlarmCMD: dynaleneData['event-HVAC-0-dynMainGridAlarmCMD']?.[0].state?.value ?? undefined,
    dynMainGridFailureFlag: dynaleneData['event-HVAC-0-dynMainGridFailureFlag']?.[0].state?.value ?? undefined,
    dynPierFansOnOff: dynaleneData['event-HVAC-0-dynPierFansOnOff']?.[0].dynPierFansOnOff?.value ?? undefined,
    dynRemoteLocalModeStatus: dynaleneData['event-HVAC-0-dynRemoteLocalModeStatus']?.[0].state?.value ?? undefined,
    dynSafetyResetFlag: dynaleneData['event-HVAC-0-dynSafetyResetFlag']?.[0].state?.value ?? undefined,
    dynSysFault: dynaleneData['event-HVAC-0-dynSysFault']?.[0].state?.value ?? undefined,
    dynSysOK: dynaleneData['event-HVAC-0-dynSysOK']?.[0].state?.value ?? undefined,
    dynSysWarning: dynaleneData['event-HVAC-0-dynSysWarning']?.[0].state?.value ?? undefined,
    dynSystOnOff: dynaleneData['event-HVAC-0-dynSystOnOff']?.[0].dynSystOnOff?.value ?? undefined,
    dynTAalarm: dynaleneData['event-HVAC-0-dynTAalarm']?.[0].state?.value ?? undefined,
    dynTAalarmCMD: dynaleneData['event-HVAC-0-dynTAalarmCMD']?.[0].state?.value ?? undefined,
    dynTAalarmMonitor: dynaleneData['event-HVAC-0-dynTAalarmMonitor']?.[0].state?.value ?? undefined,
    dynTMAalarm: dynaleneData['event-HVAC-0-dynTMAalarm']?.[0].state?.value ?? undefined,
    dynTMAalarmCMD: dynaleneData['event-HVAC-0-dynTMAalarmCMD']?.[0].state?.value ?? undefined,
    dynTMAalarmMonitor: dynaleneData['event-HVAC-0-dynTMAalarmMonitor']?.[0].state?.value ?? undefined,
    dynTaRemoteSP: dynaleneData['event-HVAC-0-dynTaRemoteSP']?.[0].dynTaRemoteSP?.value ?? undefined,
    dynTankLevelAlarmCMD: dynaleneData['event-HVAC-0-dynTankLevelAlarmCMD']?.[0].state?.value ?? undefined,
    dynTelemetryEnable: dynaleneData['event-HVAC-0-dynTelemetryEnable']?.[0].dynTelemetryEnable?.value ?? undefined,
    dynTmaRemoteSP: dynaleneData['event-HVAC-0-dynTmaRemoteSP']?.[0].dynTmaRemoteSP?.value ?? undefined,
    dynaleneTankLevel: dynaleneData['event-HVAC-0-dynaleneTankLevel']?.[0].state?.value ?? 9,
  };
};

// Dynalene Telemetry
export const getDynaleneData = (state) => {
  const subscriptions = ['telemetry-HVAC-0-dynaleneP05'];
  const dynaleneData = getStreamsData(state, subscriptions);
  return {
    dynCH01LS01: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH01LS01?.value ?? undefined,
    dynCH01supFS01: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH01supFS01?.value ?? undefined,
    dynCH01supPS11: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH01supPS11?.value ?? undefined,
    dynCH01supTS05: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH01supTS05?.value ?? undefined,
    dynCH02LS02: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH02LS02?.value ?? undefined,
    dynCH02supFS02: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH02supFS02?.value ?? undefined,
    dynCH02supPS13: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH02supPS13?.value ?? undefined,
    dynCH02supTS07: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH02supTS07?.value ?? undefined,
    dynCH01retCGLYpres: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH01retCGLYpres?.value ?? undefined,
    dynCH01retCGLYtemp: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH01retCGLYtemp?.value ?? undefined,
    dynCH01supCGLYpres: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH01supCGLYpres?.value ?? undefined,
    dynCH01supCGLYtemp: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH01supCGLYtemp?.value ?? undefined,
    dynCH02retGPGLYpres: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH02retGPGLYpres?.value ?? undefined,
    dynCH02retGPGLYtemp: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH02retGPGLYtemp?.value ?? undefined,
    dynCH02supGPGLYpres: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH02supGPGLYpres?.value ?? undefined,
    dynCH02supGPGLYtemp: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH02supGPGLYtemp?.value ?? undefined,
    dynCH1CGLYtpd: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH1CGLYtpd?.value ?? undefined,
    dynCH1supCGLYflow: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH1supCGLYflow?.value ?? undefined,
    dynCH2GPGLYtpd: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH2GPGLYtpd?.value ?? undefined,
    dynCH2supGPGLYflow: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynCH2supGPGLYflow?.value ?? undefined,
    dynTAretPS04: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTAretPS04?.value ?? undefined,
    dynTAretTS04: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTAretTS04?.value ?? undefined,
    dynTAsupFS04: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTAsupFS04?.value ?? undefined,
    dynTAsupPS03: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTAsupPS03?.value ?? undefined,
    dynTAsupTS03: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTAsupTS03?.value ?? undefined,
    dynTAtpd: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTAtpd?.value ?? undefined,
    dynTMAcmv01pos: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTMAcmv01pos?.value ?? undefined,
    dynTMAcmv02pos: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTMAcmv02pos?.value ?? undefined,
    dynTMAretPS02: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTMAretPS02?.value ?? undefined,
    dynTMAretTS02: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTMAretTS02?.value ?? undefined,
    dynTMAsupFS03: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTMAsupFS03?.value ?? undefined,
    dynTMAsupPS01: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTMAsupPS01?.value ?? undefined,
    dynTMAsupTS01: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTMAsupTS01?.value ?? undefined,
    dynTMAtpd: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.dynTMAtpd?.value ?? undefined,
    exhAirAvrgTemp: dynaleneData['telemetry-HVAC-0-dynaleneP05']?.exhAirAvrgTemp?.value ?? undefined,
  };
};

/////////////////////////////////////////
// F A C I L I T Y - S E L E C T O R S //
/////////////////////////////////////////

export const getHVACSubscription = () => {
  return [
    //Level 1//
    'event-MTAirCompressor-1-compressorInfo',
    'event-MTAirCompressor-1-connectionStatus',
    'event-MTAirCompressor-1-errors',
    'event-MTAirCompressor-1-status',
    'event-MTAirCompressor-1-timerInfo',
    'event-MTAirCompressor-1-warnings',
    'telemetry-MTAirCompressor-1-analogData',
    'event-MTAirCompressor-2-compressorInfo',
    'event-MTAirCompressor-2-connectionStatus',
    'event-MTAirCompressor-2-errors',
    'event-MTAirCompressor-2-status',
    'event-MTAirCompressor-2-timerInfo',
    'event-MTAirCompressor-2-warnings',
    'telemetry-MTAirCompressor-2-analogData',
    'telemetry-HVAC-0-coldWaterPump01',
    'telemetry-HVAC-0-chiller01P01',
    'telemetry-HVAC-0-chiller02P01',
    'telemetry-HVAC-0-chiller03P01',
    'telemetry-HVAC-0-generalP01',
    'telemetry-HVAC-0-valveP01',
    'telemetry-HVAC-0-airInletFan01P01',
    'telemetry-HVAC-0-centrifugalExtractionFan01P01',
    'telemetry-HVAC-0-centrifugalSupplyFan01P01',

    //Level 2//
    'telemetry-HVAC-0-crac01P02',
    'telemetry-HVAC-0-crac02P02',
    'telemetry-HVAC-0-fancoil01P02',
    'telemetry-HVAC-0-fancoil02P02',
    'telemetry-HVAC-0-fancoil03P02',
    'telemetry-HVAC-0-fancoil04P02',
    'telemetry-HVAC-0-fancoil05P02',
    'telemetry-HVAC-0-fancoil06P02',
    'telemetry-HVAC-0-fancoil07P02',
    'telemetry-HVAC-0-fancoil08P02',
    'telemetry-HVAC-0-fancoil09P02',
    'telemetry-HVAC-0-fancoil10P02',
    'telemetry-HVAC-0-fancoil11P02',
    'telemetry-HVAC-0-fancoil12P02',

    //Level 4//
    'telemetry-HVAC-0-whiteRoomAHU01P05',
    'telemetry-HVAC-0-cleanRoomAHU01P05',
    'telemetry-HVAC-0-lowerDamperFan03P04',
    'telemetry-HVAC-0-loadingBayFan04P04',

    //Level 5//
    'event-HVAC-0-dynMainGridAlarm',
    'event-HVAC-0-dynMainGridAlarmCMD',
    'event-HVAC-0-dynMainGridFailureFlag',
    'event-HVAC-0-dynSafetyResetFlag',
    'event-HVAC-0-dynTAalarm',
    'event-HVAC-0-dynTAalarmCMD',
    'event-HVAC-0-dynTAalarmMonitor',
    'event-HVAC-0-dynTMAalarm',
    'event-HVAC-0-dynTMAalarmCMD',
    'event-HVAC-0-dynTMAalarmMonitor',
    'event-HVAC-0-dynTankLevelAlarmCMD',
    'event-HVAC-0-dynaleneState',
    'event-HVAC-0-dynaleneTankLevel',
    'telemetry-HVAC-0-dynaleneP05',
    'telemetry-HVAC-0-lowerAHU01P05',
    'telemetry-HVAC-0-lowerAHU02P05',
    'telemetry-HVAC-0-lowerAHU03P05',
    'telemetry-HVAC-0-lowerAHU04P05',
    'telemetry-HVAC-0-airInletFan01P05',
    'telemetry-HVAC-0-airInletFan08P05',
    'telemetry-HVAC-0-airInletFan09P05',
    'telemetry-HVAC-0-airInletFan10P05',
    'telemetry-HVAC-0-airInletFan11P05',
    'telemetry-HVAC-0-airInletFan12P05',
    'telemetry-HVAC-0-airInletFan13P05',
    'telemetry-HVAC-0-airInletFan14P05',
    'telemetry-HVAC-0-airInletFan15P05',
    'telemetry-HVAC-0-airInletFan16P05',
    'telemetry-HVAC-0-airInletFan17P05',
  ];
};

// HVAC Telemetry //
export const getHVACTelemetry = (state) => {
  const subscriptions = [
    //Level 1//
    'event-MTAirCompressor-1-compressorInfo',
    'event-MTAirCompressor-1-connectionStatus',
    'event-MTAirCompressor-1-errors',
    'event-MTAirCompressor-1-status',
    'event-MTAirCompressor-1-timerInfo',
    'event-MTAirCompressor-1-warnings',
    'telemetry-MTAirCompressor-1-analogData',
    'event-MTAirCompressor-2-compressorInfo',
    'event-MTAirCompressor-2-connectionStatus',
    'event-MTAirCompressor-2-errors',
    'event-MTAirCompressor-2-status',
    'event-MTAirCompressor-2-timerInfo',
    'event-MTAirCompressor-2-warnings',
    'telemetry-MTAirCompressor-2-analogData',
    'telemetry-HVAC-0-coldWaterPump01',
    'telemetry-HVAC-0-chiller01P01',
    'telemetry-HVAC-0-chiller02P01',
    'telemetry-HVAC-0-chiller03P01',
    'telemetry-HVAC-0-generalP01',
    'telemetry-HVAC-0-valveP01',
    'telemetry-HVAC-0-airInletFan01P01',
    'telemetry-HVAC-0-centrifugalExtractionFan01P01',
    'telemetry-HVAC-0-centrifugalSupplyFan01P01',

    //Level 2//
    'telemetry-HVAC-0-crac01P02',
    'telemetry-HVAC-0-crac02P02',
    'telemetry-HVAC-0-fancoil01P02',
    'telemetry-HVAC-0-fancoil02P02',
    'telemetry-HVAC-0-fancoil03P02',
    'telemetry-HVAC-0-fancoil04P02',
    'telemetry-HVAC-0-fancoil05P02',
    'telemetry-HVAC-0-fancoil06P02',
    'telemetry-HVAC-0-fancoil07P02',
    'telemetry-HVAC-0-fancoil08P02',
    'telemetry-HVAC-0-fancoil09P02',
    'telemetry-HVAC-0-fancoil10P02',
    'telemetry-HVAC-0-fancoil11P02',
    'telemetry-HVAC-0-fancoil12P02',

    //Level 4//
    'telemetry-HVAC-0-whiteRoomAHU01P05',
    'telemetry-HVAC-0-cleanRoomAHU01P05',
    'telemetry-HVAC-0-lowerDamperFan03P04',
    'telemetry-HVAC-0-loadingBayFan04P04',

    //Level 5//
    'event-HVAC-0-dynMainGridAlarm',
    'event-HVAC-0-dynMainGridAlarmCMD',
    'event-HVAC-0-dynMainGridFailureFlag',
    'event-HVAC-0-dynSafetyResetFlag',
    'event-HVAC-0-dynTAalarm',
    'event-HVAC-0-dynTAalarmCMD',
    'event-HVAC-0-dynTAalarmMonitor',
    'event-HVAC-0-dynTMAalarm',
    'event-HVAC-0-dynTMAalarmCMD',
    'event-HVAC-0-dynTMAalarmMonitor',
    'event-HVAC-0-dynTankLevelAlarmCMD',
    'event-HVAC-0-dynaleneState',
    'event-HVAC-0-dynaleneTankLevel',
    'telemetry-HVAC-0-dynaleneP05',
    'telemetry-HVAC-0-lowerAHU01P05',
    'telemetry-HVAC-0-lowerAHU02P05',
    'telemetry-HVAC-0-lowerAHU03P05',
    'telemetry-HVAC-0-lowerAHU04P05',
    'telemetry-HVAC-0-airInletFan01P05',
    'telemetry-HVAC-0-airInletFan08P05',
    'telemetry-HVAC-0-airInletFan09P05',
    'telemetry-HVAC-0-airInletFan10P05',
    'telemetry-HVAC-0-airInletFan11P05',
    'telemetry-HVAC-0-airInletFan12P05',
    'telemetry-HVAC-0-airInletFan13P05',
    'telemetry-HVAC-0-airInletFan14P05',
    'telemetry-HVAC-0-airInletFan15P05',
    'telemetry-HVAC-0-airInletFan16P05',
    'telemetry-HVAC-0-airInletFan17P05',
  ];

  const HVACData = getStreamsData(state, subscriptions);
  return {
    //Level 1//
    compressorInfo1: HVACData['event-MTAirCompressor-1-compressorInfo'] ?? {},
    connectionStatus1: HVACData['event-MTAirCompressor-1-connectionStatus'] ?? {},
    errors1: HVACData['event-MTAirCompressor-1-errors'] ?? {},
    status1: HVACData['event-MTAirCompressor-1-status'] ?? {},
    timerInfo1: HVACData['event-MTAirCompressor-1-timerInfo'] ?? {},
    warnings1: HVACData['event-MTAirCompressor-1-warnings'] ?? {},
    analogData1: HVACData['telemetry-MTAirCompressor-1-analogData'] ?? {},

    compressorInfo2: HVACData['event-MTAirCompressor-2-compressorInfo'] ?? {},
    connectionStatus2: HVACData['event-MTAirCompressor-2-connectionStatus'] ?? {},
    errors2: HVACData['event-MTAirCompressor-2-errors'] ?? {},
    status2: HVACData['event-MTAirCompressor-2-status'] ?? {},
    timerInfo2: HVACData['event-MTAirCompressor-2-timerInfo'] ?? {},
    warnings2: HVACData['event-MTAirCompressor-2-warnings'] ?? {},
    analogData2: HVACData['telemetry-MTAirCompressor-2-analogData'] ?? {},

    coldWaterPump01: HVACData['telemetry-HVAC-0-coldWaterPump01'] ?? {},
    chiller01P01: HVACData['telemetry-HVAC-0-chiller01P01'] ?? {},
    chiller02P01: HVACData['telemetry-HVAC-0-chiller02P01'] ?? {},
    chiller03P01: HVACData['telemetry-HVAC-0-chiller03P01'] ?? {},
    generalP01: HVACData['telemetry-HVAC-0-generalP01'] ?? {},
    valveP01: HVACData['telemetry-HVAC-0-valveP01'] ?? {},
    airInletFan01P01: HVACData['telemetry-HVAC-0-airInletFan01P01'] ?? {},
    centrifugalExtractionFan01P01: HVACData['telemetry-HVAC-0-centrifugalExtractionFan01P01'] ?? {},
    centrifugalSupplyFan01P01: HVACData['telemetry-HVAC-0-centrifugalSupplyFan01P01'] ?? {},

    //Level 2//
    crac01P02: HVACData['telemetry-HVAC-0-crac01P02'] ?? {},
    crac02P02: HVACData['telemetry-HVAC-0-crac02P02'] ?? {},
    fancoil01P02: HVACData['telemetry-HVAC-0-fancoil01P02'] ?? {},
    fancoil02P02: HVACData['telemetry-HVAC-0-fancoil02P02'] ?? {},
    fancoil03P02: HVACData['telemetry-HVAC-0-fancoil03P02'] ?? {},
    fancoil04P02: HVACData['telemetry-HVAC-0-fancoil04P02'] ?? {},
    fancoil05P02: HVACData['telemetry-HVAC-0-fancoil05P02'] ?? {},
    fancoil06P02: HVACData['telemetry-HVAC-0-fancoil06P02'] ?? {},
    fancoil07P02: HVACData['telemetry-HVAC-0-fancoil07P02'] ?? {},
    fancoil08P02: HVACData['telemetry-HVAC-0-fancoil08P02'] ?? {},
    fancoil09P02: HVACData['telemetry-HVAC-0-fancoil09P02'] ?? {},
    fancoil10P02: HVACData['telemetry-HVAC-0-fancoil10P02'] ?? {},
    fancoil11P02: HVACData['telemetry-HVAC-0-fancoil11P02'] ?? {},
    fancoil12P02: HVACData['telemetry-HVAC-0-fancoil12P02'] ?? {},

    //Level 4//
    whiteRoomAHU01P05: HVACData['telemetry-HVAC-0-whiteRoomAHU01P05'] ?? {},
    cleanRoomAHU01P05: HVACData['telemetry-HVAC-0-cleanRoomAHU01P05'] ?? {},
    lowerDamperFan03P04: HVACData['telemetry-HVAC-0-lowerDamperFan03P04'] ?? {},
    loadingBayFan04P04: HVACData['telemetry-HVAC-0-loadingBayFan04P04'] ?? {},

    //Level 5//
    dynMainGridAlarm: HVACData['event-HVAC-0-dynMainGridAlarm']?.[0]?.state?.value ?? undefined,
    dynMainGridAlarmCMD: HVACData['event-HVAC-0-dynMainGridAlarmCMD']?.[0]?.state?.value ?? undefined,
    dynMainGridFailureFlag: HVACData['event-HVAC-0-dynMainGridFailureFlag']?.[0]?.state?.value ?? undefined,
    dynSafetyResetFlag: HVACData['event-HVAC-0-dynSafetyResetFlag']?.[0]?.state?.value ?? undefined,
    dynTAalarm: HVACData['event-HVAC-0-dynTAalarm']?.[0]?.state?.value ?? undefined,
    dynTAalarmCMD: HVACData['event-HVAC-0-dynTAalarmCMD']?.[0]?.state?.value ?? undefined,
    dynTAalarmMonitor: HVACData['event-HVAC-0-dynTAalarmMonitor']?.[0]?.state?.value ?? undefined,
    dynTMAalarm: HVACData['event-HVAC-0-dynTMAalarm']?.[0]?.state?.value ?? undefined,
    dynTMAalarmCMD: HVACData['event-HVAC-0-dynTMAalarmCMD']?.[0]?.state?.value ?? undefined,
    dynTMAalarmMonitor: HVACData['event-HVAC-0-dynTMAalarmMonitor']?.[0]?.state?.value ?? undefined,
    dynTankLevelAlarmCMD: HVACData['event-HVAC-0-dynTankLevelAlarmCMD']?.[0]?.state?.value ?? undefined,
    dynaleneState: HVACData['event-HVAC-0-dynaleneState']?.[0]?.state ?? undefined,
    dynaleneTankLevel: HVACData['event-HVAC-0-dynaleneTankLevel']?.[0]?.state?.value ?? undefined,
    dynaleneP05: HVACData['telemetry-HVAC-0-dynaleneP05'] ?? {},
    lowerAHU01P05: HVACData['telemetry-HVAC-0-lowerAHU01P05'] ?? {},
    lowerAHU02P05: HVACData['telemetry-HVAC-0-lowerAHU02P05'] ?? {},
    lowerAHU03P05: HVACData['telemetry-HVAC-0-lowerAHU03P05'] ?? {},
    lowerAHU04P05: HVACData['telemetry-HVAC-0-lowerAHU04P05'] ?? {},
    airInletFan01P05: HVACData['telemetry-HVAC-0-airInletFan01P05'] ?? {},
    airInletFan08P05: HVACData['telemetry-HVAC-0-airInletFan08P05'] ?? {},
    airInletFan09P05: HVACData['telemetry-HVAC-0-airInletFan09P05'] ?? {},
    airInletFan10P05: HVACData['telemetry-HVAC-0-airInletFan10P05'] ?? {},
    airInletFan11P05: HVACData['telemetry-HVAC-0-airInletFan11P05'] ?? {},
    airInletFan12P05: HVACData['telemetry-HVAC-0-airInletFan12P05'] ?? {},
    airInletFan13P05: HVACData['telemetry-HVAC-0-airInletFan13P05'] ?? {},
    airInletFan14P05: HVACData['telemetry-HVAC-0-airInletFan14P05'] ?? {},
    airInletFan15P05: HVACData['telemetry-HVAC-0-airInletFan15P05'] ?? {},
    airInletFan16P05: HVACData['telemetry-HVAC-0-airInletFan16P05'] ?? {},
    airInletFan17P05: HVACData['telemetry-HVAC-0-airInletFan17P05'] ?? {},
  };
};

export const getObservatorySubscriptions = () => {
  return [
    'event-Scheduler-1-summaryState',
    'event-Scheduler-2-summaryState',
    'event-Scheduler-1-observingMode',
    'event-Scheduler-2-observingMode',
    `telemetry-Scheduler-1-observatoryState`,
    `telemetry-Scheduler-2-observatoryState`,
    `event-Scheduler-1-target`,
    `event-Scheduler-2-target`,
    'event-ESS-301-precipitation',
    'telemetry-ESS-301-temperature',
    'telemetry-ESS-301-pressure',
    'telemetry-ESS-301-relativeHumidity',
    'telemetry-ESS-301-airFlow',
    'event-ATPtg-0-currentTarget',
    'event-MTPtg-0-currentTarget',
  ];
};

export const getObservatoryState = (state) => {
  const observatorySubscriptions = getObservatorySubscriptions();
  const observatoryData = getStreamsData(state, observatorySubscriptions);
  const simonyiSummaryState = observatoryData['event-Scheduler-1-summaryState'];
  const auxtelSummaryState = observatoryData['event-Scheduler-2-summaryState'];
  const simonyiObservingMode = observatoryData['event-Scheduler-1-observingMode'];
  const simonyiTarget = observatoryData[`event-Scheduler-1-target`];
  const auxtelObservingMode = observatoryData['event-Scheduler-2-observingMode'];
  const simonyiObservatoryState = observatoryData['telemetry-Scheduler-1-observatoryState'];
  const auxtelObservatoryState = observatoryData['telemetry-Scheduler-2-observatoryState'];
  const environmentVariables = observatoryData['event-ESS-301-precipitation'];
  const essTemperatures = observatoryData['telemetry-ESS-301-temperature'];
  const essAirFlow = observatoryData['telemetry-ESS-301-airFlow'];
  const essPressure = observatoryData['telemetry-ESS-301-pressure'];
  const essRelativeHumidity = observatoryData['telemetry-ESS-301-relativeHumidity'];
  const mptgCurrentTarget = observatoryData['event-MTPtg-0-currentTarget'];
  const atptgCurrentTarget = observatoryData['event-ATPtg-0-currentTarget'];

  return {
    simonyiState: simonyiSummaryState ? simonyiSummaryState[0].summaryState.value : 0,
    auxtelState: auxtelSummaryState ? auxtelSummaryState[0].summaryState.value : 0,
    simonyiObservingMode: simonyiObservingMode ? simonyiObservingMode[0].mode.value : 'UNKNOWN',
    auxtelObservingMode: auxtelObservingMode ? auxtelObservingMode[0].mode.value : 'UNKNOWN',
    simonyiTrackingState: simonyiObservatoryState ? simonyiObservatoryState.tracking?.value : false,
    simonyiRa: simonyiObservatoryState ? simonyiObservatoryState.ra?.value : 0.0,
    simonyiDec: simonyiObservatoryState ? simonyiObservatoryState.declination?.value : 0.0,
    simonyiAltitude: simonyiObservatoryState ? simonyiObservatoryState.telescopeAltitude?.value : 0.0,
    simonyiAzimuth: simonyiObservatoryState ? simonyiObservatoryState.telescopeAzimuth?.value : 0.0,
    simonyiRotator: simonyiObservatoryState ? simonyiObservatoryState.telescopeRotator?.value : 0.0,
    simonyiDomeAlt: simonyiObservatoryState ? simonyiObservatoryState.domeAltitude?.value : 0.0,
    simonyiDomeAz: simonyiObservatoryState ? simonyiObservatoryState.domeAzimuth?.value : 0.0,
    simonyiMoonRa: simonyiTarget ? simonyiTarget[0].moonRa?.value : 0.0,
    simonyiMoonDec: simonyiTarget ? simonyiTarget[0].moonDec?.value : 0.0,
    simonyiMoonPhase: simonyiTarget ? simonyiTarget[0].moonPhase?.value : 0.0,
    simonyiSunRa: simonyiTarget ? simonyiTarget[0].sunRa?.value : 0.0,
    simonyiSunDec: simonyiTarget ? simonyiTarget[0].sunDec?.value : 0.0,
    auxtelTrackingState: auxtelObservatoryState ? auxtelObservatoryState.tracking?.value : false,
    auxtelRa: auxtelObservatoryState ? auxtelObservatoryState.ra?.value : 0.0,
    auxtelDec: auxtelObservatoryState ? auxtelObservatoryState.declination?.value : 0.0,
    auxtelAltitude: auxtelObservatoryState ? auxtelObservatoryState.telescopeAltitude?.value : 0.0,
    auxtelAzimuth: auxtelObservatoryState ? auxtelObservatoryState.telescopeAzimuth?.value : 0.0,
    auxtelRotator: auxtelObservatoryState ? auxtelObservatoryState.telescopeRotator?.value : 0.0,
    auxtelDomeAlt: auxtelObservatoryState ? auxtelObservatoryState.domeAltitude?.value : 0.0,
    auxtelDomeAz: auxtelObservatoryState ? auxtelObservatoryState.domeAzimuth?.value : 0.0,
    simonyiTrackingMode: mptgCurrentTarget ? mptgCurrentTarget[0].frame.value : 0,
    auxtelTrackingMode: atptgCurrentTarget ? atptgCurrentTarget[0].frame.value : 0,
    isRaining: environmentVariables ? environmentVariables[0].raining.value : false,
    isSnowing: environmentVariables ? environmentVariables[0].snowing.value : false,
    numChannels: essTemperatures ? essTemperatures.numChannels.value : 0,
    temperature: essTemperatures ? essTemperatures.temperatureItem.value : [],
    location: essTemperatures ? essTemperatures.location.value : '',
    windDirection: essAirFlow ? essAirFlow.direction.value : 0.0,
    windSpeed: essAirFlow ? essAirFlow.speed.value : 0.0,
    // TODO: Add the corresponding telemetry or event when Enviromental Degradation gets integrated into SAL
    degradation: 'Unknown',
    pressure: essPressure ? essPressure.pressureItem.value : 0,
    humidity: essRelativeHumidity ? essRelativeHumidity.relativeHumidityItem.value : 0,
    // TODO: Add the corresponding telemetry or event when the following variables gets integrated into SAL
    atmosphericTrans: 'Unknown',
    seeing: 'Unknown',
  };
};

export const getWindDirectionState = (state) => {
  const subscriptions = ['telemetry-ESS-301-airFlow'];
  const streams = getStreamsData(state, subscriptions);
  return {
    direction: streams['telemetry-ESS-301-airFlow']?.direction?.value ?? 0.0,
    speed: streams['telemetry-ESS-301-airFlow']?.speed?.value ?? 0.0,
  };
};

export const getESSsubscription = (salindex) => {
  return [
    `event-ESS-${salindex}-highElectricField`,
    `event-ESS-${salindex}-lightningStrike`,
    `event-ESS-${salindex}-precipitation`,
    `event-ESS-${salindex}-sensorStatus`,
    `telemetry-ESS-${salindex}-accelerometer`,
    `telemetry-ESS-${salindex}-accelerometerPSD`,
    `telemetry-ESS-${salindex}-airFlow`,
    `telemetry-ESS-${salindex}-airTurbulence`,
    `telemetry-ESS-${salindex}-dewPoint`,
    `telemetry-ESS-${salindex}-electricFieldStrength`,
    `telemetry-ESS-${salindex}-lightningStrikeStatus`,
    `telemetry-ESS-${salindex}-pressure`,
    `telemetry-ESS-${salindex}-rainRate`,
    `telemetry-ESS-${salindex}-relativeHumidity`,
    `telemetry-ESS-${salindex}-snowRate`,
    `telemetry-ESS-${salindex}-solarRadiation`,
    `telemetry-ESS-${salindex}-spectrumAnalyzer`,
    `telemetry-ESS-${salindex}-temperature`,
  ];
};

export const getESSstate = (state, salindex) => {
  const ESSData = getStreamsData(state, getESSsubscription(salindex));
  return {
    highElectricField: ESSData[`event-ESS-${salindex}-highElectricField`] ?? {},
    lightningStrike: ESSData[`event-ESS-${salindex}-lightningStrike`] ?? {},
    precipitation: ESSData[`event-ESS-${salindex}-precipitation`] ?? {},
    sensorStatus: ESSData[`event-ESS-${salindex}-sensorStatus`] ?? {},
    accelerometer: ESSData[`telemetry-ESS-${salindex}-accelerometer`] ?? {},
    accelerometerPSD: ESSData[`telemetry-ESS-${salindex}-accelerometerPSD`] ?? {},
    airFlow: ESSData[`telemetry-ESS-${salindex}-airFlow`] ?? {},
    airTurbulence: ESSData[`telemetry-ESS-${salindex}-airTurbulence`] ?? {},
    dewPoint: ESSData[`telemetry-ESS-${salindex}-dewPoint`] ?? {},
    electricFieldStrength: ESSData[`telemetry-ESS-${salindex}-electricFieldStrength`] ?? {},
    lightningStrikeStatus: ESSData[`telemetry-ESS-${salindex}-lightningStrikeStatus`] ?? {},
    pressure: ESSData[`telemetry-ESS-${salindex}-pressure`] ?? {},
    rainRate: ESSData[`telemetry-ESS-${salindex}-rainRate`] ?? {},
    relativeHumidity: ESSData[`telemetry-ESS-${salindex}-relativeHumidity`] ?? {},
    snowRate: ESSData[`telemetry-ESS-${salindex}-snowRate`] ?? {},
    solarRadiation: ESSData[`telemetry-ESS-${salindex}-solarRadiation`] ?? {},
    spectrumAnalyzer: ESSData[`telemetry-ESS-${salindex}-spectrumAnalyzer`] ?? {},
    temperature: ESSData[`telemetry-ESS-${salindex}-temperature`] ?? {},
  };
};

// DM selectors
export const getDMFlowState = (state) => {
  return {
    dmFlowState: 0,
    oodsState: 0,
    usdfState: 0,
  };
};

// Nightreport selectors
export const getNightreportObservatoryState = (state) => {
  const subscriptions = [
    'telemetry-MTMount-0-azimuth',
    'telemetry-MTMount-0-elevation',
    'telemetry-MTDome-0-azimuth',
    'telemetry-MTRotator-0-rotation',
    'telemetry-ATMCS-0-mount_AzEl_Encoders',
    'telemetry-ATDome-0-position',
    'event-MTMount-0-mirrorCoversMotionState',
    'event-MTMount-0-oilSupplySystemState',
    'event-MTMount-0-mainAxesPowerSupplySystemState',
    'event-MTMount-0-elevationLockingPinMotionState',
    'event-ATPneumatics-0-m1CoverState',
  ];
  const streamData = getStreamsData(state, subscriptions);
  return {
    simonyiAzimuth: streamData['telemetry-MTMount-0-azimuth']?.actualPosition.value ?? 0.0,
    simonyiElevation: streamData['telemetry-MTMount-0-elevation']?.actualPosition.value ?? 0.0,
    simonyiDomeAzimuth: streamData['telemetry-MTDome-0-azimuth']?.positionActual.value ?? 0.0,
    simonyiRotator: streamData['telemetry-MTRotator-0-rotation']?.actualPosition.value ?? 0.0,
    simonyiMirrorCoversState: streamData['event-MTMount-0-mirrorCoversMotionState']?.[0]?.state.value ?? null,
    simonyiOilSupplySystemState: streamData['event-MTMount-0-oilSupplySystemState']?.[0]?.powerState.value ?? null,
    simonyiPowerSupplySystemState:
      streamData['event-MTMount-0-mainAxesPowerSupplySystemState']?.[0]?.powerState.value ?? null,
    simonyiLockingPinsSystemState:
      streamData['event-MTMount-0-elevationLockingPinMotionState']?.[0]?.state.value ?? null,
    auxtelAzimuth: streamData['telemetry-ATMCS-0-mount_AzEl_Encoders']?.azimuthCalculatedAngle?.value[0] ?? 0.0,
    auxtelElevation: streamData['telemetry-ATMCS-0-mount_AzEl_Encoders']?.elevationCalculatedAngle?.value[0] ?? 0.0,
    auxtelDomeAzimuth: streamData['telemetry-ATDome-0-position']?.azimuthPosition?.value ?? 0.0,
    auxtelMirrorCoversState: streamData['event-ATPneumatics-0-m1CoverState']?.[0]?.state.value ?? null,
  };
};

export const getKey = (dict, key, def) => {
  if (dict && dict !== {} && Object.keys(dict).includes(key)) {
    return dict[key];
  }
  return def;
};

export const getScriptQueueState = (state, salindex) => {
  const scriptQueueData = getStreamData(state, `event-ScriptQueueState-${salindex}-stateStream`);
  const scriptsData = getStreamData(state, `event-ScriptQueueState-${salindex}-scriptsStream`);
  const availableScriptsData = getStreamData(state, `event-ScriptQueueState-${salindex}-availableScriptsStream`);
  const runningState = getKey(scriptQueueData, 'running', undefined);
  let runningLabel = 'Unknown';
  if (runningState !== undefined) {
    runningLabel = runningState ? 'Running' : 'Stopped';
  }
  return {
    state: runningLabel,
    availableScriptList: getKey(availableScriptsData, 'available_scripts', undefined),
    waitingScriptList: getKey(scriptsData, 'waiting_scripts', undefined),
    // The ScriptQueue CSC will be extended to support multiple
    // current scripts in the future. For now, only one is supported.
    // See: DM-44198.
    current: getKey(scriptsData, 'current_scripts', ['None'])[0],
    finishedScriptList: getKey(scriptsData, 'finished_scripts', undefined),
  };
};

/**
 * Returns all heartbeats in the state that belong to a scriptqueue of specific salindex.
 *
 * @param {obj} state
 * @param {integer} salindex
 */
const getScripts = (state) => state.heartbeats?.scripts ?? [];
const getSalindex = (state, salindex) => salindex;

export const getScriptHeartbeats = createCachedSelector(
  // inputSelectors
  getScripts,
  getSalindex,
  // resultFunc
  (scripts, salindex) => {
    return scripts.filter((heartbeat) => heartbeat.queueSalIndex === salindex);
  },
)(
  // re-reselect keySelector (receives selectors' arguments)
  // Use "salindex" as cacheKey
  (_state_, salindex) => salindex,
);

export const getSummaryStateValue = (state, groupName) => {
  const summaryState = getStreamData(state, groupName);
  let summaryStateValue;
  if (summaryState) {
    summaryStateValue = summaryState[summaryState.length - 1].summaryState.value;
  }
  return summaryStateValue;
};

/**
 * Returns the whole lits of heartbeats
 * @param {object} state
 */
export const getCSCHeartbeats = (state) => {
  return state.heartbeats.cscs;
};

/**
 * Selects the heartbeat object of a (csc, salindex)
 * @param {object} state
 * @param {string} csc
 * @param {number} salindex
 */
export const getCSCHeartbeat = (state, csc, salindex) => {
  return state.heartbeats.cscs.find((heartbeat) => heartbeat.csc === csc && heartbeat.salindex === salindex);
};

/**
 * Selects the latest manager heartbeat
 * @param {object} state
 */
export const getLastManagerHeartbeat = (state) => {
  if (state.heartbeats === undefined) return undefined;
  return state.heartbeats?.lastHeartbeatInfo?.Manager;
};

/**
 * Selects the latest component heartbeat
 * @param {object} state
 */
export const getLastComponentHeartbeat = (state, component) => {
  if (state.heartbeats === undefined) return undefined;
  return state.heartbeats?.lastHeartbeatInfo?.[component];
};

/**
 * Reshape the output of getStreamsData into a dictionary indexed by "csc-salindex" for all "csc-salindex" pairs
 * for which a subscription to a given category and stream exists in the state.
 * Currently hardcoded to use salindex=1 only
 * @param {object} state
 * @param {string} category
 * @param {array} CSCsSalindexList: array [cscname {string}, salindex {int}] pairs
 * @param {string} stream
 * @param {bool} lastDataOnly: flag to return the last data only instead of the whole array, e.g., {csc: Object} instead of {csc: Array[]}
 */
export const getAllStreamsAsDictionary = (state, category, CSCsSalindexList, stream, lastDataOnly = false) => {
  const groupNames = CSCsSalindexList.map(([CSC, salindex]) => `${category}-${CSC}-${salindex}-${stream}`);
  const streams = getStreamsData(state, groupNames);

  const dictionary = {};
  CSCsSalindexList.forEach(([CSC, salindex]) => {
    const groupName = `${category}-${CSC}-${salindex}-${stream}`;
    if (Object.keys(streams).includes(groupName)) {
      dictionary[`${CSC}-${salindex}`] = streams[groupName];
      if (dictionary[`${CSC}-${salindex}`] && lastDataOnly) {
        const aux = dictionary[`${CSC}-${salindex}`][0];
        dictionary[`${CSC}-${salindex}`] = aux;
      }
    }
  });

  return dictionary;
};

/**
 * Returns the summaryData.withWarning state
 * @param {object} state Redux state
 * @param {string} csc CSC name
 * @param {number} salindex CSC salindex
 */
export const getCSCWithWarning = (state, csc, salindex) => {
  const cscRef = `${csc}:${salindex}`;
  return state.summaryData?.withWarning[cscRef] ?? false;
};

export const getCSCLogMessages = (state, csc, salindex) => {
  const logMessageData = state.summaryData.logMessageData.find(
    (data) => data.csc === csc && data.salindex === salindex,
  );

  if (!logMessageData) return [];

  return logMessageData.messages;
};

export const getCSCErrorCodeData = (state, csc, salindex) => {
  const errorCodeData = state.summaryData.errorCodeData.find((data) => data.csc === csc && data.salindex === salindex);
  if (!errorCodeData) return [];

  return errorCodeData.errorCodeData;
};

/**
 * Returns a sorted list of errorCode data for a CSC group
 * @param {object} state Redux state
 * @param {array} group Group of CSCs as in the hierarchy [{name: 'Test', salindex:1}, {name: 'Test', salindex: 2}]
 */
export const getGroupSortedErrorCodeData = (state, group) => {
  const filtered = state.summaryData.errorCodeData.filter((cscData) => {
    const searchIndex = group.findIndex((csc) => cscData.csc === csc.name && cscData.salindex === csc.salindex);
    return searchIndex > -1;
  });

  const flatMapped = flatMap(filtered, (cscData) => {
    return cscData.errorCodeData.map((data) => {
      return {
        csc: cscData.csc,
        salindex: cscData.salindex,
        ...data,
      };
    });
  });

  const sorted = flatMapped.sort((msg1, msg2) => {
    return msg1[TOPIC_TIMESTAMP_ATTRIBUTE].value > msg2[TOPIC_TIMESTAMP_ATTRIBUTE].value ? -1 : 1;
  });

  return sorted;
};

/**
 * Returns a sorted list of log messages data for a CSC group
 * @param {object} state Redux state
 * @param {array} group Group of CSCs as in the hierarchy [{name: 'Test', salindex:1}, {name: 'Test', salindex: 2}]
 */
export const getGroupSortedLogMessageData = (state, group) => {
  const filtered = state.summaryData.logMessageData.filter((cscData) => {
    const searchIndex = group.findIndex((csc) => cscData.csc === csc.name && cscData.salindex === csc.salindex);
    return searchIndex > -1;
  });
  const flatMapped = flatMap(filtered, (cscData) => {
    return cscData.messages.map((data) => {
      return {
        csc: cscData.csc,
        salindex: cscData.salindex,
        ...data,
      };
    });
  });

  const sorted = flatMapped.sort((msg1, msg2) => {
    return msg1[TOPIC_TIMESTAMP_ATTRIBUTE].value > msg2[TOPIC_TIMESTAMP_ATTRIBUTE].value ? -1 : 1;
  });

  return sorted;
};

export const getAllTelemetries = (state) => {
  if (state.ws === undefined) return undefined;
  return getStreamData(state, 'telemetry-all-all-all');
};

export const getAllEvents = (state) => {
  if (state.ws === undefined) return undefined;
  return getStreamData(state, 'event-all-all-all');
};

export const getAllAlarms = (state) => {
  if (state.ws === undefined) return undefined;
  return state.ws.alarms;
};

export const getLastestAlarms = (state) => {
  if (state.ws === undefined) return undefined;
  return state.ws.latestAlarms;
};

export const getLastAlarm = (state) => {
  if (state.ws === undefined) return undefined;
  return getStreamData(state, 'event-Watcher-0-alarm')[0];
};

export const getObservingLogs = (state) => {
  return state.observingLogs.logMessages;
};
