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

import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import Moment from 'moment';
import MultiSelect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import BulkSelect from 'components/GeneralPurpose/BulkSelect/BulkSelect';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import RefreshIcon from 'components/icons/RefreshIcon/RefreshIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import RichTextEditor from 'components/GeneralPurpose/RichTextEditor/RichTextEditor';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import MultiFileUploader from 'components/GeneralPurpose/MultiFileUploader/MultiFileUploader';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import { EXPOSURE_FLAG_OPTIONS, exposureFlagStateToStyle, ISO_INTEGER_DATE_FORMAT } from 'Config';
import ManagerInterface, {
  getFilesURLs,
  getLinkJira,
  htmlToJiraMarkdown,
  jiraMarkdownToHtml,
  openInNewTab,
  getFilename,
} from 'Utils';
import styles from './Exposure.module.css';

class ExposureAdd extends Component {
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
    newMessage: {
      obs_id: [],
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
      formHeight: null,
      showBulkSelector: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.multiselectImageTagsComponentRef = React.createRef();
    this.multiselectExposuresComponentRef = React.createRef();
    this.richTextEditorRef = React.createRef();
    this.formRef = React.createRef();
  }

  statusFlag(flag) {
    return exposureFlagStateToStyle[flag] ? exposureFlagStateToStyle[flag] : 'unknown';
  }

  /**
   * Reset the form by resetting the values of MultiSelect components and RichTextEditor component.
   * Also set the state of `newMessage` to the default value.
   */
  cleanForm() {
    // Reset MultiSelect components value
    this.cleanTagsMultiSelection();
    this.cleanExposuresMultiSelection();
    // Reset RichTextEditor component value
    this.richTextEditorRef.current?.cleanContent();
    this.setState({ newMessage: ExposureAdd.defaultProps.newMessage });
  }

  cleanTagsMultiSelection() {
    this.multiselectImageTagsComponentRef.current?.resetSelectedValues();
  }

  cleanExposuresMultiSelection() {
    this.multiselectExposuresComponentRef.current?.resetSelectedValues();
  }

  /**
   * Query the exposure tags and updates the component state with the retrieved data.
   */
  queryExposureTags() {
    ManagerInterface.getListImageTags().then((data) => {
      this.setState({
        imageTags: data.map((tag) => ({ name: tag.label, id: tag.key })),
      });
    });
  }

  /**
   * Query the exposure instruments and updates the component state with the retrieved data.
   */
  queryInstruments() {
    ManagerInterface.getListExposureInstruments().then((data) => {
      const registryMap = {};
      Object.entries(data).forEach(([key, value]) => {
        value.forEach((instrument) => {
          if (!instrument) return;
          registryMap[instrument] = key;
        });
      });

      const instrumentsArray = Object.keys(registryMap);

      this.setState({
        instruments: instrumentsArray,
        selectedInstrument: instrumentsArray[0],
        registryMap: registryMap,
      });
    });
  }

  /**
   * Query exposures based on selected instrument, start and end dates, and registry.
   * Update the component state with the retrieved data.
   */
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

  /**
   * Save the exposure log to the DB with the payload from the form.
   */
  saveMessage() {
    const { exposure, isLogCreate, isMenu } = this.props;
    const payload = { ...this.state.newMessage };
    payload['request_type'] = 'exposure';

    if (payload['tags']) {
      payload['tags'] = payload['tags'].map((tag) => tag.id);
    }

    // Transform &amp; back to '&'. This is a workaround due to Quill editor encoding '&'.}
    payload['message_text'] = payload['message_text'].replace(/&amp;/g, '&');

    this.setState({ savingLog: true });
    ManagerInterface.createMessageExposureLogs(payload).then((result) => {
      this.setState({ savingLog: false });
      if (isLogCreate || isMenu || !exposure.obs_id) {
        this.props.back();
      } else {
        this.props.view();
      }

      // Clean form only if the response is successful
      if (result) {
        this.cleanForm();
      }
    });
  }

