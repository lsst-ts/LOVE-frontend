/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import PropTypes from 'prop-types';
import ScriptQueue from 'components/ScriptQueue/ScriptQueue.jsx';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText.jsx';
import ResumeIcon from 'components/icons/ScriptQueue/ResumeIcon/ResumeIcon';
import PauseIcon from 'components/icons/ScriptQueue/PauseIcon/PauseIcon';
import GearIcon from 'components/icons/ScriptQueue/GearIcon/GearIcon.jsx';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import MessageIcon from 'components/icons/MessageIcon/MessageIcon';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail.jsx';
import { OBSERVATORY_STATES } from 'Config';
import { acronymizeString, formatSecondsToDigital } from 'Utils';
import styles from './GlobalState.module.css';

const summaryStateToStylesMap = Object.values(CSCDetail.states).reduce((prevDict, value) => {
  const { name } = value;
  prevDict[name.toUpperCase()] = value.class;
  return prevDict;
}, {});

const FULL_NAME_OBSERVATORY_STATES = ['OPERATIONAL', 'FAULT'];

const OBSERVATORY_STATE_DETAIL = {
  0: {
    name: 'UNKNOWN',
    statusText: 'invalid',
  },
  1: {
    name: 'DAYTIME',
    statusText: 'ok',
  },
  2: {
    name: 'OPERATIONAL',
    statusText: 'ok',
  },
  4: {
    name: 'FAULT',
    statusText: 'alert',
  },
  8: {
    name: 'WEATHER',
    statusText: 'alert',
  },
  16: {
    name: 'DOWNTIME',
    statusText: 'warning',
  },
};

const observatoryStateTooltip =
  'Current state of the observatory. ' +
  'Only active statuses are color-coded and shown. ' +
  'Important states like ' +
  FULL_NAME_OBSERVATORY_STATES.join(' and ') +
  ' are displayed with their full name, others just with their acronym format:' +
  '\n· Daytime (green): daytime when on, nighttime when off, automatically set by the Scheduler CSC.' +
  '\n· Operational (green): set when the observatory is operating in normal state. Note this status can only be set during nighttime.' +
  '\n· Fault (red): set when a fault is detected in any subsystem. Automatically set by the Scheduler CSC, but can also be changed manually.' +
  '\n· Weather (red): set when weather conditions are not suitable for observations.' +
  '\n· Downtime (yellow): set during scheduled maintenance or upgrades.' +
  "\n\nHover over each status to see its full name. Additionally, 'UNKNOWN' status will be set and shown " +
  ' when transitioning from daytime to nighttime. ' +
  'It is responsibility of the observers to set it to operational when in nighttime. This status can be also shown when ' +
  ' the observatory state feature is disabled in the Scheduler CSC.' +
  '\n\nClick the gear icon to change the observatory statuses. Note you can additionally provide a note to the change.';

const observatoryStatusTimerTooltip =
  'Time since the last change in the observatory state. ' +
  'This timer resets every time there is a change in any of the observatory statuses, ' +
  'and it can be used to track how long the observatory has been in the current state.' +
  '\nHover over the message bubble to see the note attached to the last change in the observatory state, if any.';

function getActiveObservatoryStates(decimalValue) {
  const activeStatuses = [];
  for (const [_, bitValue] of Object.entries(OBSERVATORY_STATES)) {
    if ((decimalValue & bitValue) !== 0) {
      activeStatuses.push(bitValue);
    }
  }
  return activeStatuses;
}

function renderObservatoryState(state, statusClass, acronymize = true) {
  return (
    <StatusText title={state} status={statusClass} small>
      {acronymize ? acronymizeString(state) : state}
    </StatusText>
  );
}

const ObservatoryStateStatusText = ({ state }) => {
  if (state === 0) {
    return <StatusText status="invalid">UNKNOWN</StatusText>;
  }
  const activeObservatoryStateValues = getActiveObservatoryStates(state);
  const activeObservatoryStates = activeObservatoryStateValues.map((state) => OBSERVATORY_STATE_DETAIL[state]);
  return (
    <div className={styles.observatoryStatesContainer}>
      {activeObservatoryStates.map((stateDetail) => {
        if (!stateDetail) {
          return renderObservatoryState(state, 'invalid');
        }
        if (FULL_NAME_OBSERVATORY_STATES.includes(stateDetail.name)) {
          return renderObservatoryState(stateDetail.name, stateDetail.statusText, false);
        }
        return renderObservatoryState(stateDetail.name, stateDetail.statusText);
      })}
    </div>
  );
};

