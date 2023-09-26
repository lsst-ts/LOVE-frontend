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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import Moment from 'moment';
import MultiSelect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import RefreshIcon from 'components/icons/RefreshIcon/RefreshIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import MultiFileUploader from 'components/GeneralPurpose/MultiFileUploader/MultiFileUploader';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import { EXPOSURE_FLAG_OPTIONS, exposureFlagStateToStyle, ISO_INTEGER_DATE_FORMAT } from 'Config';
import ManagerInterface, { getFilesURLs } from 'Utils';
import styles from './Exposure.module.css';

export default class ExposureAdd extends Component {
  static propTypes = {
    /** Exposure object to which a log is going to be added */
    exposure: PropTypes.object,
    /** New message object */
    newMessage: PropTypes.object,
    /** Flag to show the creation components */
    isLogCreate: PropTypes.bool,
    /** Flag to show the menu components */
    isMenu: PropTypes.bool,
    /** Array of observation ids */
    observationIds: PropTypes.arrayOf(PropTypes.string),
    /** Function to go back */
    back: PropTypes.func,
    /** Function to view a log */
    view: PropTypes.func,
  };

  static defaultProps = {
    exposure: {
      obs_id: undefined,
      instrument: undefined,
      observation_type: undefined,
      observation_reason: undefined,
      timespan_begin: undefined,
      timespan_end: undefined,
    },
    newMessage: {
      obs_id: undefined,
      instrument: undefined,
      message_text: undefined,
      level: 10,
      user_id: undefined,
      user_agent: undefined,
      is_human: true,
      is_new: false,
      exposure_flag: 'none',
      jira: false,
      jira_new: true,
      jira_issue_title: '',
      jira_issue_id: '',
      tags: undefined,
    },
    isLogCreate: false,
    isMenu: false,
    observationIds: [],
    back: () => {},
    view: () => {},
  };

