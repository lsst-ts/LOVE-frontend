import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { summaryStateMap, summaryStateToStyle } from 'Config';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';

import styles from './Summary.module.css';

export default class Summary extends Component {
  static propTypes = {
    /** Current summary state of the CSC. High level state machine state identifier. */
    summaryState: PropTypes.number,
    /** Can the commandable SAL component (CSC) control the MTM2?
     * If true the CSC can control the MTM2; else the Engineering User Interface has control. */
    commandableByDDS: PropTypes.bool,
    /** The status of force balance (FB) system (on or off). */
    forceBalanceSystemStatus: PropTypes.bool,
    /** Indicates when all of the M2 axes are within tolerance of the target positions.
     * True if the M2 assembly is in position. */
    m2AssemblyInPosition: PropTypes.bool,
  };

  static defaultProps = {
    summaryState: 0,
    commandableByDDS: false,
    forceBalanceSystemStatus: false,
    m2AssemblyInPosition: false,
  };

  render() {
    const summaryStateName = summaryStateMap[this.props.summaryState];
    const summaryStateStatus = summaryStateToStyle[summaryStateName];

    const commandableByDDSValue = {
      name: this.props.commandableByDDS ? 'CSC' : 'EUI',
      class: this.props.commandableByDDS ? 'ok' : 'warning',
    };
    const forceBalanceSystemStatusValue = {
      name: this.props.forceBalanceSystemStatus ? 'ENABLED' : 'DISABLED',
      class: this.props.forceBalanceSystemStatus ? 'ok' : 'warning',
    };
    const m2AssemblyInPositionValue = {
      name: this.props.m2AssemblyInPosition ? 'InPosition' : 'NotInPosition',
      class: this.props.m2AssemblyInPosition ? 'ok' : 'warning',
    };
    return (
      <div className={styles.summaryContainer}>
        <SummaryPanel className={styles.summaryPanelStates}>
          <div className={styles.state}>
            <Title>M2 Status</Title>
            <StatusText status={summaryStateStatus}>{summaryStateName}</StatusText>
          </div>
          <div className={styles.state}>
            <Title>Command</Title>
            <StatusText status={commandableByDDSValue?.class}>{commandableByDDSValue?.name}</StatusText>
          </div>
          <div className={styles.state}>
            <Title>M2 Assembly</Title>
            <StatusText status={m2AssemblyInPositionValue?.class}>{m2AssemblyInPositionValue?.name}</StatusText>
          </div>
          <div className={styles.state}>
            <Title>Force Balance</Title>
            <StatusText status={forceBalanceSystemStatusValue?.class}>{forceBalanceSystemStatusValue?.name}</StatusText>
          </div>
        </SummaryPanel>
      </div>
    );
  }
}
