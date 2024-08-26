/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';
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
import {
  OLE_JIRA_COMPONENTS,
  OLE_JIRA_PRIMARY_SOFTWARE_COMPONENTS,
  OLE_JIRA_PRIMARY_HARDWARE_COMPONENTS,
  iconLevelOLE,
} from 'Config';
import ManagerInterface, {
  getFilesURLs,
  getLinkJira,
  getFilename,
  openInNewTab,
  htmlToJiraMarkdown,
  jiraMarkdownToHtml,
} from 'Utils';
import styles from './NonExposure.module.css';

class NonExposureEdit extends Component {
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
      components: [],
      components_ids: [],
      primary_software_components: ['None'],
      primary_software_components_ids: OLE_JIRA_PRIMARY_SOFTWARE_COMPONENTS['None'],
      primary_hardware_components: ['None'],
      primary_hardware_components_ids: OLE_JIRA_PRIMARY_HARDWARE_COMPONENTS['None'],
      salindex: 0,
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
      logEdit: { ...NonExposureEdit.defaultProps.logEdit, ...logEdit },
      savingLog: false,
      datesAreValid: true,
      jiraIssueError: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.multiselectComponentsRef = React.createRef();
    this.richTextEditorRef = React.createRef();
    this.id = lodash.uniqueId('nonexposure-edit-');

