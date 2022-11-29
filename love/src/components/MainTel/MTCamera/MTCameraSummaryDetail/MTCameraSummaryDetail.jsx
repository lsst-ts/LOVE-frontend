import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Row from '../../../GeneralPurpose/SummaryPanel/Row';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import styles from './MTCameraSummaryDetail.module.css';

class RaftDetail extends Component {
  REBs = [
    {
      field: 'FirstColumn',
      title: '',
    },
    {
      field: 'Bias',
      title: 'Bias',
    },
    {
      field: 'Voltaje',
      title: 'Voltaje [V]',
      type: 'number',
    },
    {
      field: 'Power',
      title: 'Power [P]',
      type: 'number',
    },
  ];

  CCDs = [
    {
      field: 'FirstColumn',
      title: '',
    },
    {
      field: 'GD 0',
      title: 'GD 0 [V]',
      type: 'number',
    },
    {
      field: 'OD 0',
      title: 'OD 0 [mA]',
      type: 'number',
    },
    {
      field: 'OD 0',
      title: 'OD 0 [V]',
      type: 'number',
    },
    {
      field: 'GV 0',
      title: 'GV 0 [V]',
      type: 'number',
    },
    {
      field: 'RD 0',
      title: 'RD 0 [V]',
      type: 'number',
    },
    {
      field: 'SW 0',
      title: 'SW 0 [C°]',
      type: 'number',
    },
  ];

  render() {
    const { selectedRaft } = this.props;
    const rebs_data = [
      {
        FirstColumn: 'REB 01',
        Bias: 'On',
        Voltaje: '1.123',
        Power: '1.123',
      },
      {
        FirstColumn: 'REB 02',
        Bias: 'Off',
        Voltaje: '1.123',
        Power: '1.123',
      },
      {
        FirstColumn: 'REB 03',
        Bias: 'On',
        Voltaje: '1.123',
        Power: '1.123',
      },
    ];
    const ccds_data = [
      {
        FirstColumn: 'CCD 01',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        FirstColumn: 'CCD 02',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        FirstColumn: 'CCD 03',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        FirstColumn: 'CCD 04',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        FirstColumn: 'CCD 04',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        FirstColumn: 'CCD 05',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        FirstColumn: 'CCD 06',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        FirstColumn: 'CCD 07',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        FirstColumn: 'CCD 08',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        FirstColumn: 'CCD 09',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
    ];
    return (
      <div>
        <div>
          <Title>Raft 15</Title>
          <Value>
            <StatusText>OK</StatusText>
          </Value>
          <Label>Temp Control</Label>
          <Value>
            <StatusText>Active</StatusText>
          </Value>
        </div>
        {/* REBs table */}
        <div>
          <SimpleTable headers={this.REBs} data={rebs_data} />
        </div>
        {/* CCDs table */}
        <div>
          <SimpleTable headers={this.CCDs} data={ccds_data} />
        </div>
      </div>
    );
  }
}

export default RaftDetail;
