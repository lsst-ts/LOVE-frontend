import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface from 'Utils';
import Button from 'components/GeneralPurpose/Button/Button';
import MultiSelect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import styles from './CreateNightReport.module.css';

function AuxTelForm() {
  const observersFieldRef = useRef();
  const [currentStep, setCurrentStep] = useState(1);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [summary, setSummary] = useState('');
  const [telescopeStatus, setTelescopeStatus] = useState('');
  const [confluenceURL, setConfluenceURL] = useState('');

  useEffect(() => {
    // ManagerInterface.getUsers().then((users) => {
    //   setUserOptions(users.map((u) => u.username));
    // });
    setUserOptions(['user1', 'user2', 'user3', 'user4', 'user5']);
  }, []);

  const handleSent = (event) => {
    event.preventDefault();
  };

  const handleSave = (event) => {
    event.preventDefault();
  };

  const getCurrentStatusText = () => {
    if (currentStep === 1) {
      return ['Not saved', 'The report has not been saved yet.'];
    }
    if (currentStep === 2) {
      return ['Saved', 'The report has been saved.'];
    }
    if (currentStep === 3) {
      return ['Sent', 'The report has been sent.'];
    }
  };

  const currentStatusText = getCurrentStatusText();

  const isAbleToSave = () => {
    return currentStep === 1 || currentStep === 2;
  };

  const isAbleToSend = () => {
    return currentStep === 2;
  };

  return (
    <form className={styles.form}>
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
      <div>Observers</div>
      <MultiSelect
        innerRef={observersFieldRef}
        options={userOptions}
        selectedValues={selectedUsers}
        onSelect={setSelectedUsers}
        onRemove={setSelectedUsers}
        placeholder="Select users that participated on the report."
        selectedValueDecorator={(v) => (v.length > 10 ? `...${v.slice(-10)}` : v)}
      />
      <div>Summary</div>
      <TextArea value={summary} callback={setSummary} />
      <div>Telescope Status</div>
      <TextArea value={telescopeStatus} callback={setTelescopeStatus} />
      <div className={styles.inputField}>
        <div>Confluence URL</div>
        <Input />
      </div>
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
  const [currentStep, setCurrentStep] = useState(1);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [summary, setSummary] = useState('');
  const [telescopeStatus, setTelescopeStatus] = useState('');
  const [confluenceURL, setConfluenceURL] = useState('');

  useEffect(() => {
    // ManagerInterface.getUsers().then((users) => {
    //   setUserOptions(users.map((u) => u.username));
    // });
    setUserOptions(['user1', 'user2', 'user3', 'user4', 'user5']);
  }, []);

  const handleSent = (event) => {
    event.preventDefault();
  };

  const handleSave = (event) => {
    event.preventDefault();
  };

  const getCurrentStatusText = () => {
    if (currentStep === 1) {
      return ['Not saved', 'The report has not been saved yet.'];
    }
    if (currentStep === 2) {
      return ['Saved', 'The report has been saved.'];
    }
    if (currentStep === 3) {
      return ['Sent', 'The report has been sent.'];
    }
  };

  const currentStatusText = getCurrentStatusText();

  const isAbleToSave = () => {
    return currentStep === 1 || currentStep === 2;
  };

  const isAbleToSend = () => {
    return currentStep === 2;
  };

  return (
    <form className={styles.form}>
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
      <div>Observers</div>
      <MultiSelect
        innerRef={observersFieldRef}
        options={userOptions}
        selectedValues={selectedUsers}
        onSelect={setSelectedUsers}
        onRemove={setSelectedUsers}
        placeholder="Select users that participated on the report."
        selectedValueDecorator={(v) => (v.length > 10 ? `...${v.slice(-10)}` : v)}
      />
      <div>Summary</div>
      <TextArea value={summary} callback={setSummary} />
      <div>Telescope Status</div>
      <TextArea value={telescopeStatus} callback={setTelescopeStatus} />
      <div className={styles.inputField}>
        <div>Confluence URL</div>
        <Input />
      </div>
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
