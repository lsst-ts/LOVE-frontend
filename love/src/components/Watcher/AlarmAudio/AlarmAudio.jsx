/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import { Howl } from 'howler';
import isEqual from 'lodash/isEqual';
import { throttle } from 'lodash';

import { severityEnum } from '../../../Config';
import { isAcknowledged, isMuted, isMaxCritical, isCritical } from '../AlarmUtils';

import newWarningFile from '../../../sounds/new_warning.mp3';
import newSeriousFile from '../../../sounds/new_serious.mp3';
import newCriticalFile from '../../../sounds/new_critical.mp3';
import increasedWarningFile from '../../../sounds/increased_warning.mp3';
import increasedSeriousFile from '../../../sounds/increased_serious.mp3';
import increasedCriticalFile from '../../../sounds/increased_critical.mp3';
import unackedWarningFile from '../../../sounds/unacked_warning.mp3';
import unackedSeriousFile from '../../../sounds/unacked_serious.mp3';
import unackedCriticalFile from '../../../sounds/unacked_critical.mp3';
import stillCriticalFile from '../../../sounds/still_critical.mp3';

export default class AlarmAudio extends Component {
  static propTypes = {
    /** List of all the alarms that are displayed */
    alarms: PropTypes.array,
    /**
     * Contents of the alarms entry of LOVE configuration file.
     * It is expected to have a "minSeveritySound" with a values of either "warning", "serious" or "critical"
     */
    alarmsConfig: PropTypes.object,
    /** Function to subscribe to streams to receive the alarms */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving the alarms */
    unsubscribeToStreams: PropTypes.func,
  };

  static defaultProps = {
    alarms: [],
    alarmsConfig: null,
    subscribeToStreams: () => {},
    unsubscribeToStreams: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      minSeveritySound: severityEnum.critical + 1,
    };

