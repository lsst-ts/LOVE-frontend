/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
import styles from './Headers.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import GearIcon from 'components/icons/ScriptQueue/GearIcon/GearIcon.jsx';
import PauseIcon from 'components/icons/ScriptQueue/PauseIcon/PauseIcon';
import ResumeIcon from 'components/icons/ScriptQueue/ResumeIcon/ResumeIcon'; // play button
import LoadInfoIcon from 'components/icons/LoadInfoIcon/LoadInfoIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import Sun from '../SkyElements/SunCartoon/SunCartoon';
import Stars from '../SkyElements/Stars/Stars';
import Moment from 'moment';
import { formatSecondsToDigital } from 'Utils';
import {
  summaryStateMap,
  summaryStateToStyle,
  schedulerDetailedStateToMap,
  schedulerDetailedStateToStyle,
  URL_REGEX,
} from 'Config';

export default class Headers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
      showSchedulerConfigs: false,
      selectedSchedulerConfig: null,
      inputSchedulerConfigError: false,
      isValidUri: false,
    };
  }

  retrieveCmdOptions() {
    return [
      {
        icon: <ResumeIcon />,
        text: 'Play',
        action: () => {
          this.sendSummaryStateCommand('resume');
        },
      },
      {
        icon: <PauseIcon />,
        text: 'Stop',
        action: () => {
          const abort = false;
          this.sendSummaryStateCommand('stop', { abort });
        },
      },
      {
        icon: <LoadInfoIcon />,
        text: 'Load config',
        action: () => {
          this.toggleSchedulerConfigs();
        },
      },
    ];
  }

  toggleSchedulerCmdOptions() {
    this.setState((prevState) => ({ showOptions: !prevState.showOptions }));
  }

  toggleSchedulerConfigs() {
    this.setState((prevState) => ({ showSchedulerConfigs: !prevState.showSchedulerConfigs }));
  }

  sendSummaryStateCommand(option, params) {
    const { requestSALCommand, salindex } = this.props;
    this.setState({ showOptions: false, showSchedulerConfigs: false });
    requestSALCommand({
      cmd: `cmd_${option}`,
      csc: 'Scheduler',
      salindex,
      params,
    });
  }

  validateUri = (uri) => {
    const valid = URL_REGEX.test(uri);
    this.setState({ isValidUri: valid });
  };

  renderSchedulerConfigs() {
    const { selectedSchedulerConfig, inputSchedulerConfigError, isValidUri } = this.state;
    return (
      <div className={styles.loadConfigDiv}>
        <Input
          className={inputSchedulerConfigError ? styles.inputError : ''}
          placeholder="Insert Uri"
          onChange={(e) => {
            this.validateUri(e.target.value);
            this.setState({
              selectedSchedulerConfig: e.target.value,
              inputSchedulerConfigError: false,
            });
          }}
        />
        <br></br>
        <Button
          onClick={() => {
            if (selectedSchedulerConfig === null || selectedSchedulerConfig === '' || !isValidUri) {
              this.setState({ inputSchedulerConfigError: true });
            } else {
              this.sendSummaryStateCommand('load', {
                uri: selectedSchedulerConfig,
              });
              this.setState({
                inputSchedulerConfigError: false,
                selectedSchedulerConfig: null,
              });
            }
          }}
        >
          Send
        </Button>
      </div>
    );
  }

  render() {
    const { schedulerState, subState, mode, type, isNigth, night, sunset, sunrise } = this.props;
    const { showOptions, showSchedulerConfigs } = this.state;
    const current_time = Moment();
    const diffSunset = Moment.unix(sunset).diff(current_time, 'seconds');
    const diffSunrise = Moment.unix(sunrise).diff(current_time, 'seconds');
    const diffSunsetDigital = formatSecondsToDigital(diffSunset);
    const diffSunriseDigital = formatSecondsToDigital(diffSunrise);

    const cmdOptions = this.retrieveCmdOptions();

    // states on summary state section
    const schedulerSummaryState = summaryStateMap[schedulerState];
    const schedulerDetailedState = schedulerDetailedStateToMap[subState];

    return (
      <div className={styles.container}>
        <div className={styles.leftDivs}>
          <div className={styles.headersLeft}>
            <SummaryPanel className={styles.summaryPanel1}>
              <Title className={styles.sumState}>Summary State</Title>
              <Value>
                <StatusText status={summaryStateToStyle[schedulerSummaryState]}>{schedulerSummaryState}</StatusText>
              </Value>
              <GearIcon className={styles.gearIcon} onClick={() => this.toggleSchedulerCmdOptions()} />
              {showOptions && (
                <div className={styles.cmdOptions}>
                  <div className={styles.cmOptionsDiv}>
                    <div className={styles.cmdDiv}>
                      {cmdOptions.map((option) => (
                        <div onClick={option.action} className={styles.cmdDivDetail}>
                          <div key={option.text} className={styles.cmdIcon}>
                            {option.icon}
                          </div>
                          <span className={styles.cmdTxt}>{option.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {showSchedulerConfigs && (
                    <div className={styles.schedulerConfigsDiv}>{this.renderSchedulerConfigs()}</div>
                  )}
                </div>
              )}
              <Value>
                <StatusText status={schedulerDetailedStateToStyle[schedulerDetailedState]}>
                  {schedulerDetailedState}
                </StatusText>
              </Value>
            </SummaryPanel>
          </div>
          <div className={styles.headersCenter}>
            <SummaryPanel className={styles.summaryPanel2}>
              <Label>Obs. Mode</Label>
              <Value>{mode}</Value>
              <Label>Obs. Type</Label>
              <Value>{type}</Value>
            </SummaryPanel>
          </div>
        </div>
        <div className={styles.headersRigth}>
          {isNigth ? (
            <div className={styles.nightDiv}>
              <div className={styles.iconStars}>
                <Stars />
              </div>
              <span>
                Night #{night} - {diffSunriseDigital} till Sunrise
              </span>
            </div>
          ) : (
            <div className={styles.dayDiv}>
              <div className={styles.iconSun}>
                <Sun />
              </div>
              <span>Day - {diffSunsetDigital} till Sunset</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
