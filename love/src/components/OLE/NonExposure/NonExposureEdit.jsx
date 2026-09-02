/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

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

import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import RefreshIcon from 'components/icons/RefreshIcon/RefreshIcon';
import RichTextEditor from 'components/GeneralPurpose/RichTextEditor/RichTextEditor';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import MultiFileUploader from 'components/GeneralPurpose/MultiFileUploader/MultiFileUploader';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import Multiselect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import Select from 'components/GeneralPurpose/Select/Select';
import { OLE_OBS_SYSTEMS, OLE_OBS_SUBSYSTEMS, OLE_OBS_SUBSYSTEMS_COMPONENTS } from 'Config';
import ManagerInterface, {
  getFilesURLs,
  getLinkJira,
  getFilename,
  openInNewTab,
  parseTaiToUtc,
  htmlToJiraMarkdown,
  jiraMarkdownToHtml,
  arrangeJiraOBSSystemsSubsystemsComponentsSelection,
  arrangeNarrativelogOBSSystemsSubsystemsComponents,
  validateOBSSystemsSubsystemsComponentsIds,
  getOBSSystemsSubsystemsComponentsIds,
} from 'Utils';
import { getIconLevel, closeCalendar } from '../OLE';
import styles from './NonExposure.module.css';

const emptyLog = {
  id: undefined,
  level: 0,
  date_begin: '',
  date_end: '',
  components_json: undefined,
  time_lost: 0,
  jira_issue_id: '',
  file: undefined,
  urls: [],
  tags: [],
  message_text: '',
  is_human: true,
  category: 'None',
  time_lost_type: 'fault',
};

