import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import Moment from 'moment';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import RefreshIcon from 'components/icons/RefreshIcon/RefreshIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
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
  arrangeJiraOBSSystemsSubsystemsComponentsSelection,
  arrangeNarrativelogOBSSystemsSubsystemsComponents,
  validateOBSSystemsSubsystemsComponentsIds,
} from 'Utils';
import { getIconLevel, closeCalendar } from '../OLE';
import styles from '../NonExposure/NonExposure.module.css';
import customStyles from './Tekniker.module.css';

class TeknikerAdd extends Component {
  static propTypes = {
    /** Log to edit object */
    logEdit: PropTypes.object,
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
  };

  static defaultProps = {
    logEdit: {
      id: undefined,
      level: 0,
      date_begin: '',
      date_end: '',
      components_json: {},
      systems_ids: [],
      subsystems_ids: [],
      components_ids: [],
      user: undefined,
      time_lost: 0,
      jira: false,
      jira_new: true,
      jira_issue_title: '',
      jira_issue_id: '',
      file: undefined,
      urls: [],
      tags: [],
      message_text: '',
      is_human: true,
      category: 'None',
      time_lost_type: 'fault',
    },
    isLogCreate: false,
    isMenu: false,
    back: undefined,
    save: () => {},
    view: () => {},
  };

  constructor(props) {
    super(props);
    const { logEdit } = props;

    logEdit['date_begin'] = logEdit['date_begin'] ? Moment(logEdit['date_begin'] + 'Z') : '';
    logEdit['date_end'] = logEdit['date_end'] ? Moment(logEdit['date_end'] + 'Z') : '';

    this.state = {
      logEdit: { ...TeknikerAdd.defaultProps.logEdit, ...logEdit },
      savingLog: false,
      datesAreValid: true,
      jiraIssueError: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);

    this.multiselectSystemsRef = React.createRef();
    this.multiselectSubsystemsRef = React.createRef();
    this.multiselectComponentsRef = React.createRef();

    this.id = lodash.uniqueId('tekniker-add-');
    this.multiselectSystemId = lodash.uniqueId('multiselect-systems-');

    this.dateBeginInputRef = React.createRef();
    this.dateEndInputRef = React.createRef();
  }

  cleanForm() {
    // Reset time of incident datetime pickers
    this.clearDates();

    // Reset logEdit values
    // Keep previously saved systems for persistence
    this.setState((prevState) => ({
      logEdit: {
        ...TeknikerAdd.defaultProps.logEdit,
        systems_ids: prevState.logEdit.systems_ids,
        subsystems_ids: [],
        components_ids: [],
      },
    }));
  }

  clearSystemsInput() {
    this.setState((prevState) => ({
      logEdit: {
        ...prevState.logEdit,
        systems_ids: [],
        subsystems_ids: [],
        components_ids: [],
      },
    }));

    this.multiselectSystemsRef.current?.resetSelectedValues();
  }

  clearSubsystemsInput() {
    this.setState((prevState) => ({
      logEdit: {
        ...prevState.logEdit,
        subsystems_ids: [],
        components_ids: [],
      },
    }));

    this.multiselectSubsystemsRef.current?.resetSelectedValues();
  }

  clearComponentsInput() {
    this.setState((prevState) => ({
      logEdit: {
        ...prevState.logEdit,
        components_ids: [],
      },
    }));

    this.multiselectComponentsRef.current?.resetSelectedValues();
  }

  updateDates() {
    this.setState((prevState) => ({
      logEdit: { ...prevState.logEdit, date_begin: Moment(), date_end: Moment() },
    }));
  }

  updateDateBeginToNow() {
    this.setState(
      (prevState) => ({
        logEdit: { ...prevState.logEdit, date_begin: Moment() },
      }),
      () => {
        closeCalendar(this.dateBeginInputRef?.current);
      },
    );
  }

  updateDateEndToNow() {
    this.setState(
      (prevState) => ({
        logEdit: { ...prevState.logEdit, date_end: Moment() },
      }),
      () => {
        closeCalendar(this.dateEndInputRef?.current);
      },
    );
  }

