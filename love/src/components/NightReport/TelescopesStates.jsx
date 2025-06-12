import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import ManagerInterface, { defaultNumberFormatter, getEFDInstanceForHost } from 'Utils';
import { ISO_STRING_DATE_TIME_FORMAT } from 'Config';
import Input from 'components/GeneralPurpose/Input/Input';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';

import styles from './CreateNightReport.module.css';

const observatoryStateTelemetriesMapping = {
  simonyiAzimuth: 'telemetry-MTMount-0-azimuth-actualPosition',
  simonyiElevation: 'telemetry-MTMount-0-elevation-actualPosition',
  simonyiDomeAzimuth: 'telemetry-MTDome-0-azimuth-positionActual',
  simonyiRotator: 'telemetry-MTRotator-0-rotation-actualPosition',
  simonyiMirrorCoversState: 'event-MTMount-0-mirrorCoversMotionState-state',
  simonyiOilSupplySystemState: 'event-MTMount-0-oilSupplySystemState-powerState',
  simonyiPowerSupplySystemState: 'event-MTMount-0-mainAxesPowerSupplySystemState-powerState',
  simonyiLockingPinsSystemState: 'event-MTMount-0-lockingPinsSystemState-powerState',
  auxtelAzimuth: 'telemetry-ATMCS-0-mount_AzEl_Encoders-azimuthCalculatedAngle-0',
  auxtelElevation: 'telemetry-ATMCS-0-mount_AzEl_Encoders-elevationCalculatedAngle-0',
  auxtelDomeAzimuth: 'telemetry-ATDome-0-position-azimuthPosition',
  auxtelMirrorCoversState: 'event-ATPneumatics-0-m1CoverState-state',
};

const efdTelemetriesStateMapping = {
  'MTMount-0-azimuth': 'simonyiAzimuth',
  'MTMount-0-elevation': 'simonyiElevation',
  'MTDome-0-azimuth': 'simonyiDomeAzimuth',
  'MTRotator-0-rotation': 'simonyiRotator',
  'MTMount-0-logevent_mirrorCoversMotionState': 'simonyiMirrorCoversState',
  'MTMount-0-logevent_oilSupplySystemState': 'simonyiOilSupplySystemState',
  'MTMount-0-logevent_mainAxesPowerSupplySystemState': 'simonyiPowerSupplySystemState',
  'MTMount-0-logevent_lockingPinsSystemState': 'simonyiLockingPinsSystemState',
  'ATMCS-0-mount_AzEl_Encoders': 'auxtelAzimuth',
  'ATDome-0-position': 'auxtelDomeAzimuth',
  'ATPneumatics-0-logevent_m1CoverState': 'auxtelMirrorCoversState',
};

// True means open
const MT_MIRROR_COVERS_STATUS_MAP = {
  0: true, // RETRACTED
  1: false, // DEPLOYED
  2: false, // RETRACTING
  3: false, // DEPLOYING
  4: false, // LOST
};

// True means ON
const MT_OSS_STATUS_MAP = {
  0: false, // OFF
  1: true, // ON
  2: false, // FAULT
  3: false, // TURNING_ON
  4: false, // TURNING_OFF
  15: false, // UNKNOWN
};

// True means ON
const MT_PS_STATUS_MAP = {
  0: false, // OFF
  1: true, // ON
  2: false, // FAULT
  3: false, // TURNING_ON
  4: false, // TURNING_OFF
  15: false, // UNKNOWN
};

// True means ON
const MT_LOCKING_PINS_STATUS_MAP = {
  0: false, // OFF
  1: true, // ON
  2: false, // FAULT
  3: false, // TURNING_ON
  4: false, // TURNING_OFF
  15: false, // UNKNOWN
};

// True means open
const AT_MIRROR_COVERS_STATUS_MAP = {
  1: false, // DISABLED
  2: false, // ENABLED
  3: false, // FAULT
  4: false, // OFFLINE
  5: false, // STANDBY
  6: false, // CLOSED
  7: true, // OPENED
  8: false, // INMOTION
  9: false, // INVALID
};

