import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Howl } from 'howler';

import { severityEnum } from '../../../Config';
import { isAcknowledged, isMuted, isMaxCritical } from '../AlarmUtils';

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
    /** List of new alarms, that si they are either new or have been changed */
    newAlarms: PropTypes.array,
    /**
     * Contents of the LOVE configuration file.
     * It is expected to have a "alarm_sounds" key with the following structure:
     * alarm_sounds {
     *   critical: <ON/OFF, either 1, 0 of boolean>,
     *   serious: <ON/OFF, either 1, 0 of boolean>,
     *   warning: <ON/OFF, either 1, 0 of boolean>,
     * }
     */
    config: PropTypes.object,
    /** Function to subscribe to streams to receive the alarms */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving the alarms */
    unsubscribeToStreams: PropTypes.func,
  };

  static defaultProps = {
    alarms: [],
    newAlarms: [],
    config: null,
    subscribeToStreams: () => {},
    unsubscribeToStreams: () => {},
  };

  /** A conservative default configuration, all alarms sound... */
  defaultConf = {
    critical: 1,
    serious: 1,
    warning: 1,
  };

  constructor(props) {
    super(props);
    this.state = {};

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
    if (this.props.newAlarms !== prevProps.newAlarms) {
      this.checkAndNotifyAlarms(this.props.newAlarms, prevProps.alarms);
    }
  };

  checkAndNotifyAlarms = (newAlarms, oldAlarms) => {
    let deltaCriticals = 0;
    newAlarms.forEach((newAlarm) => {
      if (newAlarm === undefined) return;
      const oldAlarm = oldAlarms.find((oldAlarm) => {
        return oldAlarm.name.value === newAlarm.name.value;
      });

      // If they are non-acked and non-muted
      if (!isAcknowledged(newAlarm) && !isMuted(newAlarm)) {
        // If they are new, play the "new" sound
        if (!oldAlarm || oldAlarm.maxSeverity.value === severityEnum.ok) {
          if (isMaxCritical(newAlarm)) deltaCriticals++;
          this.playSound(newAlarm.maxSeverity.value, 'new');
        }
        // If they have increased, play the "increased" sound
        else if (newAlarm.maxSeverity.value > oldAlarm.maxSeverity.value) {
          if (newAlarm.maxSeverity.value === severityEnum.critical) deltaCriticals++;
          this.playSound(newAlarm.maxSeverity.value, 'increased');
        }
        // If they have been unacked, play the "unacked" sound
        else if (!isAcknowledged(newAlarm) && isAcknowledged(oldAlarm)) {
          if (newAlarm.maxSeverity.value === severityEnum.critical) deltaCriticals++;
          this.playSound(newAlarm.maxSeverity.value, 'unacked');
        }
        // Else, they should not emit a new sound!
      }
      // If they are critical and cleared, discount them
      if (
        oldAlarm &&
        isMaxCritical(oldAlarm) &&
        !isAcknowledged(oldAlarm) &&
        !isMuted(oldAlarm) &&
        (isAcknowledged(newAlarm) || isMuted(newAlarm) || !isMaxCritical(newAlarm))
      ) {
        deltaCriticals--;
      }
    });
    this.numCriticals += deltaCriticals;
    // Stop the sound if some critical alarm was cleared
    if (deltaCriticals < 0) {
      this.stopCriticals();
      // Play the "still sound" if there are still other critical alarms
      if (this.numCriticals > 0) {
        this.stillCriticalSound.play();
      }
    }
  };

  playSound = (severity, type) => {
    const config = this.props.config?.alarm_sounds || this.defaultConf;
    if (severity === severityEnum.warning && config.warning) {
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
    } else if (severity === severityEnum.serious && config.serious) {
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
    } else if (severity === severityEnum.critical && config.critical) {
      switch (type) {
        case 'new': {
          this.stopCriticals();
          this.newCriticalSound.play();
          break;
        }
        case 'increased': {
          this.stopCriticals();
          this.increasedCriticalSound.play();
          break;
        }
        case 'unacked': {
          this.stopCriticals();
          this.unackedCriticalSound.play();
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