    this.dateBeginInputRef = React.createRef();
    this.dateEndInputRef = React.createRef();
  }

  getIconLevel(level) {
    const icon = iconLevelOLE[level >= 100 ? 'urgent' : 'info'];
    return icon;
  }

  cleanForm() {
    // Reset RichTextEditor component value
    this.richTextEditorRef.current?.cleanContent();

    // Reset time of incident datetime pickers
    this.clearDates();

    // Reset logEdit values
    // Keep previously saved components for persistence
    this.setState((prevState) => ({
      logEdit: {
        ...NonExposureEdit.defaultProps.logEdit,
        components: prevState.logEdit.components,
      },
    }));
  }

  clearComponentsInput() {
    this.setState((prevState) => ({
      logEdit: { ...prevState.logEdit, components: [] },
    }));
    this.multiselectComponentsRef.current?.resetSelectedValues();
  }

  updateDates() {
    this.setState((prevState) => ({
      logEdit: { ...prevState.logEdit, date_begin: Moment(), date_end: Moment() },
    }));
  }

  closeCalendar(ref) {
    const buttons = ref?.querySelectorAll('button');
    const clickEvent = new Event('click', { bubbles: true });
    if (buttons && buttons.length > 0) {
      // buttons[2] is the button to close the calendar
      // hidden by default so it can only be clicked programatically
      buttons[2].dispatchEvent(clickEvent);
    }
  }

  updateDateBeginToNow() {
    this.setState(
      (prevState) => ({
        logEdit: { ...prevState.logEdit, date_begin: Moment() },
      }),
      () => {
        this.closeCalendar(this.dateBeginInputRef?.current);
      },
    );
  }

  updateDateEndToNow() {
    this.setState(
      (prevState) => ({
        logEdit: { ...prevState.logEdit, date_end: Moment() },
      }),
      () => {
        this.closeCalendar(this.dateEndInputRef?.current);
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

    // const clickEvent = new MouseEvent('click');
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

  updateOrCreateMessageNarrativeLogs() {
    const payload = { ...this.state.logEdit };
    const nowMoment = Moment();
    payload['request_type'] = 'narrative';

    // Handle dates saving
    let beginDateISO, endDateISO;
    beginDateISO = payload.date_begin != '' ? Moment(payload.date_begin).toISOString() : nowMoment.toISOString();
    endDateISO = payload.date_end != '' ? Moment(payload.date_end).toISOString() : nowMoment.toISOString();

    payload['date_begin'] = beginDateISO.substring(0, beginDateISO.length - 1); // remove Zone due to backend standard
    payload['date_end'] = endDateISO.substring(0, endDateISO.length - 1); // remove Zone due to backend standard

    // Transform &amp; back to '&'. This is a workaround due to Quill editor encoding '&'.}
    payload['message_text'] = payload['message_text'].replace(/&amp;/g, '&');

    // Clean null and empty values to avoid API errors
    Object.keys(payload).forEach((key) => {
      if (payload[key] === null || (Array.isArray(payload[key]) && payload[key].length === 0)) {
        delete payload[key];
      }
    });

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
    return !datesAreValid || jiraIssueError || savingLog || !logEdit?.message_text?.trim();
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
          <span className={styles.levelIcon}>{this.getIconLevel(this.state.logEdit.level)}</span>
        </span>
      </>
    );
  }

  renderComponentsFields() {
    const { logEdit } = this.state;

    const componentOptions = Object.keys(OLE_JIRA_COMPONENTS).sort();
    const primarySoftwareComponentOptions = Object.keys(OLE_JIRA_PRIMARY_SOFTWARE_COMPONENTS).sort();
    const primaryHardwareComponentOptions = Object.keys(OLE_JIRA_PRIMARY_HARDWARE_COMPONENTS).sort();

    const setLogEditComponents = (selectedOptions) => {
      this.setState((prevState) => ({
        logEdit: {
          ...prevState.logEdit,
          components: selectedOptions,
          components_ids: selectedOptions.map((component) => OLE_JIRA_COMPONENTS[component]),
        },
      }));
    };

    return (
      <>
        <span className={styles.label}>Components</span>
        <span className={styles.value}>
          <div className={styles.inputGroup}>
            <Multiselect
              innerRef={this.multiselectComponentsRef}
              className={styles.select}
              options={componentOptions}
              selectedValues={logEdit?.components}
              onSelect={setLogEditComponents}
              onRemove={setLogEditComponents}
              placeholder="Select zero or several components"
              selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
            />
            <Button onClick={() => this.clearComponentsInput()}>Clear</Button>
          </div>
        </span>
        <span className={styles.label}>Primary Software Component</span>
        <span className={styles.value}>
          <Select
            options={primarySoftwareComponentOptions}
            option={logEdit?.primary_software_components[0]}
            onChange={({ value }) => {
              this.setState((prevState) => ({
                logEdit: {
                  ...prevState.logEdit,
                  primary_software_components: [value],
                  primary_software_components_ids: [OLE_JIRA_PRIMARY_SOFTWARE_COMPONENTS[value]],
                },
              }));
            }}
            className={styles.select}
          />
        </span>
        <span className={styles.label}>Primary Hardware Component</span>
        <span className={styles.value}>
          <Select
            options={primaryHardwareComponentOptions}
            option={logEdit?.primary_hardware_components[0]}
            onChange={({ value }) => {
              this.setState((prevState) => ({
                logEdit: {
                  ...prevState.logEdit,
                  primary_hardware_components: [value],
                  primary_hardware_components_ids: [OLE_JIRA_PRIMARY_HARDWARE_COMPONENTS[value]],
                },
              }));
            }}
            className={styles.select}
          />
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
            <Button
              // ref={ref}
              className={styles.clearDateIcon}
              size="small"
              title="Clear date"
              onClick={clearDate}
            >
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

  renderMessageField() {
    const { logEdit } = this.state;
    const htmlMessage = jiraMarkdownToHtml(logEdit?.message_text);

    return (
      <>
        <div className={styles.mb1}>
          <div className={styles.title}>Message</div>
        </div>
        <RichTextEditor
          ref={this.richTextEditorRef}
          className={styles.textArea}
          defaultValue={htmlMessage}
          onChange={(value) => {
            const parsedValue = htmlToJiraMarkdown(value);
            this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, message_text: parsedValue } }));
          }}
          onKeyCombination={(combination) => {
            if (combination === 'ctrl+enter') {
              if (!this.isSubmitDisabled()) {
                this.handleSubmit();
              }
            }
          }}
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
              <div className={styles.contentRight}>{this.renderMessageField()}</div>
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
                  <Button status="link" title={jiraUrl} onClick={() => openInNewTab(jiraUrl)}>
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
              <div className={styles.contentRight}>{this.renderMessageField()}</div>
            </div>

            <div className={styles.footer}>
              <div className={styles.footerLeft}>
                {this.renderJiraFields()}
                {!isLogCreate && this.renderAttachedFiles()}
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

export default memo(NonExposureEdit);