const GlobalState = ({
  summaryState,
  queueState,
  schedulerSummaryState,
  observatoryStateValue,
  observatoryStateTimestamp,
  observatoryStateNote,
  commandExecutePermission,
  resumeScriptQueue,
  pauseScriptQueue,
  onClickContextMenu,
}) => {
  const secondsSinceLastEvent = observatoryStateTimestamp
    ? (Date.now() - observatoryStateTimestamp * 1000) / 1000
    : null;

  return (
    <div className={styles.globalStateWrapper}>
      <div className={styles.globalStateContainer}>
        <div className={styles.title}>STATE</div>
        <div className={styles.body}>
          <div className={styles.row}>
            <span className={styles.stateLabel}>Summary State</span>
            <div className={styles.stateCell}>
              <span className={[summaryStateToStylesMap[summaryState.name], styles.summaryState].join(' ')}>
                {summaryState.name}
              </span>
              {commandExecutePermission && (
                <>
                  <div
                    className={[styles.pauseIconContainer, 'summaryState'].join(' ')}
                    onClick={(e) => onClickContextMenu(e, ScriptQueue.CONTEXT_MENU_SECTIONS.SUMMARY_STATE)}
                  >
                    <div className={styles.pauseIconWrapper} title="Change summaryState">
                      <GearIcon className={styles.gearIcon} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.stateLabel}>Queue State</span>
            <div className={styles.stateCell}>
              <StatusText status={queueState.statusText}>{queueState.name}</StatusText>
              {summaryState.name === 'ENABLED' && queueState.name === 'Stopped' && commandExecutePermission && (
                <>
                  <div className={styles.pauseIconContainer} onClick={resumeScriptQueue}>
                    <div className={styles.pauseIconWrapper} title="Resume ScriptQueue">
                      <ResumeIcon />
                    </div>
                  </div>
                </>
              )}
              {summaryState.name === 'ENABLED' && queueState.name === 'Running' && commandExecutePermission && (
                <>
                  <div className={styles.pauseIconContainer} onClick={pauseScriptQueue}>
                    <div className={styles.pauseIconWrapper} title="Pause ScriptQueue">
                      <PauseIcon />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.stateLabel}>
              <span>Observatory States</span>
              <span className={styles.infoIconContainer}>
                <InfoIcon className={styles.infoIcon} title={observatoryStateTooltip} />
              </span>
            </div>
            <div className={styles.stateCell}>
              <ObservatoryStateStatusText state={observatoryStateValue} />
              {schedulerSummaryState.name === 'ENABLED' && commandExecutePermission && (
                <div
                  className={[styles.pauseIconContainer, 'observatoryState'].join(' ')}
                  onClick={(e) => onClickContextMenu(e, ScriptQueue.CONTEXT_MENU_SECTIONS.OBSERVATORY_STATE)}
                >
                  <div className={styles.pauseIconWrapper} title="Change observatoryState">
                    <GearIcon className={styles.gearIcon} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.stateLabel}>
              <span>Time since last event</span>
              <span className={styles.infoIconContainer}>
                <InfoIcon className={styles.infoIcon} title={observatoryStatusTimerTooltip} />
              </span>
            </div>
            <div className={styles.stateCell}>
              <div className={styles.observatoryStateEventContainer}>
                {formatSecondsToDigital(secondsSinceLastEvent)}
                <div
                  title={observatoryStateNote ? observatoryStateNote : 'No note available.'}
                  className={styles.observatoryStateNoteIcon}
                >
                  <MessageIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

GlobalState.propTypes = {
  summaryState: PropTypes.shape({
    /** UpperCase name of the summaryState of the scriptqueue
     */
    name: PropTypes.oneOf(['ENABLED', 'DISABLED', 'STANDBY', 'OFFLINE', 'FAULT', 'UNKNOWN']),
  }),
  queueState: PropTypes.shape({
    /**Name to be displayed in the <StatusText/> */
    name: PropTypes.string,
    /** Type of the <StatusText/> */
    statusText: PropTypes.string,
  }),
  schedulerSummaryState: PropTypes.shape({
    /** UpperCase name of the summaryState of the scheduler
     */
    name: PropTypes.oneOf(['ENABLED', 'DISABLED', 'STANDBY', 'OFFLINE', 'FAULT', 'UNKNOWN']),
  }),
  /** Decimal value representing the current observatory states */
  observatoryStateValue: PropTypes.number,
  /** Timestamp of the last change in the observatory states, in seconds since epoch */
  observatoryStateTimestamp: PropTypes.number,
  /** Note associated with the current observatory state */
  observatoryStateNote: PropTypes.string,
  /** If true, then and only then command-related buttons will be shown */
  commandExecutePermission: PropTypes.bool,
  /**
   * Callback used to call the `remote.cmd_resume` command
   * @param {event} onclick event object
   */
  resumeScriptQueue: PropTypes.func,
  /**
   * Callback used to call the `remote.cmd_pause` command
   * @param {event} onclick event object
   */
  pauseScriptQueue: PropTypes.func,
  /**
   * Callback used to open the context menu to change summaryState or observatoryState
   * @param {event} onclick event object
   * @param {string} selectedContextMenu - one of the values of ScriptQueue.CONTEXT_MENU_SECTIONS
   */
  onClickContextMenu: PropTypes.func,
};

export default GlobalState;