  clearDates() {
    // For some reason setting logEdit.date_begin to '' does not work
    // thus we clear the date by calling the onClick function of the clear button
    // of each DateTime component
    const dateBeginElement = this.dateBeginInputRef.current;
    const dateEndElement = this.dateEndInputRef.current;

    const dateBeginButtons = dateBeginElement?.querySelectorAll('button');
    const dateEndButtons = dateEndElement?.querySelectorAll('button');

    const clickEvent = new Event('click', { bubbles: true });

    if (dateBeginButtons && dateBeginButtons.length > 0) {
      dateBeginButtons[0].dispatchEvent(clickEvent);
      dateBeginButtons[2].dispatchEvent(clickEvent);
    }

    if (dateEndButtons && dateEndButtons.length > 0) {
      dateEndButtons[0].dispatchEvent(clickEvent);
      dateEndButtons[2].dispatchEvent(clickEvent);
    }
  }

  makeTemplateMessage() {
    const { logEdit } = this.state;

    const content = [
      'h3. Error/Failure explanation:',
      logEdit.tmaError,
      'h3. What were you doing when the failure occurred?:',
      logEdit.tmaSituation,
      'h3. Detailed description of the steps followed that caused the error/failure:',
      logEdit.tmaDescription,
    ];

    return content.join('\r\n');
  }

  updateOrCreateMessageNarrativeLogs() {
    const { logEdit } = this.state;
    const payload = { ...logEdit };

    const nowMoment = Moment();
    payload['request_type'] = 'narrative';

    // Handle dates saving
    let beginDateISO, endDateISO;
    beginDateISO = payload.date_begin != '' ? Moment(payload.date_begin).toISOString() : nowMoment.toISOString();
    endDateISO = payload.date_end != '' ? Moment(payload.date_end).toISOString() : nowMoment.toISOString();

    payload['date_begin'] = beginDateISO.substring(0, beginDateISO.length - 1); // remove Zone due to backend standard
    payload['date_end'] = endDateISO.substring(0, endDateISO.length - 1); // remove Zone due to backend standard

    payload['message_text'] = this.makeTemplateMessage();
    delete payload['tmaError'];
    delete payload['tmaSituation'];
    delete payload['tmaDescription'];

    // Clean null and empty values to avoid API errors
    Object.keys(payload).forEach((key) => {
      if (payload[key] === null || (Array.isArray(payload[key]) && payload[key].length === 0)) {
        delete payload[key];
      }
    });

    // Handle systems, subsystems and components for JIRA payload
    const selection = arrangeJiraOBSSystemsSubsystemsComponentsSelection(
      payload.systems_ids,
      payload.subsystems_ids,
      payload.components_ids,
    );
    payload['jira_obs_selection'] = selection;

    const componentsJSON = arrangeNarrativelogOBSSystemsSubsystemsComponents(
      payload.systems_ids,
      payload.subsystems_ids,
      payload.components_ids,
    );
    payload['components_json'] = componentsJSON;

    // Avoid API confusion with deprecated parameters
    delete payload['components'];
    delete payload['primary_software_components'];
    delete payload['primary_hardware_components'];
    delete payload['systems'];
    delete payload['subsystems'];
    delete payload['systems_ids'];
    delete payload['subsystems_ids'];
    delete payload['components_ids'];

    this.setState({ savingLog: true });
    if (this.state.logEdit.id) {
      ManagerInterface.updateMessageNarrativeLogs(this.state.logEdit.id, payload).then((response) => {
        this.setState({ savingLog: false });
        if (response) {
          this.props.save(response);
        }
      });
    } else {
      ManagerInterface.createMessageNarrativeLogs(payload).then((response) => {
        this.setState({ savingLog: false });
        // Calbacks only if the response is successful
        if (response) {
          this.cleanForm();
          this.props.save(response);
          if (this.props.back) this.props.back();
        }
      });
    }
  }

  handleSubmit(event) {
    if (event) event.preventDefault();
    this.updateOrCreateMessageNarrativeLogs();
  }

  isSubmitDisabled() {
    const { logEdit, datesAreValid, savingLog, jiraIssueError } = this.state;
    return (
      !datesAreValid ||
      jiraIssueError ||
      savingLog ||
      (!logEdit?.tmaError?.trim() && !logEdit?.tmaSituation?.trim() && !logEdit?.tmaDescription?.trim())
    );
  }

