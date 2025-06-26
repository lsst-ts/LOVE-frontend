import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import ManagerInterface, { fixedFloat, getObsDayStartFromDate } from 'Utils';
import {
  ISO_STRING_DATE_TIME_FORMAT,
  TIME_FORMAT,
  mtMountDeployableMotionStateMap,
  mtMountPowerStateMap,
  atPneumaticsMirrorCoverStateMap,
} from 'Config';
import Alert from 'components/GeneralPurpose/Alert/Alert';
import Button from 'components/GeneralPurpose/Button/Button';
import MultiSelect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import RefreshIcon from 'components/icons/RefreshIcon/RefreshIcon';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import TimeLossField from './TimeLossField';
import TelescopesStates from './TelescopesStates';
import JiraOBSTicketsTable from './JiraOBSTicketsTable';
import CSCStates from './CSCStates';
import styles from './CreateNightReport.module.css';

const MULTI_SELECT_OPTION_LENGTH = 50;
const LAST_REFRESHED_WARNING_THRESHOLD_MINUTES = 1;
const STATE_UPDATE_INTERVAL_MS = 5000;
const NARRATIVE_LOGS_POLLING_INTERVAL_MS = 30000; // 30 seconds

const STEPS = {
  NOTSAVED: 1,
  SAVED: 2,
  SENT: 3,
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
        className={styles.reportObservers}
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
    const fromDateTime = getObsDayStartFromDate(date);
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
          label="Weather time loss"
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
      <Input
        className={styles.urlField}
        disabled={isEditDisabled}
        value={confluenceURL}
        onChange={(e) => setConfluenceURL(e.target.value)}
      />
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

function ObservatoryForm({ report, setReport, observatoryState, cscStates }) {
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

  const updateReport = (report) => {
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
  };

  useEffect(() => {
    // Query users
    ManagerInterface.getUsers().then((users) => {
      setUserOptions(users.map((u) => `${u.first_name} ${u.last_name}`));
    });

    // Query current night report
    ManagerInterface.getCurrentNightReport().then((reports) => {
      if (reports.length > 0) {
        updateReport(reports[0]);
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

      const parsedObservatoryState = {
        simonyiAzimuth: fixedFloat(observatoryState.simonyiAzimuth, 2),
        simonyiElevation: fixedFloat(observatoryState.simonyiElevation, 2),
        simonyiDomeAzimuth: fixedFloat(observatoryState.simonyiDomeAzimuth, 2),
        simonyiRotator: fixedFloat(Math.abs(observatoryState.simonyiRotator, 2)),
        simonyiMirrorCoversState:
          mtMountDeployableMotionStateMap[observatoryState.simonyiMirrorCoversState] ?? 'UNKNOWN',
        simonyiOilSupplySystemState: mtMountPowerStateMap[observatoryState.simonyiOilSupplySystemState] ?? 'UNKNOWN',
        simonyiPowerSupplySystemState:
          mtMountPowerStateMap[observatoryState.simonyiPowerSupplySystemState] ?? 'UNKNOWN',
        simonyiLockingPinsSystemState:
          mtMountPowerStateMap[observatoryState.simonyiLockingPinsSystemState] ?? 'UNKNOWN',
        auxtelAzimuth: fixedFloat(observatoryState.auxtelAzimuth, 2),
        auxtelElevation: fixedFloat(observatoryState.auxtelElevation, 2),
        auxtelDomeAzimuth: fixedFloat(observatoryState.auxtelDomeAzimuth, 2),
        auxtelMirrorCoversState: atPneumaticsMirrorCoverStateMap[observatoryState.auxtelMirrorCoversState] ?? 'UNKNOWN',
      };
      const parsedCSCStates = Object.keys(cscStates).reduce((acc, csc) => {
        const state = cscStates[csc];
        acc[csc] = CSCDetail.states[state ?? 0].name;
        return acc;
      }, {});

      ManagerInterface.sendCurrentNightReport(reportID, parsedObservatoryState, parsedCSCStates).then((report) => {
        if (report) {
          updateReport(report);
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
      )
        .then((report) => {
          if (report) {
            updateReport(report);
            setChangesNotSaved(false);
          }
        })
        .finally(() => {
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
      )
        .then((report) => {
          if (report) {
            updateReport(report);
            setChangesNotSaved(false);
          }
        })
        .finally(() => {
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

function ObservatoryData({ report, observatoryState, cscStates }) {
  return (
    <div className={styles.observatoryDataContainer}>
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
      <ObservatoryForm
        report={report}
        setReport={setReport}
        observatoryState={observatoryState}
        cscStates={cscStates}
      />
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
