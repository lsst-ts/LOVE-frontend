import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import { openInNewTab, getLinkJira, getFileURL, getFilename } from 'Utils';
import { exposureFlagStateToStyle } from 'Config';
import styles from './Message.module.css';

export default class MessageDetail extends Component {
  static propTypes = {
    message: PropTypes.object,
    editMessage: PropTypes.func,
    deleteMessage: PropTypes.func,
  };

  static defaultProps = {
    message: {
      id: '',
      user_id: undefined,
      exposure_flag: undefined,
      urls: undefined,
      message_text: undefined,
      date_added: undefined,
    },
    editMessage: () => {},
    deleteMessage: () => {},
  };

  statusFlag(flag) {
    return exposureFlagStateToStyle[flag] ? exposureFlagStateToStyle[flag] : 'unknown';
  }

  render() {
    const message = this.props.message ?? MessageDetail.defaultProps.message;
    const edit = this.props.editMessage ?? MessageDetail.defaultProps.editMessage;
    const deleteMessage = this.props.deleteMessage ?? MessageDetail.defaultProps.deleteMessage;

    const linkJira = getLinkJira(message.urls);
    const fileurl = getFileURL(message.urls);

    return (
      <div className={styles.message}>
        <div className={styles.header}>
          <span className={[styles.floatLeft, styles.title, styles.margin3].join(' ')}>
            #{message.id}
            {linkJira ? (
              <span className={styles.marginLeft}>
                <Button status="link" title={linkJira} onClick={() => openInNewTab(linkJira)}>
                  view Jira ticket
                </Button>
              </span>
            ) : (
              <></>
            )}
          </span>
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button className={styles.iconBtn} title="Delete" onClick={() => deleteMessage(message)} status="transparent">
              <DeleteIcon className={styles.icon} />
            </Button>
          </span>
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <Button className={styles.iconBtn} title="Edit" onClick={() => edit(message)} status="transparent">
              <EditIcon className={styles.icon} />
            </Button>
          </span>
        </div>
        <div className={styles.description}>
          <div className={[styles.floatLeft, styles.margin3].join(' ')}>
            <span>On </span>
            <span className={styles.bold}>{message.date_added} </span>
            <span className={styles.bold}>{message.user_id} </span>
            <span>wrote:</span>
          </div>
          <p className={[styles.textDescription, styles.margin3].join(' ')}>{message.message_text}</p>
        </div>
        <div className={styles.footer}>
          <span className={[styles.floatLeft, styles.margin3].join(' ')}>
            <span className={styles.label}>{fileurl ? 'File Attached:' : ''}</span>
            <span className={styles.value}>
              {fileurl ? (
                <>
                  <Button status="link" title={fileurl} onClick={() => openInNewTab(fileurl)}>
                    {getFilename(fileurl)}
                  </Button>
                  <Button
                    className={styles.iconBtn}
                    title={fileurl}
                    onClick={() => openInNewTab(fileurl)}
                    status="transparent"
                  >
                    <DownloadIcon className={styles.icon} />
                  </Button>
                </>
              ) : (
                <></>
              )}
            </span>
          </span>
          <span className={[styles.floatRight, styles.margin3].join(' ')}>
            <span className={[styles.margin3, styles.capitalize].join(' ')}>
              {message.exposure_flag}
            </span>
            <span className={styles.vertAlign}>
              <FlagIcon
                title={message.exposure_flag}
                status={this.statusFlag(message.exposure_flag)}
                className={styles.iconFlag}
              />
            </span>
          </span>
        </div>
      </div>
    );
  }
}