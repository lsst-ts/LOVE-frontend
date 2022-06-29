import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EXPOSURE_FLAG_OPTIONS } from 'Config';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import FileUploader from 'components/GeneralPurpose/FileUploader/FileUploader';
import ManagerInterface from 'Utils';
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
      day_obs: undefined,
      seq_num: undefined,
      group_name: undefined,
      target_name: undefined,
      science_program: undefined,
      tracking_ra: undefined,
      tracking_dec: undefined,
      sky_angle: undefined,
      timespan_begin: undefined,
      timespan_end: undefined,
    },
    newMessage: {
      obs_id: undefined,
      instrument: undefined,
      message_text: undefined,
      level: 10,
      // tags: [],
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
    const logEdit = props.logEdit;
    console.log(logEdit);
    const newMessage = ExposureAdd.defaultProps.newMessage;
    newMessage['obs_id'] = logEdit['obs_id'];
    newMessage['instrument'] = logEdit['instrument'];
    newMessage['day_obs'] = logEdit['day_obs'];
    this.state = {
      logEdit,
      newMessage,
      instruments: [],
      selectedInstrument: undefined,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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
          newMessage: { ...prevState.newMessage, obs_id: undefined },
        });
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    // TODO: Some parameters are not being sent, check
    console.log('Submitted: ');

    const fakeNewMessage = { ...this.state.newMessage };
    fakeNewMessage['instrument'] = this.state.selectedInstrument;
    fakeNewMessage['day_obs'] = this.state.dayObs.find(
      (duple) => duple.obs_id === this.state.newMessage.obs_id,
    )?.day_obs;
    fakeNewMessage['user_id'] = 'saranda@localhost';
    fakeNewMessage['user_agent'] = 'LOVE';
    delete fakeNewMessage.file;

    console.log('fakeNewMessage:', fakeNewMessage);
    ManagerInterface.createMessageExposureLogs(fakeNewMessage).then((result) => {
      console.log('result', result);
      console.log('this.props.back()');
      this.props.back();
    });
  }

  deleteMessage() {
    console.log('deleteMessage id:', this.state.newMessage.id);
    if (this.state.newMessage.id) {
      ManagerInterface.deleteMessageExposureLogs(this.state.newMessage.id).then((response) => {
        console.log('response', response);
      });
    } else {
      this.props.back();
    }
  }

  render() {
    const link = this.props.back;
    const isLogCreate = this.props.isLogCreate;
    const isMenu = this.props.isMenu;
    const view = this.props.view ? this.props.view : ExposureAdd.defaultProps.view;

    return (
      <>
        {!isLogCreate && !isMenu ? (
          <div className={styles.returnToLogs}>
            <Button
              status="link"
              onClick={() => {
                link();
              }}
            >
              <span className={styles.title}>{`< Return to Observations`}</span>
            </Button>
          </div>
        ) : (
          <></>
        )}
        <form onSubmit={this.handleSubmit}>
          <div className={isMenu ? styles.detailContainerMenu : styles.detailContainer}>
            {isMenu ? (
              <div className={isMenu ? styles.headerMenu : styles.header}>
                <span className={[styles.label, styles.paddingTop].join(' ')}>Instruments</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.selectedInstrument}
                    onChange={(event) => this.setState({ selectedInstrument: event.value })}
                    options={this.state.instruments}
                    className={styles.select}
                    small
                  />
                </span>

                <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. Id</span>
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
                        onChange={(event) => this.setState({ selectedInstrument: event.value })}
                        options={this.state.instruments}
                        className={styles.select}
                        small
                      />
                    </span>

                    <span className={[styles.label, styles.paddingTop].join(' ')}>Obs. Id</span>
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
                    <span className={styles.floatRight}>
                      [{this.state.logEdit.observation_type}]
                    </span>
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
                    <span className={styles.floatRight}>
                      [{this.state.logEdit.observation_type}]
                    </span>
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
              <span className={[styles.value, !isMenu ? styles.w20 : ''].join(' ')}>
                <Select
                  value={this.state.newMessage.exposure_flag}
                  onChange={(event) =>
                    this.setState((prevState) => ({
                      newMessage: { ...prevState.newMessage, exposure_flag: event.value },
                    }))
                  }
                  options={EXPOSURE_FLAG_OPTIONS}
                  className={styles.select}
                  small
                />
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
          </div>
        </form>
      </>
    );
  }
}
