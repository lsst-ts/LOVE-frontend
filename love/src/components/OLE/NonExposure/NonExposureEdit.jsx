import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import Moment from 'moment';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import FileUploader from 'components/GeneralPurpose/FileUploader/FileUploader';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import { CSCSummaryHierarchy, defaultCSCList, LOG_TYPE_OPTIONS } from 'Config';
import ManagerInterface from 'Utils';
import { getLinkJira, getFileURL, getFilename } from 'Utils';
import { iconLevelOLE } from 'Config';
import Modal from 'components/GeneralPurpose/Modal/Modal';
import Multiselect from 'components/GeneralPurpose/MultiSelect/MultiSelect';
import styles from './NonExposure.module.css';

export default class NonExposureEdit extends Component {
  static propTypes = {
    back: PropTypes.func,
    logEdit: PropTypes.object,
    isLogCreate: PropTypes.bool,
    isMenu: PropTypes.bool,
    save: PropTypes.func,
    tagsIds: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    back: () => {},
    logEdit: {
      id: undefined,
      level: undefined,
      isUrgent: undefined,
      date_begin: undefined,
      date_end: undefined,
      systems: [],
      subsystems: [],
      cscs: [],
      salindex: 0,
      user: undefined,
      time_lost: 0,
      jira: false,
      file: undefined,
      fileurl: undefined,
      filename: undefined,
      urls: [],
      tags: [],
      message_text: '',
      is_human: true,
    },
    isLogCreate: false,
    isMenu: false,
    view: () => {},
    save: () => {},
    tagsIds: [],
  };

