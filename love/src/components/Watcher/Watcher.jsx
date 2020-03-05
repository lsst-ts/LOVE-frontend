import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import MuteIcon from '../icons/MuteIcon/MuteIcon';
import Panel from '../GeneralPurpose/Panel/Panel';
import Badge from '../GeneralPurpose/Badge/Badge';
import AlarmsTable from './AlarmsTable/AlarmsTable';
import styles from './Watcher.module.css';

const TIMEOUT = 3;

export default class Watcher extends Component {
  static propTypes = {
    /** Name of the current user */
    user: PropTypes.string,
    /** Number of seconds to add to a TAI timestamp to convert it in UTC */
    taiToUtc: PropTypes.number,
    /** List of alarms that are displayed. See examples below */
    alarms: PropTypes.array,
    /** Function to dispatch an alarm acknowledgement */
    ackAlarm: PropTypes.func,
    /** Function to dispatch an alarm unacknowledgement */
    unackAlarm: PropTypes.func,
    /** Function to dispatch an alarm mute */
    muteAlarm: PropTypes.func,
    /** Function to dispatch an alarm unmute */
    unmuteAlarm: PropTypes.func,
    /** Function to subscribe to streams to receive the alarms */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving the alarms */
    unsubscribeToStreams: PropTypes.func,
    /** Whether is embedded into other or is isolated */
    embedded: PropTypes.bool,
  };

  static defaultProps = {
    alarms: [],
  };

  constructor() {
    super();
    this.state = {
      selectedTab: 'unmuted',
      waiting: false,
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    clearTimeout(this.timer);
    this.props.unsubscribeToStreams();
  };

  changeTab(tab) {
    this.setState({ selectedTab: tab });
  }

  sortFunctions = {
    default: (row) => (row['acknowledged'] ? '0-' : '1-') + row['severity'],
    severity: (row) => row['severity'] + (row['acknowledged'] ? '-0' : '-1'),
    maxSeverity: (row) => row['maxSeverity'] + (row['acknowledged'] ? '-0' : '-1'),
    name: (row) => row['name'] + (row['acknowledged'] ? '-0' : '-1'),
    timestampSeverityOldest: (row) => row['timestampSeverityOldest'] + (row['acknowledged'] ? '-0' : '-1'),
  };

  mutedSortFunctions = {
    ...this.sortFunctions,
    default: this.sortFunctions['severity'],
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.waiting === false && this.state.waiting === true) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.setState({ waiting: false });
      }, TIMEOUT * 1000 + 100);
    }
  }

  render() {
    let alarmsToShow = [];
    let mutedAlarmsCount = 0;
    let unmutedAlarmsCount = 0;
    let unackUnmutedAlarmsCount = 0;
    const now = moment().unix() - this.props.taiToUtc;

    this.props.alarms.forEach((alarm) => {
      if (
        alarm['severity'] <= 1 &&
        alarm['maxSeverity'] <= 1 &&
        now - alarm['timestampAcknowledged'] >= TIMEOUT
      ) {
        return;
      }

      if (alarm['mutedBy'] === '') {
        unmutedAlarmsCount += 1;
        unackUnmutedAlarmsCount += alarm['acknowledged'] ? 0 : 1;
        if (this.state.selectedTab === 'unmuted') {
          alarmsToShow.push(alarm);
        }
      } else {
        mutedAlarmsCount += 1;
        if (this.state.selectedTab === 'muted') {
          alarmsToShow.push(alarm);
        }
      }
    });

    this.test = null;

    return (
      <Panel title="Watcher" className={styles.panel} expandHeight={this.props.embedded}>
        <div className={styles.tabsWrapper}>
          <div className={styles.tabsRow}>
            <div
              className={[styles.tab, this.state.selectedTab === 'unmuted' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('unmuted')}
            >
              <div className={styles.tabLabel}>
                <div className={styles.iconWrapper}>
                  <MuteIcon unmuted style={this.state.selectedTab === 'unmuted' ? styles.selectedIcon : ''} />
                </div>
                ACTIVE ALARMS ({unmutedAlarmsCount})
              </div>
              {unackUnmutedAlarmsCount === 0 ? null : <Badge status="info">{unackUnmutedAlarmsCount}</Badge>}
            </div>

            <div
              className={[styles.tab, this.state.selectedTab === 'muted' ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('muted')}
            >
              <div className={styles.tabLabel}>
                <div className={styles.iconWrapper}>
                  <MuteIcon style={this.state.selectedTab === 'muted' ? styles.selectedIcon : ''} />
                </div>
                MUTED ALARMS ({mutedAlarmsCount})
              </div>
            </div>
          </div>

          <div className={[styles.alarmsTableWrapper, this.props.embedded ? styles.embedded : ''].join(' ')}>
            <AlarmsTable
              user={this.props.user}
              taiToUtc={this.props.taiToUtc}
              alarms={alarmsToShow}
              ackAlarm={(name, severity, acknowledgedBy) => {
                this.setState({ waiting: true });
                this.props.ackAlarm(name, severity, acknowledgedBy);
              }}
              unackAlarm={this.props.unackAlarm}
              muteAlarm={this.props.muteAlarm}
              unmuteAlarm={this.props.unmuteAlarm}
              sortFunctions={this.state.selectedTab === 'unmuted' ? this.sortFunctions : this.mutedSortFunctions}
            />
          </div>
        </div>
      </Panel>
    );
  }
}
