import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import ManagerInterface from 'Utils';
import Alert from 'components/GeneralPurpose/Alert/Alert';
import Button from 'components/GeneralPurpose/Button/Button';
import MultiSelect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import styles from './CreateNightReport.module.css';

const MULTI_SELECT_OPTION_LENGHT = 50;
const LAST_REFRESHED_WARNING_THRESHOLD = 180;
const STATE_UPDATE_INTERVAL = 5000;

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

function ObserversField({ isEditDisabled, userOptions, selectedUsers, setSelectedUsers }) {
  return (
    <>
      <div>Observers</div>
      <MultiSelect
        disable={isEditDisabled}
        options={userOptions}
        selectedValues={selectedUsers}
        onSelect={setSelectedUsers}
        onRemove={setSelectedUsers}
        placeholder="Select users that participated on the report."
        selectedValueDecorator={(v) =>
          v.length > MULTI_SELECT_OPTION_LENGHT ? `...${v.slice(-MULTI_SELECT_OPTION_LENGHT)}` : v
        }
      />
    </>
  );
}

function SummaryField({ isEditDisabled, summary, setSummary }) {
  return (
    <>
      <div>Summary</div>
      <TextArea readOnly={isEditDisabled} value={summary} callback={setSummary} className={styles.reportSummary} />
    </>
  );
}