  constructor(props) {
    super(props);
    this.id = lodash.uniqueId('nonexposure-edit-');
    const logEdit = props.logEdit ?? NonExposureEdit.defaultProps.logEdit;

    logEdit.jiraurl = getLinkJira(logEdit.urls);
    logEdit.fileurl = getFileURL(logEdit.urls);
    logEdit.filename = getFilename(getFileURL(logEdit.urls));

    // Clean null and empty values to avoid API errors
    Object.keys(logEdit).forEach((key) => {
      if (logEdit[key] === null || (Array.isArray(logEdit[key]) && logEdit[key].length === 0)) {
        delete logEdit[key];
      }
    });

    this.state = {
      logEdit,
      confirmationModalShown: false,
      confirmationModalText: '',
      imageTags: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getIconLevel(level) {
    const icon = iconLevelOLE[level] ? iconLevelOLE[level] : undefined;
    return icon;
  }

  cleanForm() {
    this.setState({ logEdit: NonExposureEdit.defaultProps.logEdit });
  }

  handleSubmit(event) {
    event.preventDefault();

    const modalText = (
      <span>
        You are about to <b>save</b> changes in this message of Narrative Logs
        <br />
        Are you sure ?
      </span>
    );

    this.setState({
      confirmationModalShown: true,
      confirmationModalText: modalText,
    });
  }

  renderModalFooter = () => {
    return (
      <div className={styles.modalFooter}>
        <Button
          className={styles.borderedButton}
          onClick={() => this.setState({ confirmationModalShown: false })}
          status="transparent"
        >
          Go back
        </Button>
        <Button onClick={() => this.updateOrCreateMessageNarrativeLogs()} status="default">
          Yes
        </Button>
      </div>
    );
  };

  updateOrCreateMessageNarrativeLogs() {
    const payload = { ...this.state.logEdit };
    payload['request_type'] = 'narrative';
    // payload['level_label'] = LOG_TYPE_OPTIONS.find((type) => type.value === payload['level']).label;
    payload['level'] = payload.isUrgent ? 100 : 0;

    // if ('tags' in payload) {
    //   payload['tags'] = payload['tags'].map((tag) => tag.id);
    // }

    const beginDateISO = this.state.logEdit.date_begin?.toISOString();
    const endDateISO = this.state.logEdit.date_end?.toISOString();
    payload['date_begin'] = beginDateISO.substring(0, beginDateISO.length - 1); // remove Zone due to backend standard
    payload['date_end'] = endDateISO.substring(0, endDateISO.length - 1); // remove Zone due to backend standard

    if (this.state.logEdit.id) {
      ManagerInterface.updateMessageNarrativeLogs(this.state.logEdit.id, payload).then((response) => {
        this.setState({ confirmationModalShown: false });
        this.props.save(response);
      });
    } else {
      ManagerInterface.createMessageNarrativeLogs(payload).then((response) => {
        this.setState({
          confirmationModalShown: false,
        });
        this.props.save(response);
        this.cleanForm();
        this.props.back();
      });
    }
  }

  handleTimeOfIncident(date, type) {
    if (type === 'start') {
      this.setState((state) => ({
        logEdit: { ...state.logEdit, date_begin: date },
      }));
    } else if (type === 'end') {
      this.setState((state) => ({
        logEdit: { ...state.logEdit, date_end: date },
      }));
    }
  }

  componentDidMount() {
    ManagerInterface.getListImageTags().then((data) => {
      this.setState({
        imageTags: data.map((tag) => ({ name: tag.label, id: tag.key })),
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.logEdit?.date_begin !== this.state.logEdit?.date_begin ||
      prevState.logEdit?.date_end !== this.state.logEdit?.date_end
    ) {
      const start = Moment(this.state.logEdit.date_begin);
      const end = Moment(this.state.logEdit.date_end);
      const duration_hr = end.diff(start, 'hours', true);
      this.setState((state) => ({
        logEdit: { ...state.logEdit, time_lost: duration_hr.toFixed(2) },
      }));
    }
  }

  render() {
    const { back, isLogCreate, isMenu } = this.props;
    const { confirmationModalShown, confirmationModalText } = this.state;

    const view = this.props.view ?? NonExposureEdit.defaultProps.view;
    const systemOptions = Object.keys(CSCSummaryHierarchy);
    const subsystemOptions = Object.keys(CSCSummaryHierarchy);
    // const cscsOptions = this.state.logEdit?.subsystem
    //   ? Array.from(
    //       new Set(
    //         Object.values(CSCSummaryHierarchy[this.state.logEdit.subsystem] ?? {})
    //           .flat()
    //           .map((e) => e.name),
    //       ),
    //     ).sort()
    //   : [];
    const cscOptions = defaultCSCList.map((csc) => `${csc.name}:${csc.salindex}`);
    // const selectedCommentType = this.state.logEdit?.level
    //   ? LOG_TYPE_OPTIONS.find((type) => type.value === this.state.logEdit.level)
    //   : null;
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
              <span className={styles.title}>{`< Return to Logs`}</span>
            </Button>
          </div>
        ) : (
          <></>
        )}
        <form onSubmit={this.handleSubmit}>
          <div className={isMenu ? styles.detailContainerMenu : styles.detailContainer}>
            {isMenu ? (
              <></>
            ) : (
              <div className={styles.header}>
                {this.state.logEdit.id ? <span className={styles.bold}>#{this.state.logEdit.id}</span> : <></>}
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
                  {/* <Select
                    option={selectedCommentType}
                    onChange={({ value }) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, level: value },
                      }))
                    }
                    options={LOG_TYPE_OPTIONS}
                    className={styles.select}
                    small
                  />
                  <span className={styles.levelIcon}>
                    {selectedCommentType && selectedCommentType.label ? (
                      this.getIconLevel(selectedCommentType.label)
                    ) : (
                      <></>
                    )}
                  </span>*/}
                  <span>Yes</span>
                  <div style={{ display: 'inline-block' }}>
                    <Toggle
                      hideLabels={true}
                      isLive={this.state.logEdit.isUrgent}
                      setLiveMode={(event) =>
                        this.setState((prevState) => ({
                          logEdit: { ...prevState.logEdit, isUrgent: event },
                        }))
                      }
                    />
                  </div>
                  <span>No</span>
                </span>
                <span className={styles.label}>Systems</span>
                <span className={styles.value}>
                  <Multiselect
                    className={styles.select}
                    options={systemOptions}
                    selectedValues={this.state.logEdit.systems}
                    onSelect={(selectedOptions) => {
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, systems: selectedOptions },
                      }));
                    }}
                    placeholder="Select zero or several Systems"
                    selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
                  />
                </span>
                <span className={styles.label}>Subsystems</span>
                <span className={styles.value}>
                  <Multiselect
                    className={styles.select}
                    options={subsystemOptions}
                    selectedValues={this.state.logEdit.subsystems}
                    onSelect={(selectedOptions) => {
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, subsystems: selectedOptions },
                      }));
                    }}
                    placeholder="Select zero or several Subsystems"
                    selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
                  />
                </span>
                <span className={styles.label}>CSCs</span>
                <span className={[styles.value /* styles.cscValue */].join(' ')}>
                  <Multiselect
                    className={styles.select}
                    options={cscOptions}
                    selectedValues={this.state.logEdit.cscs}
                    onSelect={(selectedOptions) => {
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, cscs: selectedOptions },
                      }));
                    }}
                    placeholder="Select zero or several CSCs"
                  />
                </span>

                {/* <span className={[styles.label, styles.paddingTop].join(' ')}>Tags</span>
                <span className={styles.value}>
                  <Multiselect
                    options={this.state.imageTags}
                    selectedValues={this.state.logEdit.tags}
                    isObject={true}
                    displayValue="name"
                    onSelect={(selectedOptions) => {
                      this.setState((prevState) => ({
                        logEdit: {
                          ...prevState.logEdit,
                          tags: selectedOptions,
                        },
                      }));
                    }}
                    placeholder="Select zero or several tags"
                    selectedValueDecorator={(v) => (v.length > 10 ? `${v.slice(0, 10)}...` : v)}
                  />
                </span> */}

                {isMenu ? (
                  <>
                    <span className={styles.label}>Time of Incident</span>
                    <span className={styles.value}>
                      <DateTimeRange
                        className={styles.dateTimeRangeStyle}
                        onChange={(date, type) => this.handleTimeOfIncident(date, type)}
                        startDate={
                          this.state.logEdit.date_begin
                            ? new Date(this.state.logEdit.date_begin + 'Z')
                            : new Date(new Date() - 24 * 60 * 60 * 1000)
                        }
                        endDate={this.state.logEdit.date_end ? new Date(this.state.logEdit.date_end + 'Z') : new Date()}
                      />
                    </span>
                    <span className={styles.label}>Obs. Time Loss [hours]</span>
                    <span className={styles.value}>
                      <Input
                        type="number"
                        min={0.01}
                        step={0.01}
                        value={this.state.logEdit.time_lost}
                        className={styles.input}
                        onChange={(event) =>
                          this.setState((prevState) => ({
                            logEdit: { ...prevState.logEdit, time_lost: event.target.value },
                          }))
                        }
                      />
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className={styles.contentRight}>
                <div className={[styles.mb1, styles.floatLeft, styles.inline].join(' ')}>
                  <span className={styles.title}>Message</span>
                  {isMenu ? (
                    <></>
                  ) : (
                    <>
                      <span className={styles.label}>Time of Incident</span>
                      <span className={styles.value}>
                        <DateTimeRange
                          className={styles.dateTimeRangeStyle}
                          onChange={(date, type) => this.handleTimeOfIncident(date, type)}
                          startDate={
                            this.state.logEdit.date_begin
                              ? new Date(this.state.logEdit.date_begin + 'Z')
                              : new Date(new Date() - 24 * 60 * 60 * 1000)
                          }
                          endDate={
                            this.state.logEdit.date_end ? new Date(this.state.logEdit.date_end + 'Z') : new Date()
                          }
                        />
                      </span>
                      <span className={styles.label}>Obs. Time Loss [hours]</span>
                      <span className={styles.value}>
                        <Input
                          type="number"
                          min={0.01}
                          step={0.01}
                          value={this.state.logEdit.time_lost}
                          className={styles.input}
                          onChange={(event) =>
                            this.setState((prevState) => ({
                              logEdit: { ...prevState.logEdit, time_lost: event.target.value },
                            }))
                          }
                        />
                      </span>
                    </>
                  )}
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
              {!this.state.logEdit.id ? (
                <FileUploader
                  value={this.state.logEdit.file?.name}
                  handleFile={(file) =>
                    this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: file } }))
                  }
                  handleDelete={() =>
                    this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: undefined } }))
                  }
                />
              ) : (
                <></>
              )}
              {this.state.logEdit.fileurl ? (
                <>
                  <Button
                    status="link"
                    title={this.state.logEdit.fileurl}
                    onClick={() => openInNewTab(this.state.logEdit.fileurl)}
                  >
                    {this.state.logEdit.filename}
                  </Button>
                  <Button
                    className={styles.iconBtn}
                    title={this.state.logEdit.fileurl}
                    onClick={() => openInNewTab(this.state.logEdit.fileurl)}
                    status="transparent"
                  >
                    <DownloadIcon className={styles.icon} />
                  </Button>
                </>
              ) : (
                <></>
              )}
              <span className={isMenu ? styles.footerRightMenu : styles.footerRight}>
                {!this.state.logEdit.id ? (
                  <span className={styles.checkboxText}>
                    Create and link new Jira ticket
                    <Input
                      type="checkbox"
                      checked={this.state.logEdit.jira}
                      onChange={(event) => {
                        this.setState((prevState) => ({
                          logEdit: { ...prevState.logEdit, jira: event.target.checked },
                        }));
                      }}
                    />
                  </span>
                ) : this.state.logEdit.jiraurl ? (
                  <span className={styles.checkboxText}>
                    <Button
                      status="link"
                      title={this.state.logEdit.jiraurl}
                      onClick={() => openInNewTab(this.state.logEdit.jiraurl)}
                    >
                      view Jira ticket
                    </Button>
                  </span>
                ) : (
                  <></>
                )}
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
