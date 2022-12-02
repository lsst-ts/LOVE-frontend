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
  constructor() {
    super();
    this.state = {
      ccdsData: [],
      rebsData: [],
    };
  }

  REBs = [
    {
      field: 'firstColumn',
      title: '',
    },
    {
      field: 'bias',
      title: 'bias',
    },
    {
      field: 'voltage',
      title: 'voltage [V]',
      type: 'number',
    },
    {
      field: 'power',
      title: 'power [P]',
      type: 'number',
    },
  ];

  CCDs = [
    {
      field: 'firstColumn',
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

  getSummaryDetailData() {
    const { selectedRaft, selectedCCD, selectedReb } = this.props;
    const { ccds, rebs } = selectedRaft;
    const ccdsData = [];

    const rebsData = [];
    rebs.forEach((r) => {
      rebsData.push({
        firstColumn: `REB ${r.id}`,
        bias: Math.random() > 0.5 ? 'On' : 'Off',
        voltage: Math.random() * 100,
        power: Math.random() * 50,
        rowClass: selectedReb?.id === r.id ? styles.selectedRow : '',
      });
    });
    console.log(rebsData);

    this.setState({ ccdsData, rebsData });
  }

  componentDidMount() {
    this.getSummaryDetailData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.props.selectedRaft && this.props.selectedRaft.id !== prevProps.selectedRaft?.id) ||
      (this.props.selectedReb && this.props.selectedReb.id !== prevProps.selectedReb?.id)
    ) {
      this.getSummaryDetailData();
    }
  }

  render() {
    const { selectedRaft } = this.props;
    const { ccdsData, rebsData } = this.state;

    const ccds_data = [
      {
        firstColumn: 'CCD 01',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        firstColumn: 'CCD 02',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        firstColumn: 'CCD 03',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        firstColumn: 'CCD 04',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        firstColumn: 'CCD 04',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        firstColumn: 'CCD 05',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        firstColumn: 'CCD 06',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        firstColumn: 'CCD 07',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        firstColumn: 'CCD 08',
        'GD 0': '1.123',
        'OD 0': '1.123',
        'GV 0': '1.123',
        'RD 0': '1.123',
        'SW 0': '1.123',
      },
      {
        firstColumn: 'CCD 09',
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
          <Title>Raft {selectedRaft.id}</Title>
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
          <SimpleTable headers={this.REBs} data={rebsData} />
        </div>
        {/* CCDs table */}
        <div>
          <SimpleTable headers={this.CCDs} data={ccdsData} />
        </div>
      </div>
    );
  }
}

export default RaftDetail;
