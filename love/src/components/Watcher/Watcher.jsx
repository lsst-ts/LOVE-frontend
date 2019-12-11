import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuteIcon from '../icons/MuteIcon/MuteIcon';
import Panel from '../GeneralPurpose/Panel/Panel';
import AlarmsTable from './AlarmsTable/AlarmsTable';
import styles from './Watcher.module.css';

export default class Watcher extends Component {
  static propTypes = {
    /** List of alarms that are displayed. See examples below */
    alarms: PropTypes.array,
    /** Function to dispatch an alarm acknowledgement */
    ackAlarm: PropTypes.func,
    /** Function to dispatch an alarm mute */
    muteAlarm: PropTypes.func,
    /** Function to dispatch an alarm unmute */
    unmuteAlarm: PropTypes.func,
    /** Function to subscribe to streams to receive the alarms */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving the alarms */
    unsubscribeToStreams: PropTypes.func,
  };

  static defaultProps = {
    alarms: [],
  };

  constructor() {
    super();
    this.state = {
      selectedTab: 'unmuted',
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  changeTab(tab) {
    this.setState({ selectedTab: tab });
  }

  render() {
    const sortFunctions = {
      default: row => (row['acknowledged'] ? '0-' : '1-') + row['severity'],
      severity: row => (row['severity'] + (row['acknowledged'] ? '-0' : '-1')),
      maxSeverity: row => (row['maxSeverity'] + (row['acknowledged'] ? '-0' : '-1')),
      name: row => (row['name'] + (row['acknowledged'] ? '-0' : '-1')),
      timestampSeverityOldest: row => (row['timestampSeverityOldest'] + (row['acknowledged'] ? '-0' : '-1')),
    };

    const preFilter = (alarm) =>
      (this.state.selectedTab === 'unmuted' ? alarm['mutedBy'] === '' : alarm['mutedBy'] !== '') &&
      !(alarm['severity'] <= 1 && alarm['maxSeverity'] <= 1 && alarm['acknowledged']);

    const mutedSortFunctions = {
      ...sortFunctions,
      default: sortFunctions['severity'],
    };
    this.test = null;
    return (
      <Panel title="Watcher" className={styles.panel}>
        <div className={styles.tabsWrapper}>
          <div className={styles.tabsRow}>
            <div
              className={[styles.tab, this.state.selectedTab === 'unmuted' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('unmuted')}
            >
              <div className={styles.iconWrapper}>
                <MuteIcon unmuted style={this.state.selectedTab === 'unmuted' ? styles.selectedIcon : ''} />
              </div>
              UNMUTED ALARMS
            </div>

            <div
              className={[styles.tab, this.state.selectedTab === 'muted' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('muted')}
            >
              <div className={styles.iconWrapper}>
                <MuteIcon style={this.state.selectedTab === 'muted' ? styles.selectedIcon : ''} />
              </div>
              MUTED ALARMS
            </div>
          </div>

          <div className={styles.alarmsTableWrapper}>
            <AlarmsTable
              alarms={this.props.alarms.filter(preFilter)}
              ackAlarm={this.props.ackAlarm}
              muteAlarm={this.props.muteAlarm}
              unmuteAlarm={this.props.unmuteAlarm}
              sortFunctions={this.state.selectedTab === 'unmuted' ? sortFunctions : mutedSortFunctions }
            />
          </div>
        </div>
      </Panel>
    );
  }
}
