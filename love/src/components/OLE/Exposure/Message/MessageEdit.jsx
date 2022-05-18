import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import FileUploader from 'components/GeneralPurpose/FileUploader/FileUploader';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import SaveIcon from 'components/icons/SaveIcon/SaveIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import styles from './Message.module.css';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';


export default class MessageEdit extends Component {
  static propTypes = {
    message: PropTypes.object,
    cancel: PropTypes.func,
    save: PropTypes.func,
  };

  static defaultProps = {
    message: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      siteId: '',
      type: undefined,
      user: undefined,
      flag: 'ok',
      jira: undefined,
      file: undefined,
      description: undefined,
      dateAdded: undefined,
      dateInvalidated: undefined,
    },
    cancel: () => {console.log('defaultProps.cancel')},
    save: () => {console.log('defaultProps.save')},
  };

  statusFlag(flag) {
    const result = {
      none: 'ok',
      junk: 'warning',
      questionable: 'alert'
    };
    return result[flag] ? result[flag] : 'unknown';
  }

  constructor(props) {
    super(props);
    this.state = {
      message: props.message ? props.message : MessageEdit.defaultProps.message,
    };
  }

  render() {
    const cancel = this.props.cancel ? this.props.cancel : MessageEdit.defaultProps.cancel;
    const save = this.props.save ? this.props.save : MessageEdit.defaultProps.save;

    return (
      <div className={styles.message}>
        <div className={styles.header}>
          <span className={[styles.floatLeft, styles.title, styles.margin3].join(' ')}>
            #{this.state.message.id} - {this.state.message.type}
          </span>
          <span className={[styles.checkboxText, styles.floatLeft, styles.margin3].join(' ')}>
            <Button status="link">view Jira ticket</Button>
            <Input value={this.state.message.jira}
              className={styles.input}
              onChange={(event) => this.setState((prevState) => ({message: {...prevState.message, jira: event.value}}))}
            />
          </span>
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button className={styles.iconBtn} title="Exit" onClick={() => cancel()} status="transparent">
              <CloseIcon className={styles.icon}/>
            </Button>
          </span>
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button className={styles.iconBtn} title="Save" onClick={() => save(this.state.message)} status="transparent">
              <SaveIcon className={styles.icon}/>
            </Button>
          </span>

        </div>
        <div className={styles.description}>
          <TextArea
            value={this.state.message.description}
            callback={(event) => this.setState((prevState) => ({message: {...prevState.message, description: event.value}}))}
          />
        </div>
        <div className={styles.footer}>
          {/* <span className={[styles.floatLeft, styles.margin3].join(' ')}>
            <span className={styles.label}>
              File Attached:
            </span>
            <span className={styles.value}>
              <FileUploader
                value={this.state.message.file?.name}
                handleFile={(file) => this.setState((prevState) => ({message: {...prevState.message, file: file}}))}
                handleDelete={() => this.setState((prevState) => ({message: {...prevState.message, file: undefined}}))}
              />
              <Button className={styles.iconBtn} title="File" onClick={() => {}} status="transparent">
                <DownloadIcon className={styles.icon}/>
              </Button>
            </span>
          </span> */}
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <span className={[styles.margin3, styles.capitalize].join(' ')}>
              {this.state.message.flag}
            </span>
            <span className={styles.vertAlign}>
              <FlagIcon title={this.state.message.flag} status={this.statusFlag(this.state.message.flag)}
                className={styles.iconFlag}/>
            </span>

          </span>
        </div>
      </div>
    );
  }
}