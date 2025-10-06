import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import ManagerInterface, {
  fixedFloat,
  getObsDayFromDate,
  getObsDayStartFromDate,
  getObsDayISO,
  getEFDInstanceForHost,
  isNightReportOld,
  getCutDateFromNightReport,
} from 'Utils';
import {
  ISO_STRING_DATE_TIME_FORMAT,
  TIME_FORMAT,
  EFD_RETENTION_DAYS_PER_INSTANCE,
  mtMountDeployableMotionStateMap,
  mtMountPowerStateMap,
  mtMountElevationLockingPinMotionStateMap,
  atPneumaticsMirrorCoverStateMap,
} from 'Config';
import Alert from 'components/GeneralPurpose/Alert/Alert';
import Button from 'components/GeneralPurpose/Button/Button';
import MultiSelect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import Select from 'components/GeneralPurpose/Select/Select';
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
const LAST_REFRESHED_WARNING_THRESHOLD_MINUTES = 60;
const LAST_REFRESHED_WARNING_CHECK_INTERVAL_MS = 10000; // 1 minute
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

function TitleField({ report }) {
  const currentObsDay = parseInt(getObsDayFromDate(Moment()), 10);
  const formattedDate = getObsDayISO(report?.day_obs ?? currentObsDay);
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

function WeatherField({ report, setWeather }) {
  const [timeLoss, setTimeLoss] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState();
  const narrativelogsPollingRef = useRef(null);

  const isReportOld = isNightReportOld(report);

  const isEditDisabled = () => {
    return report?.date_sent ? true : false;
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
    if (!isReportOld) {
      narrativelogsPollingRef.current = setInterval(() => {
        queryNarrativelogs(Moment());
      }, NARRATIVE_LOGS_POLLING_INTERVAL_MS);
      queryNarrativelogs(Moment());

      return () => {
        clearInterval(narrativelogsPollingRef.current);
        narrativelogsPollingRef.current = null;
      };
    }
  }, []);

  useEffect(() => {
    if (report && isReportOld) {
      const cutDate = getCutDateFromNightReport(report);
      queryNarrativelogs(cutDate);
      if (narrativelogsPollingRef.current) {
        clearInterval(narrativelogsPollingRef.current);
        narrativelogsPollingRef.current = null;
      }
    }
  }, [report?.date_sent, report?.id]);

  return (
    <>
      <div className={styles.reportWeatherTitle}>
        <div>
          <div>Weather Conditions</div>
          {!isReportOld && <div>(last updated: {lastUpdated?.format(TIME_FORMAT)} local)</div>}
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
      <TextArea
        readOnly={isEditDisabled()}
        value={report?.weather}
        callback={setWeather}
        className={styles.reportWeather}
      />
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
  const refreshedWarningThresholdHours = parseInt(LAST_REFRESHED_WARNING_THRESHOLD_MINUTES / 60, 10);
  return (
    <div className={styles.alerts}>
      {refreshWarningActive && (
        <Alert type="warning">
          The page has not been refreshed in the last {refreshedWarningThresholdHours}{' '}
          {refreshedWarningThresholdHours > 1 ? 'hours' : 'hour'} and someone could have done changes. Please{' '}
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

function getReportStatusStep(report) {
  if (report?.date_sent) {
    return STEPS.SENT;
  }
  if (report?.date_added) {
    return STEPS.SAVED;
  }
  return STEPS.NOTSAVED;
}

function ObservatoryForm({ report, observatoryState, cscStates, handleReportUpdate, loading: propsLoading }) {
  const [userOptions, setUserOptions] = useState([]);
  const [changesNotSaved, setChangesNotSaved] = useState(false);
  const [loading, setLoading] = useState({
    save: false,
    send: false,
  });
  const [lastRefreshed, setLastRefreshed] = useState(Moment());
  const [refreshWarningActive, setRefreshWarningActive] = useState(false);

  const currentStep = getReportStatusStep(report);

  const updateReport = (report) => {
    handleReportUpdate(report);
  };

  const selectedUsers = useMemo(() => report?.observers_crew ?? [], [report]);

  useEffect(() => {
    // Query users
    ManagerInterface.getUsers().then((users) => {
      setUserOptions(users.map((u) => `${u.first_name} ${u.last_name}`));
    });

    // Set interval to trigger renders
    const interval = setInterval(() => {
      const warningActive = Moment().diff(lastRefreshed, 'minutes') > LAST_REFRESHED_WARNING_THRESHOLD_MINUTES;
      setRefreshWarningActive(warningActive);
    }, LAST_REFRESHED_WARNING_CHECK_INTERVAL_MS);

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
          mtMountElevationLockingPinMotionStateMap[observatoryState.simonyiLockingPinsSystemState] ?? 'UNKNOWN',
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

      ManagerInterface.sendCurrentNightReport(report.id, parsedObservatoryState, parsedCSCStates).then((report) => {
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
        report?.summary ?? '',
        report?.weather ?? '',
        report?.maintel_summary ?? '',
        report?.auxtel_summary ?? '',
        report?.confluence_url ?? '',
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
        report.id,
        report.summary ?? '',
        report.weather ?? '',
        report.maintel_summary ?? '',
        report.auxtel_summary ?? '',
        report.confluence_url ?? '',
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
    return currentStep === STEPS.SENT || propsLoading;
  };

  const handleFieldChange = (newValue) => {
    updateReport({ ...report, ...newValue });
    setChangesNotSaved(true);
  };

  const handleConfluenceURLChange = useCallback(
    (value) => {
      handleFieldChange({ confluence_url: value });
    },
    [report],
  );
  const handleSelectedUsersChange = useCallback(
    (value) => {
      handleFieldChange({ observers_crew: value });
    },
    [report],
  );
  const handleSummaryChange = useCallback(
    (value) => {
      handleFieldChange({ summary: value });
    },
    [report],
  );
  const handleWeatherChange = useCallback(
    (value) => {
      handleFieldChange({ weather: value });
    },
    [report],
  );
  const handleSimonyiStatusChange = useCallback(
    (value) => {
      handleFieldChange({ maintel_summary: value });
    },
    [report],
  );
  const handleAuxtelStatusChange = useCallback(
    (value) => {
      handleFieldChange({ auxtel_summary: value });
    },
    [report],
  );

  return (
    <form className={styles.formContainer}>
      <ProgressBarSection currentStep={currentStep} currentStatusText={getCurrentStatusText(currentStep)} />
      <TitleField report={report} />
      <ConfluenceURLField
        isEditDisabled={isEditDisabled()}
        confluenceURL={report?.confluence_url}
        setConfluenceURL={handleConfluenceURLChange}
      />
      <ObserversField
        isEditDisabled={isEditDisabled()}
        userOptions={userOptions}
        selectedUsers={selectedUsers}
        setSelectedUsers={handleSelectedUsersChange}
      />
      <SummaryField isEditDisabled={isEditDisabled()} summary={report?.summary} setSummary={handleSummaryChange} />
      <WeatherField report={report} setWeather={handleWeatherChange} />
      <SimonyiStatusField
        isEditDisabled={isEditDisabled()}
        simonyiStatus={report?.maintel_summary}
        setSimonyiStatus={handleSimonyiStatusChange}
      />
      <AuxTelStatusField
        isEditDisabled={isEditDisabled()}
        auxtelStatus={report?.auxtel_summary}
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

function NightReport({
  observatoryState,
  cscStates,
  subscribeToStreams,
  unsubscribeToStreams,
  allowSendingOldReports,
}) {
  const currentObsDay = parseInt(getObsDayFromDate(Moment()), 10);

  const [reports, setReports] = useState([]);
  const [selectedObsDay, setSelectedObsDay] = useState(currentObsDay);
  const [loading, setLoading] = useState(false);

  const efdInstanceRef = useRef();

  useEffect(() => {
    subscribeToStreams();

    // We define the reports limit based on the EFD instance retention days
    // as EFD data is queried when editing old reports.
    efdInstanceRef.current = getEFDInstanceForHost();
    const efdRetentionDays = efdInstanceRef.current ? EFD_RETENTION_DAYS_PER_INSTANCE[efdInstanceRef.current] : 7;
    const oldestObsDayWithEFDData = parseInt(getObsDayFromDate(Moment().subtract(efdRetentionDays, 'days')), 10);

    setLoading(true);
    ManagerInterface.getLastNightReports({
      min_day_obs: oldestObsDayWithEFDData,
      limit: efdRetentionDays,
    })
      .then((reports) => {
        const currentObsDayReport = reports.find((r) => r.day_obs === currentObsDay);
        if (!currentObsDayReport) {
          setReports([{ day_obs: currentObsDay }, ...reports]);
        } else {
          setReports(reports);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      unsubscribeToStreams();
      efdInstanceRef.current = null;
    };
  }, []);

  const handleReportUpdate = useCallback((report) => {
    if (report) {
      setReports((prevReports) => {
        return prevReports.map((r) => (r.day_obs === report.day_obs ? report : r));
      });
    }
  }, []);

  const handleObsDayChange = (value) => {
    setSelectedObsDay(parseInt(value, 10));
  };

  const reportOptions = reports.sort((a, b) => b.day_obs - a.day_obs).map(({ day_obs }) => day_obs.toString());
  const selectedReport = reports.find((r) => r.day_obs === selectedObsDay);

  return (
    <>
      {allowSendingOldReports && (
        <div>
          <Select
            className={styles.select}
            options={reportOptions}
            onChange={({ value }) => handleObsDayChange(value)}
            option={selectedObsDay.toString()}
          />
        </div>
      )}
      <div className={styles.container}>
        <ObservatoryForm
          key={'ObservatoryForm-' + selectedReport?.id}
          report={selectedReport}
          observatoryState={observatoryState}
          cscStates={cscStates}
          handleReportUpdate={handleReportUpdate}
          loading={loading}
        />
        <ObservatoryData
          key={'ObservatoryData-' + selectedReport?.id}
          report={selectedReport}
          observatoryState={observatoryState}
          cscStates={cscStates}
        />
      </div>
    </>
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
  /** Where to allow sending old reports */
  allowSendingOldReports: PropTypes.bool,
};

export default NightReport;
