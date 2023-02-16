import { createCachedSelector } from 're-reselect';
import { flatMap } from '../../Utils';

export const getToken = (state) => state.auth.token;

export const getUsername = (state) => state.auth.username;

export const getTaiToUtc = (state) => state.time.server_time.tai_to_utc;

export const getServerTimeRequest = (state) => state.time.request_time;

export const getServerTimeReceive = (state) => state.time.receive_time;

export const getServerTime = (state) => ({ ...state.time.server_time });

export const getConfig = (state) => (state.auth.config ? state.auth.config : null);

export const getCamFeeds = (state) => getConfig(state)?.content?.camFeeds;

export const getAlarmConfig = (state) => getConfig(state)?.content?.alarms;

export const getEfdConfig = (state) => getConfig(state)?.content?.efd;

export const getSurveyConfig = (state) => getConfig(state)?.content?.survey;

export const getAllTime = (state) => ({ ...state.time });

export const getClock = (state) => ({ ...state.time.clock });

export const getPermCmdExec = (state) => state.auth.permissions.cmd_exec;

export const getPermAuthlistAdministrator = (state) => state.auth.permissions.authlist_admin;

export const getTokenStatus = (state) => state.auth.status;

export const getTokenSwapStatus = (state) => state.auth.swapStatus;

export const getConnectionStatus = (state) => state.ws.connectionState;

export const getWebSocket = (state) => state.ws.socket;

export const getSubscriptionsStatus = (state) => state.ws.subscriptionsState;

export const getSubscription = (state, groupName) =>
  state.ws.subscriptions.find((subscription) => subscription.groupName === groupName);

export const getSubscriptions = (state) => state.ws.subscriptions;

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

// MTM1M3 selectors
export const getM1M3ActuatorsState = (state) => {
  const subscriptions = [
    'telemetry-MTM1M3-0-forceActuatorData',
    'event-MTM1M3-0-forceActuatorInfo',
    'event-MTM1M3-0-forceActuatorState',
  ];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    forceActuatorData: m1m3Data['telemetry-MTM1M3-0-forceActuatorData'] ?? {},
    xPosition: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.xPosition?.value ?? [],
    yPosition: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.yPosition?.value ?? [],
    zPosition: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.zPosition?.value ?? [],
    actuatorReferenceId: m1m3Data['event-MTM1M3-0-forceActuatorInfo']?.[0]?.referenceId?.value ?? [],
    actuatorIlcState: m1m3Data['event-MTM1M3-0-forceActuatorState']?.[0]?.ilcState?.value ?? [],
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
  };
};

export const getM1M3HardpointActuatorState = (state) => {
  const subscriptions = ['event-MTM1M3-0-hardpointActuatorState'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    hardpointIlcState: m1m3Data['event-MTM1M3-0-hardpointActuatorState']?.[0]?.ilcState?.value ?? [],
    hardpointMotionState: m1m3Data['event-MTM1M3-0-hardpointActuatorState']?.[0]?.motionState?.value ?? [],
    hardpointReferenceId: [1, 2, 3, 4, 5, 6],
  };
};