  handleTimeOfIncident(date, type) {
    if (type === 'start') {
      this.setState((prevState) => ({
        logEdit: { ...prevState.logEdit, date_begin: date },
      }));
    } else if (type === 'end') {
      this.setState((prevState) => ({
        logEdit: { ...prevState.logEdit, date_end: date },
      }));
    }
  }

  handleTimeLost() {
    const { date_begin, date_end } = this.state.logEdit;
    if (date_begin === '' || date_end === '') {
      return;
    }
    const start = Moment(date_begin);
    const end = Moment(date_end);
    const duration_hr = end.diff(start, 'hours', true);
    this.setState((prevState) => ({
      logEdit: {
        ...prevState.logEdit,
        time_lost: duration_hr.toFixed(2),
      },
    }));
  }

  // The following function is used to fix a bug with the ReactMultiselect component.
  // When setting the singleSelect prop to true, clicks on the select box are dismissed.
  // This function replaces the search box with a simple input box and removes the caret.
  // Check: https://github.com/srigar/multiselect-react-dropdown/issues/262
  fixSingleSelectBox = () => {
    const { logEdit } = this.state;
    const msParent = document.getElementById(this.multiselectSystemId);
    const searchBox = msParent.getElementsByClassName('searchBox')[0];
    const caret = msParent.getElementsByClassName('icon_down_dir')[0];

    const newSearchBox = document.createElement('input');
    newSearchBox.setAttribute('type', 'text');
    newSearchBox.setAttribute('placeholder', 'Select zero or one system');

    if (logEdit.systems_ids.length == 0) {
      searchBox.replaceWith(newSearchBox);
    }
    caret.remove();
  };

  componentDidMount() {
    this.fixSingleSelectBox();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.logEdit?.date_begin !== this.state.logEdit?.date_begin ||
      prevState.logEdit?.date_end !== this.state.logEdit?.date_end
    ) {
      this.handleTimeLost();
    }

    if (this.state.logEdit) {
      const { jira, jira_new, jira_issue_title, jira_issue_id } = this.state.logEdit;

      if (
        prevState.logEdit?.jira !== jira ||
        prevState.logEdit?.jira_new !== jira_new ||
        prevState.logEdit?.jira_issue_title !== jira_issue_title ||
        prevState.logEdit?.jira_issue_id !== jira_issue_id
      ) {
        if (jira) {
          if ((jira_new && jira_issue_title === '') || (!jira_new && jira_issue_id === '')) {
            this.setState({ jiraIssueError: true });
          }
          if ((jira_new && jira_issue_title !== '') || (!jira_new && jira_issue_id !== '')) {
            this.setState({ jiraIssueError: false });
          }
        } else {
          this.setState({ jiraIssueError: false });
        }
      }
    }

