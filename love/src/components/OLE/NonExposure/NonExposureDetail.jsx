import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from 'components/icons/DeleteIcon/DeleteIcon';
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import styles from './NonExposure.module.css';

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
              <Button className={styles.iconBtn} title="View" onClick={() => {}} status="transparent">
                <DeleteIcon className={styles.icon}/>
              </Button>
            </span>
          </div>
          <div className={styles.content}>
            <div className={styles.detail}>
              <Label>Time of Incident</Label>{/* <Value>{logDetail.timeIncident}</Value> */}
              <Label>Subsystem Affected</Label>{/* <Value>{logDetail.subsystem}</Value> */}
              <Label>Value</Label>{/* <Value>{logDetail.value}</Value> */}
              <Label>Obs. Time Loss</Label>{/* <Value>{logDetail.ObsTimeLoss}</Value> */}
            </div>
            <div className={styles.description}>
              <span>On </span>
              <span className={styles.bold}>{logDetail.timeIncident} </span>
              <span className={styles.bold}>{logDetail.user}</span>
              <span>wrote:</span><br/>
              <span>{logDetail.description}</span>
            </div>
          </div>
          <div className={styles.footer}>
            <Label>File Attached:</Label>
            {/* <Value>
              {`${logDetail.file.filename} (${logDetail.file.size}) `}
            </Value> */}
            <Button className={styles.iconBtn} title="File" onClick={() => {}} status="transparent">
              <ArrowIcon className={styles.icon}/>
            </Button>
          </div>
        </div>
      </>
    );
  }
}