export const getM1M3HardpointMonitorData = (state) => {
  const subscriptions = ['telemetry-MTM1M3-0-hardpointMonitorData'];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    hardpointsBreakawayLVDT: m1m3Data['telemetry-MTM1M3-0-hardpointMonitorData']?.breakawayLVDT?.value ?? [],
    hardpointsDisplacementLVDT: m1m3Data['telemetry-MTM1M3-0-hardpointMonitorData']?.displacementLVDT?.value ?? [],
    hardpointsBreakawayPressure: m1m3Data['telemetry-MTM1M3-0-hardpointMonitorData']?.breakawayPressure?.value ?? [],
    referenceHardpointId: [1, 2, 3, 4, 5, 6],
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
    'telemetry-MTM1M3-0-appliedForces',
    'telemetry-MTM1M3-0-appliedAccelerationForces',
    'telemetry-MTM1M3-0-appliedAzimuthForces',
    'telemetry-MTM1M3-0-appliedBalanceForces',
    'telemetry-MTM1M3-0-appliedCylinderForces',
    'telemetry-MTM1M3-0-appliedElevationForces',
    'telemetry-MTM1M3-0-appliedThermalForces',
    'telemetry-MTM1M3-0-appliedVelocityForces',
    'event-MTM1M3-0-appliedActiveOpticForces',
    'event-MTM1M3-0-appliedOffsetForces',
    'event-MTM1M3-0-appliedStaticForces',
  ];
  const m1m3Data = getStreamsData(state, subscriptions);
  return {
    appliedForces: m1m3Data['telemetry-MTM1M3-0-appliedForces'] ?? {},
    appliedAccelerationForces: m1m3Data['telemetry-MTM1M3-0-appliedAccelerationForce'] ?? {},
    appliedAzimuthForces: m1m3Data['telemetry-MTM1M3-0-appliedAzimuthForces'] ?? {},
    appliedBalanceForces: m1m3Data['telemetry-MTM1M3-0-appliedBalanceForces'] ?? {},
    appliedCylinderForces: m1m3Data['telemetry-MTM1M3-0-appliedCylinderForces'] ?? {},
    appliedElevationForces: m1m3Data['telemetry-MTM1M3-0-appliedElevationForces'] ?? {},
    appliedThermalForces: m1m3Data['telemetry-MTM1M3-0-appliedThermalForces'] ?? {},
    appliedVelocityForces: m1m3Data['telemetry-MTM1M3-0-appliedVelocityForces'] ?? {},
    appliedActiveOpticForces: m1m3Data['event-MTM1M3-0-appliedActiveOpticForces']?.[0] ?? {},
    appliedOffsetForces: m1m3Data['event-MTM1M3-0-appliedOffsetForces']?.[0] ?? {},
    appliedStaticForces: m1m3Data['event-MTM1M3-0-appliedStaticForces']?.[0] ?? {},
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
    actuatorIlcState: m2ActuatorsData['telemetry-MTM2-0-ilcData']?.status?.value ?? Array(78).fill(0),
    axialActuatorSteps: m2ActuatorsData['telemetry-MTM2-0-axialActuatorSteps']?.steps?.value ?? Array(72).fill(0),
    axialEncoderPositions:
      m2ActuatorsData['telemetry-MTM2-0-axialEncoderPositions']?.positions?.value ?? Array(72).fill(0),
    tangentActuatorSteps: m2ActuatorsData['telemetry-MTM2-0-tangentActuatorSteps']?.steps?.value ?? Array(6).fill(0),
    tangentEncoderPositions:
      m2ActuatorsData['telemetry-MTM2-0-tangentEncoderPositions']?.positions?.value ?? Array(6).fill(0),
  };
};

