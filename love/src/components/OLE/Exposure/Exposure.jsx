import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import FlagIcon from 'components/icons/FlagIcon/FlagIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Button from 'components/GeneralPurpose/Button/Button';
import ExposureAdd from './ExposureAdd';
import ExposureDetail from './ExposureDetail';
import styles from './Exposure.module.css';

export default class Exposure extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      modeView: false,
      modeAdd: false,
      selected: {},
    };
  }

  view(index) {
    if (index) {
      this.setState({
        modeView: true,
        selected: index,
      });
    }   
  }

  add(index) {
    if (index) {
      this.setState({
        modeAdd: true,
        selected: index,
      });
    }   
  }

  statusFlag(flag) {
    const result = {
      none: 'ok',
      junk: 'warning',
      questionable: 'alert'
    };
    return result[flag] ? result[flag] : 'unknown';
  }

  getHeaders = () => {
    return [
      {
        field: 'obsStatus',
        title: 'Obs. Status',
        type: 'string',
      },
      {
        field: 'obsId',
        title: 'Observation Id',
        type: 'string',
      },
      {
        field: 'timestamp',
        title: 'Date & Time (TAI)',
        type: 'timestamp',
      },
      {
        field: 'instrument',
        title: 'Instrument',
        type: 'string',
      },
      {
        field: 'flags',
        title: 'Flags',
        type: 'string',
        render: (value, row) => {
          const values = String(value).split(',');
          return values.map((val) => {
            return (
              <span>
                <FlagIcon title={val} status={this.statusFlag(val)} className={styles.iconFlag}/>
              </span>
            );
          });
        },
      },
      {
        field: 'action',
        title: 'Action',
        type: 'string',
        render: (_, index) => {
          return (
            <>
              <span className={styles.margin}>
                <Button className={styles.iconBtn} title="View"
                  onClick={() => { this.view(index) }} status="transparent"
                >
                  <AcknowledgeIcon className={styles.icon} nonAcknowledge={false}/>
                </Button>
              </span>
              <span className={styles.margin}>
                <Button className={styles.iconBtn} title="Add"
                  onClick={() => { this.add(index) }} status="transparent"
                >
                  <AddIcon className={styles.icon}/>
                </Button>
              </span>
            </>
          );
        },
      },
    ];
  }

  render() {
    const modeView = this.state.modeView;
    const modeAdd = this.state.modeAdd;
    const headers = Object.values(this.getHeaders());

    const filteredData = [
      {
        id: 1,
        obsStatus: 'Upcomming',
        obsId: 'LC201204-01',
        timestamp: '2022-03-21 11:24:24',
        instrument: 'LSST Cam',
        flags: 'none,junk',
        obsType: 'Engtest',
        obsReason: 'extra',
        obsDay: undefined,
        messages: [
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            siteId: '',
            type: undefined,
            user: 'Mia Elbo',
            flag: 'none',
            file: {name: 'file.csv', size: 6078},
            jira: 'http://lsst.jira.org',
            description: 'First we have the Logs component, which will display logs created by different  love-operators. This component will have two tabs, one for non-exposure logs and another for exposure logs, viewing these two types of logs is very different.',
            dateAdded: '2022-05-11 12:34',
            dateInvalidated: undefined,
          },
          {
            id: '3fa85f64-5717-4562-b3fc',
            siteId: '',
            type: undefined,
            user: 'Mia Elbo',
            flag: 'junk',
            file: {name: 'file.csv', size: 6078},
            jira: 'http://lsst.jira.org',
            description: undefined,
            dateAdded: '2022-05-11 12:34',
            dateInvalidated: undefined,
          },
        ]
      },
      {
        id: 2,
        obsStatus: 'Ongoing',
        obsId: 'LC201204-01',
        timestamp: '2022-03-21 11:24:24',
        instrument: 'LSST Cam',
        flags: 'none,questionable',
        obsId: 'LC20210224-1',
        instrument: 'LATISS',
        obsType: 'Engtest',
        obsReason: 'extra',
        obsDay: undefined,
        messages: [
          {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            siteId: '',
            type: undefined,
            user: undefined,
            flag: 'none',
            jira: undefined,
            file: undefined,
            description: 'First we have the Logs component, which will display logs created by different  love-operators.',
            dateAdded: undefined,
            dateInvalidated: undefined,
          },
          {
            id: '4562-b3fc-2c963f66afa6',
            siteId: '',
            type: undefined,
            user: undefined,
            flag: 'questionable',
            file: {name: 'file.csv', size: 6078},
            jira: 'http://lsst.jira.org',
            description: 'This component will have two tabs, one for non-exposure logs and another for exposure logs, viewing these two types of logs is very different',
            dateAdded: undefined,
            dateInvalidated: undefined,
          },
        ]
      },
      {
        id: 3,
        obsStatus: 'Past',
        obsId: 'LC201204-01',
        timestamp: '2022-03-21 11:24:24',
        instrument: 'LSST Cam',
        flags: 'questionable',
        obsId: 'LC20210224-1',
        instrument: 'LATISS',
        obsType: 'Engtest',
        obsReason: 'extra',
        obsDay: undefined,
        messages: [
          {
            id: '4562-b3fc-2c963f66afa6',
            siteId: '',
            type: undefined,
            user: undefined,
            flag: 'questionable',
            file: {name: 'file.csv', size: 6078},
            jira: 'http://lsst.jira.org',
            description: 'on Image 2 we are looking at the non-exposure logs tab in which users will be able to navigate through the logs listed by their unique id on a table.',
            dateAdded: undefined,
            dateInvalidated: undefined,
          },
        ]
      },
    ];
    const tableData = Object.values(filteredData);

    return (
      modeView && !modeAdd
      ? <ExposureDetail back={() => { this.setState({ modeView: false });}} logDetail={this.state.selected}/>
      : modeAdd && !modeView
        ? <ExposureAdd back={() => { this.setState({ modeEdit: false });}} logEdit={this.state.selected}/>
        : (
          <div className={styles.margin10}>
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
          </div>
      )
    );
  }
}