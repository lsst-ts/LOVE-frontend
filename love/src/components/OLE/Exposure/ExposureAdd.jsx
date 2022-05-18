import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import FileUploader from 'components/GeneralPurpose/FileUploader/FileUploader';
import styles from './Exposure.module.css';

export default class ExposureAdd extends Component {
  static propTypes = {
    back: PropTypes.func,
    logEdit: PropTypes.object,
    newMessage: PropTypes.object,
    isLogCreate: PropTypes.bool,
  };

  static defaultProps = {
    back: () => {},
    logEdit: {
      obsId: undefined,
      obsStatus: undefined,
      instrument: undefined,
      obsType: undefined,
      obsReason: undefined,
      obsDay: undefined,
      messages: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          siteId: '',
          type: undefined,
          user: undefined,
          flag: undefined,
          jira: undefined,
          file: undefined,
          description: undefined,
          dateAdded: undefined,
          dateInvalidated: undefined,
        },
      ],
    },
    newMessage: {
      id: undefined,
      siteId: '',
      type: undefined,
      user: undefined,
      flag: undefined,
      jira: undefined,
      file: undefined,
      description: undefined,
      dateAdded: undefined,
      dateInvalidated: undefined,
    },
    isLogCreate: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      logEdit: props.logEdit ? props.logEdit : ExposureAdd.defaultProps.logEdit,
      newMessage: ExposureAdd.defaultProps.newMessage,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('Submitted: ', this.state.logEdit);
  }

  render() {
    const link = this.props.back;
    const isLogCreate = this.props.isLogCreate;

    const LOG_TYPE_OPTIONS = ['Fault', 'Ok', 'Wait'];
    const EXPOSURE_FLAG_OPTIONS = ['None', 'Junk', 'Questionary'];
    const OBS_ID_OPTIONS = this.props.Observations ? this.props.Observations : ['AT_O_20220208_000140']

    return (
      <>
        { !isLogCreate
          ? (
              <div className={styles.returnToLogs}>
                <Button status="link" onClick={() => { link() }}>
                  <span className={styles.title}>{`< Return to Observations`}</span>
                </Button>
              </div>
            )
          : <></>
        }
        <form onSubmit={this.handleSubmit}>
          <div className={styles.detailContainer}>
            <div className={styles.header}>
              { this.state.logEdit.obsId
                ? (<span>{this.state.logEdit.obsId} - {this.state.logEdit.obsType}</span>)
                : <></>
              }
              
              <span className={styles.floatRight}>
                { this.state.logEdit.id
                  ? (
                    <span>
                      <span className={styles.margin}>
                      [{this.state.logEdit.obsStatus}]
                      </span>
                      <Button className={styles.iconBtn} title="Delete" onClick={() => {}} status="transparent">
                        <DeleteIcon className={styles.icon}/>
                      </Button>
                    </span>
                  )
                  : this.state.logEdit.obsStatus
                    ? <span>[{this.state.logEdit.obsStatus}]</span>
                    : <></>
                }
              </span>
            </div>
            <div className={styles.content}>
              <div className={styles.contentLeft}>
                <span className={styles.label}>Type of Comment</span>
                <span className={styles.value}>
                  <Select value={this.state.newMessage.type}
                    onChange={(event) => this.setState((prevState) => ({newMessage: {...prevState.logEdit, type: event.value}}))}
                    options={LOG_TYPE_OPTIONS}
                    className={styles.select}
                    small
                  />
                </span>
                <span className={styles.label}>Exposure Flag</span>
                <span className={styles.value}>
                  <Select value={this.state.newMessage.flag}
                    onChange={(event) => this.setState((prevState) => ({newMessage: {...prevState.newMessage, flag: event.value}}))}
                    options={EXPOSURE_FLAG_OPTIONS}
                    className={styles.select}
                    small
                  />
                </span>
                
                {
                  this.state.logEdit.obsId
                  ? <></>
                  : (
                    <>
                      <span className={styles.label}>Obs. Id</span>
                      <span className={styles.value}>
                        <Select value={this.state.logEdit.obsId}
                          onChange={(event) => this.setState((prevState) => ({logEdit: {...prevState.logEdit, csc: event.value}}))}
                          options={OBS_ID_OPTIONS}
                          className={styles.select}
                          small
                        />
                      </span>
                    </>
                  )
                }
                
              </div>
              
              <div className={styles.contentRight}>
                <div className={[styles.mb1, styles.floatLeft, styles.inline].join(' ')}>
                  <span className={styles.title}>Message</span>
                  
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
                <span className={styles.checkboxText}>
                  Create and link new Jira ticket
                  <Input type="checkbox"
                    checked={this.state.logEdit.createTicketJira}
                    onChange={(event) => {
                      this.setState((prevState) => ({logEdit: {...prevState.logEdit, createTicketJira: event.target.checked}}));
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