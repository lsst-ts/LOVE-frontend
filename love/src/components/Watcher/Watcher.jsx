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
import { DateTime } from 'luxon';
import MuteIcon from '../icons/MuteIcon/MuteIcon';
import Badge from '../GeneralPurpose/Badge/Badge';
import AlarmsTable from './AlarmsTable/AlarmsTable';
import { isAcknowledged, isMuted, isActive } from './AlarmUtils';
import styles from './Watcher.module.css';

const TIMEOUT = 10;

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
    /** Function to dispatch an alarm logging */
    logAlarm: PropTypes.func,
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
    default: (row) => (isAcknowledged(row) ? '0-' : '1-') + row.severity.value,
    severity: (row) => row.severity.value + (isAcknowledged(row) ? '-0' : '-1'),
    maxSeverity: (row) => row.maxSeverity.value + (isAcknowledged(row) ? '-0' : '-1'),
    name: (row) => row.name.value + (isAcknowledged(row) ? '-0' : '-1'),
    timestampSeverityOldest: (row) => row.timestampSeverityOldest.value + (isAcknowledged(row) ? '-0' : '-1'),
  };

  mutedSortFunctions = {
    ...this.sortFunctions,
    default: this.sortFunctions['severity'],
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.waiting === false && this.state.waiting === true) {
      clearTimeout(this.timer);
      this.timer = setTimeout(
        () => {
          this.setState({ waiting: false });
        },
        TIMEOUT * 1000 + 100,
      );
    }
  }

  render() {
    const { alarms } = this.props;
    let alarmsToShow = [];
    let mutedAlarmsCount = 0;
    let unmutedAlarmsCount = 0;
    let inactiveAlarmsCount = 0;
    let unackUnmutedAlarmsCount = 0;

    alarms.forEach((alarm) => {
      if (!isActive(alarm)) {
        inactiveAlarmsCount += 1;
        if (this.state.selectedTab === 'inactive') {
          alarmsToShow.push(alarm);
        }
      } else if (isMuted(alarm)) {
        mutedAlarmsCount += 1;
        if (this.state.selectedTab === 'muted') {
          alarmsToShow.push(alarm);
        }
      } else {
        unmutedAlarmsCount += 1;
        unackUnmutedAlarmsCount += isAcknowledged(alarm) ? 0 : 1;
        if (this.state.selectedTab === 'unmuted') {
          alarmsToShow.push(alarm);
        }
      }
    });

    return (
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

          <div
            className={[styles.tab, this.state.selectedTab === 'inactive' ? styles.selected : ''].join(' ')}
            onClick={() => this.changeTab('inactive')}
          >
            <div className={styles.tabLabel}>
              <div className={styles.iconWrapper}>
                <MuteIcon style={this.state.selectedTab === 'inactive' ? styles.selectedIcon : ''} />
              </div>
              INACTIVE ALARMS ({inactiveAlarmsCount})
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
            logAlarm={(name) => {
              this.setState({ waiting: true });
              this.props.logAlarm(name);
            }}
            sortFunctions={this.state.selectedTab === 'unmuted' ? this.sortFunctions : this.mutedSortFunctions}
          />
        </div>
      </div>
    );
  }
}
