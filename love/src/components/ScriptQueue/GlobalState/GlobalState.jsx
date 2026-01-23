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

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText.jsx';
import ResumeIcon from 'components/icons/ScriptQueue/ResumeIcon/ResumeIcon';
import PauseIcon from 'components/icons/ScriptQueue/PauseIcon/PauseIcon';
import GearIcon from 'components/icons/ScriptQueue/GearIcon/GearIcon.jsx';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import ContextMenu from '../Scripts/ContextMenu/ContextMenu';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail.jsx';
import { OBSERVATORY_STATES } from 'Config';
import { acronymizeString, formatSecondsToDigital } from 'Utils';
import styles from './GlobalState.module.css';

const summaryStateToStylesMap = Object.values(CSCDetail.states).reduce((prevDict, value) => {
  const { name } = value;
  prevDict[name.toUpperCase()] = value.class;
  return prevDict;
}, {});

const ALLOWED_COMMANDS = {
  ENABLED: ['disable'],
  DISABLED: ['enable', 'standby'],
  STANDBY: ['start'],
};

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

function getActiveObservatoryStates(decimalValue) {
  const activeStatuses = [];

  for (const [name, bitValue] of Object.entries(OBSERVATORY_STATES)) {
    if ((decimalValue & bitValue) !== 0) {
      activeStatuses.push(bitValue);
    }
  }

  return activeStatuses;
}

function renderObservatoryState(state, statusClass) {
  return (
    <StatusText title={state} status={statusClass} small>
      {acronymizeString(state)}
    </StatusText>
  );
}

const observatoryStateTooltip =
  'Current states of the observatory. ' +
  'Inactive states are shown in grey, active states are color-coded according to their status. ' +
  'Each following letter represents a different state:' +
  '\n(D)aytime: daytime when on, nighttime when off, automatically set by the Scheduler CSC.' +
  '\n(O)perational: set when the observatory is operating in normal state.' +
  '\n(F)ault: set when a fault is detected in any subsystem. Automatically set by the Scheduler CSC, but can also be changed manually.' +
  '\n(W)eather: set when weather conditions are not suitable for observations.' +
  '\n(D)owntime: set during scheduled maintenance or upgrades.' +
  '\nHover over each state to see its full name.' +
  '\n\nClick the gear icon to change the observatory states. You can additionally provide a note for the change, ' +
  'please write any comment before applying the new state.';

const ObserversNote = ({ note, setNote }) => {
  const handleNoteChange = (event) => {
    setNote(event.target.value);
    console.log('Note changed:', event.target.value);
  };
  return (
    <div>
      <span>Observer note:</span>
      <textarea
        className={styles.observatoryStateNote}
        placeholder="Enter a note for this change..."
        value={note}
        onChange={handleNoteChange}
      />
    </div>
  );
};

