import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Multiselect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import { EXPOSURE_FLAG_OPTIONS, LOG_TYPE_OPTIONS } from 'Config';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import FileUploader from 'components/GeneralPurpose/FileUploader/FileUploader';
import ManagerInterface from 'Utils';
import lodash from 'lodash';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import { exposureFlagStateToStyle } from 'Config';
import styles from './Exposure.module.css';

export default class ExposureAdd extends Component {
  static propTypes = {
    back: PropTypes.func,
    logEdit: PropTypes.object,
    newMessage: PropTypes.object,
    isLogCreate: PropTypes.bool,
    isMenu: PropTypes.bool,
    observationIds: PropTypes.arrayOf(PropTypes.string),
    view: PropTypes.func,
  };

  static defaultProps = {
    back: () => {},
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
      is_new: true,
      exposure_flag: 'none',
      jira: false,
    },
    isLogCreate: false,
    isMenu: false,
    observationIds: [],
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
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  statusFlag(flag) {
    return exposureFlagStateToStyle[flag] ? exposureFlagStateToStyle[flag] : 'unknown';
  }

  componentDidMount() {
    // TODO: only when the filter is shown
    ManagerInterface.getListExposureInstruments().then((data) => {
      const instrumentsArray = Object.values(data).map((arr) => arr[0]);
      this.setState({
        instruments: instrumentsArray,
        selectedInstrument: instrumentsArray[0],
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: only when the filter is shown
    if (prevState.selectedInstrument !== this.state.selectedInstrument) {
      ManagerInterface.getListExposureLogs(this.state.selectedInstrument).then((data) => {
        const observationIds = data.map((exposure) => exposure.obs_id);
        const dayObs = data.map((exposure) => ({
          obs_id: exposure.obs_id,
          day_obs: exposure.day_obs,
        }));
        this.setState({
          observationIds,
          dayObs,
          /* newMessage: { ...prevState.newMessage, obs_id: undefined }, */
        });
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.confirmSave();
  }

  saveMessage() {
    const { isLogCreate, isMenu } = this.props;
    const payload = { ...this.state.newMessage };
    payload['request_type'] = 'exposure';
    payload['instrument'] = this.state.selectedInstrument;
    payload['user_id'] = 'saranda@localhost';
    payload['user_agent'] = 'LOVE';

    ManagerInterface.createMessageExposureLogs(payload).then((result) => {
      console.log('result createMessage', result);
      console.log('isLogCreate', isLogCreate, 'isMenu', isMenu, 'this.state.logEdit.obs_id', this.state.logEdit.obs_id);
      this.setState({ confirmationModalShown: false });
      if (isLogCreate || isMenu || !this.state.logEdit.obs_id) {
        this.props.back();
      } else {
        this.props.view();
      }
    });
  }

  deleteMessage() {
    if (this.state.newMessage.id) {
      ManagerInterface.deleteMessageExposureLogs(this.state.newMessage.id).then((response) => {
        console.log('response', response);
        this.setState({ confirmationModalShown: false });
      });
    } else {
      this.props.back();
    }
  }

  confirmSave() {
    const modalText = (
      <span>
        You are about to <b>Save</b> this message of Exposure Logs
        <br/>
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
        <Button onClick={() => this.saveMessage() } status="default">
          Yes
        </Button>
      </div>
    );
  };

  render() {
    const { isLogCreate, isMenu } = this.props;
    const back = this.props.back;
    const view = this.props.view ?? ExposureAdd.defaultProps.view;

    const { confirmationModalShown, confirmationModalText } = this.state;

    const selectedCommentType = this.state.newMessage?.level
      ? LOG_TYPE_OPTIONS.find((type) => type.value === this.state.newMessage.level)
      : null;

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

                {/* <span className={styles.label}>Type of Comment</span>
                <span className={styles.value}>
                  <Select
                    option={selectedCommentType}
                    onChange={({ value }) =>
                      this.setState((prevState) => ({
                        newMessage: { ...prevState.newMessage, level: value },
                      }))
                    }
                    options={LOG_TYPE_OPTIONS}
                    className={styles.select}
                    small
                  />
                </span> */}

                <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. Id</span>
                <span className={styles.value}>
                  <Multiselect
                    options={this.state.observationIds}
                    onSelect={(selectedOptions) => {
                      this.setState((prevState) => ({
                        newMessage: { ...prevState.newMessage, obs_id: selectedOptions[0] },
                      }));
                    }}
                    placeholder="Select one or several observations"
                    selectedValueDecorator={(v) => (v.length > 10 ? `...${v.slice(-10)}` : v)}
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

                    {/* <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. Id</span>
                    <span className={styles.value}>
                      <Select
                        value={this.state.newMessage.obs_id}
                        onChange={(event) =>
                          this.setState((prevState) => ({
                            newMessage: { ...prevState.newMessage, obs_id: event.value },
                          }))
                        }
                        options={this.state.observationIds}
                        className={styles.select}
                        small
                      />
                    </span> */}

                    {/* <span className={styles.label}>Type of Comment</span>
                    <span className={styles.value}>
                      <Select
                        option={selectedCommentType}
                        onChange={({ value }) =>
                          this.setState((prevState) => ({
                            newMessage: { ...prevState.newMessage, level: value },
                          }))
                        }
                        options={LOG_TYPE_OPTIONS}
                        className={styles.select}
                        small
                      />
                    </span> */}

                    <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. Id</span>
                    <span className={styles.value} style={{ flex: 1 }}>
                      <Multiselect
                        options={this.state.observationIds}
                        onSelect={(selectedOptions) => {
                          this.setState((prevState) => ({
                            newMessage: { ...prevState.newMessage, obs_id: selectedOptions[0] },
                          }));
                        }}
                        placeholder="Select one or several observations"
                        selectedValueDecorator={(v) => (v.length > 10 ? `...${v.slice(-10)}` : v)}
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
                          console.log('click delete');
                          this.deleteMessage();
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

              <span className={[styles.label, styles.paddingTop].join(' ')}>
                Exposure Flag
              </span>

              <span className={[styles.value, styles.inline, !isMenu ? styles.w20 : ' '].join(' ')}>
                <Select
                  value={this.state.newMessage.exposure_flag}
                  onChange={(event) =>
                    this.setState((prevState) => ({ newMessage: { ...prevState.newMessage, exposure_flag: event.value } }))
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
                  Create and link new Jira ticket
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

                <Button type="submit">
                  <span className={styles.title}>Upload Log</span>
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
              {confirmationModalText}
              {this.renderModalFooter()}
            </Modal>
          </div>
        </form>
      </>
    );
  }
}