export const getM2ActuatorForce = (state) => {
  const subscriptions = ['telemetry-MTM2-0-axialForce', 'telemetry-MTM2-0-tangentForce'];
  const m2ActuatorsData = getStreamsData(state, subscriptions);
  return {
    axialForceApplied: m2ActuatorsData['telemetry-MTM2-0-axialForce']?.applied?.value ?? Array(72).fill(0),
    axialForceMeasured: m2ActuatorsData['telemetry-MTM2-0-axialForce']?.measured?.value ?? Array(72).fill(0),
    tangentForceApplied: m2ActuatorsData['telemetry-MTM2-0-tangentForce']?.applied?.value ?? Array(6).fill(0),
    tangentForceMeasured: m2ActuatorsData['telemetry-MTM2-0-tangentForce']?.measured?.value ?? Array(6).fill(0),
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

export const getDomeState = (state) => {
  const domeSubscriptions = [
    'telemetry-ATDome-0-position',
    'event-ATDome-0-azimuthState',
    'event-ATDome-0-azimuthCommandedState',
    'event-ATDome-0-dropoutDoorState',
    'event-ATDome-0-mainDoorState',
    'event-ATDome-0-allAxesInPosition',
    'telemetry-ATMCS-0-mount_AzEl_Encoders',
    'telemetry-ATMCS-0-mount_Nasmyth_Encoders',
    'event-ATMCS-0-detailedState',
    'event-ATMCS-0-atMountState',
    'event-ATMCS-0-target',
    'event-ATMCS-0-allAxesInPosition',
    'event-ATMCS-0-m3State',
    'event-ATMCS-0-positionLimits',
    'telemetry-ATPtg-1-currentTimesToLimits',
  ];
  const domeData = getStreamsData(state, domeSubscriptions);
  return {
    dropoutDoorOpeningPercentage: domeData['telemetry-ATDome-0-position']
      ? domeData['telemetry-ATDome-0-position'].dropoutDoorOpeningPercentage
      : 0,
    mainDoorOpeningPercentage: domeData['telemetry-ATDome-0-position']
      ? domeData['telemetry-ATDome-0-position'].mainDoorOpeningPercentage
      : 0,
    azimuthPosition: domeData['telemetry-ATDome-0-position']
      ? domeData['telemetry-ATDome-0-position'].azimuthPosition
      : 0,
    azimuthState: domeData['event-ATDome-0-azimuthState'],
    azimuthCommandedState: domeData['event-ATDome-0-azimuthCommandedState'],
    domeInPosition: domeData['event-ATDome-0-allAxesInPosition'],
    dropoutDoorState: domeData['event-ATDome-0-dropoutDoorState'],
    mainDoorState: domeData['event-ATDome-0-mainDoorState'],
    azElMountEncoders: domeData['telemetry-ATMCS-0-mount_AzEl_Encoders'],
    nasmythMountEncoders: domeData['telemetry-ATMCS-0-mount_Nasmyth_Encoders'],
    detailedState: domeData['event-ATMCS-0-detailedState'],
    atMountState: domeData['event-ATMCS-0-atMountState'],
    mountInPosition: domeData['event-ATMCS-0-allAxesInPosition'],
    target: domeData['event-ATMCS-0-target'],
    m3State: domeData['event-ATMCS-0-m3State'],
    positionLimits: domeData['event-ATMCS-0-positionLimits'],
    currentTimesToLimits: domeData.currentTimesToLimits,
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
    `telemetry-ATPneumatics-${index}-loadCell`,
    `telemetry-ATPneumatics-${index}-m1AirPressure`,
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
  const m1SetPressure = mountData[`event-ATPneumatics-${index}-m1SetPressure`];
  const mainValveState = mountData[`event-ATPneumatics-${index}-mainValveState`];
  const instrumentState = mountData[`event-ATPneumatics-${index}-instrumentState`];
  const hexapodReadyForCommand = mountData[`event-ATPneumatics-${index}-readyForCommand`];
  const m1VentsLimitSwitches = mountData[`event-ATPneumatics-${index}-m1VentsLimitSwitches`];
  const m1CoverLimitSwitches = mountData[`event-ATPneumatics-${index}-m1CoverLimitSwitches`];
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
    loadCell: mountData[`telemetry-ATPneumatics-${index}-loadCell`]
      ? mountData[`telemetry-ATPneumatics-${index}-loadCell`].cellLoad
      : 'Unknown',
    m1AirPressure: mountData[`telemetry-ATPneumatics-${index}-m1AirPressure`]
      ? mountData[`telemetry-ATPneumatics-${index}-m1AirPressure`].pressure
      : 'Unknown', 
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
    hexapodControllerStateOfflineSubstate: hexapodStatusData[`event-MTHexapod-${salindex}-controllerState`]
      ? hexapodStatusData[`event-MTHexapod-${salindex}-controllerState`][0].offlineSubstate.value
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

//MTDome
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
  const subscriptions = ['telemetry-MTDome-0-louvers', 'telemetry-ATDome-0-position',];
  const louvers = getStreamsData(state, subscriptions);
  return {
    actualPositionLouvers: louvers['telemetry-MTDome-0-louvers']
      ? louvers['telemetry-MTDome-0-louvers'].positionActual.value
      : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    commandedPositionLouvers: louvers['telemetry-MTDome-0-louvers']
      ? louvers['telemetry-MTDome-0-louvers'].positionCommanded.value
      : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    powerDrawLouvers: louvers['telemetry-MTDome-0-louvers']
      ? louvers['telemetry-MTDome-0-louvers']
      : {},
    atDomePosition: louvers['telemetry-ATDome-0-position']
      ? louvers['telemetry-ATDome-0-position']
      : {},
  };
};

export const getDomeStatus = (state) => {
  const subscriptions = [
    'event-MTMount-0-target',
    'event-MTDome-0-summaryState',
    'event-MTDome-0-azEnabled',
    'event-MTDome-0-azMotion',
    'event-MTDome-0-azTarget',
    'event-MTDome-0-elEnabled',
    'event-MTDome-0-elMotion',
    'event-MTDome-0-elTarget',
    'event-MTDome-0-operationalMode',
  ];
  const domeStatus = getStreamsData(state, subscriptions);
  return {
    trackId: domeStatus['event-MTMount-0-target']?.[0]?.trackId?.value ?? 0,
    mtdomeSummaryState: domeStatus['event-MTDome-0-summaryState']?.[0]?.summaryState?.value ?? 0,
    azimuthDomeState: domeStatus['event-MTDome-0-azEnabled']?.[0]?.state?.value ?? 0,
    azimuthDomeMotion: domeStatus['event-MTDome-0-azMotion']?.[0]?.state?.value ?? 0,
    azimuthDomeTarget: domeStatus['event-MTDome-0-azTarget']?.[0]?.position?.value ?? 0,
    elevationDomeState: domeStatus['event-MTDome-0-elEnabled']?.[0]?.state?.value ?? 0,
    elevationDomeMotion: domeStatus['event-MTDome-0-elMotion']?.[0]?.state?.value ?? 0,
    elevationDomeTarget: domeStatus['event-MTDome-0-elTarget']?.[0]?.position?.value ?? 0,
    modeDomeStatus: domeStatus['event-MTDome-0-operationalMode']?.[0]?.operationalMode?.value ?? 0,
  };
};

//MTMount
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
  ];
  const summaryData = getStreamsData(state, subscriptions);
  return {
    trackId: summaryData['event-MTMount-0-target']?.[0]?.trackId.value ?? 0,
    commander: summaryData['event-MTMount-0-commander']?.[0]?.commander.value ?? 0,
    connected: summaryData['event-MTMount-0-connected']?.[0]?.command.value ?? undefined,
    balancing: summaryData['event-MTMount-0-balanceSystemState']?.[0]?.powerState.value ?? 15,
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
    azimuthSystem: summaryData['event-MTMount-0-azimuthSystemState']?.[0]?.powerState.value ?? 15,
    azimuthMotion: summaryData['event-MTMount-0-azimuthMotionState']?.[0]?.state.value ?? undefined,
    azimuthLimits: summaryData['event-MTMount-0-azimuthLimits']?.[0]?.limits.value ?? 0,
    azimuthActualPosition: summaryData['telemetry-MTMount-0-azimuth']?.actualPosition.value ?? 0.0,
    azimuthDemandPosition: summaryData['telemetry-MTMount-0-azimuth']?.demandPosition.value ?? 0.0,
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
    elevationSystem: summaryData['event-MTMount-0-elevationSystemState']?.[0]?.powerState.value ?? 15,
    elevationMotion: summaryData['event-MTMount-0-elevationMotionState']?.[0]?.state.value ?? undefined,
    elevationLimits: summaryData['event-MTMount-0-elevationLimits']?.[0]?.limits.value ?? 0,
    elevationActualPosition: summaryData['telemetry-MTMount-0-elevation']?.actualPosition.value ?? 0.0,
    elevationDemandPosition: summaryData['telemetry-MTMount-0-elevation']?.demandPosition.value ?? 0.0,
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
    azimuthDrives: drivesData['telemetry-MTMount-0-azimuthDrives']?.current.value ?? [],
    elevationDrives: drivesData['telemetry-MTMount-0-elevationDrives']?.current.value ?? [],
  };
};

/**
 * Selects the Mirror Covers status for Mirror Covers view
 * @param {object} state
 */
export const getMirrorCoversMotionState = (state) => {
  const subscriptions = ['event-MTMount-0-mirrorCoversMotionState'];
  const summaryData = getStreamsData(state, subscriptions);
  return {
    mirrorCovers: summaryData['event-MTMount-0-mirrorCoversMotionState']?.[0]?.state.value ?? 0,
  };
};

// GIS
export const getRawStatus = (state) => {
  const subscriptions = ['event-GIS-0-rawStatus'];
  const interlocksData = getStreamsData(state, subscriptions);
  return {
    interlocksStatus: interlocksData['event-GIS-0-rawStatus']
      ? interlocksData['event-GIS-0-rawStatus'][0].rawStatus.value
      : Array(30).fill(0),
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

export const getAuthlistState = (state, subscriptions) => {
  const authlistData = getStreamsData(state, subscriptions);
  return authlistData;
};

export const getKey = (dict, key, def) => {
  if (dict && dict !== {} && Object.keys(dict).includes(key)) {
    return dict[key];
  }
  return def;
};

export const getScriptQueueState = (state, salindex) => {
  const scriptQueueData = getStreamData(state, `event-ScriptQueueState-${salindex}-stream`);
  const runningState = getKey(scriptQueueData, 'running', undefined);
  return {
    state: runningState === undefined ? 'Unknown' : runningState ? 'Running' : 'Stopped',
    availableScriptList: getKey(scriptQueueData, 'available_scripts', undefined),
    waitingScriptList: getKey(scriptQueueData, 'waiting_scripts', undefined),
    current: getKey(scriptQueueData, 'current', 'None'),
    finishedScriptList: getKey(scriptQueueData, 'finished_scripts', undefined),
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
        dictionary[`${CSC}-${salindex}`] = dictionary[`${CSC}-${salindex}`][0];
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
    return msg1.private_rcvStamp.value > msg2.private_rcvStamp.value ? -1 : 1;
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
    return msg1.private_rcvStamp.value > msg2.private_rcvStamp.value ? -1 : 1;
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
  return getStreamData(state, 'event-Watcher-0-alarm');
};

export const getObservingLogs = (state) => {
  return state.observingLogs.logMessages;
};