  /**
   * Delete a message and updates the component state accordingly.
   */
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
    if (event) event.preventDefault();
    this.saveMessage();
  }

  isSubmitDisabled() {
    const { jiraIssueError, savingLog, newMessage, selectedInstrument } = this.state;
    return (
      jiraIssueError ||
      savingLog ||
      newMessage.obs_id.length === 0 ||
      !selectedInstrument ||
      !newMessage.message_text?.trim()
    );
  }

  setNewMessageObsId = (selectedOptions) => {
    this.setState((prevState) => ({
      newMessage: { ...prevState.newMessage, obs_id: selectedOptions },
    }));
  };

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

    const renderDateTimeInput = (props) => {
      return <input {...props} readOnly />;
    };

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
          renderInput: renderDateTimeInput,
        }}
        endDateProps={{
          timeFormat: false,
          className: styles.rangeDateOnly,
          maxDate: Moment(),
          renderInput: renderDateTimeInput,
        }}
        onChange={(day, type) => this.changeDayExposure(day, type)}
      />
    );
  }

  renderImageTagsSelect() {
    const { imageTags, newMessage } = this.state;

    const setNewMessageTags = (selectedOptions) => {
      this.setState((prevState) => ({
        newMessage: { ...prevState.newMessage, tags: selectedOptions },
      }));
    };

    return (
      <MultiSelect
        innerRef={this.multiselectImageTagsComponentRef}
        options={imageTags}
        selectedValues={newMessage.tags}
        isObject={true}
        displayValue="name"
        onSelect={setNewMessageTags}
        onRemove={setNewMessageTags}
        placeholder="Select zero or more tags"
        selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
      />
    );
  }

  renderExposuresSelect() {
    const { observationIds, newMessage, showBulkSelector } = this.state;

    const toggleBulkSelector = () => {
      this.setState((prevState) => ({
        showBulkSelector: !prevState.showBulkSelector,
      }));
    };

    return (
      <>
        <MultiSelect
          className={styles.exposuresMultiSelect}
          innerRef={this.multiselectExposuresComponentRef}
          options={observationIds}
          selectedValues={newMessage.obs_id}
          onSelect={this.setNewMessageObsId}
          onRemove={this.setNewMessageObsId}
          placeholder="Select one or several observations"
          selectedValueDecorator={(v) => (v.length > 10 ? `...${v.slice(-10)}` : v)}
          disable={showBulkSelector}
        />
        <Button size="extra-small" onClick={toggleBulkSelector}>
          {showBulkSelector ? 'Hide' : 'Show'} bulk selector
        </Button>
      </>
    );
  }

  renderJiraFields() {
    const { newMessage, jiraIssueError } = this.state;
    const logHasJira = getLinkJira(newMessage.urls) !== '';
    return (
      <>
        <div className={styles.jira}>
          {!logHasJira && (
            <>
              <div className={styles.checkboxText}>
                <Input
                  type="checkbox"
                  checked={newMessage?.jira}
                  onChange={(event) => {
                    this.setState((prevState) => ({
                      newMessage: { ...prevState.newMessage, jira: event.target.checked },
                    }));
                  }}
                />
                <span>link Jira ticket</span>
              </div>
              {newMessage?.jira && (
                <div className={styles.radioText}>
                  <div>
                    <input
                      type="radio"
                      name="jira"
                      value="new"
                      checked={newMessage?.jira_new}
                      onChange={() => {
                        this.setState((prevState) => ({
                          newMessage: { ...prevState.newMessage, jira_new: true },
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
                      checked={!newMessage?.jira_new}
                      onChange={() => {
                        this.setState((prevState) => ({
                          newMessage: { ...prevState.newMessage, jira_new: false },
                        }));
                      }}
                    />
                    <span>Existent</span>
                  </div>
                </div>
              )}
              {newMessage?.jira && (
                <div className={styles.textInput}>
                  {newMessage?.jira_new ? (
                    <Input
                      value={newMessage?.jira_issue_title}
                      className={jiraIssueError ? styles.inputError : ''}
                      placeholder="Jira ticket title"
                      onChange={(event) =>
                        this.setState((prevState) => ({
                          newMessage: { ...prevState.newMessage, jira_issue_title: event.target.value },
                        }))
                      }
                    />
                  ) : (
                    <Input
                      value={newMessage?.jira_issue_id}
                      className={jiraIssueError ? styles.inputError : ''}
                      placeholder="Jira ticket id"
                      onChange={(event) =>
                        this.setState((prevState) => ({
                          newMessage: { ...prevState.newMessage, jira_issue_id: event.target.value },
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
    // If exposure is not empty, then add a log
    // to a specific exposure selected from the Exposure (parent) component
    if (this.props.exposure) {
      this.setState((state) => ({
        newMessage: {
          ...state.newMessage,
          obs_id: [this.props.exposure.obs_id],
          instrument: this.props.exposure.instrument,
        },
      }));
    }

    this.queryInstruments();
    this.queryExposureTags();

    // Create resizeObserver to observe the form node
    // and update the formHeight state accordingly.
    // This will be used to set the height of the exposures
    // bulk selector component.
    const resizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        const form = entries[0];
        this.setState({ formHeight: form.contentRect.height });
      });
    });
    // The first children of the form node will be observed
    // as it controls the height of the form.
    resizeObserver.observe(this.formRef?.current?.children[0]);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.exposure) {
      // If exposure is empty, then set the newMessage.instrument
      // to the selectedInstrument in case it was changed
      if (this.state.selectedInstrument && prevState.selectedInstrument !== this.state.selectedInstrument) {
        this.setState((state) => ({
          observationIds: [],
          newMessage: { ...state.newMessage, instrument: this.state.selectedInstrument },
        }));
      }
    }

    // If the selected instrument, start or end date changes, then query the exposures
    if (
      (this.state.selectedInstrument && prevState.selectedInstrument !== this.state.selectedInstrument) ||
      this.state.selectedDayExposureStart !== prevState.selectedDayExposureStart ||
      this.state.selectedDayExposureEnd !== prevState.selectedDayExposureEnd
    ) {
      this.queryExposures();
    }

    if (this.state.newMessage) {
      const { jira, jira_new, jira_issue_title, jira_issue_id } = this.state.newMessage;
      // Check if the jira fields are filled correctly
      if (
        prevState.newMessage?.jira !== jira ||
        prevState.newMessage?.jira_new !== jira_new ||
        prevState.newMessage?.jira_issue_title !== jira_issue_title ||
        prevState.newMessage?.jira_issue_id !== jira_issue_id
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

  render() {
    const { isLogCreate, isMenu, back, view } = this.props;
    const {
      newMessage,
      confirmationModalShown,
      confirmationModalText,
      observationIds,
      savingLog,
      formHeight,
      showBulkSelector,
    } = this.state;
    const filesUrls = getFilesURLs(newMessage?.urls);
    const htmlMessage = jiraMarkdownToHtml(newMessage?.message_text);
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
        <div className={styles.formWrapper}>
          <div style={{ height: formHeight }} className={showBulkSelector ? styles.bulkSelectorShown : ''}>
            <BulkSelect
              options={observationIds}
              selectedOptions={newMessage.obs_id}
              onSelect={this.setNewMessageObsId}
            />
          </div>
          <form ref={this.formRef} onSubmit={this.handleSubmit}>
            <div id={this.id} className={isMenu ? styles.detailContainerMenu : styles.detailContainer}>
              {isMenu ? (
                <div className={styles.headerMenu}>
                  <span className={[styles.label, styles.paddingTop].join(' ')}>Instruments</span>
                  <span className={styles.value}>{this.renderInstrumentsSelect()}</span>

                  <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. day</span>
                  <span className={styles.value}>{this.renderDateTimeRangeSelect()}</span>

                  <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. Id</span>
                  <span className={[styles.value, styles.obsIdSelector].join(' ')}>
                    {this.renderRefreshLogsButton()}
                    {this.renderExposuresSelect()}
                  </span>

                  <span className={[styles.label, styles.paddingTop].join(' ')}>Tags</span>
                  <span className={styles.value}>{this.renderImageTagsSelect()}</span>
                </div>
              ) : (
                <div className={[styles.header, !this.props.exposure?.obs_id ? styles.inline : ''].join(' ')}>
                  {this.props.exposure?.obs_id ? (
                    <span>{this.props.exposure.obs_id}</span>
                  ) : (
                    <>
                      <span className={[styles.label, styles.paddingTop].join(' ')}>Instruments</span>
                      <span className={styles.value}>{this.renderInstrumentsSelect()}</span>

                      {this.renderDateTimeRangeSelect()}

                      <span className={styles.label}>Obs. Id</span>
                      <span className={styles.obsIdSelector}>
                        {this.renderRefreshLogsButton()}
                        {this.renderExposuresSelect()}
                      </span>
                    </>
                  )}

                  {newMessage?.id ? (
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
                      <span className={styles.floatRight}>[{this.props.exposure?.observation_type}]</span>
                    </>
                  ) : (
                    this.props.exposure?.observation_type && (
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
                <div className={styles.mb1}>
                  <span className={styles.title}>Message</span>
                </div>

                <RichTextEditor
                  ref={this.richTextEditorRef}
                  className={styles.textArea}
                  defaultValue={htmlMessage}
                  onChange={(value) => {
                    const parsedValue = htmlToJiraMarkdown(value);
                    this.setState((prevState) => ({
                      newMessage: { ...prevState.newMessage, message_text: parsedValue },
                    }));
                  }}
                  onKeyCombination={(combination) => {
                    if (combination === 'ctrl+enter') {
                      if (!this.isSubmitDisabled()) {
                        this.handleSubmit();
                      }
                    }
                  }}
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
                      values={newMessage?.file}
                      handleFiles={(files) =>
                        this.setState((prevState) => ({ newMessage: { ...prevState.newMessage, file: files } }))
                      }
                      handleDelete={(file) => {
                        const files = { ...newMessage?.file };
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
                      value={newMessage?.exposure_flag}
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
                      title={newMessage?.exposure_flag}
                      status={this.statusFlag(newMessage?.exposure_flag)}
                      className={styles.iconFlag}
                    />
                  </div>

                  {this.renderJiraFields()}
                </div>

                <div className={isMenu ? styles.footerRightMenu : styles.footerRight}>
                  <Button disabled={this.isSubmitDisabled()} type="submit">
                    {savingLog ? (
                      <SpinnerIcon className={styles.spinnerIcon} />
                    ) : (
                      <span className={styles.title}>Save</span>
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
        </div>
      </>
    );
  }
}

export default memo(ExposureAdd);
