import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { openInNewTab, getLinkJira, getFileURL, getFilename } from 'Utils';
import { EXPOSURE_FLAG_OPTIONS } from 'Config';
import TextArea from 'components/GeneralPurpose/TextArea/TextArea';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import FileUploader from 'components/GeneralPurpose/FileUploader/FileUploader';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import SaveIcon from 'components/icons/SaveIcon/SaveIcon';
import CloseIcon from 'components/icons/CloseIcon/CloseIcon';
import styles from './Message.module.css';

export default class MessageEdit extends Component {
  static propTypes = {
    message: PropTypes.object,
    cancel: PropTypes.func,
    save: PropTypes.func,
  };

  static defaultProps = {
    message: {
      id: '',
      urls: [],
      file: undefined,
      fileurl: undefined,
      filename: undefined,
      jira: false,
      jiraurl: undefined,
      message_text: undefined,
    },
    cancel: () => {},
    save: () => {},
  };

  statusFlag(flag) {
    const result = {
      none: 'ok',
      junk: 'warning',
      questionable: 'alert',
    };
    return result[flag] ? result[flag] : 'unknown';
  }

  constructor(props) {
    super(props);
    const message = props.message ?? MessageEdit.defaultProps.message;

    message.jiraurl = getLinkJira(message.urls);
    message.fileurl = getFileURL(message.urls);
    message.filename = getFilename(getFileURL(message.urls));
    message.jira = false;

    // Clean null and empty values to avoid API errors
    Object.keys(message).forEach((key) => {
      if (message[key] === null || (Array.isArray(message[key]) && message[key].length === 0)) {
        delete message[key];
      }
    });

    console.log(message);
    this.state = { message };
  }

  render() {
    const cancel = this.props.cancel ?? MessageEdit.defaultProps.cancel;
    const save = this.props.save ?? MessageEdit.defaultProps.save;

    return (
      <div className={styles.message}>
        <div className={styles.header}>
          <span className={[styles.floatLeft, styles.margin3, styles.inline].join(' ')}>
            <span className={styles.title}>#{this.state.message.id}</span>
            {this.state.message.jiraurl ? (
              <span className={styles.marginLeft}>
                <Button
                  status="link"
                  title={this.state.message.jiraurl}
                  onClick={() => openInNewTab(this.state.message.jiraurl)}
                >
                  view Jira ticket
                </Button>
              </span>
            ) : !this.state.message.id ? (
              <span className={[styles.checkboxText, styles.marginLeft].join(' ')}>
                Create and link new Jira ticket
                <Input
                  type="checkbox"
                  checked={this.state.message.jira}
                  onChange={(event) => {
                    this.setState((prevState) => ({
                      message: { ...prevState.message, jira: event.target.checked },
                    }));
                  }}
                />
              </span>
            ) : (
              <></>
            )}
          </span>
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button className={styles.iconBtn} title="Exit" onClick={() => cancel()} status="transparent">
              <CloseIcon className={styles.icon} />
            </Button>
          </span>
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button
              className={styles.iconBtn}
              title="Save"
              onClick={() => save(this.state.message)}
              status="transparent"
            >
              <SaveIcon className={styles.icon} />
            </Button>
          </span>
        </div>
        <div className={styles.description}>
          <div className={[styles.mb1, styles.floatLeft, styles.inline].join(' ')}>
            <span className={styles.title}>Message</span>
          </div>
          <TextArea
            value={this.state.message.message_text}
            callback={(event) =>
              this.setState((prevState) => ({ message: { ...prevState.message, message_text: event } }))
            }
          />
        </div>
        <div className={styles.footer}>
          <span className={[styles.floatLeft, styles.inline].join(' ')}>
            {!this.state.message.id && (
              <FileUploader
                value={this.state.message.file?.name}
                handleFile={(file) => this.setState((prevState) => ({ message: { ...prevState.message, file: file } }))}
                handleDelete={() =>
                  this.setState((prevState) => ({ message: { ...prevState.message, file: undefined } }))
                }
              />
            )}
            {this.state.message.fileurl && (
              <>
                <Button
                  status="link"
                  title={this.state.message.fileurl}
                  onClick={() => openInNewTab(this.state.message.fileurl)}
                >
                  {this.state.message.filename}
                </Button>
                <Button
                  className={styles.iconBtn}
                  title={this.state.message.fileurl}
                  onClick={() => openInNewTab(this.state.message.fileurl)}
                  status="transparent"
                >
                  <DownloadIcon className={styles.icon} />
                </Button>
              </>
            )}
          </span>
          <span className={[styles.floatRight, styles.margin3, styles.inline].join(' ')}>
            <span className={[styles.label, styles.paddingTop].join(' ')}>Exposure Flag</span>
            <span className={styles.value}>
              <Select
                value={this.state.message.exposure_flag}
                onChange={(event) =>
                  this.setState((prevState) => ({ message: { ...prevState.message, exposure_flag: event.value } }))
                }
                options={EXPOSURE_FLAG_OPTIONS}
                className={styles.select}
                small
              />
            </span>
          </span>
        </div>
      </div>
    );
  }
}
