/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import Moment from 'moment';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import RefreshIcon from 'components/icons/RefreshIcon/RefreshIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import MultiFileUploader from 'components/GeneralPurpose/MultiFileUploader/MultiFileUploader';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import DateTime from 'components/GeneralPurpose/DateTime/DateTime';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import Multiselect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import Select from 'components/GeneralPurpose/Select/Select';
import {
  OLE_JIRA_COMPONENTS,
  OLE_JIRA_PRIMARY_SOFTWARE_COMPONENTS,
  OLE_JIRA_PRIMARY_HARDWARE_COMPONENTS,
  iconLevelOLE,
} from 'Config';
import ManagerInterface, { getFilesURLs, getLinkJira, getFilename, openInNewTab } from 'Utils';
import styles from './NonExposure.module.css';

export default class NonExposureEdit extends Component {
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
      date_begin: Moment(),
      date_end: Moment(),
      components: [],
      primary_software_components: ['None'],
      primary_hardware_components: ['None'],
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

    this.state = {
      logEdit,
      savingLog: false,
      datesAreValid: true,
      jiraIssueError: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.multiselectComponentsRef = React.createRef();
    this.id = lodash.uniqueId('nonexposure-edit-');
  }

  getIconLevel(level) {
    const icon = iconLevelOLE[level >= 100 ? 'urgent' : 'info'];
    return icon;
  }

  cleanForm() {
    // Reset multiselects values
    this.multiselectComponentsRef.current.resetSelectedValues();
    this.setState({ logEdit: NonExposureEdit.defaultProps.logEdit });
  }

  updateDates() {
    this.setState((prevState) => ({
      logEdit: { ...prevState.logEdit, date_begin: Moment(), date_end: Moment() },
    }));
  }

