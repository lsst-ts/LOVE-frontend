import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import styles from './NonExposure.module.css';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';
import ManagerInterface from 'Utils';
import { formatSecondsToDigital, openInNewTab, getOLEDataFromTags } from 'Utils';

export default class NonExposureDetail extends Component {
  static propTypes = {
    back: PropTypes.func,
    logDetail: PropTypes.object,
  };

  static defaultProps = {
    back: () => {},
    logDetail: {
      id: undefined,
      type: undefined,
      timeIncident: undefined,
      subsystem: undefined,
      csc: undefined,
      cscTopic: undefined,
      value: undefined,
      user: undefined,
      time_lost: undefined,
      jira: undefined,
      file: undefined,
      description: undefined,
    },
  };

  deleteMessage(message) {
    console.log('deleteMessage', message);
    ManagerInterface.deleteMessageNarrativeLogs(message.id).then((response) => {
      console.log('result', response);
      this.props.back();
    });
  }

  render() {
    const link = this.props.back;
    const logDetail = this.props.logDetail ? this.props.logDetail : this.defaultProps.logDetail;
    const fileUrl = logDetail.urls?.[1];
    const fileName = fileUrl ? fileUrl.substring(fileUrl.lastIndexOf('/') + 1) : null;
    const logTagsParams = getOLEDataFromTags(logDetail.tags);

    return (
      <>
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
        <div className={styles.detailContainer}>
          <div className={styles.header}>
            <span className={styles.bold}>
              #{logDetail.id} - {logDetail.type}
            </span>
            <span>
              <Button status="link" onClick={() => openInNewTab(logDetail.urls[0])}>
                view Jira ticket
              </Button>
            </span>
            <span className={styles.floatRight}>
              <Button
                className={styles.iconBtn}
                title="Delete"
                onClick={() => this.deleteMessage(logDetail)}
                status="transparent"
              >
                <DeleteIcon className={styles.icon} />
              </Button>
            </span>
          </div>
          <div className={styles.content}>
            <div className={styles.detail}>
              <span className={styles.label}>Time of Incident</span>
              <span className={styles.value}>{logDetail.date_user_specified}</span>
              <span className={styles.label}>Subsystem Affected</span>
              <span className={styles.value}>
                {(logTagsParams.subsystem ?? 'None') +
                  ' > ' +
                  (logTagsParams.csc ?? 'None') +
                  ' > ' +
                  (logTagsParams.topic ?? 'None') +
                  ' > ' +
                  (logTagsParams.param ?? 'None')}
              </span>
              <span className={styles.label}>Obs. Time Loss</span>
              <span className={styles.value}>{formatSecondsToDigital(logDetail.time_lost)}</span>
            </div>
            <div className={styles.description}>
              <div className={styles.floatLeft}>
                <span>On </span>
                <span className={styles.bold}>{logDetail.date_added} </span>
                <span className={styles.bold}>{logDetail.user_id} </span>
                <span>wrote:</span>
              </div>
              <div className={styles.textDescription}>
                <br></br>
                {logDetail.message_text}
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <span className={styles.label}>File Attached: </span>
            <span className={styles.value}>
              {fileUrl && (
                <div style={{ display: 'flex' }}>
                  <Button title={fileUrl} onClick={() => openInNewTab(fileUrl)} status="link">
                    {fileName}
                  </Button>
                  <Button
                    className={styles.iconBtn}
                    title={fileUrl}
                    onClick={() => openInNewTab(fileUrl)}
                    status="transparent"
                  >
                    <DownloadIcon className={styles.icon} />
                  </Button>
                </div>
              )}
            </span>
          </div>
        </div>
      </>
    );
  }
}