function NonExposureEdit({ log: propLog = emptyLog, isLogCreate = false, isMenu = false, back, save, view, taiToUtc }) {
  const [log, setLog] = useState(() => ({
    ...emptyLog,
    ...propLog,
    // Narrative log dates come in TAI time so we parse them
    // inmediately after receiving them
    date_begin: parseTaiToUtc(propLog?.date_begin, taiToUtc),
    date_end: parseTaiToUtc(propLog?.date_end, taiToUtc),
  }));
  const [savingLog, setSavingLog] = useState(false);
  const [tryingToSave, setTryingToSave] = useState(false);

  const componentsJSONIds = log?.components_json ? getOBSSystemsSubsystemsComponentsIds([log.components_json]) : null;
  const [systemIds, setSystemIds] = useState(() => {
    if (componentsJSONIds) {
      return componentsJSONIds.systemsIds;
    }
    return [];
  });
  const [subsystemIds, setSubsystemIds] = useState(() => {
    if (componentsJSONIds) {
      return componentsJSONIds.subsystemsIds;
    }
    return [];
  });
  const [componentIds, setComponentIds] = useState(() => {
    if (componentsJSONIds) {
      return componentsJSONIds.componentsIds;
    }
    return [];
  });

  const multiselectSystemsRef = useRef();
  const multiselectSubsystemsRef = useRef();
  const multiselectComponentsRef = useRef();
  const richTextEditorRef = useRef();
  const dateBeginInputRef = useRef();
  const dateEndInputRef = useRef();

  const messageEmpty = !log?.message_text?.trim();
  const isSendAllowed = !messageEmpty;
  const isSubmitDisabled = tryingToSave && !isSendAllowed;

  useEffect(() => {
    const { date_begin, date_end } = log;
    if (!date_begin || !date_end) {
      return;
    }
    const start = Moment(date_begin);
    const end = Moment(date_end);
    const duration_hr = end.diff(start, 'hours', true);
    setLog((prevLog) => ({
      ...prevLog,
      time_lost: duration_hr.toFixed(2),
    }));
  }, [log?.date_begin, log?.date_end]);

  const clearForm = () => {
    // Reset RichTextEditor component value
    richTextEditorRef.current?.cleanContent();

    setLog({ ...emptyLog });
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

  const updateOrCreateNarrativeLog = () => {
    setTryingToSave(true);
    if (!isSendAllowed) return;

    const payload = { ...log };
    const nowMoment = Moment();
    payload.request_type = 'narrative';
    payload.jira = payload.jira_issue_id !== '';

    const beginDate = payload.date_begin ? Moment(payload.date_begin) : nowMoment;
    const endDate = payload.date_end ? Moment(payload.date_end) : nowMoment;

    // We remove the 'Z' at the end of the ISO string because the backend
    // expects the date in UTC but without the 'Z' suffix.
    payload.date_begin = beginDate.toISOString().slice(0, -1);
    payload.date_end = endDate.toISOString().slice(0, -1);

    // Transform &amp; back to '&'. This is a workaround due to Quill editor encoding '&'.}
    payload.message_text = payload.message_text.replace(/&amp;/g, '&');

    // Clean null and empty values to avoid API errors
    Object.keys(payload).forEach((key) => {
      if (payload[key] === null || (Array.isArray(payload[key]) && payload[key].length === 0)) {
        delete payload[key];
      }
    });

    // We arrange the OBS systems, subsystems, and components selection for the Jira ticket payload.
    payload.jira_obs_selection = arrangeJiraOBSSystemsSubsystemsComponentsSelection(
      systemIds,
      subsystemIds,
      componentIds,
    );

    // We arrange the OBS systems, subsystems, and components selection for the narrative log payload.
    payload.components_json = arrangeNarrativelogOBSSystemsSubsystemsComponents(systemIds, subsystemIds, componentIds);

    setSavingLog(true);
    // If log contains an id, we are updating an existing narrative log, otherwise we are creating a new one.
    if (log.id) {
      ManagerInterface.updateMessageNarrativeLogs(log.id, payload)
        .then((response) => {
          setSavingLog(false);
          if (response) {
            clearForm();
            if (save) save(response);
          }
        })
        .finally(() => {
          setSavingLog(false);
        });
    } else {
      ManagerInterface.createMessageNarrativeLogs(payload)
        .then((response) => {
          setSavingLog(false);
          if (response) {
            clearForm();
            if (save) save(response);
            if (back) back();
          }
        })
        .finally(() => {
          setSavingLog(false);
        });
    }
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    updateOrCreateNarrativeLog();
  };

  const handleTimeOfIncident = (date, type) => {
    if (type === 'start') {
      setLog((prevLog) => ({ ...prevLog, date_begin: date }));
    } else if (type === 'end') {
      setLog((prevLog) => ({ ...prevLog, date_end: date }));
    }
  };

  const renderCategoryField = () => {
    return (
      <>
        <span className={styles.label}>Type of observing time</span>
        <span className={styles.value}>
          <Select
            options={['None', 'ENG', 'SCIENCE']}
            option={log?.category}
            onChange={({ value }) => {
              setLog((prevLog) => ({
                ...prevLog,
                category: value,
              }));
            }}
            className={styles.select}
          />
        </span>
      </>
    );
  };

  const renderUrgentField = () => {
    return (
      <>
        <span className={styles.label}>Urgent?</span>
        <span className={[styles.value].join(' ')}>
          <div style={{ display: 'inline-block', marginRight: '0.5em' }}>
            <Toggle
              labels={['No', 'Yes']}
              toggled={log.level >= 100}
              onToggle={(event) =>
                setLog((prevLog) => ({
                  ...prevLog,
                  level: event ? 100 : 0,
                }))
              }
            />
          </div>
          <span className={styles.levelIcon}>{getIconLevel(log.level)}</span>
        </span>
      </>
    );
  };

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
    const { date_begin, date_end, time_lost, time_lost_type } = log;

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

        // Only for years, months and days view
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
                inputProps: {
                  title: 'This field is optional. If it is not filled, the current time will be used.',
                  placeholder: 'YYYY/MM/DD HH:mm',
                  className: styles.timeOfIncidentInput,
                },
                dateFormat: 'YYYY/MM/DD',
                timeFormat: 'HH:mm A',
                closeOnSelect: false,
              }}
              endDateProps={{
                renderInput: renderDateTimeInput(dateEndInputRef),
                renderView: renderDatePickerView(false),
                inputProps: {
                  title: 'This field is optional. If it is not filled, the current time will be used.',
                  placeholder: 'YYYY/MM/DD HH:mm',
                  className: styles.timeOfIncidentInput,
                },
                dateFormat: 'YYYY/MM/DD',
                timeFormat: 'HH:mm A',
                closeOnSelect: false,
              }}
            />
          </div>
        </span>
        <span className={styles.label}>Obs. Time Loss Type</span>
        <span className={styles.value}>
          <Toggle
            labels={['Fault', 'Weather']}
            toggled={time_lost_type === 'weather'}
            onToggle={(event) =>
              setLog((prevLog) => ({
                ...prevLog,
                time_lost_type: event ? 'weather' : 'fault',
              }))
            }
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
            onChange={(event) =>
              setLog((prevLog) => ({
                ...prevLog,
                time_lost: event.target.value,
              }))
            }
          />
        </span>
      </>
    );
  };

  const renderMessageField = () => {
    const htmlMessage = jiraMarkdownToHtml(log?.message_text);
    const inputError = tryingToSave && messageEmpty;
    return (
      <>
        <div className={styles.mb1}>
          <div className={styles.title}>Message</div>
        </div>
        <RichTextEditor
          ref={richTextEditorRef}
          className={[styles.textArea, inputError ? styles.inputError : ''].join(' ')}
          defaultValue={htmlMessage}
          onChange={(value) => {
            const parsedValue = htmlToJiraMarkdown(value);
            setLog((prevLog) => ({ ...prevLog, message_text: parsedValue }));
          }}
          onKeyCombination={(combination) => {
            if (combination === 'ctrl+enter') {
              if (!isSubmitDisabled) {
                handleSubmit();
              }
            }
          }}
        />
      </>
    );
  };

  const renderFilesField = () => {
    return (
      <>
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
      </>
    );
  };

  const renderJiraFields = () => {
    const logHasJira = getLinkJira(log.urls) !== '';
    return (
      <>
        <div className={styles.jira}>
          {!logHasJira && (
            <div className={styles.textInput}>
              <Input
                value={log?.jira_issue_id}
                placeholder="Jira ticket id"
                onChange={(event) =>
                  setLog((prevLog) => ({
                    ...prevLog,
                    jira_issue_id: event.target.value,
                  }))
                }
              />
            </div>
          )}
        </div>
      </>
    );
  };

  const renderAttachedFiles = () => {
    const filesUrls = getFilesURLs(log.urls);

    return (
      <>
        <div className={styles.attachedFiles}>
          <div className={styles.label}>Files Attached:</div>
          <div>
            {filesUrls.length > 0
              ? filesUrls.map((fileurl) => (
                  <div key={fileurl} className={styles.buttonWraper}>
                    <Button
                      className={styles.fileButton}
                      title={fileurl}
                      onClick={() => openInNewTab(fileurl)}
                      status="default"
                    >
                      <DownloadIcon className={styles.downloadIcon} />
                      {getFilename(fileurl)}
                    </Button>
                  </div>
                ))
              : 'no files attached'}
          </div>
        </div>
      </>
    );
  };

  const renderSubmitButton = () => {
    return (
      <>
        <Button disabled={isSubmitDisabled} type="submit">
          {savingLog ? <SpinnerIcon className={styles.spinnerIcon} /> : <span className={styles.title}>Save</span>}
        </Button>
      </>
    );
  };

  const renderMenu = () => {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div className={styles.detailContainerMenu}>
            <div className={styles.contentMenu}>
              <div className={styles.contentLeft}>
                {renderUrgentField()}
                {renderComponentsFields()}
                {renderTimeOfIncidentFields()}
                {renderCategoryField()}
              </div>
              <div className={styles.contentRight}>{renderMessageField()}</div>
            </div>
          </div>
          <div className={styles.footerMenu}>
            <div className={styles.footerLeftMenu}>
              {renderJiraFields()}
              {renderFilesField()}
            </div>
            <span className={styles.footerRightMenu}>{renderSubmitButton()}</span>
          </div>
        </form>
      </>
    );
  };

  const renderComponent = () => {
    const jiraUrl = getLinkJira(log.urls);

    return (
      <>
        {back && (
          <div className={styles.returnToLogs}>
            <Button
              status="link"
              onClick={() => {
                back();
              }}
            >
              <span className={styles.title}>{`< Return to Logs`}</span>
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.detailContainer}>
            <div className={styles.header}>
              {log.id && <span className={styles.bold}>#{log.id}</span>}
              {jiraUrl && (
                <span>
                  <Button status="link" title={jiraUrl} onClick={() => openInNewTab(jiraUrl)}>
                    view Jira ticket
                  </Button>
                </span>
              )}
              {log.id && (
                <span className={styles.floatRight}>
                  <Button
                    className={styles.iconBtn}
                    title="View"
                    onClick={() => {
                      if (view) view(true);
                    }}
                    status="transparent"
                  >
                    <CloseIcon className={styles.icon} />
                  </Button>
                </span>
              )}
            </div>

            <div className={styles.content}>
              <div className={styles.contentLeft}>
                {renderUrgentField()}
                {renderComponentsFields()}
                {renderTimeOfIncidentFields()}
                {renderCategoryField()}
              </div>
              <div className={styles.contentRight}>{renderMessageField()}</div>
            </div>

            <div className={styles.footer}>
              <div className={styles.footerLeft}>
                {renderJiraFields()}
                {!isLogCreate && renderAttachedFiles()}
                {renderFilesField()}
              </div>
              <span className={styles.footerRight}>{renderSubmitButton()}</span>
            </div>
          </div>
        </form>
      </>
    );
  };

  return isMenu ? renderMenu() : renderComponent();
}

NonExposureEdit.propTypes = {
  /** Log object with narrative log data */
  log: PropTypes.object,
  /** Flag to show the creation components */
  isLogCreate: PropTypes.bool,
  /** Flag to show the menu components */
  isMenu: PropTypes.bool,
  /** Function to go back */
  back: PropTypes.func,
  /** Function to save a log */
  save: PropTypes.func,
  /** Function to view a log */
  view: PropTypes.func,
  /** Seconds offset between TAI and UTC. */
  taiToUtc: PropTypes.number,
};

export default memo(NonExposureEdit);
