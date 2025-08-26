import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import ManagerInterface, {
  fixedFloat,
  getEFDInstanceForHost,
  isNightReportOld,
  getCutDateFromNightReport,
} from 'Utils';
import {
  ISO_STRING_DATE_TIME_FORMAT,
  mtMountDeployableMotionStateMap,
  mtMountPowerStateMap,
  atPneumaticsMirrorCoverStateMap,
  stateToStyleMTMountDeployableMotionState,
  stateToStyleMTMountPowerState,
  mtMountElevationLockingPinMotionStateMap,
  stateToStyleMTMountElevationLockingPinMotionState,
  stateToStyleATPneumaticsMirrorCoverState,
} from 'Config';
import Input from 'components/GeneralPurpose/Input/Input';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';

import styles from './CreateNightReport.module.css';

export const observatoryStateTelemetriesMapping = {
  simonyiAzimuth: 'telemetry-MTMount-0-azimuth-actualPosition',
  simonyiElevation: 'telemetry-MTMount-0-elevation-actualPosition',
  simonyiDomeAzimuth: 'telemetry-MTDome-0-azimuth-positionActual',
  simonyiRotator: 'telemetry-MTRotator-0-rotation-actualPosition',
  simonyiMirrorCoversState: 'event-MTMount-0-mirrorCoversMotionState-state',
  simonyiOilSupplySystemState: 'event-MTMount-0-oilSupplySystemState-powerState',
  simonyiPowerSupplySystemState: 'event-MTMount-0-mainAxesPowerSupplySystemState-powerState',
  simonyiLockingPinsSystemState: 'event-MTMount-0-elevationLockingPinMotionState-state',
  auxtelAzimuth: 'telemetry-ATMCS-0-mount_AzEl_Encoders-azimuthCalculatedAngle-0',
  auxtelElevation: 'telemetry-ATMCS-0-mount_AzEl_Encoders-elevationCalculatedAngle-0',
  auxtelDomeAzimuth: 'telemetry-ATDome-0-position-azimuthPosition',
  auxtelMirrorCoversState: 'event-ATPneumatics-0-m1CoverState-state',
};

export const efdTelemetriesStateMapping = {
  'MTMount-0-azimuth': ['simonyiAzimuth'],
  'MTMount-0-elevation': ['simonyiElevation'],
  'MTDome-0-azimuth': ['simonyiDomeAzimuth'],
  'MTRotator-0-rotation': ['simonyiRotator'],
  'MTMount-0-logevent_mirrorCoversMotionState': ['simonyiMirrorCoversState'],
  'MTMount-0-logevent_oilSupplySystemState': ['simonyiOilSupplySystemState'],
  'MTMount-0-logevent_mainAxesPowerSupplySystemState': ['simonyiPowerSupplySystemState'],
  'MTMount-0-logevent_elevationLockingPinMotionState': ['simonyiLockingPinsSystemState'],
  'ATMCS-0-mount_AzEl_Encoders': ['auxtelAzimuth', 'auxtelElevation'],
  'ATDome-0-position': ['auxtelDomeAzimuth'],
  'ATPneumatics-0-logevent_m1CoverState': ['auxtelMirrorCoversState'],
};

/**
 * Parses telescope state values from an EFD response object.
 *
 * Input format:
 * {
 *   "MTMount-0-azimuth": {
 *     "actualPosition": [
 *       {
 *         "ts": "2025-08-30 21:00:00+00:00",
 *         "value": 3.14
 *       }
 *     ]
 *   },
 *   "MTMount-0-elevation": {
 *     "simonyiElevation": [
 *       {
 *         "ts": "2025-08-30 21:00:00+00:00",
 *         "value": 2.71
 *       }
 *     ]
 *   },
 *  ...
 * }
 *
 * Output format:
 * {
 *  "simonyiAzimuth": 3.14,
 *  "simonyiElevation": 2.71,
 *  ...
 * }
 *
 * @param {Object} efdResponse - The EFD response object containing telemetry data, keyed by <CSC-saldindex-topicName>.
 * @returns {Object} An object mapping each state variable name to its extracted value from the EFD response.
 */
