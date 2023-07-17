import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import Button from '../../../GeneralPurpose/Button/Button';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import styles from './FocalPlaneSummaryDetail.module.css';
import {
  /* summaryStateMap,
  summaryStateToStyle, */
  cccameraRaftTempControlState,
  cccameraRaftTempControlStateToStyle,
} from 'Config';
import { defaultNumberFormatter } from 'Utils';

class FocalPlaneSummaryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      raftSummaryState: 0,
      raftTempControlState: 0,
      ccdsData: [],
      rebsData: [],
    };
  }

  REBs = [
    {
      field: 'identifier',
      title: '',
    },
    {
      field: 'bias',
      title: 'Bias',
      render: (value) => defaultNumberFormatter(value),
    },
    {
      field: 'voltage',
      title: 'Voltage [V]',
      type: 'number',
      className: styles.columns,
      render: (value) => defaultNumberFormatter(value),
    },
    {
      field: 'power',
      title: 'Power [P]',
      type: 'number',
      className: styles.columns,
      render: (value) => defaultNumberFormatter(value),
    },
  ];

  getCCDsHeaders() {
    const { selectedCCDVar } = this.props;
    return [
      {
        field: 'identifier',
        title: '',
      },
      {
        field: 'gDV',
        title: <Button onClick={() => this.changeCCDsPlotsVariable('gDV')}>GDV [V]</Button>,
        type: 'number',
        className: selectedCCDVar === 'gDV' ? styles.columnsHighlighted : styles.columns,
        render: (value) => defaultNumberFormatter(value),
      },
      {
        field: 'oDV',
        title: <Button onClick={() => this.changeCCDsPlotsVariable('oDV')}>ODV [V]</Button>,
        type: 'number',
        className: selectedCCDVar === 'oDV' ? styles.columnsHighlighted : styles.columns,
        render: (value) => defaultNumberFormatter(value),
      },
      {
        field: 'oGV',
        title: <Button onClick={() => this.changeCCDsPlotsVariable('oGV')}>OGV [V]</Button>,
        type: 'number',
        className: selectedCCDVar === 'oGV' ? styles.columnsHighlighted : styles.columns,
        render: (value) => defaultNumberFormatter(value),
      },
      {
        field: 'rDV',
        title: <Button onClick={() => this.changeCCDsPlotsVariable('rDV')}>RDV [V]</Button>,
        type: 'number',
        className: selectedCCDVar === 'rDV' ? styles.columnsHighlighted : styles.columns,
        render: (value) => defaultNumberFormatter(value),
      },
      {
        field: 'temp',
        title: <Button onClick={() => this.changeCCDsPlotsVariable('temp')}>SWT [C°]</Button>,
        type: 'number',
        className: selectedCCDVar === 'temp' ? styles.columnsHighlighted : styles.columns,
        render: (value) => defaultNumberFormatter(value),
      },
    ];
  }

  changeCCDsPlotsVariable(variable) {
    const { setSelectedCCDVar } = this.props;
    setSelectedCCDVar(variable);
  }

  getCCDIndex(id) {
    return parseInt(id) - 1;
  }

  getRebIndex(id) {
    return parseInt(id) - 1;
  }

  getSummaryDetailData() {
    const {
      selectedRaft,
      selectedCCD,
      selectedReb,
      tempControlActive,
      hVBiasSwitch,
      anaV,
      power,
      gDV,
      oDV,
      oGV,
      rDV,
      temp,
    } = this.props;
    const { ccds, rebs } = selectedRaft;

    const raftSummaryState = 2; // TODO: get info src
    const raftTempControlState = tempControlActive[selectedRaft.id - 1] ? 1 : 0;

    const ccdsData = [];
    ccds.forEach((c) => {
      ccdsData.push({
        identifier: `CCD ${c.id}`,
        gDV: gDV[this.getCCDIndex(c.id)],
        oDV: oDV[this.getCCDIndex(c.id)],
        oGV: oGV[this.getCCDIndex(c.id)],
        rDV: rDV[this.getCCDIndex(c.id)],
        temp: temp[this.getCCDIndex(c.id)],
        rowClass: selectedCCD?.id === c.id ? styles.selectedRow : '',
      });
    });

    const rebsData = [];
    rebs.forEach((r) => {
      rebsData.push({
        identifier: `REB ${r.id}`,
        bias: hVBiasSwitch[this.getRebIndex(r.id)],
        voltage: anaV[this.getRebIndex(r.id)],
        power: power[this.getRebIndex(r.id)],
        rowClass: selectedReb?.id === r.id ? styles.selectedRow : '',
      });
    });

    this.setState({ raftSummaryState, raftTempControlState, ccdsData, rebsData });
  }

  componentDidMount() {
    this.getSummaryDetailData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.selectedRaft?.id !== prevProps.selectedRaft?.id ||
      this.props.selectedReb?.id !== prevProps.selectedReb?.id ||
      this.props.selectedCCD?.id !== prevProps.selectedCCD?.id
    ) {
      this.getSummaryDetailData();
    }
  }

  render() {
    const { selectedRaft } = this.props;
    const { /* raftSummaryState, */ raftTempControlState, ccdsData, rebsData } = this.state;
    return (
      <div>
        <div className={styles.container}>
          <SummaryPanel className={styles.summaryPanel}>
            <Title>Raft {selectedRaft.id}</Title>
            <Value>
              {/* <StatusText status={summaryStateToStyle[summaryStateMap[raftSummaryState]]}>
                {summaryStateMap[raftSummaryState]}
              </StatusText> */}
            </Value>
            <Label>Temp Control</Label>
            <Value>
              <StatusText
                status={cccameraRaftTempControlStateToStyle[cccameraRaftTempControlState[raftTempControlState]]}
              >
                {cccameraRaftTempControlState[raftTempControlState]}
              </StatusText>
            </Value>
          </SummaryPanel>
        </div>
        {/* REBs table */}
        <div>
          <SimpleTable headers={this.REBs} data={rebsData} />
        </div>
        {/* CCDs table */}
        <div>
          <SimpleTable headers={this.getCCDsHeaders()} data={ccdsData} />
        </div>
      </div>
    );
  }
}

export default FocalPlaneSummaryDetail;
