import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import CSCDetailStyles from 'components/CSCSummary/CSCDetail/CSCDetail.module.css';

import styles from './Summary.module.css';

export default class Summary extends Component {
  static propTypes = {
    /** Current summary state of the CSC. High level state machine state identifier. */
    summaryState: PropTypes.number,
    /**  */
    enabled: PropTypes.bool,
    /**  */
    fanHeaters: PropTypes.bool,
    /**  */
    coolantPump: PropTypes.bool,
  };

  static defaultProps = {
    summaryState: 0,
    enabled: false,
    fanHeaters: false,
    coolantPump: false,
  };

  render() {
    const summaryStateValue = CSCDetail.states[this.props.summaryState ?? Summary.defaultProps.summaryState];
    const m1m3tsEnabledValue = {
      name: this.props.enabled ? 'ENABLED' : 'DISABLED',
      class: CSCDetailStyles[this.props.enabled ? 'ok' : 'warning'],
    };
    const m1m3tsFanHeatersValue = {
      name: this.props.fanHeaters ? 'ENABLED' : 'DISABLED',
      class: CSCDetailStyles[this.props.fanHeaters ? 'ok' : 'warning'],
    };
    const m1m3tsCoolantPumpValue = {
      name: this.props.coolantPump ? 'ENABLED' : 'DISABLED',
      class: CSCDetailStyles[this.props.coolantPump ? 'ok' : 'warning'],
    };

    return (
        <div className={styles.summaryPanelControls}>
          <div className={styles.controls}>
            <div className={styles.control}>
              <span className={styles.title}>M1M3TS</span>
              <span className={[summaryStateValue?.class, styles.summaryState].join(' ')}>
                {summaryStateValue?.name}
              </span>
            </div>
            <div className={styles.control}>
              <span className={styles.title}>Status</span>
              <span className={[m1m3tsEnabledValue.class, styles.summaryState].join(' ')}>
                {m1m3tsEnabledValue.name}
              </span>
            </div>
            <div className={styles.control}>
              <span className={styles.title}>Fan Heaters</span>
              <span className={[m1m3tsFanHeatersValue.class, styles.summaryState].join(' ')}>
                {m1m3tsFanHeatersValue.name}
              </span>
            </div>
            <div className={styles.control}>
              <span className={styles.title}>Coolant Pump</span>
              <span className={[m1m3tsCoolantPumpValue.class, styles.summaryState].join(' ')}>
                {m1m3tsCoolantPumpValue.name}
              </span>
            </div>
          </div>
          
        </div>
    );
  }
}