function TelescopesStates({ report, observatoryState: observatoryStateProp }) {
  const [observatoryState, setObservatoryState] = useState(observatoryStateProp);

  useEffect(() => {
    if (!report?.date_sent) {
      setObservatoryState(observatoryStateProp);
    }
  }, [observatoryStateProp, report?.date_sent]);

  useEffect(() => {
    if (report?.date_sent) {
      const timeCutdate = Moment(report.date_sent).format(ISO_STRING_DATE_TIME_FORMAT);
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
            [topicName]: [...(cscsPayload[csc]?.[index]?.[topicName] ?? []), itemName],
          },
        };
      });
      const efdInstance = getEFDInstanceForHost();
      if (!efdInstance) return;
      ManagerInterface.getEFDMostRecentTimeseries(cscsPayload, 1, timeCutdate, efdInstance).then((efdResponse) => {
        if (efdResponse) {
          const newObservatoryState = {};
          Object.keys(efdResponse).forEach((topic) => {
            const topicData = efdResponse[topic];
            const stateVarName = efdTelemetriesStateMapping[topic];
            const topicTokens = observatoryStateTelemetriesMapping[stateVarName].split('-');
            const item = topicTokens[4];
            const arrayIndex = topicTokens[5] ?? '';
            const itemName = `${item}${arrayIndex}`;
            const newValue = topicData[itemName]?.[0].value;
            newObservatoryState[stateVarName] = newValue;
          });
          setObservatoryState(newObservatoryState);
        }
      });
    }
  }, [report?.date_sent]);

  const simonyiMirrorCoverState = observatoryState?.simonyiMirrorCoversMotionState
    ? MT_MIRROR_COVERS_STATUS_MAP[observatoryState?.simonyiMirrorCoversMotionState]
    : false;
  const simonyiOilSupplySystemState = observatoryState?.simonyiOilSupplySystemState
    ? MT_OSS_STATUS_MAP[observatoryState?.simonyiOilSupplySystemState]
    : false;
  const simonyiPowerSupplySystemState = observatoryState?.simonyiPowerSupplySystemState
    ? MT_PS_STATUS_MAP[observatoryState?.simonyiPowerSupplySystemState]
    : false;
  const simonyiLockingPinsSystemState = observatoryState?.simonyiLockingPinsSystemState
    ? MT_LOCKING_PINS_STATUS_MAP[observatoryState?.simonyiLockingPinsSystemState]
    : false;
  const auxtelMirrorCoverState = observatoryState?.auxtelMirrorCoversMotionState
    ? AT_MIRROR_COVERS_STATUS_MAP[observatoryState?.auxtelMirrorCoversMotionState]
    : false;
  return (
    <div className={styles.telescopeStatesContainer}>
      <div>
        <div className={styles.telescopeStatesContainerTitle}>Simonyi Observatory State</div>
        <div className={styles.telescopeData}>
          <div className={styles.telescopeDataParam}>
            <div>Telescope Az:</div>
            <Input
              className={styles.telescopeDataParamInput}
              type="text"
              value={defaultNumberFormatter(observatoryState?.simonyiAzimuth, 2) + '°'}
              readOnly={true}
            />
          </div>
          <div className={styles.telescopeDataParam}>
            <div>Telescope El:</div>
            <Input
              className={styles.telescopeDataParamInput}
              type="text"
              value={defaultNumberFormatter(observatoryState?.simonyiElevation, 2) + '°'}
              readOnly={true}
            />
          </div>
          <div className={styles.telescopeDataParam}>
            <div>Dome Az:</div>
            <Input
              className={styles.telescopeDataParamInput}
              type="text"
              value={defaultNumberFormatter(observatoryState?.simonyiDomeAzimuth, 2) + '°'}
              readOnly={true}
            />
          </div>
          <div className={styles.telescopeDataParam}>
            <div>Camera Rotator position:</div>
            <Input
              className={styles.telescopeDataParamInput}
              type="text"
              value={defaultNumberFormatter(observatoryState?.simonyiRotator, 2) + '°'}
              readOnly={true}
            />
          </div>
          <div className={styles.telescopeDataParam}>
            <div>Mirror Covers</div>
            <Toggle labels={['Off', 'On']} toggled={simonyiMirrorCoverState} />
          </div>
          <div className={styles.telescopeDataParam}>
            <div>OSS</div>
            <Toggle labels={['Off', 'On']} toggled={simonyiOilSupplySystemState} />
          </div>
          <div className={styles.telescopeDataParam}>
            <div>Power Supply</div>
            <Toggle labels={['Off', 'On']} toggled={simonyiPowerSupplySystemState} />
          </div>
          <div className={styles.telescopeDataParam}>
            <div>Locking Pins</div>
            <Toggle labels={['Off', 'On']} toggled={simonyiLockingPinsSystemState} />
          </div>
        </div>
      </div>
      <div>
        <div className={styles.telescopeStatesContainerTitle}>AuxTel Observatory State</div>
        <div className={styles.telescopeData}>
          <div className={styles.telescopeDataParam}>
            <div>Telescope Az:</div>
            <Input
              className={styles.telescopeDataParamInput}
              type="text"
              value={defaultNumberFormatter(observatoryState?.auxtelAzimuth, 2) + '°'}
              readOnly={true}
            />
          </div>
          <div className={styles.telescopeDataParam}>
            <div>Telescope El:</div>
            <Input
              className={styles.telescopeDataParamInput}
              type="text"
              value={defaultNumberFormatter(observatoryState?.auxtelElevation, 2) + '°'}
              readOnly={true}
            />
          </div>
          <div className={styles.telescopeDataParam}>
            <div>Dome Az:</div>
            <Input
              className={styles.telescopeDataParamInput}
              type="text"
              value={defaultNumberFormatter(observatoryState?.auxtelDomeAzimuth, 2) + '°'}
              readOnly={true}
            />
          </div>
          <div className={styles.telescopeDataParam}>
            <div>Mirror Covers</div>
            <Toggle labels={['Off', 'On']} toggled={auxtelMirrorCoverState} />
          </div>
        </div>
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
