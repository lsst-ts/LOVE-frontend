import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import ManagerInterface, { getObsDayFromDate, defaultNumberFormatter } from 'Utils';
import { JIRA_TICKETS_BASE_URL, ISO_STRING_DATE_TIME_FORMAT, TIME_FORMAT } from 'Config';
import Alert from 'components/GeneralPurpose/Alert/Alert';
import Button from 'components/GeneralPurpose/Button/Button';
import MultiSelect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import RefreshIcon from 'components/icons/RefreshIcon/RefreshIcon';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import styles from './CreateNightReport.module.css';

const dummyJiraTickets = [
  {
    key: 'OBS-1027',
    systems: 'Simonyi',
    summary: 'park_dome script stalls and does not engage brakes',
    time_lost: 0.5,
  },
  {
    key: 'OBS-1026',
    systems: 'Simonyi',
    summary: "Rotator position \"unknown format code 'f' for object of type 'str'\"",
    time_lost: 0.5,
  },
  {
    key: 'OBS-1025',
    systems: 'Simonyi',
    summary: 'Mount stopped tracking causing MTRotator and MTPtg to fault',
    time_lost: 0.5,
  },
  {
    key: 'OBS-1024',
    systems: 'Simonyi',
    summary: 'TMA - Axes Home Status not displaying properly in Simonyi Integrated Telemetry dashboard',
    time_lost: 0.5,
  },
  {
    key: 'OBS-1023',
    systems: 'AuxTel',
    summary: 'Axes Home Status not displaying properly in AuxTel Integrated Telemetry dashboard',
    time_lost: 0.5,
  },
];

const MULTI_SELECT_OPTION_LENGTH = 50;
const LAST_REFRESHED_WARNING_THRESHOLD_MINUTES = 1;
const STATE_UPDATE_INTERVAL_MS = 5000;
const OBS_TICKETS_POLLING_INTERVAL_MS = 30000; // 30 seconds
const NARRATIVE_LOGS_POLLING_INTERVAL_MS = 30000; // 30 seconds

