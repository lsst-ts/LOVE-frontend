import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Row from '../../../GeneralPurpose/SummaryPanel/Row';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import styles from './FocalPlaneSummaryDetail.module.css';

class FocalPlaneSummaryDetail extends Component {
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
      title: 'Bias',
    },
    {
      field: 'voltage',
      title: 'Voltage [V]',
      type: 'number',
      className: styles.columns,
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'power',
      title: 'Power [P]',
      type: 'number',
      className: styles.columns,
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
  ];

  CCDs = [
    {
      field: 'firstColumn',
      title: '',
    },
    {
      field: 'GD',
      title: 'GD 0 [V]',
      type: 'number',
      className: styles.columns,
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'ODm',
      title: 'OD 0 [mA]',
      type: 'number',
      className: styles.columns,
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'ODv',
      title: 'OD 0 [V]',
      type: 'number',
      className: styles.columns,
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'GV',
      title: 'GV 0 [V]',
      type: 'number',
      className: styles.columns,
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'RD',
      title: 'RD 0 [V]',
      type: 'number',
      className: styles.columns,
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'SW',
      title: 'SW 0 [C°]',
      type: 'number',
      className: styles.columns,
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
  ];

  getSummaryDetailData() {
    const { selectedRaft, selectedCCD, selectedReb } = this.props;
    const { ccds, rebs } = selectedRaft;
    const ccdsData = [];
    ccds.forEach((c) => {
      ccdsData.push({
        firstColumn: `CCD ${c.id}`,
        GD: Math.random() * 75,
        ODm: Math.random() * 100,
        ODv: Math.random() * 50,
        GV: Math.random() * 75,
        RD: Math.random() * 50,
        SW: Math.random() * 100,
        rowClass: selectedCCD?.id === c.id ? styles.selectedRow : '',
      });
    });

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
      (this.props.selectedReb && this.props.selectedReb.id !== prevProps.selectedReb?.id) ||
      (this.props.selectedCCD && this.props.selectedCCD.id !== prevProps.selectedCCD?.id)
    ) {
      this.getSummaryDetailData();
    }
  }

  render() {
    const { selectedRaft } = this.props;
    const { ccdsData, rebsData } = this.state;
    const { tempControlActive, hVBiasSwitch, anaV, power, gDV, oDI, oDV, oGV, rDV, temp } = this.props;
    return (
      <div>
        <div className={styles.container}>
          <SummaryPanel className={styles.summaryPanel}>
            <Title>Raft {selectedRaft.id}</Title>
            <Value>
              <StatusText>OK</StatusText>
            </Value>
            <Label>Temp Control</Label>
            <Value>
              <StatusText>{tempControlActive}</StatusText>
            </Value>
          </SummaryPanel>
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

export default FocalPlaneSummaryDetail;
