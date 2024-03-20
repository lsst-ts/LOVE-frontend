import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface from 'Utils';
import Button from 'components/GeneralPurpose/Button/Button';
import MultiSelect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import styles from './CreateNightReport.module.css';

const MULTI_SELECT_OPTION_LENGHT = 50;

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

function ProgressBarSection({ currentStep, currentStatusText, changesNotSaved }) {
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
      {changesNotSaved && (
        <div className={styles.changesNotSaved}>Changes on the current draft have not been saved</div>
      )}
    </>
  );
}

function ObserversField({ isEditDisabled, observersFieldRef, userOptions, selectedUsers, setSelectedUsers }) {
  return (
    <>
      <div>Observers</div>
      <MultiSelect
        disable={isEditDisabled}
        innerRef={observersFieldRef}
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
      <div>Confluence URL</div>
      <Input disabled={isEditDisabled} value={confluenceURL} onChange={(e) => setConfluenceURL(e.target.value)} />
    </div>
  );
}

function AuxTelForm() {
  const observersFieldRef = useRef();
  const [currentStep, setCurrentStep] = useState(STEPS.NOTSAVED);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [summary, setSummary] = useState('');
  const [telescopeStatus, setTelescopeStatus] = useState('');
  const [confluenceURL, setConfluenceURL] = useState('');
  const [reportID, setReportID] = useState();
  const [changesNotSaved, setChangesNotSaved] = useState(false);

  useEffect(() => {
    ManagerInterface.getUsers().then((users) => {
      setUserOptions(users.map((u) => `${u.first_name} ${u.last_name}`));
    });

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
  }, []);

  const handleSent = (event) => {
    event.preventDefault();
    if (currentStep === STEPS.SAVED) {
      ManagerInterface.sendCurrentNightReport(reportID).then((resp) => {
        if (resp) {
          setCurrentStep(STEPS.SENT);
        }
      });
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (currentStep === STEPS.NOTSAVED) {
      ManagerInterface.saveCurrentNightReport('AuxTel', summary, telescopeStatus, confluenceURL, selectedUsers).then(
        (resp) => {
          if (resp) {
            setCurrentStep(STEPS.SAVED);
            setChangesNotSaved(false);
          }
        },
      );
    } else {
      ManagerInterface.updateCurrentNightReport(reportID, summary, telescopeStatus, confluenceURL, selectedUsers).then(
        (resp) => {
          if (resp) {
            setChangesNotSaved(false);
          }
        },
      );
    }
  };

  const isAbleToSave = () => {
    return currentStep === STEPS.NOTSAVED || currentStep === STEPS.SAVED;
  };

  const isAbleToSend = () => {
    return currentStep === STEPS.SAVED && !changesNotSaved;
  };

  const isEditDisabled = () => {
    return currentStep === STEPS.SENT;
  };

  const handleSelectedUsersChange = (newSelectedUsers) => {
    setSelectedUsers(newSelectedUsers);
    setChangesNotSaved(true);
  };

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

  return (
    <form className={styles.form}>
      <ProgressBarSection
        currentStep={currentStep}
        currentStatusText={getCurrentStatusText(currentStep)}
        changesNotSaved={changesNotSaved}
      />

      <ObserversField
        isEditDisabled={isEditDisabled()}
        observersFieldRef={observersFieldRef}
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

      <div className={styles.buttons}>
        <Button onClick={handleSave} disabled={!isAbleToSave()}>
          Save
        </Button>
        <Button onClick={handleSent} disabled={!isAbleToSend()}>
          Send
        </Button>
      </div>
    </form>
  );
}

function SimonyiForm() {
  const observersFieldRef = useRef();
  const [currentStep, setCurrentStep] = useState(STEPS.NOTSAVED);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [summary, setSummary] = useState('');
  const [telescopeStatus, setTelescopeStatus] = useState('');
  const [confluenceURL, setConfluenceURL] = useState('');
  const [reportID, setReportID] = useState();
  const [changesNotSaved, setChangesNotSaved] = useState(false);

  useEffect(() => {
    ManagerInterface.getUsers().then((users) => {
      setUserOptions(users.map((u) => `${u.first_name} ${u.last_name}`));
    });

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
  }, []);

  const handleSent = (event) => {
    event.preventDefault();
    if (currentStep === STEPS.SAVED) {
      ManagerInterface.sendCurrentNightReport(reportID).then((resp) => {
        if (resp) {
          setCurrentStep(STEPS.SENT);
        }
      });
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (currentStep === STEPS.NOTSAVED) {
      ManagerInterface.saveCurrentNightReport('Simonyi', summary, telescopeStatus, confluenceURL, selectedUsers).then(
        (resp) => {
          if (resp) {
            setCurrentStep(STEPS.SAVED);
            setChangesNotSaved(false);
          }
        },
      );
    } else {
      ManagerInterface.updateCurrentNightReport(reportID, summary, telescopeStatus, confluenceURL, selectedUsers).then(
        (resp) => {
          if (resp) {
            setChangesNotSaved(false);
          }
        },
      );
    }
  };

  const isAbleToSave = () => {
    return currentStep === STEPS.NOTSAVED || currentStep === STEPS.SAVED;
  };

  const isAbleToSend = () => {
    return currentStep === STEPS.SAVED && !changesNotSaved;
  };

  const isEditDisabled = () => {
    return currentStep === STEPS.SENT;
  };

  const handleSelectedUsersChange = (newSelectedUsers) => {
    setSelectedUsers(newSelectedUsers);
    setChangesNotSaved(true);
  };

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

  return (
    <form className={styles.form}>
      <ProgressBarSection
        currentStep={currentStep}
        currentStatusText={getCurrentStatusText(currentStep)}
        changesNotSaved={changesNotSaved}
      />

      <ObserversField
        isEditDisabled={isEditDisabled()}
        observersFieldRef={observersFieldRef}
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

      <div className={styles.buttons}>
        <Button onClick={handleSave} disabled={!isAbleToSave()}>
          Save
        </Button>
        <Button onClick={handleSent} disabled={!isAbleToSend()}>
          Send
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
        {selectedTab == 'auxtel' && <AuxTelForm />}
        {selectedTab == 'simonyi' && <SimonyiForm />}
      </div>
    </div>
  );
}

NightReport.propTypes = {};

export default NightReport;
