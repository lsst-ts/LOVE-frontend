import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import CSCDetailStyles from 'components/CSCSummary/CSCDetail/CSCDetail.module.css';

import styles from './Summary.module.css';

export default class Summary extends Component {
    static propTypes = {
        summaryState: PropTypes.number,
        commandableByDDS: PropTypes.bool,
        forceBalanceSystemStatus: PropTypes.bool,
        m2AssemblyInPosition: PropTypes.bool,
    };

    static defaultProps = {
        summaryState: 0,
        commandableByDDS: false,
        forceBalanceSystemStatus: false,
        m2AssemblyInPosition: false,
    };

    render() {

        const summaryStateValue = CSCDetail.states[this.props.summaryState ? this.props.summaryState : 0];
        const commandableByDDSValue = {
            name: this.props.commandableByDDS ? 'CSC' : 'EUI',
            class: CSCDetailStyles[this.props.commandableByDDS ? 'ok' : 'warning'],
        };
        const forceBalanceSystemStatusValue = {
            name: this.props.forceBalanceSystemStatus ? 'ENABLED' : 'DISABLED',
            class: CSCDetailStyles[this.props.forceBalanceSystemStatus ? 'ok' : 'warning'],
        };
        const m2AssemblyInPositionValue = {
            name: this.props.m2AssemblyInPosition ? 'InPosition' : 'NotInPosition',
            class: CSCDetailStyles[this.props.m2AssemblyInPosition ? 'ok' : 'warning'],
        };

        return (
            <div className={styles.summaryContainer}>
                <SummaryPanel className={styles.summaryPanelStates}>
                    <div className={styles.state}>
                        <Title>M2 Status</Title>
                        <span className={[summaryStateValue?.class, styles.summaryState].join(' ')}>
                            {summaryStateValue?.name}
                        </span>
                    </div>
                    <div className={styles.state}>
                        <Title>Command</Title>
                        <span className={[commandableByDDSValue.class, styles.summaryState].join(' ')}>
                            {commandableByDDSValue.name}
                        </span>
                    </div>
                    <div className={styles.state}>
                        <Title>M2 Assembly</Title>
                        <span className={[m2AssemblyInPositionValue.class, styles.summaryState].join(' ')}>
                            {m2AssemblyInPositionValue.name}
                        </span>
                    </div>
                    <div className={styles.state}>
                        <Title>Force Balance</Title>
                        <span className={[forceBalanceSystemStatusValue.class, styles.summaryState].join(' ')}>
                            {forceBalanceSystemStatusValue.name}
                        </span>
                    </div>
                </SummaryPanel>

            </div>
        );
    }
}