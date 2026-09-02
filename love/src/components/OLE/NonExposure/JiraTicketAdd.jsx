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

import React, { useEffect, useRef, useState, memo } from 'react';
import Moment from 'moment';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import RefreshIcon from 'components/icons/RefreshIcon/RefreshIcon';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import MultiFileUploader from 'components/GeneralPurpose/MultiFileUploader/MultiFileUploader';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import Multiselect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import Select from 'components/GeneralPurpose/Select/Select';
import { OLE_OBS_SYSTEMS, OLE_OBS_SUBSYSTEMS, OLE_OBS_SUBSYSTEMS_COMPONENTS } from 'Config';
import ManagerInterface, {
  arrangeJiraOBSSystemsSubsystemsComponentsSelection,
  arrangeNarrativelogOBSSystemsSubsystemsComponents,
  validateOBSSystemsSubsystemsComponentsIds,
} from 'Utils';
import { getIconLevel, closeCalendar } from '../OLE';
import styles from './NonExposure.module.css';

const STATIC_DATETIME_PROPS = {
  inputProps: {
    title: 'This field is optional. If it is not filled, the current time will be used.',
    placeholder: 'YYYY/MM/DD HH:mm',
    className: styles.timeOfIncidentInput,
  },
  dateFormat: 'YYYY/MM/DD',
  timeFormat: 'HH:mm A',
  closeOnSelect: false,
};

const emptyLog = {
  level: 0,
  date_begin: '',
  date_end: '',
  time_lost: 0,
  jira: true,
  jira_new: true,
  jira_issue_title: '',
  file: undefined,
  message_text: '',
  is_human: true,
  category: 'None',
  time_lost_type: 'fault',
};