  constructor(props) {
    super(props);
    this.id = lodash.uniqueId('exposure-message-create-');
    const { newMessage } = props;

    this.state = {
      newMessage,
      instruments: [],
      selectedInstrument: null,
      confirmationModalShown: false,
      confirmationModalText: '',
      imageTags: [],
      selectedDayExposureStart: Moment(Date.now() + 37 * 1000).subtract(1, 'days'),
      selectedDayExposureEnd: Moment(Date.now() + 37 * 1000),
      registryMap: {},
      updatingExposures: false,
      savingLog: false,
      jiraIssueError: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  statusFlag(flag) {
    return exposureFlagStateToStyle[flag] ? exposureFlagStateToStyle[flag] : 'unknown';
  }

  cleanForm() {
    this.setState({ newMessage: ExposureAdd.defaultProps.newMessage });
  }

  queryExposures() {
    const { selectedInstrument, selectedDayExposureStart, selectedDayExposureEnd, registryMap } = this.state;
    const startObsDay = Moment(selectedDayExposureStart).format(ISO_INTEGER_DATE_FORMAT);
    const endObsDay = Moment(selectedDayExposureEnd).add(1, 'days').format(ISO_INTEGER_DATE_FORMAT);
    const registry = registryMap[selectedInstrument].split('_')[2];

    // Get the list of exposures
    this.setState({ updatingExposures: true });
    ManagerInterface.getListExposureLogs(selectedInstrument, startObsDay, endObsDay, registry).then((data) => {
      const observationIds = data.map((exposure) => exposure.obs_id);
      const dayObs = data.map((exposure) => ({
        obs_id: exposure.obs_id,
        day_obs: exposure.day_obs,
      }));

      this.setState({
        updatingExposures: false,
        observationIds,
        dayObs,
      });
    });
  }

  saveMessage() {
    const { exposure, isLogCreate, isMenu } = this.props;
    const payload = { ...this.state.newMessage };
    payload['request_type'] = 'exposure';

    // If exposure is not empty, then we are adding a log
    // to a specific exposure
    if (exposure.obs_id) {
      payload['obs_id'] = [exposure['obs_id']];
      payload['instrument'] = exposure['instrument'];
      payload['day_obs'] = exposure['day_obs'];
    }

    if (payload['tags']) {
      payload['tags'] = payload['tags'].map((tag) => tag.id);
    }

    this.setState({ savingLog: true });
    ManagerInterface.createMessageExposureLogs(payload).then((result) => {
      if (isLogCreate || isMenu || !exposure.obs_id) {
        this.props.back();
      } else {
        this.props.view();
      }
      this.cleanForm();
      this.setState({ savingLog: false });
    });
  }

  deleteMessage() {
    const { newMessage } = this.state;
    if (newMessage?.id) {
      ManagerInterface.deleteMessageExposureLogs(newMessage.id).then((response) => {
        this.setState({ confirmationModalShown: false });
      });
    } else {
      this.props.back();
    }
  }

  confirmDelete() {
    const modalText = (
      <span>
        You are about to <b>delete</b> this message of Exposure Logs
        <br />
        Are you sure?
      </span>
    );
    this.setState({
      confirmationModalShown: true,
      confirmationModalText: modalText,
    });
  }

  changeDayExposure(day, type) {
    if (type === 'start') {
      this.setState({ selectedDayExposureStart: day });
    } else if (type === 'end') {
      this.setState({ selectedDayExposureEnd: day });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.saveMessage();
  }

  renderInstrumentsSelect() {
    const { instruments, selectedInstrument } = this.state;
    return (
      <Select
        value={selectedInstrument}
        onChange={({ value }) =>
          this.setState((prevState) => ({
            selectedInstrument: value,
            newMessage: { ...prevState.newMessage, instrument: value },
          }))
        }
        options={instruments}
        className={styles.select}
        small
      />
    );
  }

  renderDateTimeRangeSelect() {
    const { selectedDayExposureStart, selectedDayExposureEnd } = this.state;
    return (
      <DateTimeRange
        label="From"
        className={styles.dateRange}
        startDate={selectedDayExposureStart}
        endDate={selectedDayExposureEnd}
        startDateProps={{
          timeFormat: false,
          className: styles.rangeDateOnly,
          maxDate: Moment(),
        }}
        endDateProps={{
          timeFormat: false,
          className: styles.rangeDateOnly,
          maxDate: Moment(),
        }}
        onChange={(day, type) => this.changeDayExposure(day, type)}
      />
    );
  }

  renderImageTagsSelect() {
    const { imageTags, newMessage } = this.state;
    return (
      <MultiSelect
        options={imageTags}
        selectedValues={newMessage.tags}
        isObject={true}
        displayValue="name"
        onSelect={(selectedOptions) => {
          this.setState((prevState) => ({
            newMessage: { ...prevState.newMessage, tags: selectedOptions },
          }));
        }}
        placeholder="Select one or several tags"
        selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
      />
    );
  }

  renderExposuresSelect() {
    const { observationIds, newMessage } = this.state;
    return (
      <MultiSelect
        options={observationIds}
        selectedValues={newMessage.obs_id}
        onSelect={(selectedOptions) => {
          this.setState((prevState) => ({
            newMessage: { ...prevState.newMessage, obs_id: selectedOptions },
          }));
        }}
        placeholder="Select one or several observations"
        selectedValueDecorator={(v) => (v.length > 10 ? `...${v.slice(-10)}` : v)}
      />
    );
  }

  renderModalFooter() {
    return (
      <div className={styles.modalFooter}>
        <Button
          className={styles.borderedButton}
          onClick={() => this.setState({ confirmationModalShown: false })}
          status="transparent"
        >
          Go back
        </Button>
        <Button onClick={() => this.deleteMessage()} status="default">
          Yes
        </Button>
      </div>
    );
  }

  renderRefreshLogsButton() {
    const { updatingExposures } = this.state;

    return (
      <Button
        className={styles.refreshDataBtn}
        title="Refresh exposures"
        disabled={updatingExposures}
        onClick={() => this.queryExposures()}
      >
        {updatingExposures ? (
          <SpinnerIcon className={styles.spinnerIcon} />
        ) : (
          <RefreshIcon title="Refresh exposures" className={styles.refreshIcon} />
        )}
      </Button>
    );
  }

  componentDidMount() {
    ManagerInterface.getListExposureInstruments().then((data) => {
      const registryMap = {};
      Object.entries(data).forEach(([key, value]) => {
        value.forEach((instrument) => {
          if (!instrument) return;
          registryMap[instrument] = key;
        });
      });
      const instrumentsArray = Object.values(data)
        .map((arr) => arr[0])
        .filter((instrument) => instrument);
      this.setState({
        instruments: instrumentsArray,
        selectedInstrument: instrumentsArray[0],
        registryMap: registryMap,
      });
    });
    ManagerInterface.getListImageTags().then((data) => {
      this.setState({
        imageTags: data.map((tag) => ({ name: tag.label, id: tag.key })),
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.selectedInstrument !== this.state.selectedInstrument ||
      (this.state.selectedDayExposureStart &&
        !Moment(this.state.selectedDayExposureStart).isSame(prevState.selectedDayExposureStart)) ||
      (this.state.selectedDayExposureEnd &&
        !Moment(this.state.selectedDayExposureEnd).isSame(prevState.selectedDayExposureEnd))
    ) {
      this.setState(
        {
          observationIds: [],
        },
        () => {
          this.queryExposures();
        },
      );
    }

    if (this.state.newMessage && this.state.newMessage.jira !== prevState.newMessage.jira) {
      const { jira, jira_issue_title, jira_issue_id } = this.state.newMessage;
      if (jira_issue_title === '' || jira_issue_id === '') {
        this.setState({ jiraIssueError: true });
      }

      if (!jira) {
        this.setState({
          jiraIssueError: false,
        });
      }
    }

    if (this.state.newMessage && this.state.newMessage.jira_issue_title !== prevState.newMessage.jira_issue_title) {
      const { jira_issue_title } = this.state.newMessage;
      if (jira_issue_title === '') {
        this.setState({ jiraIssueError: true });
      } else {
        this.setState({ jiraIssueError: false });
      }
    }

    if (this.state.newMessage && this.state.newMessage.jira_issue_id !== prevState.newMessage.jira_issue_id) {
      const { jira_issue_id } = this.state.newMessage;
      if (jira_issue_id === '') {
        this.setState({ jiraIssueError: true });
      } else {
        this.setState({ jiraIssueError: false });
      }
    }
  }

  render() {
    const { isLogCreate, isMenu, back, view } = this.props;
    const { confirmationModalShown, confirmationModalText, savingLog, jiraIssueError } = this.state;

    const filesUrls = getFilesURLs(this.state.newMessage.urls);

    return (
      <>
        {back && !isMenu && (
          <div className={styles.returnToLogs}>
            <Button
              status="link"
              onClick={() => {
                back();
              }}
            >
              <span className={styles.title}>{`< Return to Observations`}</span>
            </Button>
          </div>
        )}

        <form onSubmit={this.handleSubmit}>
          <div id={this.id} className={isMenu ? styles.detailContainerMenu : styles.detailContainer}>
            {isMenu ? (
              <div className={isMenu ? styles.headerMenu : styles.header}>
                <span className={[styles.label, styles.paddingTop].join(' ')}>Instruments</span>
                <span className={styles.value}>{this.renderInstrumentsSelect()}</span>

                <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. day</span>
                <span className={styles.value}>{this.renderDateTimeRangeSelect()}</span>

                <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. Id</span>
                <span className={[styles.value, styles.obsIdSelector].join(' ')}>
                  {this.renderExposuresSelect()}
                  {this.renderRefreshLogsButton()}
                </span>

                <span className={[styles.label, styles.paddingTop].join(' ')}>Tags</span>
                <span className={styles.value}>{this.renderImageTagsSelect()}</span>
              </div>
            ) : (
              <div className={[styles.header, !this.props.exposure.obs_id ? styles.inline : ''].join(' ')}>
                {this.props.exposure.obs_id ? (
                  <span>{this.props.exposure.obs_id}</span>
                ) : (
                  <>
                    <span className={[styles.label, styles.paddingTop].join(' ')}>Instruments</span>
                    <span className={styles.value}>{this.renderInstrumentsSelect()}</span>

                    {this.renderDateTimeRangeSelect()}

                    <span className={styles.label}>Obs. Id</span>
                    <span className={[styles.value, styles.obsIdSelector].join(' ')}>
                      {this.renderExposuresSelect()}
                      {this.renderRefreshLogsButton()}
                    </span>
                  </>
                )}

                {this.state.newMessage.id ? (
                  <>
                    <span className={styles.floatRight}>
                      <Button
                        className={styles.iconBtn}
                        title="Delete"
                        onClick={() => {
                          this.confirmDelete();
                        }}
                        status="transparent"
                      >
                        <DeleteIcon className={styles.icon} />
                      </Button>
                    </span>
                    <span className={styles.floatRight}>[{this.props.exposure.observation_type}]</span>
                  </>
                ) : (
                  this.props.exposure.observation_type && (
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
                      <span className={styles.floatRight}>[{this.props.exposure.observation_type}]</span>
                    </>
                  )
                )}
              </div>
            )}

            {!isMenu && (
              <div className={[styles.header, styles.inline].join(' ')}>
                <span className={[styles.label, styles.paddingTop].join(' ')}>Tags</span>
                <span className={styles.value} style={{ flex: 1 }}>
                  {this.renderImageTagsSelect()}
                </span>
              </div>
            )}

            <div className={isMenu ? styles.contentMenu : styles.content}>
              <div className={[styles.mb1, styles.floatLeft, styles.inline].join(' ')}>
                <span className={styles.title}>Message</span>
              </div>

              <TextArea
                value={this.state.newMessage.message_text}
                callback={(event) =>
                  this.setState((prevState) => ({ newMessage: { ...prevState.newMessage, message_text: event } }))
                }
              />
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
                    values={this.state.newMessage.file}
                    handleFiles={(files) =>
                      this.setState((prevState) => ({ newMessage: { ...prevState.newMessage, file: files } }))
                    }
                    handleDelete={(file) => {
                      const files = { ...this.state.newMessage.file };
                      delete files[file];
                      this.setState((prevState) => ({ newMessage: { ...prevState.newMessage, file: files } }));
                    }}
                    handleDeleteAll={() =>
                      this.setState((prevState) => ({ newMessage: { ...prevState.newMessage, file: undefined } }))
                    }
                  />
                </div>

                <div className={styles.flag}>
                  <span className={styles.label}>Exposure Flag</span>
                  <Select
                    value={this.state.newMessage.exposure_flag}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        newMessage: { ...prevState.newMessage, exposure_flag: event.value },
                      }))
                    }
                    options={EXPOSURE_FLAG_OPTIONS}
                    className={[styles.select, styles.capitalize].join(' ')}
                    small
                  />
                  <FlagIcon
                    title={this.state.newMessage.exposure_flag}
                    status={this.statusFlag(this.state.newMessage.exposure_flag)}
                    className={styles.iconFlag}
                  />
                </div>

                <div className={styles.jira}>
                  <span className={styles.label}>Jira ticket</span>
                  <span>
                    <Input
                      type="checkbox"
                      checked={this.state.newMessage.jira}
                      onChange={(event) => {
                        this.setState((prevState) => ({
                          newMessage: { ...prevState.newMessage, jira: event.target.checked },
                        }));
                      }}
                    />
                  </span>

                  {this.state.newMessage.jira && (
                    <>
                      <span>
                        <Toggle
                          labels={['New', 'Existent']}
                          toggled={!this.state.newMessage.jira_new}
                          onToggle={(event) => {
                            this.setState((prevState) => ({
                              newMessage: { ...prevState.newMessage, jira_new: !event },
                            }));
                          }}
                        />
                      </span>

                      {this.state.newMessage.jira_new ? (
                        <Input
                          placeholder="Jira ticket title"
                          onChange={(event) =>
                            this.setState((prevState) => ({
                              newMessage: { ...prevState.newMessage, jira_issue_title: event.target.value },
                            }))
                          }
                        />
                      ) : (
                        <Input
                          placeholder="Jira ticket id"
                          onChange={(event) =>
                            this.setState((prevState) => ({
                              newMessage: { ...prevState.newMessage, jira_issue_id: event.target.value },
                            }))
                          }
                        />
                      )}

                      {jiraIssueError && <div className={styles.inputError}>This field cannot be empty.</div>}
                    </>
                  )}
                </div>
              </div>

              <div className={isMenu ? styles.footerRightMenu : styles.footerRight}>
                <Button disabled={jiraIssueError} type="submit">
                  {savingLog ? (
                    <SpinnerIcon className={styles.spinnerIcon} />
                  ) : (
                    <span className={styles.title}>Upload Log</span>
                  )}
                </Button>
              </div>
            </div>

            <Modal
              displayTopBar={false}
              isOpen={!!confirmationModalShown}
              onRequestClose={() => this.setState({ confirmationModalShown: false })}
              parentSelector={() => document.querySelector(`#${this.id}`)}
              size={50}
            >
              <p style={{ textAlign: 'center' }}>{confirmationModalText}</p>
              {this.renderModalFooter()}
            </Modal>
          </div>
        </form>
      </>
    );
  }
}
