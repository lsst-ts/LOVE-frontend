import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Input from 'components/GeneralPurpose/Input/Input';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Button from 'components/GeneralPurpose/Button/Button';
import { Link } from 'react-router-dom';
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import EditIcon from 'components/icons/EditIcon/EditIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import styles from './NonExposure.module.css';
import NonExposureDetail from './NonExposureDetail';

export default class NonExposure extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      modeEdit: false,
    };
  }

   edit(index) {
    console.log('edit', index);
    if (index) {
      this.setState({ modeEdit: true });
    }   
  }

  getHeaders = () => {
    return [
      {
        field: 'id',
        title: 'Log Id',
        type: 'number',
      },
      {
        field: 'userId',
        title: 'User Id',
        type: 'string',
      },
      {
        field: 'agent',
        title: 'Agent',
        type: 'string',
      },
      {
        field: 'timestamp',
        title: 'Timestamp',
        type: 'timestamp',
      },
      {
        field: 'timeIncident',
        title: 'Time of Incident',
        type: 'string',
      },
      {
        field: 'type',
        title: 'Type',
        type: 'string',
      },
      {
        field: 'obsTimeLoss',
        title: 'Obs. Time Loss',
        type: 'string',
      },
      {
        field: 'subsystem',
        title: 'Subsystem',
        type: 'string',
      },
      {
        field: 'csc',
        title: 'CSC',
        type: 'string',
        render: (cell) => <b>{cell}</b>,
      },
      {
        field: 'cscTopic',
        title: 'CSC Topic',
        type: 'string',
      },
      {
        field: 'file',
        title: 'File',
        type: 'link',
        render: (value) => (
          <Button
            className={styles.iconBtn}
            title="File"
            onClick={() => {}}
          >
            <ArrowIcon className={styles.icon}/>
          </Button>
        ),
      },
      {
        field: 'jira',
        title: 'Jira',
        type: 'link',
        render: (value) => (
          <Link to={value}>{value}</Link>
        ),
      },
      {
        field: 'action',
        title: 'Action',
        type: 'string',
        render: (_, index) => {
          return (
            <>
              <span className={styles.margin}>
                <Button className={styles.iconBtn} title="View" onClick={() => {}} status="transparent">
                  <AcknowledgeIcon className={styles.icon} nonAcknowledge={false}/>
                </Button>
              </span>
              <span className={styles.margin}>
                <Button className={styles.iconBtn} title="Edit"
                  onClick={() => { this.edit(index) }} status="transparent"
                >
                  <EditIcon className={styles.icon}/>
                </Button>
              </span>
            </>
          );
        },
      },
    ];
  }

  render() {
    const modeEdit = this.state.modeEdit;
    const headers = Object.values(this.getHeaders());

    const filteredData = [
      {
        id: 1,
        userId: 'MiaElbo',
        agent: 'Lorem',
        timestamp: '2022-03-21 11:24:24',
        timeIncident: '2022-03-21 12:25:25',
        type: 'Observation',
        obsTimeLoss: '-',
        subsystem: 'M. Telescope',
        csc: 'MTHexapod',
        cscTopic: 'Actuators',
        file: 'http://file.org',
        jira: 'http://lsst.jira.org',
      },
    ];
    const tableData = Object.values(filteredData);

    return (
      modeEdit
      ? <NonExposureDetail back={() => { this.setState({ modeEdit: false });}}/>
      : (
        <>
          <div className={styles.title}>
            Filter
          </div>
          <div className={styles.filters}>
            <Label>From: </Label>
            {/* <Value>
              <Input/>
            </Value> */}
          </div>
          <SimpleTable headers={headers} data={tableData} />
        </>
      )
    );
  }
}