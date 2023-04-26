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
import Sun from '../SkyElements/SunCartoon/SunCartoon';
import Stars from '../SkyElements/Stars/Stars';
import Moment from 'moment';
import { formatSecondsToDigital } from 'Utils';
import { summaryStateMap, summaryStateToStyle, schedulerDetailedStateToMap, schedulerDetailedStateToStyle } from 'Config';

export default class Headers extends Component {


  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
      summaryStateCommand: null,
      configurationOverride: '',
    };
  };

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
          this.sendSummaryStateCommand('stop');
        },
      },
      {
        icon: <LoadInfoIcon />,
        text: 'Load config',
        action: () => {
          this.sendSummaryStateCommand('load');
        },
      },
    ];
  }


  toggleContent() {
    this.setState((prevState) => ({ showOptions: !prevState.showOptions }));
  }

  sendSummaryStateCommand(option) {
    const { summaryStateCommand } = this.state;
    this.setState({
      summaryStateCommand: summaryStateCommand,
      configurationOverride: option,
    });
    console.log(option);
    // this.props.requestSALCommand({
    //   cmd: `cmd_${this.state.summaryStateCommand}`,
    //   csc: this.props.name,
    //   salindex: this.props.salindex,
    //   params:
    //     // this.state.summaryStateCommand === 'start'
    //     //   ? {
    //         {
    //           configurationOverride: this.state.configurationOverride,
    //         }
    //       // : {},
    // });
  }

  render() {
    const { schedulerState, subState, mode, type, isNigth, night, sunset, sunrise } = this.props;
    const { showOptions } = this.state;
    const current_time = Moment();
    const diffSunset = Moment.unix(sunset).diff(current_time, 'seconds');
    const diffSunrise = Moment.unix(sunrise).diff(current_time, 'seconds');
    const diffSunsetDigital = formatSecondsToDigital(diffSunset);
    const diffSunriseDigital = formatSecondsToDigital(diffSunrise);

    const cmdOptions = this.retrieveCmdOptions()

    // states on summary state section
    const schedulerSummaryState = summaryStateMap[schedulerState];
    const schedulerDetailedState = schedulerDetailedStateToMap[subState];

    return (
      <div className={styles.container}>
        <div className={styles.leftDivs}>
          <div className={styles.headersLeft}>
            <SummaryPanel className={styles.summaryPanel1}>
              <Title>Summary State</Title>
              <Value>
                <StatusText status={summaryStateToStyle[schedulerSummaryState]}>{schedulerSummaryState}</StatusText>
              </Value>
              <div className={styles.cmdOptions}>
                <GearIcon className={styles.gearIcon} onClick={() => this.toggleContent()} />
                {showOptions && (
                  <div className={styles.cmdDiv}>
                    {cmdOptions.map((option) => (
                      <div className={styles.cmdDivDetail}>
                        <Button key={option.text} onClick={option.action} className={styles.cmdBtn}>
                          {option.icon}
                          <span className={styles.cmdTxt}>{option.text}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Value>
                <StatusText status={schedulerDetailedStateToStyle[schedulerDetailedState]}>{schedulerDetailedState}</StatusText>
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
              <span>Night #{night} - {diffSunriseDigital} till Sunrise</span>
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
