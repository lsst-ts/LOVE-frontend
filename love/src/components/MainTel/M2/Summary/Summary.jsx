/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { summaryStateMap, summaryStateToStyle, alignedStateMap, alignedStateToStyle } from 'Config';
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

    const alignedStateName = alignedStateMap[this.props.alignment];
    const alignedStateStatus = alignedStateToStyle[alignedStateName];

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
          <div className={styles.state}>
            <Title>M1M3 Alignment</Title>
            <StatusText status={alignedStateStatus}>{alignedStateName}</StatusText>
          </div>
        </SummaryPanel>
      </div>
    );
  }
}
