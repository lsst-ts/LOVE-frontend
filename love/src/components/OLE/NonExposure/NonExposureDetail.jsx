import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import styles from './NonExposure.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import DownloadIcon from 'components/icons/DownloadIcon/DownloadIcon';

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
      ObsTimeLoss: undefined,
      jira: undefined,
      file: undefined,
      description: undefined,
    },
  };


  render() {
    const link = this.props.back;
    const logDetail = this.props.logDetail ? this.props.logDetail : this.defaultProps.logDetail;

    return (
      <>
        <div className={styles.returnToLogs}>
          <Button status="link" onClick={() => { link() }}>
            <span className={styles.title}>{`< Return to Logs`}</span>
          </Button>
        </div>
        <div className={styles.detailContainer}>
          <div className={styles.header}>
            <span className={styles.bold}>#{logDetail.id} - {logDetail.type}</span>
            <span><Button status="link">view Jira ticket</Button></span>
            <span className={styles.floatRight}>
              <Button className={styles.iconBtn} title="Delete" onClick={() => {}} status="transparent">
                <DeleteIcon className={styles.icon}/>
              </Button>
            </span>
          </div>
          <div className={styles.content}>
            <div className={styles.detail}>
              <span className={styles.label}>Time of Incident</span><span className={styles.value}>{logDetail.timeIncident}</span>
              <span className={styles.label}>Subsystem Affected</span>
              <span className={styles.value}>{logDetail.subsystem + ' > ' + logDetail.csc + ' > ' + logDetail.cscTopic}</span>
              <span className={styles.label}>Value</span><span className={styles.value}>{logDetail.value}</span>
              <span className={styles.label}>Obs. Time Loss</span><span className={styles.value}>{logDetail.ObsTimeLoss}</span>
            </div>
            <div className={styles.description}>
              <div className={styles.floatLeft}>
                <span>On </span>
                <span className={styles.bold}>{logDetail.timeIncident} </span>
                <span>by </span>
                <span className={styles.bold}>{logDetail.user} </span>
                <span>wrote:</span>
              </div>
              <div className={styles.textDescription}>
                {logDetail.description}
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <span className={styles.label}>File Attached: </span>
            <span className={styles.value}>
              { logDetail.file
                ? ` ${logDetail.file.name} (${(parseInt(logDetail.file.size) / 1024).toFixed(2)} KB) `
                : ``
              }
            </span>
            <span className={styles.value}>
              <Button className={styles.iconBtn} title="File" onClick={() => {}} status="transparent">
                <DownloadIcon className={styles.icon}/>
              </Button>
            </span>
          </div>
        </div>
      </>
    );
  }
}