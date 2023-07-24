import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import Moment from 'moment';
import Multiselect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import SpinnerIcon from 'components/icons/SpinnerIcon/SpinnerIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import FileUploader from 'components/GeneralPurpose/FileUploader/FileUploader';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import { EXPOSURE_FLAG_OPTIONS, exposureFlagStateToStyle, ISO_INTEGER_DATE_FORMAT } from 'Config';
import ManagerInterface from 'Utils';
import styles from './Exposure.module.css';

export default class ExposureAdd extends Component {
  static propTypes = {
    /** Log to edit object */
    logEdit: PropTypes.object,
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
    logEdit: {
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
    const logEdit = props.logEdit;
    const newMessage = ExposureAdd.defaultProps.newMessage;
    newMessage['obs_id'] = logEdit['obs_id'];
    newMessage['instrument'] = logEdit['instrument'];
    newMessage['day_obs'] = logEdit['day_obs'];
    this.state = {
      logEdit,
      newMessage,
      instruments: [],
      selectedInstrument: null,
      confirmationModalShown: false,
      confirmationModalText: '',
      imageTags: [],
      selectedTags: [],
      selectedDayExposureStart: Moment(Date.now() + 37 * 1000).subtract(1, 'days'),
      selectedDayExposureEnd: Moment(Date.now() + 37 * 1000),
      registryMap: {},
      updatingExposures: false,
      savingLog: false,
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
    const endObsDay = Moment(selectedDayExposureEnd).format(ISO_INTEGER_DATE_FORMAT);
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
    const { isLogCreate, isMenu } = this.props;
    const payload = { ...this.state.newMessage };
    payload['request_type'] = 'exposure';
    payload['instrument'] = this.state.selectedInstrument;
    if (payload['tags']) {
      payload['tags'] = payload['tags'].map((tag) => tag.id);
    }

    this.setState({ savingLog: true });
    ManagerInterface.createMessageExposureLogs(payload).then((result) => {
      if (isLogCreate || isMenu || !this.state.logEdit.obs_id) {
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
      this.setState((prevState) => ({
        newMessage: { ...prevState.newMessage, obs_id: [] },
      }));
      this.queryExposures();
    }
  }

  render() {
    const { isLogCreate, isMenu } = this.props;
    const {
      confirmationModalShown,
      confirmationModalText,
      selectedDayExposureStart,
      selectedDayExposureEnd,
      savingLog,
    } = this.state;
    const back = this.props.back;
    const view = this.props.view ?? ExposureAdd.defaultProps.view;

    return (
      <>
        {!isLogCreate && !isMenu ? (
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
        ) : (
          <></>
        )}
        <form onSubmit={this.handleSubmit}>
          <div id={this.id} className={isMenu ? styles.detailContainerMenu : styles.detailContainer}>
            {isMenu ? (
              <div className={isMenu ? styles.headerMenu : styles.header}>
                <span className={[styles.label, styles.paddingTop].join(' ')}>Instruments</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.selectedInstrument}
                    onChange={({ value }) => this.setState({ selectedInstrument: value })}
                    options={this.state.instruments}
                    className={styles.select}
                    small
                  />
                </span>

                <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. day</span>
                <span className={styles.value}>
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
                </span>

                <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. Id</span>
                <span className={styles.value}>
                  <Multiselect
                    options={this.state.observationIds}
                    selectedValues={this.state.newMessage?.obs_id}
                    onSelect={(selectedOptions) => {
                      this.setState((prevState) => ({
                        newMessage: { ...prevState.newMessage, obs_id: selectedOptions },
                      }));
                    }}
                    placeholder="Select one or several observations"
                    selectedValueDecorator={(v) => (v.length > 10 ? `...${v.slice(-10)}` : v)}
                  />
                </span>

                <span className={[styles.value, styles.paddingTop].join(' ')}>
                  <Button
                    className={styles.refreshDataBtn}
                    disabled={this.state.updatingExposures}
                    onClick={() => this.queryExposures()}
                  >
                    Refresh exposures
                    {this.state.updatingExposures && <SpinnerIcon className={styles.spinnerIcon} />}
                  </Button>
                </span>

                <span className={[styles.label, styles.paddingTop].join(' ')}>Tags</span>
                <span className={styles.value}>
                  <Multiselect
                    options={this.state.imageTags}
                    selectedValues={this.state.newMessage?.tags}
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
                </span>
              </div>
            ) : (
              <div className={[styles.header, !this.state.logEdit.obs_id ? styles.inline : ''].join(' ')}>
                {this.state.logEdit.obs_id ? (
                  <span>{this.state.logEdit.obs_id}</span>
                ) : (
                  <>
                    <span className={[styles.label, styles.paddingTop].join(' ')}>Instruments</span>
                    <span className={styles.value}>
                      <Select
                        value={this.state.selectedInstrument}
                        onChange={({ value }) => this.setState({ selectedInstrument: value })}
                        options={this.state.instruments}
                        className={styles.select}
                        small
                      />
                    </span>

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

                    <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. Id</span>
                    <span className={styles.value} style={{ flex: 1 }}>
                      <Multiselect
                        options={this.state.observationIds}
                        selectedValues={this.state.newMessage?.obs_id}
                        onSelect={(selectedOptions) => {
                          this.setState((prevState) => ({
                            newMessage: { ...prevState.newMessage, obs_id: selectedOptions },
                          }));
                        }}
                        placeholder="Select one or several observations"
                        selectedValueDecorator={(v) => (v.length > 10 ? `...${v.slice(-10)}` : v)}
                      />
                    </span>

                    <Button
                      className={styles.refreshDataBtn}
                      disabled={this.state.updatingExposures}
                      onClick={() => {
                        this.setState({ updatingExposures: true });
                        this.queryExposures(() => {
                          this.setState({ updatingExposures: false });
                        });
                      }}
                    >
                      Refresh exposures
                      {this.state.updatingExposures && <SpinnerIcon className={styles.spinnerIcon} />}
                    </Button>

                    <span className={[styles.label, styles.paddingTop].join(' ')}>Tags</span>
                    <span className={styles.value} style={{ flex: 1 }}>
                      <Multiselect
                        options={this.state.imageTags}
                        selectedValues={this.state.newMessage?.tags}
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
                    <span className={styles.floatRight}>[{this.state.logEdit.observation_type}]</span>
                  </>
                ) : this.state.logEdit.observation_type ? (
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
                    <span className={styles.floatRight}>[{this.state.logEdit.observation_type}]</span>
                  </>
                ) : (
                  <></>
                )}
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
              <FileUploader
                value={this.state.newMessage.file?.name}
                handleFile={(file) =>
                  this.setState((prevState) => ({ newMessage: { ...prevState.newMessage, file: file } }))
                }
                handleDelete={() =>
                  this.setState((prevState) => ({ newMessage: { ...prevState.newMessage, file: undefined } }))
                }
              />

              <span className={[styles.label, styles.paddingTop].join(' ')}>Exposure Flag</span>

              <span className={[styles.value, styles.inline, !isMenu ? styles.w20 : ' '].join(' ')}>
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
                <span className={styles.margin3}>
                  <FlagIcon
                    title={this.state.newMessage.exposure_flag}
                    status={this.statusFlag(this.state.newMessage.exposure_flag)}
                    className={styles.iconFlag}
                  />
                </span>
              </span>

              <span className={isMenu ? styles.footerRightMenu : styles.footerRight}>
                <span className={styles.checkboxText}>
                  <span>link Jira ticket</span>
                  <Input
                    type="checkbox"
                    checked={this.state.newMessage.jira}
                    onChange={(event) => {
                      this.setState((prevState) => ({
                        newMessage: { ...prevState.newMessage, jira: event.target.checked },
                      }));
                    }}
                  />
                  {this.state.newMessage.jira && (
                    <>
                      <Toggle
                        labels={['New', 'Existent']}
                        isLive={this.state.newMessage.jira_comment}
                        setLiveMode={(event) =>
                          this.setState((prevState) => ({
                            newMessage: { ...prevState.newMessage, jira_comment: event },
                          }))
                        }
                      />
                      {this.state.newMessage.jira_comment && (
                        <input
                          className={styles.issueIdInput}
                          placeholder="Jira ticket id"
                          onChange={(event) =>
                            this.setState((prevState) => ({
                              newMessage: { ...prevState.newMessage, issue_id: event.target.value },
                            }))
                          }
                        />
                      )}
                    </>
                  )}
                </span>

                <Button type="submit">
                  {savingLog ? (
                    <SpinnerIcon className={styles.spinnerIcon} />
                  ) : (
                    <span className={styles.title}>Upload Log</span>
                  )}
                </Button>
              </span>
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
