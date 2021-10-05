import React, { Component } from 'react';
import styles from './OLE.module.css';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import Select from 'components/GeneralPurpose/Select/Select';
import Input from 'components/GeneralPurpose/Input/Input';
import Button from 'components/GeneralPurpose/Button/Button';

class OLE extends Component {
  static oleTableHeaders() {
    return [
      {
        field: 'status',
        title: 'Obs. status',
        type: 'string',
      },
      {
        field: 'id',
        title: 'Observation ID',
        type: 'string',
      },
      {
        field: 'instrument',
        title: 'Instrument',
        type: 'string',
      },
      {
        field: 'date',
        title: 'Date & Time (TAI)',
        type: 'date',
      },
      {
        field: 'msg',
        title: 'Messages',
        type: 'number',
      },
      {
        field: 'more',
        title: 'See more',
      },
      {
        field: 'new_msg',
        title: 'New Message',
      },
    ];
  }

  getOLETableData = () => {
    const data = [
      {
        status: 'Upcoming',
        id: 'LC20210424-01',
        instrument: 'LSST Cam',
        date: '2021-04-24 22:2000',
        msg: '1',
        more: '',
        new_msg: '+',
      },
    ];

    return data;
  };

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const OLEData = Object.values(this.getOLETableData());
    return (
      <div>
        <div>
          <div className={styles.oleh3}>
            <h3>Observations(1)</h3>
          </div>

          <div className={styles.oleContainer}>
            <div className={styles.oleContainerItems}>
              <span>Instrument</span>
              <Select></Select>
            </div>

            <div className={styles.oleContainerItems}>
              <span>Date & Time</span>
              <Select></Select>
            </div>

            <div className={styles.oleContainerItems}>
              <span>Obs ID</span>
              <Select></Select>
            </div>

            <div className={styles.oleTextAreaFilter}>
              <Input></Input>
            </div>
          </div>
        </div>
        <div>
          <SimpleTable headers={OLE.oleTableHeaders()} data={OLEData} />
        </div>
      </div>
    );
  }
}

export default OLE;