    this.fixSingleSelectBox();
  }

  renderCategoryField() {
    return (
      <>
        <span className={styles.label}>Type of observing time</span>
        <span className={styles.value}>
          <Select
            options={['None', 'ENG', 'SCIENCE']}
            option={this.state.logEdit?.category}
            onChange={({ value }) => {
              this.setState((prevState) => ({
                logEdit: { ...prevState.logEdit, category: value },
              }));
            }}
            className={styles.select}
          />
        </span>
      </>
    );
  }

  renderUrgentField() {
    return (
      <>
        <span className={styles.label}>Urgent?</span>
        <span className={[styles.value].join(' ')}>
          <div style={{ display: 'inline-block', marginRight: '0.5em' }}>
            <Toggle
              labels={['No', 'Yes']}
              toggled={this.state.logEdit.level >= 100}
              onToggle={(event) =>
                this.setState((prevState) => ({
                  logEdit: { ...prevState.logEdit, level: event ? 100 : 0 },
                }))
              }
            />
          </div>
          <span className={styles.levelIcon}>{getIconLevel(this.state.logEdit.level)}</span>
        </span>
      </>
    );
  }

  renderComponentsFields() {
    const { logEdit } = this.state;

    const selectedSystemsIds = logEdit?.systems_ids;
    const selectedSubsystemsIds = logEdit?.subsystems_ids;
    const selectedComponentsIds = logEdit?.components_ids;

    const selectedSystems = Object.keys(OLE_OBS_SYSTEMS).filter((s) =>
      selectedSystemsIds?.includes(OLE_OBS_SYSTEMS[s].id),
    );
    const selectedSubsystems = Object.keys(OLE_OBS_SUBSYSTEMS).filter((ss) =>
      selectedSubsystemsIds?.includes(OLE_OBS_SUBSYSTEMS[ss].id),
    );
    const selectedComponents = Object.keys(OLE_OBS_SUBSYSTEMS_COMPONENTS).filter((c) =>
      selectedComponentsIds?.includes(OLE_OBS_SUBSYSTEMS_COMPONENTS[c].id),
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

    const setLogEditSystems = (selectedOptions) => {
      const selectedSystemsIds = selectedOptions.map((s) => OLE_OBS_SYSTEMS[s].id);
      this.setState((prevState) => {
        const validComponentsIds = validateOBSSystemsSubsystemsComponentsIds(
          selectedSystemsIds,
          prevState.logEdit.subsystems_ids,
          prevState.logEdit.components_ids,
        );

        return {
          logEdit: {
            ...prevState.logEdit,
            systems_ids: validComponentsIds.systemsIds,
            subsystems_ids: validComponentsIds.subsystemsIds,
            components_ids: validComponentsIds.componentsIds,
          },
        };
      });
    };

    const setLogEditSubsystems = (selectedOptions) => {
      const selectedSubsystemsIds = selectedOptions.map((ss) => OLE_OBS_SUBSYSTEMS[ss].id);
      this.setState((prevState) => {
        const validComponentsIds = validateOBSSystemsSubsystemsComponentsIds(
          prevState.logEdit.systems_ids,
          selectedSubsystemsIds,
          prevState.logEdit.components_ids,
        );

        return {
          logEdit: {
            ...prevState.logEdit,
            subsystems_ids: validComponentsIds.subsystemsIds,
            components_ids: validComponentsIds.componentsIds,
          },
        };
      });
    };

    const setLogEditComponents = (selectedOptions) => {
      const selectedComponentsIds = selectedOptions.map((c) => OLE_OBS_SUBSYSTEMS_COMPONENTS[c].id);
      this.setState((prevState) => {
        const validComponentsIds = validateOBSSystemsSubsystemsComponentsIds(
          prevState.logEdit.systems_ids,
          prevState.logEdit.subsystems_ids,
          selectedComponentsIds,
        );

        return {
          logEdit: {
            ...prevState.logEdit,
            components_ids: validComponentsIds.componentsIds,
          },
        };
      });
    };

    return (
      <>
        <span className={styles.label}>System</span>
        <span className={styles.value}>
          <div className={styles.inputGroup} id={this.multiselectSystemId}>
            <Multiselect
              innerRef={this.multiselectSystemsRef}
              className={styles.select}
              options={systemOptions}
              selectedValues={selectedSystems}
              onSelect={setLogEditSystems}
              onRemove={setLogEditSystems}
              singleSelect={true}
            />
            <Button onClick={() => this.clearSystemsInput()}>Clear</Button>
          </div>
        </span>
        <span className={styles.label}>Subsystems</span>
        <span className={styles.value}>
          <div className={styles.inputGroup}>
            <Multiselect
              innerRef={this.multiselectSubsystemsRef}
              className={styles.select}
              options={subsystemOptions}
              selectedValues={selectedSubsystems}
              onSelect={setLogEditSubsystems}
              onRemove={setLogEditSubsystems}
              placeholder="Select zero or more subsystems"
              selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
            />
            <Button onClick={() => this.clearSubsystemsInput()}>Clear</Button>
          </div>
        </span>
        <span className={styles.label}>Components</span>
        <span className={styles.value}>
          <div className={styles.inputGroup}>
            <Multiselect
              innerRef={this.multiselectComponentsRef}
              className={styles.select}
              options={componentOptions}
              selectedValues={selectedComponents}
              onSelect={setLogEditComponents}
              onRemove={setLogEditComponents}
              placeholder="Select zero or more components"
              selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
            />
            <Button onClick={() => this.clearComponentsInput()}>Clear</Button>
          </div>
        </span>
      </>
    );
  }

  renderTimeOfIncidentFields() {
    const { date_begin, date_end, time_lost, time_lost_type } = this.state.logEdit ?? {};
    const { datesAreValid } = this.state;

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
            this.updateDateBeginToNow();
          } else {
            this.updateDateEndToNow();
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
              onChange={(date, type) => this.handleTimeOfIncident(date, type)}
              startDateProps={{
                renderInput: renderDateTimeInput(this.dateBeginInputRef),
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
                renderInput: renderDateTimeInput(this.dateEndInputRef),
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
          {!datesAreValid && <div className={styles.inputError}>Error: dates must be input in valid ISO format</div>}
        </span>
        <span className={styles.label}>Obs. Time Loss Type</span>
        <span className={styles.value}>
          <Toggle
            labels={['Fault', 'Weather']}
            toggled={time_lost_type === 'weather'}
            onToggle={(event) =>
              this.setState((prevState) => ({
                logEdit: { ...prevState.logEdit, time_lost_type: event ? 'weather' : 'fault' },
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
              this.setState((prevState) => ({
                logEdit: { ...prevState.logEdit, time_lost: event.target.value },
              }))
            }
          />
        </span>
      </>
    );
  }

  renderErrorMessageField() {
    const { logEdit } = this.state;

    return (
      <>
        <div className={styles.mb1}>
          <div className={styles.title}>Error/Failure explanation:</div>
        </div>
        <TextArea
          className={customStyles.textArea}
          value={logEdit?.tmaError}
          callback={(event) =>
            this.setState((prevState) => ({
              logEdit: { ...prevState.logEdit, tmaError: event },
            }))
          }
        />
      </>
    );
  }

  renderSituationMessageField() {
    const { logEdit } = this.state;

    return (
      <>
        <div className={styles.mb1}>
          <div className={styles.title}>What were you doing when the failure occurred?:</div>
        </div>
        <TextArea
          className={customStyles.textArea}
          value={logEdit?.tmaSituation}
          callback={(event) =>
            this.setState((prevState) => ({
              logEdit: { ...prevState.logEdit, tmaSituation: event },
            }))
          }
        />
      </>
    );
  }

  renderDescriptionMessageField() {
    const { logEdit } = this.state;

    return (
      <>
        <div className={styles.mb1}>
          <div className={styles.title}>Detailed description of the steps followed that caused the error/failure:</div>
        </div>
        <TextArea
          className={customStyles.textArea}
          value={logEdit?.tmaDescription}
          callback={(event) =>
            this.setState((prevState) => ({
              logEdit: { ...prevState.logEdit, tmaDescription: event },
            }))
          }
        />
      </>
    );
  }

  renderFilesField() {
    const { logEdit } = this.state;

    return (
      <>
        <div className={styles.toAttachFiles}>
          <MultiFileUploader
            values={logEdit?.file}
            handleFiles={(files) => this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: files } }))}
            handleDelete={(file) => {
              const files = { ...logEdit?.file };
              delete files[file];
              this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: files } }));
            }}
            handleDeleteAll={() =>
              this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: undefined } }))
            }
          />
        </div>
      </>
    );
  }

  renderJiraFields() {
    const { logEdit, jiraIssueError } = this.state;
    const logHasJira = getLinkJira(logEdit.urls) !== '';
    return (
      <>
        <div className={styles.jira}>
          {!logHasJira && (
            <>
              <div className={styles.checkboxText}>
                <Input
                  type="checkbox"
                  checked={logEdit?.jira}
                  onChange={(event) => {
                    this.setState((prevState) => ({
                      logEdit: { ...prevState.logEdit, jira: event.target.checked },
                    }));
                  }}
                />
                <span>link Jira ticket</span>
              </div>
              {logEdit?.jira && (
                <div className={styles.radioText}>
                  <div>
                    <input
                      type="radio"
                      name="jira"
                      value="new"
                      checked={logEdit?.jira_new}
                      onChange={() => {
                        this.setState((prevState) => ({
                          logEdit: { ...prevState.logEdit, jira_new: true },
                        }));
                      }}
                    />
                    <span>New</span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="jira"
                      value="existent"
                      checked={!logEdit?.jira_new}
                      onChange={() => {
                        this.setState((prevState) => ({
                          logEdit: { ...prevState.logEdit, jira_new: false },
                        }));
                      }}
                    />
                    <span>Existent</span>
                  </div>
                </div>
              )}
              {logEdit?.jira && (
                <div className={styles.textInput}>
                  {logEdit?.jira_new ? (
                    <Input
                      value={logEdit?.jira_issue_title}
                      className={jiraIssueError ? styles.inputError : ''}
                      placeholder="Jira ticket title"
                      onChange={(event) =>
                        this.setState((prevState) => ({
                          logEdit: { ...prevState.logEdit, jira_issue_title: event.target.value },
                        }))
                      }
                    />
                  ) : (
                    <Input
                      value={logEdit?.jira_issue_id}
                      className={jiraIssueError ? styles.inputError : ''}
                      placeholder="Jira ticket id"
                      onChange={(event) =>
                        this.setState((prevState) => ({
                          logEdit: { ...prevState.logEdit, jira_issue_id: event.target.value },
                        }))
                      }
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }

  renderAttachedFiles() {
    const filesUrls = getFilesURLs(this.state.logEdit.urls);

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
  }

  renderSubmitButton() {
    const { savingLog } = this.state;

    return (
      <>
        <Button disabled={this.isSubmitDisabled()} type="submit">
          {savingLog ? <SpinnerIcon className={styles.spinnerIcon} /> : <span className={styles.title}>Save</span>}
        </Button>
      </>
    );
  }

  renderMenu() {
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <div className={styles.detailContainerMenu}>
            <div id={this.id} className={styles.contentMenu}>
              <div className={styles.contentLeft}>
                {this.renderUrgentField()}
                {this.renderComponentsFields()}
                {this.renderTimeOfIncidentFields()}
                {this.renderCategoryField()}
              </div>
              <div className={styles.contentRight}>
                {this.renderErrorMessageField()}
                {this.renderSituationMessageField()}
                {this.renderDescriptionMessageField()}
              </div>
            </div>
          </div>
          <div className={styles.footerMenu}>
            <div className={styles.footerLeftMenu}>
              {this.renderJiraFields()}
              {this.renderFilesField()}
            </div>
            <span className={styles.footerRightMenu}>{this.renderSubmitButton()}</span>
          </div>
        </form>
      </>
    );
  }

  renderComponent() {
    const { back, isLogCreate, view } = this.props;
    const jiraUrl = getLinkJira(this.state.logEdit.urls);

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

        <form onSubmit={this.handleSubmit}>
          <div className={styles.detailContainer}>
            <div className={styles.header}>
              {this.state.logEdit.id && <span className={styles.bold}>#{this.state.logEdit.id}</span>}
              {jiraUrl && (
                <span>
                  <Button
                    status="link"
                    title={this.state.logEdit.jiraurl}
                    onClick={() => openInNewTab(this.state.logEdit.jiraurl)}
                  >
                    view Jira ticket
                  </Button>
                </span>
              )}
              {this.state.logEdit.id && (
                <span className={styles.floatRight}>
                  <Button
                    className={styles.iconBtn}
                    title="View"
                    onClick={() => {
                      view(true);
                    }}
                    status="transparent"
                  >
                    <CloseIcon className={styles.icon} />
                  </Button>
                </span>
              )}
            </div>

            <div id={this.id} className={styles.content}>
              <div className={styles.contentLeft}>
                {this.renderUrgentField()}
                {this.renderComponentsFields()}
                {this.renderTimeOfIncidentFields()}
                {this.renderCategoryField()}
              </div>
              <div className={styles.contentRight}>
                {this.renderErrorMessageField()}
                {this.renderSituationMessageField()}
                {this.renderDescriptionMessageField()}
              </div>
            </div>

            <div className={styles.footer}>
              <div className={styles.footerLeft}>
                {!isLogCreate && this.renderAttachedFiles()}
                {this.renderJiraFields()}
                {this.renderFilesField()}
              </div>
              <span className={styles.footerRight}>{this.renderSubmitButton()}</span>
            </div>
          </div>
        </form>
      </>
    );
  }

  render() {
    const { isMenu } = this.props;
    return isMenu ? this.renderMenu() : this.renderComponent();
  }
}

export default memo(TeknikerAdd);
