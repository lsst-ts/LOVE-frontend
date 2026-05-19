/** 
This file is part of LOVE-frontend.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import { validNumbers, getStandardDeviation } from 'Utils';
import InputPresent from './InputPresent';
import UtilityGridCard from './Cards/UtilityGridCard';
import GeneratorCard from './Cards/GeneratorCard';
import ATSCard from './Cards/ATSCard';
import UPSCard from './Cards/UPSCard';
import LoadCard from './Cards/LoadCard';
import styles from './PowerMonitor.module.css';

const DEVICE_SENSOR_NAME = {
  MAIN_UPS: 'power-ups.cp.lsst.org',
  AUX_UPS: 'aux-ups01.cp.lsst.org',
  DP1: 'power-dp01.cp.lsst.org',
  SERVER_ROOM_UPS1: 'sdc-upsmod01.cp.lsst.org',
  SERVER_ROOM_UPS2: 'sdc-upsmod02.cp.lsst.org',
};

const DEVICE_MAX_LOAD_KW = {
  PRIMARY_GENERATOR: 880,
  SECONDARY_GENERATOR: 660,
  MAIN_UPS: 750,
  AUX_UPS: 18,
  SERVER_ROOM_UPS: 18,
  NON_CRITICAL: 1030,
};

const GENERATOR_LOADTAKEOVER_THRESHOLD_KVA = 100;

const DEVICE_VOLTAGE_CACHE_SIZE = 6;

function getGeneratorMode(blockMode, testMode, manualMode, semiAutoMode, autoMode) {
  if (blockMode) return 'BLOCK';
  if (testMode) return 'TEST';
  if (manualMode) return 'MANUAL';
  if (semiAutoMode) return 'SEMI-AUTO';
  if (autoMode) return 'AUTO';
  return 'UNKNOWN';
}

function getATSMode(automaticMainsFailure, loadTakeover, fixedPower) {
  if (automaticMainsFailure) return <span title="AUTOMATIC MAINS FAILURE">AMF</span>;
  if (loadTakeover) return <span title="LOAD TAKEOVER">LTO</span>;
  if (fixedPower) return <span title="FIXED POWER">FP</span>;
  return <span title="UNKNOWN">UNKNOWN</span>;
}

function PowerMonitor({
  upsState,
  secondaryGeneratorState,
  primaryGeneratorState,
  atsState,
  serverRoommUPS1State,
  serverRoomUPS2State,

  atsMainsFailure,
  atsAutomaticMainsFailure,
  atsLoadTakeover,
  atsFixedPower,

  atsMainsVoltageL1L2,
  atsMainsVoltageL2L3,
  atsMainsVoltageL3L1,
  atsMainsVoltageL1N,
  atsMainsVoltageL2N,
  atsMainsVoltageL3N,
  atsMainsFrequencyL1,
  atsMainsFrequencyL2,
  atsMainsFrequencyL3,
  atsMainsPower,

  secondaryGeneratorRunning,
  primaryGeneratorRunning,
  secondaryGeneratorBlockMode,
  primaryGeneratorBlockMode,
  secondaryGeneratorTestMode,
  primaryGeneratorTestMode,
  secondaryGeneratorManualMode,
  primaryGeneratorManualMode,
  secondaryGeneratorSemiAutoMode,
  primaryGeneratorSemiAutoMode,
  secondaryGeneratorAutoMode,
  primaryGeneratorAutoMode,

  secondaryGeneratorActivePower,
  primaryGeneratorActivePower,
  secondaryGeneratorApparentPower,
  primaryGeneratorApparentPower,
  secondaryGeneratorFuelLevel,
  primaryGeneratorFuelLevel,

  upsInputVoltage1,
  upsInputVoltage2,
  upsInputVoltage3,
  upsInputFrequency,
  upsInputPower,
  upsOutputVoltage1,
  upsOutputVoltage2,
  upsOutputVoltage3,
  upsOutputFrequency,
  upsOutputPower1,
  upsOutputPower2,
  upsOutputPower3,
  upsBatteryLevel,
  upsBatteryTimeRemaining,
  upsSensorName,
  upsTimestamp,

  serverRoomUPS1InputVoltage1,
  serverRoomUPS2InputVoltage1,
  serverRoomUPS1InputVoltage2,
  serverRoomUPS2InputVoltage2,
  serverRoomUPS1InputVoltage3,
  serverRoomUPS2InputVoltage3,
  serverRoomUPS1InputFrequency,
  serverRoomUPS2InputFrequency,
  serverRoomUPS1OutputVoltage1,
  serverRoomUPS2OutputVoltage1,
  serverRoomUPS1OutputVoltage2,
  serverRoomUPS2OutputVoltage2,
  serverRoomUPS1OutputVoltage3,
  serverRoomUPS2OutputVoltage3,
  serverRoomUPS1OutputFrequency,
  serverRoomUPS2OutputFrequency,
  serverRoomUPS1OutputPower,
  serverRoomUPS2OutputPower,
  serverRoommUPS1Battery,
  serverRoomUPS2Battery,
  serverRoommUPS1BatteryBackupTime,
  serverRoomUPS2BatteryBackupTime,
  serverRoomUPS1Timestamp,
  serverRoomUPS2Timestamp,

  subscribeToStreams,
  unsubscribeToStreams,
}) {
  const [deviceCache, setDeviceCache] = useState({
    [DEVICE_SENSOR_NAME.MAIN_UPS]: {
      inputVoltage1: null,
      inputVoltage2: null,
      inputVoltage3: null,
      inputFrequency: null,
      outputVoltage1: null,
      outputVoltage2: null,
      outputVoltage3: null,
      outputFrequency: null,
      outputPower1: null,
      outputPower2: null,
      outputPower3: null,
      battery: null,
      batteryTimeRemaining: null,
    },
    [DEVICE_SENSOR_NAME.AUX_UPS]: {
      inputVoltage1: null,
      inputVoltage2: null,
      inputVoltage3: null,
      inputFrequency: null,
      outputVoltage1: null,
      outputVoltage2: null,
      outputVoltage3: null,
      outputFrequency: null,
      outputPower1: null,
      outputPower2: null,
      outputPower3: null,
      battery: null,
      batteryTimeRemaining: null,
    },
    [DEVICE_SENSOR_NAME.DP1]: {
      inputVoltage1: null,
      inputVoltage2: null,
      inputVoltage3: null,
      inputFrequency: null,
      outputVoltage1: null,
      outputVoltage2: null,
      outputVoltage3: null,
      outputFrequency: null,
      outputPower1: null,
      outputPower2: null,
      outputPower3: null,
      battery: null,
      batteryTimeRemaining: null,
    },
  });
  const [voltageCache, setVoltageCache] = useState({
    [DEVICE_SENSOR_NAME.MAIN_UPS]: {
      outputVoltage1: [],
      outputVoltage2: [],
      outputVoltage3: [],
    },
    [DEVICE_SENSOR_NAME.AUX_UPS]: {
      outputVoltage1: [],
      outputVoltage2: [],
      outputVoltage3: [],
    },
    [DEVICE_SENSOR_NAME.DP1]: {
      outputVoltage1: [],
      outputVoltage2: [],
      outputVoltage3: [],
    },
    [DEVICE_SENSOR_NAME.SERVER_ROOM_UPS1]: {
      outputVoltage1: [],
      outputVoltage2: [],
      outputVoltage3: [],
    },
    [DEVICE_SENSOR_NAME.SERVER_ROOM_UPS2]: {
      outputVoltage1: [],
      outputVoltage2: [],
      outputVoltage3: [],
    },
  });

  useEffect(() => {
    subscribeToStreams();
    return () => {
      unsubscribeToStreams();
    };
  }, []);

  useEffect(() => {
    const isKnownSensor =
      upsSensorName === DEVICE_SENSOR_NAME.MAIN_UPS ||
      upsSensorName === DEVICE_SENSOR_NAME.AUX_UPS ||
      upsSensorName === DEVICE_SENSOR_NAME.DP1;

    if (!isKnownSensor) return;

    setDeviceCache((prev) => ({
      ...prev,
      [upsSensorName]: {
        ...prev[upsSensorName],
        inputVoltage1: upsInputVoltage1,
        inputVoltage2: upsInputVoltage2,
        inputVoltage3: upsInputVoltage3,
        inputFrequency: upsInputFrequency,
        outputVoltage1: upsOutputVoltage1,
        outputVoltage2: upsOutputVoltage2,
        outputVoltage3: upsOutputVoltage3,
        outputFrequency: upsOutputFrequency,
        outputPower1: upsOutputPower1,
        outputPower2: upsOutputPower2,
        outputPower3: upsOutputPower3,
        battery: upsBatteryLevel,
        batteryTimeRemaining: upsBatteryTimeRemaining,
      },
    }));
  }, [
    upsSensorName,
    upsInputVoltage1,
    upsInputVoltage2,
    upsInputVoltage3,
    upsInputFrequency,
    upsInputPower,
    upsOutputVoltage1,
    upsOutputVoltage2,
    upsOutputVoltage3,
    upsOutputFrequency,
    upsOutputPower1,
    upsOutputPower2,
    upsOutputPower3,
    upsBatteryLevel,
    upsBatteryTimeRemaining,
  ]);

  useEffect(() => {
    setVoltageCache((prev) => ({
      ...prev,
      [upsSensorName]: {
        outputVoltage1: [...(prev[upsSensorName]?.outputVoltage1 || []), upsOutputVoltage1].slice(
          -DEVICE_VOLTAGE_CACHE_SIZE,
        ),
        outputVoltage2: [...(prev[upsSensorName]?.outputVoltage2 || []), upsOutputVoltage2].slice(
          -DEVICE_VOLTAGE_CACHE_SIZE,
        ),
        outputVoltage3: [...(prev[upsSensorName]?.outputVoltage3 || []), upsOutputVoltage3].slice(
          -DEVICE_VOLTAGE_CACHE_SIZE,
        ),
      },
    }));
  }, [upsTimestamp]);

  useEffect(() => {
    setVoltageCache((prev) => ({
      ...prev,
      [DEVICE_SENSOR_NAME.SERVER_ROOM_UPS1]: {
        outputVoltage1: [
          ...(prev[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS1]?.outputVoltage1 || []),
          serverRoomUPS1OutputVoltage1,
        ].slice(-DEVICE_VOLTAGE_CACHE_SIZE),
        outputVoltage2: [
          ...(prev[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS1]?.outputVoltage2 || []),
          serverRoomUPS1OutputVoltage2,
        ].slice(-DEVICE_VOLTAGE_CACHE_SIZE),
        outputVoltage3: [
          ...(prev[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS1]?.outputVoltage3 || []),
          serverRoomUPS1OutputVoltage3,
        ].slice(-DEVICE_VOLTAGE_CACHE_SIZE),
      },
    }));
  }, [serverRoomUPS1Timestamp]);

  useEffect(() => {
    setVoltageCache((prev) => ({
      ...prev,
      [DEVICE_SENSOR_NAME.SERVER_ROOM_UPS2]: {
        outputVoltage1: [
          ...(prev[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS2]?.outputVoltage1 || []),
          serverRoomUPS2OutputVoltage1,
        ].slice(-DEVICE_VOLTAGE_CACHE_SIZE),
        outputVoltage2: [
          ...(prev[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS2]?.outputVoltage2 || []),
          serverRoomUPS2OutputVoltage2,
        ].slice(-DEVICE_VOLTAGE_CACHE_SIZE),
        outputVoltage3: [
          ...(prev[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS2]?.outputVoltage3 || []),
          serverRoomUPS2OutputVoltage3,
        ].slice(-DEVICE_VOLTAGE_CACHE_SIZE),
      },
    }));
  }, [serverRoomUPS2Timestamp]);

  const gridOff = atsMainsFailure;
  const secondaryGeneratorLoadTakeover =
    secondaryGeneratorRunning && secondaryGeneratorApparentPower >= GENERATOR_LOADTAKEOVER_THRESHOLD_KVA;
  const primaryGeneratorLoadTakeover =
    primaryGeneratorRunning && primaryGeneratorApparentPower >= GENERATOR_LOADTAKEOVER_THRESHOLD_KVA;
  const generatorLoadTakeover = secondaryGeneratorLoadTakeover || primaryGeneratorLoadTakeover;
  const noSource = gridOff && !generatorLoadTakeover;

  const gridStatus = gridOff ? 'NO POWER' : 'ONLINE';
  const secondaryGeneratorStatus = secondaryGeneratorRunning ? 'RUNNING' : 'STOPPED';
  const primaryGeneratorStatus = primaryGeneratorRunning ? 'RUNNING' : 'STOPPED';
  const atsStatus = noSource ? 'NO SOURCE' : 'HEALTHY';
  const upsStatus = noSource ? 'ON BATTERY' : 'ONLINE';

  const atsSource = noSource ? 'NO SOURCE' : generatorLoadTakeover ? 'GENERATOR' : 'UTILITY';
  const atsUtilityInput = (
    <InputPresent present={!gridOff} title={!gridOff ? 'Utility input present' : 'Utility input not present'} />
  );
  const atsGeneratorInput = (
    <InputPresent
      present={generatorLoadTakeover}
      title={generatorLoadTakeover ? 'Generator input present' : 'Generator input not present'}
    />
  );
  const atsOutputUPS = noSource ? 'NO POWER' : 'ENERGIZED';

  const mainUPSCache = deviceCache[DEVICE_SENSOR_NAME.MAIN_UPS];
  const auxUPSCache = deviceCache[DEVICE_SENSOR_NAME.AUX_UPS];

  const mainUPSNoBattery = mainUPSCache.battery === 0 || mainUPSCache.battery === null;
  const auxUPSNoBattery = auxUPSCache.battery === 0 || auxUPSCache.battery === null;
  const serverRoomUPS1NoBattery = serverRoommUPS1Battery === 0 || serverRoommUPS1Battery === null;
  const serverRoomUPS2NoBattery = serverRoomUPS2Battery === 0 || serverRoomUPS2Battery === null;

  const criticalLoadStatus = noSource && mainUPSNoBattery ? 'NO POWER' : 'ONLINE';
  const serverRoomLoadStatus = noSource && serverRoomUPS1NoBattery && serverRoomUPS2NoBattery ? 'NO POWER' : 'ONLINE';
  const auxTelLoadStatus = noSource && auxUPSNoBattery ? 'NO POWER' : 'ONLINE';
  const nonCriticalLoadStatus = noSource ? 'NO POWER' : 'ONLINE';

  const gridVoltageLL = validNumbers(atsMainsVoltageL1L2, atsMainsVoltageL2L3, atsMainsVoltageL3L1)
    ? (atsMainsVoltageL1L2 + atsMainsVoltageL2L3 + atsMainsVoltageL3L1) / 3
    : null;
  const gridVoltageLN = validNumbers(atsMainsVoltageL1N, atsMainsVoltageL2N, atsMainsVoltageL3N)
    ? (atsMainsVoltageL1N + atsMainsVoltageL2N + atsMainsVoltageL3N) / 3
    : null;
  const gridFrequency = validNumbers(atsMainsFrequencyL1, atsMainsFrequencyL2, atsMainsFrequencyL3)
    ? Math.round((atsMainsFrequencyL1 + atsMainsFrequencyL2 + atsMainsFrequencyL3) / 3)
    : null;

  const mainUPSInputVoltage = validNumbers(
    mainUPSCache.inputVoltage1,
    mainUPSCache.inputVoltage2,
    mainUPSCache.inputVoltage3,
  )
    ? (mainUPSCache.inputVoltage1 + mainUPSCache.inputVoltage2 + mainUPSCache.inputVoltage3) / 3
    : null;
  const auxUPSInputVoltage = validNumbers(
    auxUPSCache.inputVoltage1,
    auxUPSCache.inputVoltage2,
    auxUPSCache.inputVoltage3,
  )
    ? (auxUPSCache.inputVoltage1 + auxUPSCache.inputVoltage2 + auxUPSCache.inputVoltage3) / 3
    : null;
  const mainUPSOutputVoltage = validNumbers(
    mainUPSCache.outputVoltage1,
    mainUPSCache.outputVoltage2,
    mainUPSCache.outputVoltage3,
  )
    ? (mainUPSCache.outputVoltage1 + mainUPSCache.outputVoltage2 + mainUPSCache.outputVoltage3) / 3
    : null;
  const auxUPSOutputVoltage = validNumbers(
    auxUPSCache.outputVoltage1,
    auxUPSCache.outputVoltage2,
    auxUPSCache.outputVoltage3,
  )
    ? (auxUPSCache.outputVoltage1 + auxUPSCache.outputVoltage2 + auxUPSCache.outputVoltage3) / 3
    : null;
  const mainUPSOutputPower = validNumbers(
    mainUPSCache.outputPower1,
    mainUPSCache.outputPower2,
    mainUPSCache.outputPower3,
  )
    ? (mainUPSCache.outputPower1 + mainUPSCache.outputPower2 + mainUPSCache.outputPower3) / 1000
    : null;
  const auxUPSOutputPower = validNumbers(auxUPSCache.outputPower1, auxUPSCache.outputPower2, auxUPSCache.outputPower3)
    ? (auxUPSCache.outputPower1 + auxUPSCache.outputPower2 + auxUPSCache.outputPower3) / 1000
    : null;

  const mainUPSOutputVoltage1StdDev = getStandardDeviation(voltageCache[DEVICE_SENSOR_NAME.MAIN_UPS].outputVoltage1);
  const mainUPSOutputVoltage2StdDev = getStandardDeviation(voltageCache[DEVICE_SENSOR_NAME.MAIN_UPS].outputVoltage2);
  const mainUPSOutputVoltage3StdDev = getStandardDeviation(voltageCache[DEVICE_SENSOR_NAME.MAIN_UPS].outputVoltage3);
  const auxUPSOutputVoltage1StdDev = getStandardDeviation(voltageCache[DEVICE_SENSOR_NAME.AUX_UPS].outputVoltage1);
  const auxUPSOutputVoltage2StdDev = getStandardDeviation(voltageCache[DEVICE_SENSOR_NAME.AUX_UPS].outputVoltage2);
  const auxUPSOutputVoltage3StdDev = getStandardDeviation(voltageCache[DEVICE_SENSOR_NAME.AUX_UPS].outputVoltage3);
  const dp1OutputVoltage1StdDev = getStandardDeviation(voltageCache[DEVICE_SENSOR_NAME.DP1].outputVoltage1);
  const dp1OutputVoltage2StdDev = getStandardDeviation(voltageCache[DEVICE_SENSOR_NAME.DP1].outputVoltage2);
  const dp1OutputVoltage3StdDev = getStandardDeviation(voltageCache[DEVICE_SENSOR_NAME.DP1].outputVoltage3);

  const mainUPSOutputVoltageStdDevMean =
    (mainUPSOutputVoltage1StdDev + mainUPSOutputVoltage2StdDev + mainUPSOutputVoltage3StdDev) / 3;
  const auxUPSOutputVoltageStdDevMean =
    (auxUPSOutputVoltage1StdDev + auxUPSOutputVoltage2StdDev + auxUPSOutputVoltage3StdDev) / 3;
  const dp1OutputVoltageStdDevMean = (dp1OutputVoltage1StdDev + dp1OutputVoltage2StdDev + dp1OutputVoltage3StdDev) / 3;

  const serverRoomUPS1InputVoltage = validNumbers(
    serverRoomUPS1InputVoltage1,
    serverRoomUPS1InputVoltage2,
    serverRoomUPS1InputVoltage3,
  )
    ? (serverRoomUPS1InputVoltage1 + serverRoomUPS1InputVoltage2 + serverRoomUPS1InputVoltage3) / 3
    : null;
  const serverRoomUPS2InputVoltage = validNumbers(
    serverRoomUPS2InputVoltage1,
    serverRoomUPS2InputVoltage2,
    serverRoomUPS2InputVoltage3,
  )
    ? (serverRoomUPS2InputVoltage1 + serverRoomUPS2InputVoltage2 + serverRoomUPS2InputVoltage3) / 3
    : null;
  const serverRoomUPS1OutputVoltage = validNumbers(
    serverRoomUPS1OutputVoltage1,
    serverRoomUPS1OutputVoltage2,
    serverRoomUPS1OutputVoltage3,
  )
    ? (serverRoomUPS1OutputVoltage1 + serverRoomUPS1OutputVoltage2 + serverRoomUPS1OutputVoltage3) / 3
    : null;
  const serverRoomUPS2OutputVoltage = validNumbers(
    serverRoomUPS2OutputVoltage1,
    serverRoomUPS2OutputVoltage2,
    serverRoomUPS2OutputVoltage3,
  )
    ? (serverRoomUPS2OutputVoltage1 + serverRoomUPS2OutputVoltage2 + serverRoomUPS2OutputVoltage3) / 3
    : null;
  const serverRoomUPS1OutputPowerKW = validNumbers(serverRoomUPS1OutputPower) ? serverRoomUPS1OutputPower / 1000 : null;
  const serverRoomUPS2OutputPowerKW = validNumbers(serverRoomUPS2OutputPower) ? serverRoomUPS2OutputPower / 1000 : null;

  const serverRoomUPS1BatteryTimeRemaining = serverRoommUPS1BatteryBackupTime * 60;
  const serverRoomUPS2BatteryTimeRemaining = serverRoomUPS2BatteryBackupTime * 60;

  const serverRoomUPS1OutputVoltage1StdDev = getStandardDeviation(
    voltageCache[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS1].outputVoltage1,
  );
  const serverRoomUPS1OutputVoltage2StdDev = getStandardDeviation(
    voltageCache[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS1].outputVoltage2,
  );
  const serverRoomUPS1OutputVoltage3StdDev = getStandardDeviation(
    voltageCache[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS1].outputVoltage3,
  );
  const serverRoomUPS2OutputVoltage1StdDev = getStandardDeviation(
    voltageCache[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS2].outputVoltage1,
  );
  const serverRoomUPS2OutputVoltage2StdDev = getStandardDeviation(
    voltageCache[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS2].outputVoltage2,
  );
  const serverRoomUPS2OutputVoltage3StdDev = getStandardDeviation(
    voltageCache[DEVICE_SENSOR_NAME.SERVER_ROOM_UPS2].outputVoltage3,
  );

  const serverRoomUPS1OutputVoltageStdDevMean =
    (serverRoomUPS1OutputVoltage1StdDev + serverRoomUPS1OutputVoltage2StdDev + serverRoomUPS1OutputVoltage3StdDev) / 3;
  const serverRoomUPS2OutputVoltageStdDevMean =
    (serverRoomUPS2OutputVoltage1StdDev + serverRoomUPS2OutputVoltage2StdDev + serverRoomUPS2OutputVoltage3StdDev) / 3;
  const serverRoomUPSOutputVoltageStdDevMean =
    (serverRoomUPS1OutputVoltageStdDevMean + serverRoomUPS2OutputVoltageStdDevMean) / 2;

  const primaryGeneratorLoad = validNumbers(primaryGeneratorApparentPower)
    ? Math.min((primaryGeneratorApparentPower / DEVICE_MAX_LOAD_KW.PRIMARY_GENERATOR) * 100, 100)
    : 0;
  const secondaryGeneratorLoad = validNumbers(secondaryGeneratorApparentPower)
    ? Math.min((secondaryGeneratorApparentPower / DEVICE_MAX_LOAD_KW.SECONDARY_GENERATOR) * 100, 100)
    : 0;
  const mainUPSLoad = validNumbers(mainUPSOutputPower)
    ? Math.min((mainUPSOutputPower / DEVICE_MAX_LOAD_KW.MAIN_UPS) * 100, 100)
    : 0;
  const auxUPSLoad = validNumbers(auxUPSOutputPower)
    ? Math.min((auxUPSOutputPower / DEVICE_MAX_LOAD_KW.AUX_UPS) * 100, 100)
    : 0;
  const serverRoomUPS1Load = validNumbers(serverRoomUPS1OutputPowerKW)
    ? Math.min((serverRoomUPS1OutputPowerKW / DEVICE_MAX_LOAD_KW.SERVER_ROOM_UPS) * 100, 100)
    : 0;
  const serverRoomUPS2Load = validNumbers(serverRoomUPS2OutputPowerKW)
    ? Math.min((serverRoomUPS2OutputPowerKW / DEVICE_MAX_LOAD_KW.SERVER_ROOM_UPS) * 100, 100)
    : 0;

  const criticalLoadPower = mainUPSOutputPower;
  const auxtelLoadPower = auxUPSOutputPower;
  const serverRoomLoadPower = serverRoomUPS1OutputPowerKW + serverRoomUPS2OutputPowerKW;
  const nonCriticalLoadPower =
    atsMainsPower +
    primaryGeneratorActivePower +
    secondaryGeneratorActivePower -
    criticalLoadPower -
    serverRoomLoadPower -
    auxtelLoadPower;

  const criticalLoadUsage = mainUPSLoad;
  const auxtelLoadUsage = auxUPSLoad;
  const serverRoomLoadUsage = (serverRoomLoadPower / (2 * DEVICE_MAX_LOAD_KW.SERVER_ROOM_UPS)) * 100;
  const nonCriticalLoadUsage = (nonCriticalLoadPower / DEVICE_MAX_LOAD_KW.NON_CRITICAL) * 100;

  const gridConditions = [];
  const primaryGeneratorConditions = [];
  const secondaryGeneratorConditions = [];
  const atsConditions = [];
  const mainUPSConditions = [];
  const auxUPSConditions = [];
  const serverRoomUPS1Conditions = [];
  const serverRoomUPS2Conditions = [];
  const criticalLoadConditions = [];
  const nonCriticalLoadConditions = [];
  const serverRoomLoadConditions = [];
  const auxtelLoadConditions = [];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.section}>
          <div>Sources</div>
          <UtilityGridCard
            title="Utility Grid"
            label="(GRID)"
            status={gridStatus}
            voltageLL={gridVoltageLL}
            voltageLN={gridVoltageLN}
            frequency={gridFrequency}
            conditions={gridConditions}
          />
          <GeneratorCard
            title="Caterpillar 1100 kVA"
            label="(GENSET 1)"
            status={primaryGeneratorStatus}
            cscState={CSCDetail.states[primaryGeneratorState].name}
            cscIndex={306}
            activePower={primaryGeneratorActivePower}
            load={primaryGeneratorLoad}
            fuel={primaryGeneratorFuelLevel}
            mode={getGeneratorMode(
              primaryGeneratorBlockMode,
              primaryGeneratorTestMode,
              primaryGeneratorManualMode,
              primaryGeneratorSemiAutoMode,
              primaryGeneratorAutoMode,
            )}
            conditions={primaryGeneratorConditions}
          />
          <GeneratorCard
            title="Mitsubishi 750 kVA"
            label="(GENSET 2)"
            status={secondaryGeneratorStatus}
            cscState={CSCDetail.states[secondaryGeneratorState].name}
            cscIndex={305}
            activePower={secondaryGeneratorActivePower}
            load={secondaryGeneratorLoad}
            fuel={secondaryGeneratorFuelLevel}
            mode={getGeneratorMode(
              secondaryGeneratorBlockMode,
              secondaryGeneratorTestMode,
              secondaryGeneratorManualMode,
              secondaryGeneratorSemiAutoMode,
              secondaryGeneratorAutoMode,
            )}
            conditions={secondaryGeneratorConditions}
          />
        </div>
        <div className={styles.section}>
          <div>ATS & UPS</div>
          <ATSCard
            title="Automatic Transfer Switch"
            label="(ATS)"
            status={atsStatus}
            cscState={CSCDetail.states[atsState].name}
            cscIndex={309}
            currentSource={atsSource}
            utilityInput={atsUtilityInput}
            generatorInput={atsGeneratorInput}
            outputUPS={atsOutputUPS}
            mode={getATSMode(atsAutomaticMainsFailure, atsLoadTakeover, atsFixedPower)}
            power={atsMainsPower}
            conditions={atsConditions}
          />
          <UPSCard
            title="Main UPS 825 kVA"
            label="(UPS 1)"
            status={upsStatus}
            cscState={CSCDetail.states[upsState].name}
            cscIndex={303}
            inputVoltage={mainUPSInputVoltage}
            inputFrequency={mainUPSCache.inputFrequency}
            outputVoltage={mainUPSOutputVoltage}
            outputFrequency={mainUPSCache.outputFrequency}
            power={mainUPSOutputPower}
            load={mainUPSLoad}
            battery={mainUPSCache.battery}
            batteryTimeRemaining={mainUPSCache.batteryTimeRemaining}
            conditions={mainUPSConditions}
          />
          <div className={styles.device2Cols}>
            <UPSCard
              title="Servers UPS 1 20 kVA"
              label="(UPS 2.1)"
              status={upsStatus}
              cscState={CSCDetail.states[serverRoommUPS1State].name}
              cscIndex={310}
              inputVoltage={serverRoomUPS1InputVoltage}
              inputFrequency={serverRoomUPS1InputFrequency}
              outputVoltage={serverRoomUPS1OutputVoltage}
              outputFrequency={serverRoomUPS1OutputFrequency}
              power={serverRoomUPS1OutputPowerKW}
              load={serverRoomUPS1Load}
              battery={serverRoommUPS1Battery}
              batteryTimeRemaining={serverRoomUPS1BatteryTimeRemaining}
              conditions={serverRoomUPS1Conditions}
            />
            <UPSCard
              title="Servers UPS 2 20 kVA"
              label="(UPS 2.2)"
              status={upsStatus}
              cscState={CSCDetail.states[serverRoomUPS2State].name}
              cscIndex={311}
              inputVoltage={serverRoomUPS2InputVoltage}
              inputFrequency={serverRoomUPS2InputFrequency}
              outputVoltage={serverRoomUPS2OutputVoltage}
              outputFrequency={serverRoomUPS2OutputFrequency}
              power={serverRoomUPS2OutputPowerKW}
              load={serverRoomUPS2Load}
              battery={serverRoomUPS2Battery}
              batteryTimeRemaining={serverRoomUPS2BatteryTimeRemaining}
              conditions={serverRoomUPS2Conditions}
            />
          </div>
          <UPSCard
            title="AuxTel UPS 20 kVA"
            label="(UPS 3)"
            status={upsStatus}
            cscState={CSCDetail.states[upsState].name}
            cscIndex={303}
            inputVoltage={auxUPSInputVoltage}
            inputFrequency={auxUPSCache.inputFrequency}
            outputVoltage={auxUPSOutputVoltage}
            outputFrequency={auxUPSCache.outputFrequency}
            power={auxUPSOutputPower}
            load={auxUPSLoad}
            battery={auxUPSCache.battery}
            batteryTimeRemaining={auxUPSCache.batteryTimeRemaining}
            conditions={auxUPSConditions}
          />
        </div>
        <div className={styles.section}>
          <div>Loads</div>
          <LoadCard
            status={criticalLoadStatus}
            title="Critical Systems"
            label="(LOAD 1)"
            power={criticalLoadPower}
            criticality="HIGH"
            usage={criticalLoadUsage}
            voltageStdDev={mainUPSOutputVoltageStdDevMean}
            conditions={criticalLoadConditions}
          />
          <LoadCard
            status={serverRoomLoadStatus}
            title="Server Room"
            label="(LOAD 2)"
            power={serverRoomLoadPower}
            criticality="HIGH"
            usage={serverRoomLoadUsage}
            voltageStdDev={serverRoomUPSOutputVoltageStdDevMean}
            conditions={serverRoomLoadConditions}
          />
          <LoadCard
            status={auxTelLoadStatus}
            title="AuxTel Facility"
            label="(LOAD 3)"
            power={auxtelLoadPower}
            criticality="MEDIUM"
            usage={auxtelLoadUsage}
            voltageStdDev={auxUPSOutputVoltageStdDevMean}
            conditions={auxtelLoadConditions}
          />
          <LoadCard
            status={nonCriticalLoadStatus}
            title="Non Critical Systems"
            label="(LOAD 4)"
            power={nonCriticalLoadPower}
            criticality="LOW"
            usage={nonCriticalLoadUsage}
            voltageStdDev={dp1OutputVoltageStdDevMean}
            conditions={nonCriticalLoadConditions}
          />
        </div>
      </div>
    </div>
  );
}

PowerMonitor.propTypes = {
  /** UPSs CSC SummaryState */
  upsState: PropTypes.number.isRequired,
  /** Secondary Generator SummaryState */
  secondaryGeneratorState: PropTypes.number.isRequired,
  /** Primary Generator SummaryState */
  primaryGeneratorState: PropTypes.number.isRequired,
  /** ATS SummaryState */
  atsState: PropTypes.number.isRequired,
  /** Server Room UPS 1 SummaryState */
  serverRoommUPS1State: PropTypes.number.isRequired,
  /** Server Room UPS 2 SummaryState */
  serverRoomUPS2State: PropTypes.number.isRequired,

  /** UPS Input Voltage in V */
  upsInputVoltage: PropTypes.number,
  /** UPS Input Frequency in Hz */
  upsInputFrequency: PropTypes.number,
  /** UPS Input Power in W */
  upsInputPower: PropTypes.number,
  /** UPS Output Voltage in V */
  upsOutputVoltage: PropTypes.number,
  /** UPS Output Frequency in Hz */
  upsOutputFrequency: PropTypes.number,
  /** UPS Battery Level percentage (0-100) */
  upsBatteryLevel: PropTypes.number,
  /** UPS Battery Time Remaining in seconds */
  upsBatteryTimeRemaining: PropTypes.number,
  /** UPS Timestamp */
  upsTimestamp: PropTypes.number,

  /** Sensor name for incoming UPS data */
  upsSensorName: PropTypes.string.isRequired,

  /** ATS Mains Failure */
  atsMainsFailure: PropTypes.bool,
  /** ATS Automatic Mains Failure */
  atsAutomaticMainsFailure: PropTypes.bool,
  /** ATS Load Takeover */
  atsLoadTakeover: PropTypes.bool,
  /** ATS Fixed Power */
  atsFixedPower: PropTypes.bool,

  /** ATS Mains Voltage L1-L2 in V */
  atsMainsVoltageL1L2: PropTypes.number,
  /** ATS Mains Voltage L2-L3 in V */
  atsMainsVoltageL2L3: PropTypes.number,
  /** ATS Mains Voltage L3-L1 in V */
  atsMainsVoltageL3L1: PropTypes.number,
  /** ATS Mains Voltage L1-N in V */
  atsMainsVoltageL1N: PropTypes.number,
  /** ATS Mains Voltage L2-N in V */
  atsMainsVoltageL2N: PropTypes.number,
  /** ATS Mains Voltage L3-N in V */
  atsMainsVoltageL3N: PropTypes.number,
  /** ATS Mains Frequency L1 in Hz */
  atsMainsFrequencyL1: PropTypes.number,
  /** ATS Mains Frequency L2 in Hz */
  atsMainsFrequencyL2: PropTypes.number,
  /** ATS Mains Frequency L3 */
  atsMainsFrequencyL3: PropTypes.number,
  /** ATS Mains Power in kW */
  atsMainsPower: PropTypes.number,

  /** Secondary Generator Running State */
  secondaryGeneratorRunning: PropTypes.bool,
  /** Primary Generator Running State */
  primaryGeneratorRunning: PropTypes.bool,
  /** Secondary Generator Block Mode */
  secondaryGeneratorBlockMode: PropTypes.bool,
  /** Primary Generator Block Mode */
  primaryGeneratorBlockMode: PropTypes.bool,
  /** Secondary Generator Test Mode */
  secondaryGeneratorTestMode: PropTypes.bool,
  /** Primary Generator Test Mode */
  primaryGeneratorTestMode: PropTypes.bool,
  /** Secondary Generator Manual Mode */
  secondaryGeneratorManualMode: PropTypes.bool,
  /** Primary Generator Manual Mode */
  primaryGeneratorManualMode: PropTypes.bool,
  /** Secondary Generator Semi-Auto Mode */
  secondaryGeneratorSemiAutoMode: PropTypes.bool,
  /** Primary Generator Semi-Auto Mode */
  primaryGeneratorSemiAutoMode: PropTypes.bool,
  /** Secondary Generator Auto Mode */
  secondaryGeneratorAutoMode: PropTypes.bool,
  /** Primary Generator Auto Mode */
  primaryGeneratorAutoMode: PropTypes.bool,

  /** Secondary Generator Active Power in kW */
  secondaryGeneratorActivePower: PropTypes.number,
  /** Primary Generator Active Power in kW */
  primaryGeneratorActivePower: PropTypes.number,
  /** Secondary Generator Apparent Power in kVA */
  secondaryGeneratorApparentPower: PropTypes.number,
  /** Primary Generator Apparent Power in kVA */
  primaryGeneratorApparentPower: PropTypes.number,
  /** Secondary Generator Fuel Level in percentage (0-100) */
  secondaryGeneratorFuelLevel: PropTypes.number,
  /** Primary Generator Fuel Level in percentage (0-100) */
  primaryGeneratorFuelLevel: PropTypes.number,

  /** Server Room UPS 1 Input Voltage L1N in V */
  serverRoomUPS1InputVoltage1: PropTypes.number,
  /** Server Room UPS 2 Input Voltage L1N in V */
  serverRoomUPS2InputVoltage1: PropTypes.number,
  /** Server Room UPS 1 Input Voltage L2N in V */
  serverRoomUPS1InputVoltage2: PropTypes.number,
  /** Server Room UPS 2 Input Voltage L2N in V */
  serverRoomUPS2InputVoltage2: PropTypes.number,
  /** Server Room UPS 1 Input Voltage L3N in V */
  serverRoomUPS1InputVoltage3: PropTypes.number,
  /** Server Room UPS 2 Input Voltage L3N in V */
  serverRoomUPS2InputVoltage3: PropTypes.number,
  /** Server Room UPS 1 Input Frequency in Hz */
  serverRoomUPS1InputFrequency: PropTypes.number,
  /** Server Room UPS 2 Input Frequency in Hz */
  serverRoomUPS2InputFrequency: PropTypes.number,
  /** Server Room UPS 1 Output Voltage L1N in V */
  serverRoomUPS1OutputVoltage1: PropTypes.number,
  /** Server Room UPS 2 Output Voltage L1N in V */
  serverRoomUPS2OutputVoltage1: PropTypes.number,
  /** Server Room UPS 1 Output Voltage L2N in V */
  serverRoomUPS1OutputVoltage2: PropTypes.number,
  /** Server Room UPS 2 Output Voltage L2N in V */
  serverRoomUPS2OutputVoltage2: PropTypes.number,
  /** Server Room UPS 1 Output Voltage L3N in V */
  serverRoomUPS1OutputVoltage3: PropTypes.number,
  /** Server Room UPS 2 Output Voltage L3N in V */
  serverRoomUPS2OutputVoltage3: PropTypes.number,
  /** Server Room UPS 1 Output Frequency in Hz */
  serverRoomUPS1OutputFrequency: PropTypes.number,
  /** Server Room UPS 2 Output Frequency in Hz */
  serverRoomUPS2OutputFrequency: PropTypes.number,
  /** Server Room UPS 1 Output Power in kW */
  serverRoomUPS1OutputPower: PropTypes.number,
  /** Server Room UPS 2 Output Power in kW */
  serverRoomUPS2OutputPower: PropTypes.number,
  /** Server Room UPS 1 Battery Level in percentage (0-100) */
  serverRoommUPS1Battery: PropTypes.number,
  /** Server Room UPS 2 Battery Level in percentage (0-100) */
  serverRoomUPS2Battery: PropTypes.number,
  /** Server Room UPS 1 Battery Time Remaining in minutes */
  serverRoommUPS1BatteryBackupTime: PropTypes.number,
  /** Server Room UPS 2 Battery Time Remaining in minutes */
  serverRoomUPS2BatteryBackupTime: PropTypes.number,
  /** Server Room UPS 1 Timestamp */
  serverRoomUPS1Timestamp: PropTypes.number,
  /** Server Room UPS 2 Timestamp */
  serverRoomUPS2Timestamp: PropTypes.number,

  /** Function to subscribe to necessary streams */
  subscribeToStreams: PropTypes.func.isRequired,
  /** Function to unsubscribe from streams on unmount */
  unsubscribeToStreams: PropTypes.func.isRequired,
};

export default PowerMonitor;
