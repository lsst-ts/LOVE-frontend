import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import styles from './NonExposure.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import FileUploader from 'components/GeneralPurpose/FileUploader/FileUploader';
import { defaultProps } from 'react-json-pretty';


export default class NonExposureEdit extends Component {
  static propTypes = {
    back: PropTypes.func,
    logEdit: PropTypes.object,
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
    },
  };

  constructor(props) {
    super(props);
    console.log("NonExposureEdit props", props);
    this.state = {
      logEdit: props.logEdit ? props.logEdit : defaultProps.logEdit,
    };
    this.inputRef = React.createRef();
  }

  getFile(event) {
    console.log('getFile', event);
    const nativeEvent = event.nativeEvent.target; // as HTMLInputElement;
    const targetEvent = event.target; // as HTMLInputElement;
    if (targetEvent.files && targetEvent.files[0]) {
      const file = targetEvent.files[0];
      // eslint-disable-next-line no-param-reassign
      nativeEvent.value = "";
      console.log('file', file);
    }
  }

  render() {
    const link = this.props.back;

    const LOG_TYPE_OPTIONS = ['Fault', 'Ok', 'Wait'];

    return (
      <>
        { link
          ? (
              <div className={styles.returnToLogs}>
                <Button status="link" onClick={() => { link() }}>
                  <span className={styles.title}>{`< Return to Logs`}</span>
                </Button>
              </div>
            )
          : <></>
        }
        <div className={styles.detailContainer}>
          <div className={styles.header}>
            <span className={styles.bold}>#{this.state.logEdit.id}</span>
            <span className={styles.floatRight}>
              <Button className={styles.iconBtn} title="Delete" onClick={() => {}} status="transparent">
                <DeleteIcon className={styles.icon}/>
              </Button>
            </span>
          </div>
          <div className={styles.content}>
            <div className={styles.contentLeft}>
              <span className={styles.label}>Type of Comment</span>
              <span className={styles.value}>
                <Select value={this.state.logEdit.type}
                  onChange={(event) => this.setState((prevState) => ({logEdit: {...prevState.logEdit, type: event.value}}))}
                  options={LOG_TYPE_OPTIONS}
                  className={styles.select}
                  small
                />
              </span>
              <span className={styles.label}>Obs. Time Loss {this.state.logEdit.ObsTimeLoss}</span>
              <span className={styles.value}>
                <Input value={this.state.logEdit.ObsTimeLoss}
                  className={styles.input}
                />
              </span>
              <span className={styles.label}>Subsystem</span>
              <span className={styles.value}>
                <Select value={this.state.logEdit.subsystem}
                  onChange={(event) => this.setState((prevState) => ({logEdit: {...prevState.logEdit, subsystem: event.value}}))}
                  options={LOG_TYPE_OPTIONS}
                  className={styles.select}
                  small
                />
              </span>
              <span className={styles.label}>CSC</span>
              <span className={styles.value}>
                <Select value={this.state.logEdit.csc}
                  onChange={(event) => this.setState((prevState) => ({logEdit: {...prevState.logEdit, csc: event.value}}))}
                  options={LOG_TYPE_OPTIONS}
                  className={styles.select}
                  small
                />
              </span>
              <span className={styles.label}>CSC Topic</span>
              <span className={styles.value}>
              <Select value={this.state.logEdit.cscTopic}
                  onChange={(event) => this.setState((prevState) => ({logEdit: {...prevState.logEdit, cscTopic: event.value}}))}
                  options={LOG_TYPE_OPTIONS}
                  className={styles.select}
                  
                />
              </span>
              <span className={styles.label}>Value</span>
              <span className={styles.value}>
                <Input value={this.state.logEdit.value}
                  className={styles.input}
                />
              </span>
            </div>
            
            <div className={styles.contentRight}>
              <div className={[styles.mb1, styles.floatLeft, styles.inline].join(' ')}>
                <span className={styles.title}>Message</span>
                <span className={styles.label}>Time of Incident</span>
                <span className={styles.value}>
                  <Input value={this.state.logEdit.timeIncident}
                    className={styles.input}
                  />
                </span>
              </div>
              <TextArea
                value={this.state.logEdit.description}
                callback={(event) => this.setState((prevState) => ({logEdit: {...prevState.logEdit, description: event.value}}))}
              />
            </div>
          </div>
          <div className={styles.footer}>
            <FileUploader
              value={this.state.logEdit.file?.name}
              handleFile={(file) => this.setState((prevState) => ({logEdit: {...prevState.logEdit, file: file}}))}
              handleDelete={() => this.setState((prevState) => ({logEdit: {...prevState.logEdit, file: undefined}}))}
            />
            <span className={styles.footerRight}>
              <span className={styles.checkboxText}>Create and link new Jira ticket <Input type="checkbox"></Input></span>
              
              <Button >
                <span className={styles.title}>Upload Log</span>
              </Button>
            </span>
          </div>
        </div>
      </>
    );
  }
}