const parseTelescopesStatesFromEFD = (efdResponse) => {
  return Object.entries(efdResponse).reduce((acc, [topic, topicData]) => {
    const stateVarNames = efdTelemetriesStateMapping[topic];
    stateVarNames.forEach((stateVarName) => {
      const topicTokens = observatoryStateTelemetriesMapping[stateVarName].split('-');
      const item = topicTokens[4];
      const arrayIndex = topicTokens[5] ?? '';
      const itemName = `${item}${arrayIndex}`;
      const newValue = topicData[itemName]?.[0].value;
      acc[stateVarName] = newValue;
    });
    return acc;
  }, {});
};

function TelescopesStates({ report, observatoryState: observatoryStateProp }) {
  const [observatoryState, setObservatoryState] = useState(observatoryStateProp);
  const [loading, setLoading] = useState(false);

  const isReportOld = isNightReportOld(report);

  const fetchHistoricalData = () => {
    const cutDate = getCutDateFromNightReport(report);
    const timeCutdate = Moment(cutDate).format(ISO_STRING_DATE_TIME_FORMAT);
    const cscsPayload = {};
    Object.values(observatoryStateTelemetriesMapping).forEach((topic) => {
      const topicTokens = topic.split('-');
      const csc = topicTokens[1];
      const index = topicTokens[2];
      const topicName = topicTokens[0] === 'telemetry' ? topicTokens[3] : `logevent_${topicTokens[3]}`;
      const item = topicTokens[4];
      const arrayIndex = topicTokens[5] ?? '';
      const itemName = `${item}${arrayIndex}`;

      cscsPayload[csc] = {
        [index]: {
          ...(cscsPayload[csc]?.[index] ?? {}),
          [topicName]: [...(cscsPayload[csc]?.[index]?.[topicName] ?? []), itemName],
        },
      };
    });
    const efdInstance = getEFDInstanceForHost();
    if (!efdInstance) return;

    setLoading(true);
    ManagerInterface.getEFDMostRecentTimeseries(cscsPayload, 1, timeCutdate, efdInstance)
      .then((efdResponse) => {
        if (efdResponse) {
          const newObservatoryState = parseTelescopesStatesFromEFD(efdResponse);
          setObservatoryState(newObservatoryState);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isReportOld) {
      setObservatoryState(observatoryStateProp);
    }
  }, [observatoryStateProp, isReportOld]);

  useEffect(() => {
    if (report && isReportOld) {
      fetchHistoricalData();
    }
  }, [report?.date_sent, report?.id]);

  const simonyiMirrorCoverState =
    mtMountDeployableMotionStateMap[observatoryState.simonyiMirrorCoversState] ?? 'UNKNOWN';
  const simonyiOilSupplySystemState = mtMountPowerStateMap[observatoryState.simonyiOilSupplySystemState] ?? 'UNKNOWN';
  const simonyiPowerSupplySystemState =
    mtMountPowerStateMap[observatoryState.simonyiPowerSupplySystemState] ?? 'UNKNOWN';
  const simonyiLockingPinsSystemState =
    mtMountElevationLockingPinMotionStateMap[observatoryState.simonyiLockingPinsSystemState] ?? 'UNKNOWN';
  const auxtelMirrorCoverState = atPneumaticsMirrorCoverStateMap[observatoryState.auxtelMirrorCoversState] ?? 'UNKNOWN';

  const simonyiMirrorCoverStateStyle = stateToStyleMTMountDeployableMotionState[simonyiMirrorCoverState];
  const simonyiOilSupplySystemStateStyle = stateToStyleMTMountPowerState[simonyiOilSupplySystemState];
  const simonyiPowerSupplySystemStateStyle = stateToStyleMTMountPowerState[simonyiPowerSupplySystemState];
  const simonyiLockingPinsSystemStateStyle =
    stateToStyleMTMountElevationLockingPinMotionState[simonyiLockingPinsSystemState];
  const auxtelMirrorCoverStateStyle = stateToStyleATPneumaticsMirrorCoverState[auxtelMirrorCoverState];

  return (
    <div className={styles.telescopeStatesContainer}>
      <div>
        <div className={styles.telescopeStatesContainerTitle}>Simonyi Observatory State</div>
        {loading ? (
          <SpinnerIcon className={styles.spinner} />
        ) : (
          <div className={styles.telescopeData}>
            <div className={styles.telescopeDataParam}>
              <div>Telescope Az:</div>
              <Input
                className={styles.telescopeDataParamInput}
                type="text"
                value={fixedFloat(observatoryState?.simonyiAzimuth, 2) + '°'}
                readOnly={true}
              />
            </div>
            <div className={styles.telescopeDataParam}>
              <div>Telescope El:</div>
              <Input
                className={styles.telescopeDataParamInput}
                type="text"
                value={fixedFloat(observatoryState?.simonyiElevation, 2) + '°'}
                readOnly={true}
              />
            </div>
            <div className={styles.telescopeDataParam}>
              <div>Dome Az:</div>
              <Input
                className={styles.telescopeDataParamInput}
                type="text"
                value={fixedFloat(observatoryState?.simonyiDomeAzimuth, 2) + '°'}
                readOnly={true}
              />
            </div>
            <div className={styles.telescopeDataParam}>
              <div>Camera Rotator position:</div>
              <Input
                className={styles.telescopeDataParamInput}
                type="text"
                value={fixedFloat(observatoryState?.simonyiRotator, 2) + '°'}
                readOnly={true}
              />
            </div>
            <div className={styles.telescopeDataParam}>
              <div>Mirror Covers</div>
              <StatusText status={simonyiMirrorCoverStateStyle} title="Simonyi mirror covers">
                {simonyiMirrorCoverState}
              </StatusText>
            </div>
            <div className={styles.telescopeDataParam}>
              <div>OSS</div>
              <StatusText status={simonyiOilSupplySystemStateStyle} title="Simonyi oil supply system">
                {simonyiOilSupplySystemState}
              </StatusText>
            </div>
            <div className={styles.telescopeDataParam}>
              <div>Power Supply</div>
              <StatusText status={simonyiPowerSupplySystemStateStyle} title="Simonyi power supply system">
                {simonyiPowerSupplySystemState}
              </StatusText>
            </div>
            <div className={styles.telescopeDataParam}>
              <div>Locking Pins</div>
              <StatusText status={simonyiLockingPinsSystemStateStyle} title="Simonyi locking pins system">
                {simonyiLockingPinsSystemState}
              </StatusText>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className={styles.telescopeStatesContainerTitle}>AuxTel Observatory State</div>
        {loading ? (
          <SpinnerIcon className={styles.spinner} />
        ) : (
          <div className={styles.telescopeData}>
            <div className={styles.telescopeDataParam}>
              <div>Telescope Az:</div>
              <Input
                className={styles.telescopeDataParamInput}
                type="text"
                value={fixedFloat(observatoryState?.auxtelAzimuth, 2) + '°'}
                readOnly={true}
              />
            </div>
            <div className={styles.telescopeDataParam}>
              <div>Telescope El:</div>
              <Input
                className={styles.telescopeDataParamInput}
                type="text"
                value={fixedFloat(observatoryState?.auxtelElevation, 2) + '°'}
                readOnly={true}
              />
            </div>
            <div className={styles.telescopeDataParam}>
              <div>Dome Az:</div>
              <Input
                className={styles.telescopeDataParamInput}
                type="text"
                value={fixedFloat(observatoryState?.auxtelDomeAzimuth, 2) + '°'}
                readOnly={true}
              />
            </div>
            <div className={styles.telescopeDataParam}>
              <div>Mirror Covers</div>
              <StatusText status={auxtelMirrorCoverStateStyle} title="AuxTel mirror covers">
                {auxtelMirrorCoverState}
              </StatusText>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

TelescopesStates.propTypes = {
  /** Report object containing the date_sent */
  report: PropTypes.object,
  /** Observatory state object */
  observatoryState: PropTypes.object.isRequired,
};

export default TelescopesStates;
