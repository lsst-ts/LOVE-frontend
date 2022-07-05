import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import FileUploader from 'components/GeneralPurpose/FileUploader/FileUploader';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import { CSCSummaryHierarchy, LOG_TYPE_OPTIONS } from 'Config';
import ManagerInterface from 'Utils';
import { getLinkJira, getFileURL, getFilename } from 'Utils';
import { getOLEDataFromTags } from 'Utils';
import styles from './NonExposure.module.css';

export default class NonExposureEdit extends Component {
  static propTypes = {
    back: PropTypes.func,
    logEdit: PropTypes.object,
    isLogCreate: PropTypes.bool,
    isMenu: PropTypes.bool,
  };

  static defaultProps = {
    back: () => {},
    logEdit: {
      id: undefined,
      level: undefined,
      timeIncident: undefined,
      subsystem: undefined,
      csc: undefined,
      topic: undefined,
      parameter: undefined,
      salindex: 0,
      user: undefined,
      time_lost: 0,
      jira: false,
      file: undefined,
      fileurl: undefined,
      filename: undefined,
      urls: [],
      tags: [],
      message_text: undefined,
      is_human: true,
    },
    isLogCreate: false,
    isMenu: false,
    view: () => {},
  };

  constructor(props) {
    super(props);
    const logEdit = props.logEdit ?? NonExposureEdit.defaultProps.logEdit;

    logEdit.jiraurl = getLinkJira(logEdit.urls);
    logEdit.fileurl = getFileURL(logEdit.urls);
    logEdit.filename = getFilename(getFileURL(logEdit.urls));

    const params = getOLEDataFromTags(logEdit.tags);
    logEdit.csc = params.csc;
    logEdit.topic = params.topic;
    logEdit.parameter = params.parameter;

    // Clean null and empty values to avoid API errors
    Object.keys(logEdit).forEach((key) => {
      if (logEdit[key] === null || (Array.isArray(logEdit[key]) && logEdit[key].length === 0)) {
        delete logEdit[key];
      }
    });

    this.state = {
      logEdit,
      optionsTree: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    const payload = { ...this.state.logEdit };
    payload['request_type'] = 'narrative';
    // payload['tags'] = [this.state.logEdit.csc, this.state.logEdit.topic, this.state.logEdit.param];
    payload['tags'] = [this.state.logEdit.csc, this.state.logEdit.topic, this.state.logEdit.parameter].filter((tag) => tag);

    // TODO: add following fields to backend
    payload['user_id'] = 'saranda@localhost';
    payload['user_agent'] = 'LOVE';

    if (this.state.logEdit.id) {
      ManagerInterface.updateMessageNarrativeLogs(this.state.logEdit.id, payload).then((response) => {
        // TODO: add new updated log to state
        this.props.back();
      });
    } else {
      ManagerInterface.createMessageNarrativeLogs(payload).then((response) => {
        // TODO: add new created log to state
        this.setState({ logEdit: { time_lost: 0, salindex: 0 } });
        this.props.back();
      });
    }
  }

  handleTimeOfIncident(date, type) {
    if (type === 'start') {
      this.setState((state) => ({
        logEdit: { ...state.logEdit, begin_date: date },
      }));
    } else if (type === 'end') {
      this.setState((state) => ({
        logEdit: { ...state.logEdit, end_date: date },
      }));
    }
  }

  componentDidMount() {
    ManagerInterface.getTopicData('event-telemetry').then((data) => {
      this.setState({ optionsTree: data });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (prevState.logEdit?.subsystem || this.state.logEdit?.subsystem) &&
      prevState.logEdit.subsystem !== this.state.logEdit.subsystem
    ) {
      this.setState((state) => ({
        logEdit: { ...state.logEdit, csc: null, salindex: 0, topic: null, parameter: null },
        topicOptions: [],
        paramsOptions: [],
      }));
    }

    if ((prevState.logEdit?.csc || this.state.logEdit?.csc) && prevState.logEdit.csc !== this.state.logEdit.csc) {
      if (!this.state.logEdit?.csc) return;
      const options = [
        ...Object.keys(this.state.optionsTree[this.state.logEdit.csc].telemetry_data),
        ...Object.keys(this.state.optionsTree[this.state.logEdit.csc].event_data),
      ].sort();
      this.setState((state) => ({
        topicOptions: options,
        logEdit: { ...state.logEdit, salindex: 0, topic: null, parameter: null },
      }));
    }

    if (
      (prevState.logEdit?.topic || this.state.logEdit?.topic) &&
      prevState.logEdit.topic !== this.state.logEdit.topic
    ) {
      if (!this.state.logEdit.csc || !this.state.logEdit?.topic) return;
      const topicData = [
        ...Object.entries(this.state.optionsTree[this.state.logEdit.csc].telemetry_data),
        ...Object.entries(this.state.optionsTree[this.state.logEdit.csc].event_data),
      ];
      const topicParams = topicData.find(([topic]) => {
        return topic === this.state.logEdit.topic;
      });
      const options = Object.keys(topicParams[1]).sort();
      this.setState((state) => ({
        paramsOptions: options,
        logEdit: { ...state.logEdit, parameter: null },
      }));
    }
  }

  render() {
    const { link, isLogCreate, isMenu } = this.props;
    const view = this.props.view ?? NonExposureEdit.defaultProps.view;

    const subsystemOptions = Object.keys(CSCSummaryHierarchy);
    const cscsOptions = this.state.logEdit?.subsystem
      ? Array.from(
          new Set(
            Object.values(CSCSummaryHierarchy[this.state.logEdit.subsystem] ?? {})
              .flat()
              .map((e) => e.name),
          ),
        ).sort()
      : [];
    const topicsOptions = this.state.topicOptions;
    const paramsOptions = this.state.paramsOptions;

    const selectedCommentType = this.state.logEdit?.level
      ? LOG_TYPE_OPTIONS.find((type) => type.value === this.state.logEdit.level)
      : null;

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

            <div className={isMenu ? styles.contentMenu : styles.content}>
              <div className={styles.contentLeft}>
                <span className={styles.label}>Type of Comment</span>
                <span className={styles.value}>
                  <Select
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
                </span>
                <span className={styles.label}>Obs. Time Loss</span>
                <span className={styles.value}>
                  <Input
                    type="number"
                    min={0}
                    value={this.state.logEdit.time_lost}
                    className={styles.input}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, time_lost: event.target.value },
                      }))
                    }
                  />
                </span>
                <span className={styles.label}>Subsystem</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.subsystem}
                    onChange={({ value }) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, subsystem: value },
                      }))
                    }
                    options={subsystemOptions}
                    className={styles.select}
                    small
                  />
                </span>
                <span className={styles.label}>CSC</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.csc}
                    onChange={({ value }) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, csc: value },
                      }))
                    }
                    options={cscsOptions}
                    className={styles.select}
                    small
                  />
                </span>
                <span className={styles.label}>Salindex</span>
                <span className={styles.value}>
                  <Input
                    type="number"
                    min={0}
                    value={this.state.logEdit.salindex}
                    className={styles.input}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, salindex: event.target.value },
                      }))
                    }
                  />
                </span>
                <span className={styles.label}>CSC Topic</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.topic}
                    onChange={({ value }) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, topic: value },
                      }))
                    }
                    options={topicsOptions}
                    className={styles.select}
                  />
                </span>
                <span className={styles.label}>Parameter</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.parameter}
                    onChange={({ value }) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, parameter: value },
                      }))
                    }
                    options={paramsOptions}
                    className={styles.select}
                  />
                </span>
                {isMenu ? (
                  <>
                    <span className={styles.label}>Time of Incident</span>
                    <span className={styles.value}>
                      <DateTimeRange
                        className={styles.dateTimeRangeStyle}
                        onChange={(date, type) => this.handleTimeOfIncident(date, type)}
                        startDate={new Date(new Date() - 24 * 60 * 60 * 1000)}
                        endDate={new Date()}
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
                          startDate={new Date(new Date() - 24 * 60 * 60 * 1000)}
                          endDate={new Date()}
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
          </div>
        </form>
      </>
    );
  }
}