    this.numCriticals = 0;
    this.newWarningSound = new Howl({
      src: [newWarningFile],
      onplayerror: () => {
        console.error('Error playing sound for warning alarm: ', newWarningFile);
      },
      onloaderror: () => {
        console.error('Error loading sound for warning alarm: ', newWarningFile);
      },
    });
    this.newSeriousSound = new Howl({
      src: [newSeriousFile],
      onplayerror: () => {
        console.error('Error playing sound for serious alarm: ', newSeriousFile);
      },
      onloaderror: () => {
        console.error('Error loading sound for serious alarm: ', newSeriousFile);
      },
    });
    this.newCriticalSound = new Howl({
      src: [newCriticalFile],
      loop: 1,
      onplayerror: () => {
        console.error('Error playing sound for critical alarm: ', newCriticalFile);
      },
      onloaderror: () => {
        console.error('Error loading sound for critical alarm: ', newCriticalFile);
      },
    });
    this.increasedWarningSound = new Howl({
      src: [increasedWarningFile],
      onplayerror: () => {
        console.error('Error playing sound for warning alarm: ', increasedWarningFile);
      },
      onloaderror: () => {
        console.error('Error loading sound for warning alarm: ', increasedWarningFile);
      },
    });
    this.increasedSeriousSound = new Howl({
      src: [increasedSeriousFile],
      onplayerror: () => {
        console.error('Error playing sound for serious alarm: ', increasedSeriousFile);
      },
      onloaderror: () => {
        console.error('Error loading sound for serious alarm: ', increasedSeriousFile);
      },
    });
    this.increasedCriticalSound = new Howl({
      src: [increasedCriticalFile],
      loop: 1,
      onplayerror: () => {
        console.error('Error playing sound for critical alarm: ', increasedCriticalFile);
      },
      onloaderror: () => {
        console.error('Error loading sound for critical alarm: ', increasedCriticalFile);
      },
    });
    this.unackedWarningSound = new Howl({
      src: [unackedWarningFile],
      onplayerror: () => {
        console.error('Error playing sound for warning alarm: ', unackedWarningFile);
      },
      onloaderror: () => {
        console.error('Error loading sound for warning alarm: ', unackedWarningFile);
      },
    });
    this.unackedSeriousSound = new Howl({
      src: [unackedSeriousFile],
      onplayerror: () => {
        console.error('Error playing sound for serious alarm: ', unackedSeriousFile);
      },
      onloaderror: () => {
        console.error('Error loading sound for serious alarm: ', unackedSeriousFile);
      },
    });
    this.unackedCriticalSound = new Howl({
      src: [unackedCriticalFile],
      loop: 1,
      onplayerror: () => {
        console.error('Error playing sound for critical alarm: ', unackedCriticalFile);
      },
      onloaderror: () => {
        console.error('Error loading sound for critical alarm: ', unackedCriticalFile);
      },
    });
    this.stillCriticalSound = new Howl({
      src: [stillCriticalFile],
      loop: 1,
      onplayerror: () => {
        console.error('Error playing sound for critical alarm: ', stillCriticalFile);
      },
      onloaderror: () => {
        console.error('Error loading sound for critical alarm: ', stillCriticalFile);
      },
    });
  }

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.alarmsConfig && !isEqual(this.props.alarmsConfig, prevProps.alarmsConfig)) {
      const minSeveritySound = this.props.alarmsConfig.minSeveritySound?.trim().toLowerCase();
      if (!minSeveritySound || minSeveritySound === 'mute' || minSeveritySound === 'muted') {
        // If minSeveritySound is null or "mute" or "muted", then do not play any sound
        this.setState({ minSeveritySound: severityEnum.critical + 1 });
      } else {
        this.setState({ minSeveritySound: severityEnum[minSeveritySound] });
      }
    }

    if (
      this.props.alarms &&
      (!isEqual(this.props.alarms, prevProps.alarms) || this.state.minSeveritySound !== prevState.minSeveritySound)
    ) {
      const difference = this.props.alarms.filter((x) => prevProps.alarms.findIndex((y) => x.name === y.name) === -1);
      // Don't play sound for new OK alarm
      if (difference.length === 1 && difference[0].severity.value === 1) {
        return;
      }
      this.throtCheckAndNotifyAlarms(this.props.alarms, prevProps.alarms);
    }
  };

  /**
   * Function to check if the alarms have changed and notify the user
   *
   * If the alarms have changed, then check if the new alarms are more severe than the old alarms
   * If they are, then play the appropriate sound
   * If they are not, then check if the old alarms were acknowledged
   * If they were, then stop the critical sound
   * If they were not, then do nothing
   *
   * @param {*} newAlarms
   * @param {*} oldAlarms
   */
  checkAndNotifyAlarms = (newAlarms, oldAlarms) => {
    const newHighestAlarm = { severity: severityEnum.ok, type: 'new' };
    newAlarms.forEach((newAlarm) => {
      const oldAlarm = oldAlarms.find((oldAlarm) => {
        return oldAlarm.name.value === newAlarm.name.value;
      });

      // If alarm was acknowledged stop the critical sound
      if (oldAlarm && !isAcknowledged(oldAlarm) && isAcknowledged(newAlarm)) {
        this.stopCriticals();
      }

      // If they are non-acked and non-muted
      if (!isAcknowledged(newAlarm) && !isMuted(newAlarm)) {
        if (newAlarm.severity.value > newHighestAlarm.severity) {
          newHighestAlarm.severity = newAlarm.severity.value;
          newHighestAlarm.type = 'new';
        }

        if (oldAlarm) {
          if (oldAlarm.severity.value < newAlarm.severity.value) {
            // If they are increased, play the "increased" sound
            if (newAlarm.severity.value > newHighestAlarm.severity) {
              newHighestAlarm.severity = newAlarm.severity.value;
              newHighestAlarm.type = 'increased';
            }
          }

          if (!isAcknowledged(newAlarm) && isAcknowledged(oldAlarm)) {
            // If they are unacknowledged, play the "unacked" sound
            if (newAlarm.severity.value >= newHighestAlarm.severity) {
              newHighestAlarm.severity = newAlarm.severity.value;
              newHighestAlarm.type = 'unacked';
            }
          }

          if (!isAcknowledged(newAlarm) && !isAcknowledged(oldAlarm)) {
            // If they are still critical, play the "still critical" sound
            if (isCritical(newAlarm) && isCritical(oldAlarm)) {
              newHighestAlarm.severity = newAlarm.severity.value;
              newHighestAlarm.type = 'still';
            }
          }
        }
      }
    });

    if (newHighestAlarm.severity >= this.state.minSeveritySound) {
      this.stopCriticals();
      this.playSound(newHighestAlarm.severity, newHighestAlarm.type);
    }
  };

  /**
   * Throtle checkAndNotifyAlarms
   */
  throtCheckAndNotifyAlarms = throttle(this.checkAndNotifyAlarms, 3000);

  playSound = (severity, type) => {
    if (severity < this.state.minSeveritySound) {
      return;
    }
    if (severity === severityEnum.warning) {
      switch (type) {
        case 'new': {
          this.newWarningSound.play();
          break;
        }
        case 'increased': {
          this.increasedWarningSound.play();
          break;
        }
        case 'unacked': {
          this.unackedWarningSound.play();
          break;
        }
        default:
          break;
      }
    } else if (severity === severityEnum.serious) {
      switch (type) {
        case 'new': {
          this.newSeriousSound.play();
          break;
        }
        case 'increased': {
          this.increasedSeriousSound.play();
          break;
        }
        case 'unacked': {
          this.unackedSeriousSound.play();
          break;
        }
        default:
          break;
      }
    } else if (severity === severityEnum.critical) {
      switch (type) {
        case 'new': {
          this.newCriticalSound.play();
          break;
        }
        case 'increased': {
          this.increasedCriticalSound.play();
          break;
        }
        case 'unacked': {
          this.unackedCriticalSound.play();
          break;
        }
        case 'still': {
          this.stillCriticalSound.play();
          break;
        }
        default:
          break;
      }
    }
  };

  stopCriticals = () => {
    this.newCriticalSound.stop();
    this.increasedCriticalSound.stop();
    this.unackedCriticalSound.stop();
    this.stillCriticalSound.stop();
  };

  render() {
    return <></>;
  }
}