function TelescopeStatusField({ isEditDisabled, telescopeStatus, setTelescopeStatus }) {
  return (
    <>
      <div>Telescope Status</div>
      <TextArea
        readOnly={isEditDisabled}
        value={telescopeStatus}
        callback={setTelescopeStatus}
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
          The page has not been refreshed in the last {parseInt(LAST_REFRESHED_WARNING_THRESHOLD / 60, 10)} hours.
          Please{' '}
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

function AuxTelForm() {
  const [currentStep, setCurrentStep] = useState(STEPS.NOTSAVED);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [summary, setSummary] = useState('');
  const [telescopeStatus, setTelescopeStatus] = useState('');
  const [confluenceURL, setConfluenceURL] = useState('');
  const [reportID, setReportID] = useState();
  const [changesNotSaved, setChangesNotSaved] = useState(false);
  const [loading, setLoading] = useState({
    save: false,
    send: false,
  });
  const [lastRefreshed, setLastRefreshed] = useState(Moment());
  const [time, setTime] = useState(0);

  useEffect(() => {
    // Query users
    ManagerInterface.getUsers().then((users) => {
      setUserOptions(users.map((u) => `${u.first_name} ${u.last_name}`));
    });

    // Query current night report
    ManagerInterface.getCurrentNightReport('AuxTel').then((reports) => {
      if (reports.length > 0) {
        const report = reports[0];
        if (report.date_sent) {
          setCurrentStep(STEPS.SENT);
        } else {
          setCurrentStep(STEPS.SAVED);
        }

        setReportID(report.id);
        setSelectedUsers(report.observers_crew);
        setSummary(report.summary);
        setTelescopeStatus(report.telescope_status);
        setConfluenceURL(report.confluence_url);
      }
    });

    // Set interval to trigger renders
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, STATE_UPDATE_INTERVAL);

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
      ManagerInterface.saveCurrentNightReport('AuxTel', summary, telescopeStatus, confluenceURL, selectedUsers).then(
        (resp) => {
          if (resp) {
            setReportID(resp.id);
            setCurrentStep(STEPS.SAVED);
            setChangesNotSaved(false);
          }
          setLoading({ ...loading, save: false });
        },
      );
    } else {
      setLoading({ ...loading, save: true });
      ManagerInterface.updateCurrentNightReport(reportID, summary, telescopeStatus, confluenceURL, selectedUsers).then(
        (resp) => {
          if (resp) {
            setReportID(resp.id);
            setChangesNotSaved(false);
          }
          setLoading({ ...loading, save: false });
        },
      );
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

  const handleSelectedUsersChange = useCallback((newSelectedUsers) => {
    setSelectedUsers(newSelectedUsers);
    setChangesNotSaved(true);
  }, []);

  const handleSummaryChange = (newSummary) => {
    setSummary(newSummary);
    setChangesNotSaved(true);
  };

  const handleTelescopeStatusChange = (newTelescopeStatus) => {
    setTelescopeStatus(newTelescopeStatus);
    setChangesNotSaved(true);
  };

  const handleConfluenceURLChange = (newConfluenceURL) => {
    setConfluenceURL(newConfluenceURL);
    setChangesNotSaved(true);
  };

  const refreshWarningActive = Moment().diff(lastRefreshed, 'minutes') > LAST_REFRESHED_WARNING_THRESHOLD;

  return (
    <form className={styles.form}>
      <ProgressBarSection currentStep={currentStep} currentStatusText={getCurrentStatusText(currentStep)} />

      <ObserversField
        isEditDisabled={isEditDisabled()}
        userOptions={userOptions}
        selectedUsers={selectedUsers}
        setSelectedUsers={handleSelectedUsersChange}
      />

      <SummaryField isEditDisabled={isEditDisabled()} summary={summary} setSummary={handleSummaryChange} />

      <TelescopeStatusField
        isEditDisabled={isEditDisabled()}
        telescopeStatus={telescopeStatus}
        setTelescopeStatus={handleTelescopeStatusChange}
      />

      <ConfluenceURLField
        isEditDisabled={isEditDisabled()}
        confluenceURL={confluenceURL}
        setConfluenceURL={handleConfluenceURLChange}
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

function SimonyiForm() {
  const [currentStep, setCurrentStep] = useState(STEPS.NOTSAVED);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [summary, setSummary] = useState('');
  const [telescopeStatus, setTelescopeStatus] = useState('');
  const [confluenceURL, setConfluenceURL] = useState('');
  const [reportID, setReportID] = useState();
  const [changesNotSaved, setChangesNotSaved] = useState(false);
  const [loading, setLoading] = useState({
    save: false,
    send: false,
  });
  const [lastRefreshed, setLastRefreshed] = useState(Moment());
  const [time, setTime] = useState(0);

  useEffect(() => {
    // Query users
    ManagerInterface.getUsers().then((users) => {
      setUserOptions(users.map((u) => `${u.first_name} ${u.last_name}`));
    });

    // Query current night report
    ManagerInterface.getCurrentNightReport('Simonyi').then((reports) => {
      if (reports.length > 0) {
        const report = reports[0];
        if (report.date_sent) {
          setCurrentStep(STEPS.SENT);
        } else {
          setCurrentStep(STEPS.SAVED);
        }

        setReportID(report.id);
        setSelectedUsers(report.observers_crew);
        setSummary(report.summary);
        setTelescopeStatus(report.telescope_status);
        setConfluenceURL(report.confluence_url);
      }
    });

    // Set interval to trigger renders
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, STATE_UPDATE_INTERVAL);

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
      ManagerInterface.saveCurrentNightReport('Simonyi', summary, telescopeStatus, confluenceURL, selectedUsers).then(
        (resp) => {
          if (resp) {
            setReportID(resp.id);
            setCurrentStep(STEPS.SAVED);
            setChangesNotSaved(false);
          }
          setLoading({ ...loading, save: false });
        },
      );
    } else {
      setLoading({ ...loading, save: true });
      ManagerInterface.updateCurrentNightReport(reportID, summary, telescopeStatus, confluenceURL, selectedUsers).then(
        (resp) => {
          if (resp) {
            setReportID(resp.id);
            setChangesNotSaved(false);
          }
          setLoading({ ...loading, save: false });
        },
      );
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

  const handleSelectedUsersChange = useCallback((newSelectedUsers) => {
    setSelectedUsers(newSelectedUsers);
    setChangesNotSaved(true);
  }, []);

  const handleSummaryChange = (newSummary) => {
    setSummary(newSummary);
    setChangesNotSaved(true);
  };

  const handleTelescopeStatusChange = (newTelescopeStatus) => {
    setTelescopeStatus(newTelescopeStatus);
    setChangesNotSaved(true);
  };

  const handleConfluenceURLChange = (newConfluenceURL) => {
    setConfluenceURL(newConfluenceURL);
    setChangesNotSaved(true);
  };

  const refreshWarningActive = Moment().diff(lastRefreshed, 'minutes') > LAST_REFRESHED_WARNING_THRESHOLD;

  return (
    <form className={styles.form}>
      <ProgressBarSection
        currentStep={currentStep}
        currentStatusText={getCurrentStatusText(currentStep)}
        changesNotSaved={changesNotSaved}
      />

      <ObserversField
        isEditDisabled={isEditDisabled()}
        userOptions={userOptions}
        selectedUsers={selectedUsers}
        setSelectedUsers={handleSelectedUsersChange}
      />

      <SummaryField isEditDisabled={isEditDisabled()} summary={summary} setSummary={handleSummaryChange} />

      <TelescopeStatusField
        isEditDisabled={isEditDisabled()}
        telescopeStatus={telescopeStatus}
        setTelescopeStatus={handleTelescopeStatusChange}
      />

      <ConfluenceURLField
        isEditDisabled={isEditDisabled()}
        confluenceURL={confluenceURL}
        setConfluenceURL={handleConfluenceURLChange}
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

function NightReport(props) {
  const [selectedTab, setSelectedTab] = useState('auxtel');

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div className={selectedTab == 'auxtel' ? styles.selectedTab : ''} onClick={() => setSelectedTab('auxtel')}>
          AuxTel
        </div>
        <div className={selectedTab == 'simonyi' ? styles.selectedTab : ''} onClick={() => setSelectedTab('simonyi')}>
          Simonyi
        </div>
      </div>
      <div className={styles.content}>
        <div style={{ display: selectedTab === 'auxtel' ? 'block' : 'none' }}>
          <AuxTelForm />
        </div>
        <div style={{ display: selectedTab === 'simonyi' ? 'block' : 'none' }}>
          <SimonyiForm />
        </div>
      </div>
    </div>
  );
}

NightReport.propTypes = {};

export default NightReport;
