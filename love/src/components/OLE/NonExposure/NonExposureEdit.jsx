import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import FileUploader from 'components/GeneralPurpose/FileUploader/FileUploader';
import { CSCSummaryHierarchy, LOG_TYPE_OPTIONS } from 'Config';
import ManagerInterface from 'Utils';
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
      type: undefined,
      timeIncident: undefined,
      subsystem: undefined,
      csc: undefined,
      cscTopic: undefined,
      value: undefined,
      user: undefined,
      ObsTimeLoss: undefined,
      jira: undefined,
      file: undefined,
      description: undefined,
      createTicketJira: false,
    },
    isLogCreate: false,
    isMenu: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      logEdit: props.logEdit ? props.logEdit : defaultProps.logEdit,
      optionsTree: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('NonExposureEdit.handleSubmit');
    console.log('Submitted: ', this.state.logEdit);
  }

  componentDidMount() {
    ManagerInterface.getTopicData('event-telemetry').then((data) => {
      this.setState({ optionsTree: data });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.logEdit?.csc || this.state.logEdit?.csc) && prevState.logEdit.csc !== this.state.logEdit.csc) {
      console.log('CSC SELECTED', this.state.logEdit.csc);
      const options = [
        ...Object.keys(this.state.optionsTree[this.state.logEdit.csc].telemetry_data),
        ...Object.keys(this.state.optionsTree[this.state.logEdit.csc].event_data),
      ].sort();
      this.setState({ topicOptions: options });
    }

    if (
      (prevState.logEdit?.cscTopic || this.state.logEdit?.cscTopic) &&
      prevState.logEdit.cscTopic !== this.state.logEdit.cscTopic
    ) {
      console.log('TOPIC SELECTED', this.state.logEdit.cscTopic);
      const topicData = [
        ...Object.entries(this.state.optionsTree[this.state.logEdit.csc].telemetry_data),
        ...Object.entries(this.state.optionsTree[this.state.logEdit.csc].event_data),
      ];
      const topicParams = topicData.find(([topic]) => {
        return topic === this.state.logEdit.cscTopic;
      });
      const options = Object.keys(topicParams[1]).sort();
      this.setState({ paramsOptions: options });
    }
  }

  render() {
    const link = this.props.back;
    const isLogCreate = this.props.isLogCreate;
    const isMenu = this.props.isMenu;

    const subsystemOptions = Object.keys(CSCSummaryHierarchy);
    const cscsOptions = Object.keys(this.state.optionsTree).sort();
    const topicsOptions = this.state.topicOptions;
    const paramsOptions = this.state.paramsOptions;

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
                <span className={styles.floatRight}>
                  {this.state.logEdit.id ? (
                    <Button className={styles.iconBtn} title="Delete" onClick={() => {}} status="transparent">
                      <DeleteIcon className={styles.icon} />
                    </Button>
                  ) : (
                    <></>
                  )}
                </span>
              </div>
            )}

            <div className={isMenu ? styles.contentMenu : styles.content}>
              <div className={styles.contentLeft}>
                <span className={styles.label}>Type of Comment</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.type}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, type: event.value },
                      }))
                    }
                    options={LOG_TYPE_OPTIONS}
                    className={styles.select}
                    small
                  />
                </span>
                <span className={styles.label}>Obs. Time Loss {this.state.logEdit.ObsTimeLoss}</span>
                <span className={styles.value}>
                  <Input
                    value={this.state.logEdit.ObsTimeLoss}
                    className={styles.input}
                    onChange={(event) =>
                      this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, ObsTimeLoss: event.value } }))
                    }
                  />
                </span>
                <span className={styles.label}>Subsystem</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.subsystem}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, subsystem: event.value },
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
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, csc: event.value },
                      }))
                    }
                    options={cscsOptions}
                    className={styles.select}
                    small
                  />
                </span>
                <span className={styles.label}>CSC Topic</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.cscTopic}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, cscTopic: event.value },
                      }))
                    }
                    options={topicsOptions}
                    className={styles.select}
                  />
                </span>
                <span className={styles.label}>Param</span>
                <span className={styles.value}>
                  <Select
                    value={this.state.logEdit.cscParam}
                    onChange={(event) =>
                      this.setState((prevState) => ({
                        logEdit: { ...prevState.logEdit, cscParam: event.value },
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
                      <Input
                        value={this.state.logEdit.timeIncident}
                        className={styles.input}
                        onChange={(event) =>
                          this.setState((prevState) => ({
                            logEdit: { ...prevState.logEdit, timeIncident: event.value },
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
                        <Input
                          value={this.state.logEdit.timeIncident}
                          className={styles.input}
                          onChange={(event) =>
                            this.setState((prevState) => ({
                              logEdit: { ...prevState.logEdit, timeIncident: event.value },
                            }))
                          }
                        />
                      </span>
                    </>
                  )}
                </div>
                <TextArea
                  value={this.state.logEdit.description}
                  callback={(event) =>
                    this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, description: event.value } }))
                  }
                />
              </div>
            </div>
            <div className={isMenu ? styles.footerMenu : styles.footer}>
              <FileUploader
                value={this.state.logEdit.file?.name}
                handleFile={(file) => this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: file } }))}
                handleDelete={() =>
                  this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, file: undefined } }))
                }
              />
              <span className={isMenu ? styles.footerRightMenu : styles.footerRight}>
                {!this.state.logEdit.id ? (
                  <span className={styles.checkboxText}>
                    Create and link new Jira ticket
                    <Input
                      type="checkbox"
                      checked={this.state.logEdit.createTicketJira}
                      onChange={(event) => {
                        this.setState((prevState) => ({
                          logEdit: { ...prevState.logEdit, createTicketJira: event.target.checked },
                        }));
                      }}
                    />
                  </span>
                ) : (
                  <span className={styles.checkboxText}>
                    <Button status="link">view Jira ticket</Button>
                    <Input
                      value={this.state.logEdit.jira}
                      className={styles.input}
                      onChange={(event) =>
                        this.setState((prevState) => ({ logEdit: { ...prevState.logEdit, jira: event.value } }))
                      }
                    />
                  </span>
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