const GlobalState = ({
  summaryState,
  queueState,
  schedulerSummaryState,
  observatoryStateValue,
  observatoryStateTimestamp,
  requestSummaryStateCommand,
  updateObservatoryStateCommand,
  commandExecutePermission,
  resumeScriptQueue,
  pauseScriptQueue,
  // updateObservatoryState,
}) => {
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState(undefined);
  const [observatoryStateNote, setObservatoryStateNote] = useState();

  const onClickContextMenu = useCallback((event) => {
    event.stopPropagation();
    setContextMenuIsOpen((state) => !state);
    setContextMenuTarget(event.currentTarget);
  }, []);

  useEffect(() => {
    const handler = () => {
      setContextMenuIsOpen(false);
    };
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);

  const summaryStatecontextMenuOptions = useMemo(() => {
    const allowedCommands = ALLOWED_COMMANDS[summaryState.name.toUpperCase()] ?? [];
    return [
      {
        icon: <ResumeIcon />,
        text: 'Start',
        action: () => {
          requestSummaryStateCommand('start');
          setContextMenuIsOpen(false);
        },
        disabled: !allowedCommands.includes('start'),
      },
      {
        icon: <ResumeIcon />,
        text: 'Enable',
        action: () => {
          requestSummaryStateCommand('enable');
          setContextMenuIsOpen(false);
        },
        disabled: !allowedCommands.includes('enable'),
      },
      {
        icon: <ResumeIcon />,
        text: 'Disable',
        action: () => {
          requestSummaryStateCommand('disable');
          setContextMenuIsOpen(false);
        },
        disabled: !allowedCommands.includes('disable'),
      },
      {
        icon: <ResumeIcon />,
        text: 'StandBy',
        action: () => {
          requestSummaryStateCommand('standby');
          setContextMenuIsOpen(false);
        },
        disabled: !allowedCommands.includes('standby'),
      },
    ];
  }, [summaryState, requestSummaryStateCommand]);

  const updateObservatoryState = (state) => {
    console.log('Current value:', observatoryStateValue);
    const newValue = observatoryStateValue ^ state;
    console.log('New value:', newValue);
    console.log('Note:', observatoryStateNote);
    // updateObservatoryStateCommand(newValue, observatoryStateNote);
    setContextMenuIsOpen(false);
    setObservatoryStateNote();
  };

  const observatoryStateContextMenuOptions = [
    {
      icon: <ResumeIcon />,
      text: 'Operational',
      action: () => {
        updateObservatoryState(OBSERVATORY_STATES.OPERATIONAL);
      },
    },
    {
      icon: <PauseIcon />,
      text: 'Fault',
      action: () => {
        updateObservatoryState(OBSERVATORY_STATES.FAULT);
      },
    },
    {
      icon: <PauseIcon />,
      text: 'Weather',
      action: () => {
        updateObservatoryState(OBSERVATORY_STATES.WEATHER);
      },
    },
    {
      icon: <PauseIcon />,
      text: 'Downtime',
      action: () => {
        updateObservatoryState(OBSERVATORY_STATES.DOWNTIME);
      },
    },
  ];

  const getContextMenuOptions = (element) => {
    if (element?.classList.contains('summaryState')) {
      return summaryStatecontextMenuOptions;
    }
    if (element?.classList.contains('observatoryState')) {
      return observatoryStateContextMenuOptions;
    }
    return null;
  };

  const contextMenuOptions = getContextMenuOptions(contextMenuTarget);
  const observatoryStateOptionsSelected = contextMenuTarget?.classList.contains('observatoryState');

  const availableObservatoryStates = Object.keys(OBSERVATORY_STATES).slice(1);
  const activeObservatoryStateValues = getActiveObservatoryStates(observatoryStateValue);
  const activeObservatoryStates = activeObservatoryStateValues.map((state) => OBSERVATORY_STATE_DETAIL[state]);

  const secondsSinceLastEvent = observatoryStateTimestamp
    ? ((Date.now() - new Date(observatoryStateTimestamp * 1000).getTime()) / 1000).toFixed(1)
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
                    onClick={(e) => onClickContextMenu(e, true)}
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
              <div className={styles.observatoryStatesContainer}>
                {activeObservatoryStates.map((stateDetail) => {
                  if (!stateDetail) {
                    return renderObservatoryState(state, 'invalid');
                  }
                  return renderObservatoryState(stateDetail.name, stateDetail.statusText);
                })}
              </div>
              {schedulerSummaryState.name === 'ENABLED' && commandExecutePermission && (
                <div
                  className={[styles.pauseIconContainer, 'observatoryState'].join(' ')}
                  onClick={(e) => onClickContextMenu(e, true)}
                >
                  <div className={styles.pauseIconWrapper} title="Change observatoryState">
                    <GearIcon className={styles.gearIcon} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.stateLabel}>Time since last event:</div>
            <div className={styles.stateCell}>{formatSecondsToDigital(secondsSinceLastEvent)}</div>
          </div>
        </div>

        <ContextMenu isOpen={contextMenuIsOpen} options={contextMenuOptions} target={contextMenuTarget}>
          {observatoryStateOptionsSelected && (
            <ObserversNote note={observatoryStateNote} setNote={setObservatoryStateNote} />
          )}
        </ContextMenu>
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
  /**
   * Callback used to request summaryState changes
   * @param {string} name to be attached to the command as `cmd_<name>`
   */
  requestSummaryStateCommand: PropTypes.func,
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
};

export default GlobalState;
