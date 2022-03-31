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
  };

  static defaultProps = {
    back: () => {},
  };


  render() {
    const logDetail = {
      id: 1,
      type: 'Fault',
      timeIncident: '2022/03/21 16:21:33',
      subsystem: 'M. Telescope > MTDome > Azimuth',
      value: 24,
      user: 'Mía Elbo',
      ObsTimeLoss: '02:00:00',
      jira: 'http://lsst.jira.org',
      file: {
        filename: 'AMolla_soundsleep.jpeg',
        size: '486kb',
        src: 'http://file.org',
      },
      description: 'Operator Andrea Molla collapse during observation Relay team will have to finish her tasks when they take over.',
    };
    const link = this.props.back;

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
              <span className={styles.label}>Subsystem Affected</span><span className={styles.value}>{logDetail.subsystem}</span>
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
              <div className={styles.floatLeft}>
                {logDetail.description}
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <span className={styles.label}>File Attached: </span>
            <span className={styles.value}>
              {` ${logDetail.file.filename} (${logDetail.file.size}) `}
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