function JiraTicketAdd() {
  const [log, setLog] = useState(emptyLog);
  const [symptomMessage, setSymptomMessage] = useState('');
  const [contextMessage, setContextMessage] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  const [savingLog, setSavingLog] = useState(false);
  const [tryingToSave, setTryingToSave] = useState(false);
  const [systemIds, setSystemIds] = useState([]);
  const [subsystemIds, setSubsystemIds] = useState([]);
  const [componentIds, setComponentIds] = useState([]);

  const multiselectSystemsRef = useRef(null);
  const multiselectSubsystemsRef = useRef(null);
  const multiselectComponentsRef = useRef(null);

  const dateBeginInputRef = useRef(null);
  const dateEndInputRef = useRef(null);

  const jiraIssueTitleEmpty = !log?.jira_issue_title?.trim();
  const anyMessageEmpty = !symptomMessage?.trim() || !contextMessage?.trim() || !recoveryMessage?.trim();
  const isSendAllowed = !jiraIssueTitleEmpty && !anyMessageEmpty;
  const isSubmitDisabled = tryingToSave && !isSendAllowed;

  useEffect(() => {
    if (!log.date_begin || !log.date_end) {
      return;
    }
    const start = Moment(log.date_begin);
    const end = Moment(log.date_end);
    const durationHr = end.diff(start, 'hours', true);
    setLog((prevLog) => ({
      ...prevLog,
      time_lost: durationHr.toFixed(2),
    }));
  }, [log.date_begin, log.date_end]);

  const clearForm = () => {
    setLog(emptyLog);
    setSubsystemIds([]);
    setComponentIds([]);
    setTryingToSave(false);
  };

  const clearSystemsInput = () => {
    setSystemIds([]);
    setSubsystemIds([]);
    setComponentIds([]);
    multiselectSystemsRef.current?.resetSelectedValues();
  };

  const clearSubsystemsInput = () => {
    setSubsystemIds([]);
    setComponentIds([]);
    multiselectSubsystemsRef.current?.resetSelectedValues();
  };

  const clearComponentsInput = () => {
    setComponentIds([]);
    multiselectComponentsRef.current?.resetSelectedValues();
  };

  const updateDateBeginToNow = () => {
    setLog((prevLog) => ({ ...prevLog, date_begin: Moment() }));
    closeCalendar(dateBeginInputRef?.current);
  };

  const updateDateEndToNow = () => {
    setLog((prevLog) => ({ ...prevLog, date_end: Moment() }));
    closeCalendar(dateEndInputRef?.current);
  };

  const createNarrativeLog = () => {
    setTryingToSave(true);
    if (!isSendAllowed) return;

    const payload = { ...log };

    const nowMoment = Moment();
    payload.request_type = 'narrative';

    const beginDate = payload.date_begin ? Moment(payload.date_begin) : nowMoment;
    const endDate = payload.date_end ? Moment(payload.date_end) : nowMoment;

    // We remove the 'Z' at the end of the ISO string because the backend
    // expects the date in UTC but without the 'Z' suffix.
    payload.date_begin = beginDate.toISOString().slice(0, -1);
    payload.date_end = endDate.toISOString().slice(0, -1);

    // We create the log text from the symptom, context, and recovery messages.
    payload.message_text = makeTemplateMessage();

    // We arrange the OBS systems, subsystems, and components selection for the Jira ticket payload.
    payload.jira_obs_selection = arrangeJiraOBSSystemsSubsystemsComponentsSelection(
      systemIds,
      subsystemIds,
      componentIds,
    );

    // We arrange the OBS systems, subsystems, and components selection for the narrative log payload.
    payload.components_json = arrangeNarrativelogOBSSystemsSubsystemsComponents(systemIds, subsystemIds, componentIds);

    setSavingLog(true);
    ManagerInterface.createMessageNarrativeLogs(payload)
      .then((response) => {
        if (response) {
          clearForm();
        }
      })
      .finally(() => {
        setSavingLog(false);
      });
  };

  const makeTemplateMessage = () => {
    return [
      'Symptom:',
      (symptomMessage ?? 'N/A') + '\n',
      'Context/additional info:',
      (contextMessage ?? 'N/A') + '\n',
      'How did you recover the fault?:',
      (recoveryMessage ?? 'N/A') + '\n',
    ].join('\n');
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    createNarrativeLog();
  };

  const handleTimeOfIncident = (date, type) => {
    if (type === 'start') {
      setLog((prevLog) => ({ ...prevLog, date_begin: date }));
    } else if (type === 'end') {
      setLog((prevLog) => ({ ...prevLog, date_end: date }));
    }
  };

  // The following function is used to fix a bug with the ReactMultiselect component.
  // When setting the singleSelect prop to true, clicks on the select box are dismissed.
  // This function replaces the search box with a simple input box and removes the caret.
  // Check: https://github.com/srigar/multiselect-react-dropdown/issues/262
  const fixSingleSelectBox = (node) => {
    if (!node) return;

    const searchBox = node.getElementsByClassName('searchBox')[0];
    const caret = node.getElementsByClassName('icon_down_dir')[0];
    const newSearchBox = document.createElement('input');
    newSearchBox.setAttribute('type', 'text');
    newSearchBox.setAttribute('placeholder', 'Select zero or one system');

    if (systemIds.length === 0 && searchBox) {
      searchBox.replaceWith(newSearchBox);
    }

    if (caret) {
      caret.remove();
    }
  };

  const renderCategoryField = () => (
    <>
      <span className={styles.label}>Type of observing time</span>
      <span className={styles.value}>
        <Select
          options={['None', 'ENG', 'SCIENCE']}
          option={log?.category}
          onChange={({ value }) => {
            setLog((prevLog) => ({ ...prevLog, category: value }));
          }}
          className={styles.select}
        />
      </span>
    </>
  );

  const renderUrgentField = () => (
    <>
      <span className={styles.label}>Urgent?</span>
      <span className={[styles.value].join(' ')}>
        <div style={{ display: 'inline-block', marginRight: '0.5em' }}>
          <Toggle
            labels={['No', 'Yes']}
            toggled={log.level >= 100}
            onToggle={(isToggled) => setLog((prevLog) => ({ ...prevLog, level: isToggled ? 100 : 0 }))}
          />
        </div>
        <span className={styles.levelIcon}>{getIconLevel(log.level)}</span>
      </span>
    </>
  );

  const renderComponentsFields = () => {
    const selectedSystems = Object.keys(OLE_OBS_SYSTEMS).filter((s) => systemIds?.includes(OLE_OBS_SYSTEMS[s].id));
    const selectedSubsystems = Object.keys(OLE_OBS_SUBSYSTEMS).filter((ss) =>
      subsystemIds?.includes(OLE_OBS_SUBSYSTEMS[ss].id),
    );
    const selectedComponents = Object.keys(OLE_OBS_SUBSYSTEMS_COMPONENTS).filter((c) =>
      componentIds?.includes(OLE_OBS_SUBSYSTEMS_COMPONENTS[c].id),
    );

    const systemOptions = Object.keys(OLE_OBS_SYSTEMS).sort();

    const availableSubsystemsIds =
      selectedSystems
        ?.map((s) => {
          return OLE_OBS_SYSTEMS[s].children;
        })
        .flat() ?? [];
    const subsystemOptions = Object.keys(OLE_OBS_SUBSYSTEMS)
      .filter((ss) => {
        return availableSubsystemsIds.includes(OLE_OBS_SUBSYSTEMS[ss].id);
      })
      .sort();

    const availableComponentsIds =
      selectedSubsystems
        ?.map((ss) => {
          return OLE_OBS_SUBSYSTEMS[ss].children;
        })
        .flat() ?? [];
    const componentOptions = Object.keys(OLE_OBS_SUBSYSTEMS_COMPONENTS)
      .filter((c) => {
        return availableComponentsIds.includes(OLE_OBS_SUBSYSTEMS_COMPONENTS[c].id);
      })
      .sort();

    const handleSystemIdsChange = (selectedOptions) => {
      const selectedSystemsIds = selectedOptions.map((s) => OLE_OBS_SYSTEMS[s].id);
      const validIds = validateOBSSystemsSubsystemsComponentsIds(selectedSystemsIds, subsystemIds, componentIds);
      setSystemIds(validIds.systemsIds);
      setSubsystemIds(validIds.subsystemsIds);
      setComponentIds(validIds.componentsIds);
    };

    const handleSubsystemIdsChange = (selectedOptions) => {
      const selectedSubsystemsIds = selectedOptions.map((ss) => OLE_OBS_SUBSYSTEMS[ss].id);
      const validIds = validateOBSSystemsSubsystemsComponentsIds(systemIds, selectedSubsystemsIds, componentIds);
      setSystemIds(validIds.systemsIds);
      setSubsystemIds(validIds.subsystemsIds);
      setComponentIds(validIds.componentsIds);
    };

    const handleComponentIdsChange = (selectedOptions) => {
      const selectedComponentsIds = selectedOptions.map((c) => OLE_OBS_SUBSYSTEMS_COMPONENTS[c].id);
      const validIds = validateOBSSystemsSubsystemsComponentsIds(systemIds, subsystemIds, selectedComponentsIds);
      setSystemIds(validIds.systemsIds);
      setSubsystemIds(validIds.subsystemsIds);
      setComponentIds(validIds.componentsIds);
    };

    return (
      <>
        <span className={styles.label}>System</span>
        <span className={styles.value}>
          <div className={styles.inputGroup}>
            <Multiselect
              innerRef={(node) => {
                if (!node) return;
                multiselectSystemsRef.current = node;
                fixSingleSelectBox(node.searchWrapper.current);
              }}
              className={styles.select}
              options={systemOptions}
              selectedValues={selectedSystems}
              onSelect={handleSystemIdsChange}
              onRemove={handleSystemIdsChange}
              singleSelect={true}
            />
            <Button onClick={() => clearSystemsInput()}>Clear</Button>
          </div>
        </span>
        <span className={styles.label}>Subsystems</span>
        <span className={styles.value}>
          <div className={styles.inputGroup}>
            <Multiselect
              innerRef={multiselectSubsystemsRef}
              className={styles.select}
              options={subsystemOptions}
              selectedValues={selectedSubsystems}
              onSelect={handleSubsystemIdsChange}
              onRemove={handleSubsystemIdsChange}
              placeholder="Select zero or more subsystems"
              selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
            />
            <Button onClick={() => clearSubsystemsInput()}>Clear</Button>
          </div>
        </span>
        <span className={styles.label}>Components</span>
        <span className={styles.value}>
          <div className={styles.inputGroup}>
            <Multiselect
              innerRef={multiselectComponentsRef}
              className={styles.select}
              options={componentOptions}
              selectedValues={selectedComponents}
              onSelect={handleComponentIdsChange}
              onRemove={handleComponentIdsChange}
              placeholder="Select zero or more components"
              selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
            />
            <Button onClick={() => clearComponentsInput()}>Clear</Button>
          </div>
        </span>
      </>
    );
  };

  const renderTimeOfIncidentFields = () => {
    const { date_begin, date_end, time_lost, time_lost_type } = log ?? {};

    const renderDateTimeInput = (ref) => {
      return (props, openCalendar, closeCalendar) => {
        function clearDate() {
          props.onChange({ target: { value: '' } });
        }
        return (
          <div ref={ref} className={styles.timeOfIncidentInputContainer}>
            <input {...props} readOnly />
            <Button className={styles.clearDateIcon} size="small" title="Clear date" onClick={clearDate}>
              <CloseIcon title="Clear date" />
            </Button>
            <button className={styles.hiddenButtons} type="button" onClick={openCalendar} />
            <button className={styles.hiddenButtons} type="button" onClick={closeCalendar} />
          </div>
        );
      };
    };

    const renderDatePickerView = (dateBegin = true) => {
      return (mode, renderDefault) => {
        const updateToNow = () => {
          if (dateBegin) {
            updateDateBeginToNow();
          } else {
            updateDateEndToNow();
          }
        };

        if (mode === 'time') return renderDefault();

        return (
          <div className="wrapper">
            {renderDefault()}
            <div className={styles.rdtControls}>
              <Button title="Set date to now" className={styles.rdtControlsButton} onClick={updateToNow}>
                <RefreshIcon />
                Now
              </Button>
            </div>
          </div>
        );
      };
    };

    return (
      <>
        <span className={styles.label}>
          Time of Incident (UTC)
          <div className={styles.infoIcon}>
            <InfoIcon title="This fields are optionals. If not filled, the current time will be used." />
          </div>
        </span>
        <span className={styles.value}>
          <div className={styles.incidentTimeTypeContainer}>
            <DateTimeRange
              label="From"
              className={styles.dateTimeRangeStyle}
              startDate={date_begin}
              endDate={date_end}
              onChange={(date, type) => handleTimeOfIncident(date, type)}
              startDateProps={{
                renderInput: renderDateTimeInput(dateBeginInputRef),
                renderView: renderDatePickerView(true),
                ...STATIC_DATETIME_PROPS,
              }}
              endDateProps={{
                renderInput: renderDateTimeInput(dateEndInputRef),
                renderView: renderDatePickerView(false),
                ...STATIC_DATETIME_PROPS,
              }}
            />
          </div>
        </span>
        <span className={styles.label}>Obs. Time Loss Type</span>
        <span className={styles.value}>
          <Toggle
            labels={['Fault', 'Weather']}
            toggled={time_lost_type === 'weather'}
            onToggle={(event) => setLog((prevLog) => ({ ...prevLog, time_lost_type: event ? 'weather' : 'fault' }))}
          />
        </span>
        <span className={styles.label}>Obs. Time Loss (hours)</span>
        <span className={styles.value}>
          <Input
            type="number"
            min={0.0}
            step={0.01}
            value={time_lost}
            className={styles.input}
            onChange={(event) => setLog((prevLog) => ({ ...prevLog, time_lost: event.target.value }))}
          />
        </span>
      </>
    );
  };

  const renderSymptomField = () => {
    const inputError = tryingToSave && !symptomMessage.trim();
    return (
      <div className={styles.messageGroup}>
        <div className={styles.title}>Symptom</div>
        <textarea
          className={[styles.textarea, inputError ? styles.inputError : ''].join(' ')}
          value={symptomMessage}
          onChange={(event) => setSymptomMessage(event.target.value)}
        />
      </div>
    );
  };

  const renderContextField = () => {
    const inputError = tryingToSave && !contextMessage.trim();
    return (
      <div className={styles.messageGroup}>
        <div className={styles.title}>Context/additional info</div>
        <textarea
          className={[styles.textarea, inputError ? styles.inputError : ''].join(' ')}
          value={contextMessage}
          onChange={(event) => setContextMessage(event.target.value)}
        />
      </div>
    );
  };

  const renderRecoveryField = () => {
    const inputError = tryingToSave && !recoveryMessage.trim();
    return (
      <div className={styles.messageGroup}>
        <div className={styles.title}>How did you recover the fault?</div>
        <textarea
          className={[styles.textarea, inputError ? styles.inputError : ''].join(' ')}
          value={recoveryMessage}
          onChange={(event) => setRecoveryMessage(event.target.value)}
        />
      </div>
    );
  };

  const renderFilesField = () => (
    <div className={styles.toAttachFiles}>
      <MultiFileUploader
        values={log?.file}
        handleFiles={(files) => setLog((prevLog) => ({ ...prevLog, file: files }))}
        handleDelete={(file) => {
          const files = { ...log?.file };
          delete files[file];
          setLog((prevLog) => ({ ...prevLog, file: files }));
        }}
        handleDeleteAll={() => setLog((prevLog) => ({ ...prevLog, file: undefined }))}
      />
    </div>
  );

  const renderJiraFields = () => {
    const inputError = tryingToSave && jiraIssueTitleEmpty;
    return (
      <div className={styles.jira}>
        <Input
          value={log?.jira_issue_title}
          className={inputError ? styles.inputError : ''}
          placeholder="Jira ticket title"
          onChange={(event) => setLog((prevLog) => ({ ...prevLog, jira_issue_title: event.target.value }))}
        />
      </div>
    );
  };

  const renderSubmitButton = () => (
    <Button disabled={isSubmitDisabled} type="submit">
      {savingLog ? <SpinnerIcon className={styles.spinnerIcon} /> : <span className={styles.title}>Save</span>}
    </Button>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.detailContainer}>
        <div className={styles.header}></div>

        <div className={styles.content}>
          <div className={styles.contentLeft}>
            {renderUrgentField()}
            {renderComponentsFields()}
            {renderTimeOfIncidentFields()}
            {renderCategoryField()}
          </div>
          <div className={styles.contentRight}>
            {renderSymptomField()}
            {renderContextField()}
            {renderRecoveryField()}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            {renderJiraFields()}
            {renderFilesField()}
          </div>
          <span className={styles.footerRight}>{renderSubmitButton()}</span>
        </div>
      </div>
    </form>
  );
}

export default memo(JiraTicketAdd);
