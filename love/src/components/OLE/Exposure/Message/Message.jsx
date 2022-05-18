import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import styles from './Message.module.css';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';


export default class Message extends Component {
  static propTypes = {
    message: PropTypes.object,
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
  };

  statusFlag(flag) {
    const result = {
      none: 'ok',
      junk: 'warning',
      questionable: 'alert'
    };
    return result[flag] ? result[flag] : 'unknown';
  }


  render() {
    const message = this.props.message ? this.props.message : this.defaultProps.message;

    return (
      <div className={styles.message}>
        <div className={styles.header}>
          <span className={[styles.floatLeft, styles.title, styles.margin3].join(' ')}>
            #{message.id} - {message.type}
            <span>
              <Button status="link" onClick={() => { link() }}>view Jira ticket</Button>
              </span>
          </span>
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button className={styles.iconBtn} title="Delete" onClick={() => {}} status="transparent">
              <DeleteIcon className={styles.icon}/>
            </Button>
          </span>
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button className={styles.iconBtn} title="Edit" onClick={() => {}} status="transparent">
              <EditIcon className={styles.icon}/>
            </Button>
          </span>
        </div>
        <div className={styles.description}>
          <div className={[styles.floatLeft, styles.margin3].join(' ')}>
            <span>On </span>
            <span className={styles.bold}>{message.timeIncident} </span>
            <span>by </span>
            <span className={styles.bold}>{message.user} </span>
            <span>wrote:</span>
          </div>
          <p className={[styles.textDescription, styles.margin3].join(' ')}>
            {message.description}
          </p>
        </div>
        <div className={styles.footer}>
          <span className={[styles.floatLeft, styles.margin3].join(' ')}>
            <span className={styles.label}>
              File Attached:
            </span>
            <span className={styles.value}>
              { message.file
                ? ` ${message.file.name} (${(parseInt(message.file.size) / 1024).toFixed(2)} KB) `
                : ``
              }
              <Button className={styles.iconBtn} title="File" onClick={() => {}} status="transparent">
                <DownloadIcon className={styles.icon}/>
              </Button>
            </span>
          </span>
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <span className={[styles.margin3, styles.capitalize].join(' ')}>
              {message.flag}
            </span>
            <span className={styles.vertAlign}>
              <FlagIcon title={message.flag} status={this.statusFlag(message.flag)}
                className={styles.iconFlag}/>
            </span>

          </span>
        </div>
      </div>
    );
  }
}