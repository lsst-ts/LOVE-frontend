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

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText.jsx';
import ResumeIcon from 'components/icons/ScriptQueue/ResumeIcon/ResumeIcon';
import PauseIcon from 'components/icons/ScriptQueue/PauseIcon/PauseIcon';
import GearIcon from 'components/icons/ScriptQueue/GearIcon/GearIcon.jsx';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import MessageIcon from 'components/icons/MessageIcon/MessageIcon';
import ContextMenu from '../Scripts/ContextMenu/ContextMenu';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail.jsx';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle.jsx';
import Button from 'components/GeneralPurpose/Button/Button.jsx';
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

function getActiveObservatoryStates(decimalValue) {
  const activeStatuses = [];

  for (const [name, bitValue] of Object.entries(OBSERVATORY_STATES)) {
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

const ObserversNote = ({ note, setNote }) => {
  const handleNoteChange = (event) => {
    setNote(event.target.value);
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

const ObservatoryStatusMenu = memo(({ observatoryStateValue, updateObservatoryState }) => {
  const [newState, setNewState] = useState(observatoryStateValue);
  const [note, setNote] = useState();

  const hasChanged = newState !== observatoryStateValue || note?.trim().length > 0;
  const isDayTime = (observatoryStateValue & OBSERVATORY_STATES.DAYTIME) !== 0;

  const MenuOption = ({ label, status, disabled, title }) => {
    const isStatusActive = (newState & status) !== 0;
    const onToggleState = () => {
      let updatedState = newState ^ status;
      if (status === OBSERVATORY_STATES.OPERATIONAL) {
        // OPERATIONAL state is mutually exclusive with FAULT & DOWNTIME states.
        updatedState = (newState ^ status) & ~(OBSERVATORY_STATES.FAULT | OBSERVATORY_STATES.DOWNTIME);
      } else if (status === OBSERVATORY_STATES.FAULT || status === OBSERVATORY_STATES.DOWNTIME) {
        // FAULT & DOWNTIME states are mutually exclusive with OPERATIONAL state.
        updatedState = (newState ^ status) & ~OBSERVATORY_STATES.OPERATIONAL;
      }
      setNewState(updatedState);
    };
    return (
      <div title={title} className={styles.observatoryStatusContextMenu}>
        <Toggle
          toggled={isStatusActive}
          onToggle={onToggleState}
          activeColorClassName={styles.sliderActiveState}
          disabled={disabled}
        />
        <span className={isStatusActive ? styles.highlightedSliderLabel : ''}>{label}</span>
      </div>
    );
  };
  return (
    <>
      <div>
        <MenuOption
          label="Operational"
          status={OBSERVATORY_STATES.OPERATIONAL}
          disabled={isDayTime}
          title={isDayTime ? 'Operational status cannot be set during daytime.' : undefined}
        />
        <MenuOption label="Fault" status={OBSERVATORY_STATES.FAULT} />
        <MenuOption label="Weather" status={OBSERVATORY_STATES.WEATHER} />
        <MenuOption label="Downtime" status={OBSERVATORY_STATES.DOWNTIME} />
      </div>
      <ObserversNote note={note} setNote={setNote} />
      <Button
        status="info"
        disabled={!hasChanged}
        onClick={() => updateObservatoryState(newState, note)}
        command={true}
      >
        Update observatory state
      </Button>
    </>
  );
});

const GlobalState = ({
  summaryState,
  queueState,
  schedulerSummaryState,
  observatoryStateValue,
  observatoryStateTimestamp,
  observatoryStateNote,
  requestSummaryStateCommand,
  updateObservatoryStateCommand,
  commandExecutePermission,
  resumeScriptQueue,
  pauseScriptQueue,
}) => {
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState();

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

  const summaryStateContextMenuOptions = useMemo(() => {
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

  const updateObservatoryState = useCallback((state, note) => {
    updateObservatoryStateCommand(state, note);
    setContextMenuIsOpen(false);
  }, []);

  const getContextMenuOptions = (element) => {
    if (element?.classList.contains('summaryState')) {
      return summaryStateContextMenuOptions;
    }
    return [];
  };

  const contextMenuOptions = getContextMenuOptions(contextMenuTarget);
  const observatoryStateOptionsSelected = contextMenuTarget?.classList.contains('observatoryState');
  const activeObservatoryStateValues = getActiveObservatoryStates(observatoryStateValue);
  const activeObservatoryStates = activeObservatoryStateValues.map((state) => OBSERVATORY_STATE_DETAIL[state]);

  const secondsSinceLastEvent = observatoryStateTimestamp
    ? (Date.now() - observatoryStateTimestamp * 1000) / 1000
    : null;

  const ObservatoryStateStatusText = ({ state }) => {
    if (state === 0) {
      return <StatusText status="invalid">UNKNOWN</StatusText>;
    }
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
              <ObservatoryStateStatusText state={observatoryStateValue} />
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

        <ContextMenu isOpen={contextMenuIsOpen} options={contextMenuOptions} target={contextMenuTarget}>
          {observatoryStateOptionsSelected && (
            <ObservatoryStatusMenu
              key={observatoryStateTimestamp}
              observatoryStateValue={observatoryStateValue}
              updateObservatoryState={updateObservatoryState}
            />
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
  schedulerSummaryState: PropTypes.shape({
    /** UpperCase name of the summaryState of the scheduler
     */
    name: PropTypes.oneOf(['ENABLED', 'DISABLED', 'STANDBY', 'OFFLINE', 'FAULT', 'UNKNOWN']),
  }),
  /** Decimal value representing the current observatory states */
  observatoryStateValue: PropTypes.number,
  /** Timestamp of the last change in the observatory states, in seconds since epoch */
  observatoryStateTimestamp: PropTypes.number,
  /**
   * Callback used to request summaryState changes
   * @param {string} name to be attached to the command as `cmd_<name>`
   */
  requestSummaryStateCommand: PropTypes.func,
  /**
   * Callback used to request observatoryState changes, it will be called
   * with the new state value and the note provided by the user in the context menu
   * @param {number} state Decimal value representing the new observatory states
   * @param {string} note Note provided by the user in the context menu, it can be an empty string if the user didn't provide any note
   */
  updateObservatoryStateCommand: PropTypes.func,
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
