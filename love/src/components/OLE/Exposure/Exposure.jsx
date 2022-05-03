import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import AcknowledgeIcon from 'components/icons/Watcher/AcknowledgeIcon/AcknowledgeIcon';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Button from 'components/GeneralPurpose/Button/Button';
import styles from './Exposure.module.css';

export default class Exposure extends Component {
  static propTypes = {};

  static defaultProps = {};

  add(index) {
    console.log('add', index);
  }

  view(index) {
    console.log('view', index);
  }

  flag(index) {
    console.log('flag', index);
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
              <span className={styles.margin}>
                <Button className={styles.iconBtn} title={val}
                  onClick={() => { this.flag(val) }} status="transparent"
                >
                  <AddIcon className={styles.icon}/>
                </Button>
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
                <Button className={styles.iconBtn} title="Add"
                  onClick={() => { this.add(index) }} status="transparent"
                >
                  <AddIcon className={styles.icon}/>
                </Button>
              </span>
              <span className={styles.margin}>
                <Button className={styles.iconBtn} title="View"
                  onClick={() => { this.view(index) }} status="transparent"
                >
                  <AcknowledgeIcon className={styles.icon} nonAcknowledge={false}/>
                </Button>
              </span>
              
            </>
          );
        },
      },
    ];
  }

  render() {
    
    const headers = Object.values(this.getHeaders());

    const filteredData = [
      {
        id: 1,
        obsStatus: 'Upcomming',
        obsId: 'LC201204-01',
        timestamp: '2022-03-21 11:24:24',
        instrument: 'LSST Cam',
        flags: '1,2',
      },
      {
        id: 2,
        obsStatus: 'Ongoing',
        obsId: 'LC201204-01',
        timestamp: '2022-03-21 11:24:24',
        instrument: 'LSST Cam',
        flags: '1,2',
      },
      {
        id: 3,
        obsStatus: 'Past',
        obsId: 'LC201204-01',
        timestamp: '2022-03-21 11:24:24',
        instrument: 'LSST Cam',
        flags: '3',
      },
    ];
    const tableData = Object.values(filteredData);


    return (
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
    );
  }
}