  updateOrCreateMessageNarrativeLogs() {
    const payload = { ...this.state.logEdit };

    payload['request_type'] = 'narrative';

    const beginDateISO = Moment(this.state.logEdit.date_begin).toISOString();
    const endDateISO = Moment(this.state.logEdit.date_end).toISOString();
    payload['date_begin'] = beginDateISO.substring(0, beginDateISO.length - 1); // remove Zone due to backend standard
    payload['date_end'] = endDateISO.substring(0, endDateISO.length - 1); // remove Zone due to backend standard

    // Clean null and empty values to avoid API errors
    Object.keys(payload).forEach((key) => {
      if (payload[key] === null || (Array.isArray(payload[key]) && payload[key].length === 0)) {
        delete payload[key];
      }
    });

    this.setState({ savingLog: true });
    if (this.state.logEdit.id) {
      ManagerInterface.updateMessageNarrativeLogs(this.state.logEdit.id, payload).then((response) => {
        this.setState({
          savingLog: false,
        });
        this.props.save(response);
      });
    } else {
      ManagerInterface.createMessageNarrativeLogs(payload).then((response) => {
        this.setState({
          savingLog: false,
        });
        this.props.save(response);
        this.cleanForm();
        if (this.props.back) this.props.back();
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.updateOrCreateMessageNarrativeLogs();
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

  renderTimeOfIncidentSection() {
    const { date_begin, date_end, time_lost } = this.state.logEdit ?? {};
    const { incidentTimeIsSingular, datesAreValid } = this.state;

    return (
      <>
        <span className={styles.label}>Time of Incident (UTC)</span>
        <span className={styles.value}>
          <div className={styles.incidentTimeTypeContainer}>
            <Toggle
              labels={['Singular', 'Range']}
              toggled={incidentTimeIsSingular}
              onToggle={(event) => this.setState({ incidentTimeIsSingular: event })}
            />
            <Button
              className={styles.refreshDateIcon}
              size="small"
              title="Refresh date"
              onClick={() => this.updateDates()}
            >
              <RefreshIcon title="Refresh date" />
            </Button>
          </div>
          {incidentTimeIsSingular ? (
            <DateTimeRange
              className={styles.dateTimeRangeStyle}
              startDate={date_begin}
              endDate={date_end}
              onChange={(date, type) => this.handleTimeOfIncident(date, type)}
            />
          ) : (
            <DateTime
              className={styles.dateTimeSingularStyle}
              viewMode="time"
              dateFormat="YYYY/MM/DD"
              timeFormat="HH:mm:ss"
              closeOnSelect={true}
              value={date_begin}
              onChange={(date) => {
                this.setState((prevState) => ({
                  logEdit: { ...prevState.logEdit, date_begin: date },
                }));
              }}
            />
          )}
          {!datesAreValid && <div className={styles.inputError}>Error: dates must be input in valid ISO format</div>}
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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.logEdit?.date_begin !== this.state.logEdit?.date_begin ||
      prevState.logEdit?.date_end !== this.state.logEdit?.date_end
    ) {
      try {
        this.state.logEdit.date_begin.toISOString();
        this.state.logEdit.date_end.toISOString();
        this.setState({
          datesAreValid: true,
        });
        this.handleTimeLost();
      } catch (error) {
        this.setState({
          datesAreValid: false,
        });
      }
    }

    if (this.state.logEdit && this.state.logEdit.jira !== prevState.logEdit.jira) {
      const { jira, jira_issue_title, jira_issue_id } = this.state.logEdit;
      if (jira_issue_title === '' || jira_issue_id === '') {
        this.setState({ jiraIssueError: true });
      }

      if (!jira) {
        this.setState({
          jiraIssueError: false,
        });
      }
    }

    if (this.state.logEdit && this.state.logEdit.jira_issue_title !== prevState.logEdit.jira_issue_title) {
      const { jira_issue_title } = this.state.logEdit;
      if (jira_issue_title === '') {
        this.setState({ jiraIssueError: true });
      } else {
        this.setState({ jiraIssueError: false });
      }
    }

    if (this.state.logEdit && this.state.logEdit.jira_issue_id !== prevState.logEdit.jira_issue_id) {
      const { jira_issue_id } = this.state.logEdit;
      if (jira_issue_id === '') {
        this.setState({ jiraIssueError: true });
      } else {
        this.setState({ jiraIssueError: false });
      }
    }
  }

  render() {
    const { back, isLogCreate, isMenu, view } = this.props;
    const { datesAreValid, savingLog, jiraIssueError } = this.state;

    const jiraUrl = getLinkJira(this.state.logEdit.urls);
    const filesUrls = getFilesURLs(this.state.logEdit.urls);

    const componentOptions = OLE_JIRA_COMPONENTS.sort();
    const primarySoftwareComponentOptions = OLE_JIRA_PRIMARY_SOFTWARE_COMPONENTS.sort();
    const primaryHardwareComponentOptions = OLE_JIRA_PRIMARY_HARDWARE_COMPONENTS.sort();

    return (
      <>
        {!isMenu && back && (
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
          <div className={isMenu ? styles.detailContainerMenu : styles.detailContainer}>
            {!isMenu && (
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
                {this.state.logEdit.id ? (
                  <>
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
                  </>
                ) : (
                  <></>
                )}
              </div>
            )}

            <div id={this.id} className={isMenu ? styles.contentMenu : styles.content}>
              <div className={styles.contentLeft}>
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
                <span className={styles.label}>Components</span>
                <span className={styles.value}>
                  <Multiselect
                    innerRef={this.multiselectComponentsRef}
                    className={styles.select}
                    options={componentOptions}
                    selectedValues={this.state.logEdit.components}
                    onSelect={(selectedOptions) => {
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, components: selectedOptions },
                      }));
                    }}
                    placeholder="Select zero or several components"
                    selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
                  />
                </span>
                <span className={styles.label}>Primary Software Component</span>
                <span className={styles.value}>
                  <Select
                    options={primarySoftwareComponentOptions}
                    option={this.state.logEdit.primary_software_components[0]}
                    onChange={({ value }) => {
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, primary_software_components: [value] },
                      }));
                    }}
                    className={styles.select}
                  />
                </span>
                <span className={styles.label}>Primary Hardware Component</span>
                <span className={styles.value}>
                  <Select
                    options={primaryHardwareComponentOptions}
                    option={this.state.logEdit.primary_hardware_components[0]}
                    onChange={({ value }) => {
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, primary_hardware_components: [value] },
                      }));
                    }}
                    className={styles.select}
                  />
                </span>

                {isMenu && this.renderTimeOfIncidentSection()}
              </div>

              <div className={styles.contentRight}>
                <div className={styles.mb1}>
                  <div className={styles.title}>Message</div>
                  <div className={styles.inline}>{!isMenu && this.renderTimeOfIncidentSection()}</div>
                </div>
                <TextArea
                  value={this.state.logEdit.message_text}
                  callback={(event) =>
                    this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, message_text: event } }))
                  }
                />
              </div>
            </div>
            <div className={isMenu ? styles.footerMenu : styles.footer}>
              <div>
                {!isLogCreate && !isMenu && (
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
                )}
                <div className={styles.toAttachFiles}>
                  <MultiFileUploader
                    values={this.state.logEdit.file}
                    handleFiles={(files) =>
                      this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: files } }))
                    }
                    handleDelete={(file) => {
                      const files = { ...this.state.logEdit.file };
                      delete files[file];
                      this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: files } }));
                    }}
                    handleDeleteAll={() =>
                      this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: undefined } }))
                    }
                  />
                </div>

                <div className={styles.jira}>
                  {!this.state.logEdit.id && (
                    <span className={styles.checkboxText}>
                      <span>link Jira ticket</span>
                      <Input
                        type="checkbox"
                        checked={this.state.logEdit.jira}
                        onChange={(event) => {
                          this.setState((prevState) => ({
                            logEdit: { ...prevState.logEdit, jira: event.target.checked },
                          }));
                        }}
                      />
                      {this.state.logEdit.jira && (
                        <>
                          <Toggle
                            labels={['New', 'Existent']}
                            toggled={!this.state.logEdit.jira_new}
                            onToggle={(event) =>
                              this.setState((prevState) => ({
                                logEdit: { ...prevState.logEdit, jira_new: !event },
                              }))
                            }
                          />
                          {this.state.logEdit.jira_new ? (
                            <Input
                              placeholder="Jira ticket title"
                              onChange={(event) =>
                                this.setState((prevState) => ({
                                  logEdit: { ...prevState.logEdit, jira_issue_title: event.target.value },
                                }))
                              }
                            />
                          ) : (
                            <Input
                              placeholder="Jira ticket id"
                              onChange={(event) =>
                                this.setState((prevState) => ({
                                  logEdit: { ...prevState.logEdit, jira_issue_id: event.target.value },
                                }))
                              }
                            />
                          )}
                          {this.state.jiraIssueError && (
                            <div className={styles.inputError}>This field cannot be empty.</div>
                          )}
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <span className={isMenu ? styles.footerRightMenu : styles.footerRight}>
                <Button disabled={!datesAreValid || jiraIssueError} type="submit">
                  {savingLog ? (
                    <SpinnerIcon className={styles.spinnerIcon} />
                  ) : (
                    <span className={styles.title}>Upload Log</span>
                  )}
                </Button>
              </span>
            </div>
          </div>
        </form>
      </>
    );
  }
}