const STEPS = {
  NOTSAVED: 1,
  SAVED: 2,
  SENT: 3,
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

const getCurrentStatusText = (currentStep) => {
  if (currentStep === STEPS.NOTSAVED) {
    return ['Not saved', 'Today report has not been drafted yet.'];
  }
  if (currentStep === STEPS.SAVED) {
    return ['Saved', 'A report draft has been saved.'];
  }
  if (currentStep === STEPS.SENT) {
    return ['Sent', 'The report was sent.'];
  }
};

function ProgressBarSection({ currentStep, currentStatusText }) {
  return (
    <>
      <div className={styles.progressBar}>
        <div className={[styles.step, currentStep === 1 ? styles.selectedStep : ''].join(' ')}>
          <span>1</span>
        </div>
        <div className={[styles.step, currentStep === 2 ? styles.selectedStep : ''].join(' ')}>
          <span>2</span>
        </div>
        <div className={[styles.step, currentStep === 3 ? styles.selectedStep : ''].join(' ')}>
          <span>3</span>
        </div>
      </div>
      <div className={styles.currentStatusText}>
        <div>{currentStatusText[0]}</div>
        <div>{currentStatusText[1]}</div>
      </div>
    </>
  );
}

function TitleField() {
  const formattedDate = Moment().format('YYYY-MM-DD');
  return (
    <div className={styles.titleField}>
      <h1>Rubin Observatory Night Report {formattedDate}</h1>
    </div>
  );
}

function ObserversField({ isEditDisabled, userOptions, selectedUsers, setSelectedUsers }) {
  const memoizedSelectedValueDecorator = useCallback(
    (v) => (v.length > MULTI_SELECT_OPTION_LENGTH ? `...${v.slice(-MULTI_SELECT_OPTION_LENGTH)}` : v),
    [],
  );
  return (
    <>
      <div className={styles.reportObserversTitle}>
        <div>Observers</div>
      </div>
      <MultiSelect
        disable={isEditDisabled}
        options={userOptions}
        selectedValues={selectedUsers}
        onSelect={setSelectedUsers}
        onRemove={setSelectedUsers}
        placeholder="Select users that participated on the report."
        selectedValueDecorator={memoizedSelectedValueDecorator}
      />
    </>
  );
}

function SummaryField({ isEditDisabled, summary, setSummary }) {
  return (
    <>
      <div className={styles.reportSummaryTitle}>
        <div>Summary</div>
      </div>
      <TextArea readOnly={isEditDisabled} value={summary} callback={setSummary} className={styles.reportSummary} />
    </>
  );
}

function TimeLossField({ timeLoss, hint }) {
  return (
    <div className={styles.timeLossField}>
      <div>Time Loss</div>
      <Input className={styles.timeLossFieldInput} type="text" value={`${timeLoss} h`} readOnly={true} />
      {hint && (
        <div className={styles.timeLossFieldHint}>
          <InfoIcon title={hint} />
        </div>
      )}
    </div>
  );
}

function WeatherField({ report, weather, setWeather }) {
  const [timeLoss, setTimeLoss] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState();
  const narrativelogsPollingRef = useRef(null);

  const isEditDisabled = () => {
    return report.date_sent ? true : false;
  };

  const queryNarrativelogs = (date) => {
    setLoading(true);
    let fromDateTime = null;
    if (date.hour() >= 12) {
      fromDateTime = date.set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    } else {
      fromDateTime = date.clone().subtract(1, 'day').set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
    }
    const toDateTime = fromDateTime.clone().add(1, 'day');
    const formattedFromDateTime = fromDateTime.format(ISO_STRING_DATE_TIME_FORMAT);
    const formattedToDateTime = toDateTime.format(ISO_STRING_DATE_TIME_FORMAT);
    ManagerInterface.getListMessagesNarrativeLogs(formattedFromDateTime, formattedToDateTime)
      .then((logs) => {
        if (logs && logs.length > 0) {
          const accumulatedTimeLoss = logs.reduce((acc, log) => {
            if (log.time_lost && log.time_lost_type === 'weather') {
              return acc + log.time_lost;
            }
            return acc;
          }, 0);
          setTimeLoss(accumulatedTimeLoss);
        }
        setLastUpdated(Moment());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    narrativelogsPollingRef.current = setInterval(() => {
      queryNarrativelogs(Moment());
    }, NARRATIVE_LOGS_POLLING_INTERVAL_MS);
    queryNarrativelogs(Moment());

    return () => {
      clearInterval(narrativelogsPollingRef.current);
      narrativelogsPollingRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (report?.date_sent) {
      queryNarrativelogs(Moment(report.date_sent));
      clearInterval(narrativelogsPollingRef.current);
      narrativelogsPollingRef.current = null;
    }
  }, [report?.date_sent]);

  return (
    <>
      <div className={styles.reportWeatherTitle}>
        <div>
          <div>Weather Conditions</div>
          <div>(last updated: {lastUpdated?.format(TIME_FORMAT)} local)</div>
          <Button
            title="Refresh weather time loss"
            onClick={() => {
              queryNarrativelogs(Moment());
            }}
            disabled={isEditDisabled() || loading}
          >
            <RefreshIcon title="Refresh weather time loss" className={styles.refreshIcon} />
          </Button>
        </div>
        <TimeLossField
          timeLoss={timeLoss}
          hint="Time loss calculated in base to the weather conditions reported in the narrativelog."
        />
      </div>
      <TextArea readOnly={isEditDisabled()} value={weather} callback={setWeather} className={styles.reportWeather} />
    </>
  );
}

function AuxTelStatusField({ isEditDisabled, auxtelStatus, setAuxtelStatus }) {
  return (
    <>
      <div className={styles.reportTelescopeStatusTitle}>
        <div>AuxTel Summary</div>
      </div>
      <TextArea
        readOnly={isEditDisabled}
        value={auxtelStatus}
        callback={setAuxtelStatus}
        className={styles.reportTelescopeStatus}
      />
    </>
  );
}

function SimonyiStatusField({ isEditDisabled, simonyiStatus, setSimonyiStatus }) {
  return (
    <>
      <div className={styles.reportTelescopeStatusTitle}>
        <div>Simonyi Summary</div>
      </div>
      <TextArea
        readOnly={isEditDisabled}
        value={simonyiStatus}
        callback={setSimonyiStatus}
        className={styles.reportTelescopeStatus}
      />
    </>
  );
}

function ConfluenceURLField({ isEditDisabled, confluenceURL, setConfluenceURL }) {
  return (
    <div className={styles.inputField}>
      <div>Night Plan URL</div>
      <Input disabled={isEditDisabled} value={confluenceURL} onChange={(e) => setConfluenceURL(e.target.value)} />
    </div>
  );
}

function AlertsSection({ refreshWarningActive, changesNotSaved }) {
  return (
    <div className={styles.alerts}>
      {refreshWarningActive && (
        <Alert type="warning">
          The page has not been refreshed in the last {parseInt(LAST_REFRESHED_WARNING_THRESHOLD_MINUTES / 60, 10)}{' '}
          hours. Please{' '}
          <a
            href="#"
            onClick={() => {
              location.reload();
            }}
          >
            refresh
          </a>{' '}
          the page to get the latest data and don't forget to backup your changes if needed.
        </Alert>
      )}
      {changesNotSaved && <Alert type="error">Changes on the current draft have not been saved yet.</Alert>}
    </div>
  );
}

function ObservatoryForm({ report, setReport }) {
  const [currentStep, setCurrentStep] = useState(STEPS.NOTSAVED);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [summary, setSummary] = useState('');
  const [weather, setWeather] = useState('');
  const [simonyiStatus, setSimonyiStatus] = useState('');
  const [auxtelStatus, setAuxtelStatus] = useState('');
  const [confluenceURL, setConfluenceURL] = useState('');
  const [reportID, setReportID] = useState();
  const [changesNotSaved, setChangesNotSaved] = useState(false);
  const [loading, setLoading] = useState({
    save: false,
    send: false,
  });
  const [lastRefreshed, setLastRefreshed] = useState(Moment());

  useEffect(() => {
    // Query users
    ManagerInterface.getUsers().then((users) => {
      setUserOptions(users.map((u) => `${u.first_name} ${u.last_name}`));
    });

    // Query current night report
    ManagerInterface.getCurrentNightReport().then((reports) => {
      if (reports.length > 0) {
        const report = reports[0];
        setReport(report);

        if (report.date_sent) {
          setCurrentStep(STEPS.SENT);
        } else {
          setCurrentStep(STEPS.SAVED);
        }
        setReportID(report.id);
        setSelectedUsers(report.observers_crew);
        setSummary(report.summary);
        setWeather(report.weather);
        setSimonyiStatus(report.maintel_summary);
        setAuxtelStatus(report.auxtel_summary);
        setConfluenceURL(report.confluence_url);
      }
    });

    // Set interval to trigger renders
    const interval = setInterval(() => {
      setLastRefreshed(Moment());
    }, STATE_UPDATE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSent = (event) => {
    event.preventDefault();
    if (currentStep === STEPS.SAVED) {
      setLoading({ ...loading, send: true });
      ManagerInterface.sendCurrentNightReport(reportID).then((resp) => {
        if (resp) {
          setCurrentStep(STEPS.SENT);
        }
        setLoading({ ...loading, send: false });
      });
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (currentStep === STEPS.NOTSAVED) {
      setLoading({ ...loading, save: true });
      ManagerInterface.saveCurrentNightReport(
        summary,
        weather,
        simonyiStatus,
        auxtelStatus,
        confluenceURL,
        selectedUsers,
      ).then((resp) => {
        if (resp) {
          setReportID(resp.id);
          setCurrentStep(STEPS.SAVED);
          setChangesNotSaved(false);
        }
        setLoading({ ...loading, save: false });
      });
    } else {
      setLoading({ ...loading, save: true });
      ManagerInterface.updateCurrentNightReport(
        reportID,
        summary,
        weather,
        simonyiStatus,
        auxtelStatus,
        confluenceURL,
        selectedUsers,
      ).then((resp) => {
        if (resp) {
          setReportID(resp.id);
          setChangesNotSaved(false);
        }
        setLoading({ ...loading, save: false });
      });
    }
  };

  const isAbleToSave = () => {
    return (currentStep === STEPS.NOTSAVED || currentStep === STEPS.SAVED) && !(loading.save || loading.send);
  };

  const isAbleToSend = () => {
    return currentStep === STEPS.SAVED && !changesNotSaved && !loading.send && selectedUsers.length > 0;
  };

  const isEditDisabled = () => {
    return currentStep === STEPS.SENT;
  };

  const handleFieldChange = (setState) => {
    return (newValue) => {
      setState(newValue);
      setChangesNotSaved(true);
    };
  };

  const handleConfluenceURLChange = handleFieldChange(setConfluenceURL);
  const handleSelectedUsersChange = handleFieldChange(setSelectedUsers);
  const handleSummaryChange = handleFieldChange(setSummary);
  const handleWeatherChange = handleFieldChange(setWeather);
  const handleSimonyiStatusChange = handleFieldChange(setSimonyiStatus);
  const handleAuxtelStatusChange = handleFieldChange(setAuxtelStatus);

  const handleSelectedUsersChangeCallback = useCallback(handleSelectedUsersChange, []);

  const refreshWarningActive = Moment().diff(lastRefreshed, 'minutes') > LAST_REFRESHED_WARNING_THRESHOLD_MINUTES;

  return (
    <form className={styles.formContainer}>
      <ProgressBarSection currentStep={currentStep} currentStatusText={getCurrentStatusText(currentStep)} />

      <TitleField />

      <ConfluenceURLField confluenceURL={confluenceURL} setConfluenceURL={handleConfluenceURLChange} />

      <ObserversField
        isEditDisabled={isEditDisabled()}
        userOptions={userOptions}
        selectedUsers={selectedUsers}
        setSelectedUsers={handleSelectedUsersChangeCallback}
      />

      <SummaryField isEditDisabled={isEditDisabled()} summary={summary} setSummary={handleSummaryChange} />

      <WeatherField report={report} weather={weather} setWeather={handleWeatherChange} />

      <SimonyiStatusField
        isEditDisabled={isEditDisabled()}
        simonyiStatus={simonyiStatus}
        setSimonyiStatus={handleSimonyiStatusChange}
      />

      <AuxTelStatusField
        isEditDisabled={isEditDisabled()}
        auxtelStatus={auxtelStatus}
        setAuxtelStatus={handleAuxtelStatusChange}
      />

      <ObserversField
        isEditDisabled={isEditDisabled()}
        userOptions={userOptions}
        selectedUsers={selectedUsers}
        setSelectedUsers={handleSelectedUsersChange}
      />

      <AlertsSection refreshWarningActive={refreshWarningActive} changesNotSaved={changesNotSaved} />

      <div className={styles.buttons}>
        <Button onClick={handleSave} disabled={!isAbleToSave()}>
          {loading.save ? 'Saving...' : 'Save'}
        </Button>
        <Button onClick={handleSent} disabled={!isAbleToSend()}>
          {loading.send ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </form>
  );
}

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
      const efdInstance = 'base_efd';
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
  const simonyiPowerSupplySystemState = observatoryState?.simonyiMainAxesPowerSupplySystemState
    ? MT_PS_STATUS_MAP[observatoryState?.simonyiMainAxesPowerSupplySystemState]
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

function JiraOBSTicketsTable({ report }) {
  const [tickets, setObsTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState();
  const obsTicketsPollingRef = useRef(null);

  const isEditDisabled = () => {
    return report.date_sent ? true : false;
  };

  const queryTickets = (date) => {
    setLoading(true);
    const currentObsDay = getObsDayFromDate(date);
    ManagerInterface.getJiraOBSTickets(currentObsDay)
      .then((tickets) => {
        if (tickets) {
          setObsTickets(dummyJiraTickets);
          setLastUpdated(Moment());
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    obsTicketsPollingRef.current = setInterval(() => {
      queryTickets(Moment());
    }, OBS_TICKETS_POLLING_INTERVAL_MS);
    queryTickets(Moment());

    return () => {
      clearInterval(obsTicketsPollingRef.current);
      obsTicketsPollingRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (report?.date_sent) {
      queryTickets(Moment(report.date_sent));
      clearInterval(obsTicketsPollingRef.current);
      obsTicketsPollingRef.current = null;
    }
  }, [report?.date_sent]);

  const calculatedTimeLoss = tickets.reduce((acc, ticket) => {
    if (ticket.time_lost) {
      return acc + ticket.time_lost;
    }
    return acc;
  }, 0);

  const tableHeaders = [
    {
      field: 'key',
      title: 'Ticket ID',
      render: (value) => (
        <a href={`${JIRA_TICKETS_BASE_URL}/${value}`} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      ),
    },
    {
      field: 'systems',
      title: 'Systems',
    },
    {
      field: 'summary',
      title: 'Summary',
      render: (value) => <span title={value}>{value}</span>,
    },
    {
      field: 'time_lost',
      title: 'Time Loss [hour]',
    },
  ];

  return (
    <div className={styles.obsTicketsContainer}>
      <div className={styles.reportObsTicketsTitle}>
        <div>
          <div>Faults</div>
          <div>(last updated: {lastUpdated?.format(TIME_FORMAT)} local)</div>
          <Button
            title="Refresh tickets"
            onClick={() => {
              queryTickets(Moment());
            }}
            disabled={isEditDisabled() || loading}
          >
            <RefreshIcon className={styles.refreshIcon} />
          </Button>
        </div>
        <TimeLossField timeLoss={calculatedTimeLoss} />
      </div>
      <div className={styles.obsTicketsTableWrapper}>
        {tickets && tickets.length > 0 ? (
          <SimpleTable headers={tableHeaders} data={tickets} />
        ) : (
          <div>No tickets found.</div>
        )}
      </div>
    </div>
  );
}

function CSCStates({ report, cscs: cscsProp }) {
  const [cscs, setCscs] = useState(cscsProp);

  useEffect(() => {
    if (!report?.date_sent) {
      setCscs(cscsProp);
    }
  }, [cscsProp, report?.date_sent]);

  useEffect(() => {
    if (report?.date_sent) {
      const timeCutdate = Moment(report.date_sent).format(ISO_STRING_DATE_TIME_FORMAT);
      const cscsPayload = {};
      Object.keys(cscs).forEach((cscName) => {
        const [csc, index] = cscName.split(':');
        cscsPayload[csc] = {
          [index]: {
            logevent_summaryState: ['summaryState'],
          },
        };
      });
      const efdInstance = 'base_efd';
      ManagerInterface.getEFDMostRecentTimeseries(cscsPayload, 1, timeCutdate, efdInstance).then((efdResponse) => {
        if (efdResponse) {
          const newCscs = {};
          Object.keys(efdResponse).forEach((topic) => {
            const topicTokens = topic.split('-');
            const cscName = topicTokens[0] + ':' + topicTokens[1];
            const cscData = efdResponse[topic];
            newCscs[cscName] = cscData.summaryState?.[0]?.value ?? 0;
          });
          setCscs(newCscs);
        }
      });
    }
  }, [report?.date_sent]);

  return (
    <div className={styles.cscStatesContainer}>
      <div className={styles.cscStatesTitle}>
        <div>CSCs States</div>
      </div>
      <div className={styles.cscStates}>
        {Object.keys(cscs).map((cscNameIndex) => {
          const cscState = cscs[cscNameIndex];
          const stateObject = CSCDetail.states[cscState ?? 0];
          return (
            <div key={cscNameIndex} className={styles.cscState}>
              <div className={styles.cscName}>{cscNameIndex}</div>
              <div title={stateObject.name} className={stateObject.class}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ObservatoryData({ report, observatoryState, cscStates }) {
  return (
    <div className={styles.observatoryDataContainer}>
      <ConfluenceURLField />
      <TelescopesStates report={report} observatoryState={observatoryState} />
      <JiraOBSTicketsTable report={report} />
      <CSCStates report={report} cscs={cscStates} />
    </div>
  );
}

function NightReport({ observatoryState, cscStates, subscribeToStreams, unsubscribeToStreams }) {
  const [report, setReport] = useState({});

  useEffect(() => {
    subscribeToStreams();
    return () => {
      unsubscribeToStreams();
    };
  }, []);

  return (
    <div className={styles.container}>
      <ObservatoryForm report={report} setReport={setReport} />
      <ObservatoryData report={report} observatoryState={observatoryState} cscStates={cscStates} />
    </div>
  );
}

NightReport.propTypes = {
  /** Object containing the current state of the observatory */
  observatoryState: PropTypes.object.isRequired,
  /** Object containing the current states of the CSCS */
  cscStates: PropTypes.object.isRequired,
  /** Function to subscribe to streams */
  subscribeToStreams: PropTypes.func.isRequired,
  /** Function to unsubscribe to streams */
  unsubscribeToStreams: PropTypes.func.isRequired,
};

export default NightReport;
