/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by the Telescope and Site Software team.

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

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle.jsx';
import Button from 'components/GeneralPurpose/Button/Button.jsx';
import WarningIcon from 'components/icons/WarningIcon/WarningIcon.jsx';
import { OBSERVATORY_STATES } from 'Config';
import styles from './ObservatoryStatusMenu.module.css';

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

ObserversNote.propTypes = {
  /** Current value of the observer's note. */
  note: PropTypes.string,
  /** Function to update the observer's note. */
  setNote: PropTypes.func.isRequired,
};

const ObservatoryStatusMenu = ({ observatoryStateValue, updateObservatoryState }) => {
  const [newState, setNewState] = useState(observatoryStateValue);
  const [note, setNote] = useState();
  const [sendNarrativelog, setSendNarrativelog] = useState(false);

  const hasChanged = newState !== observatoryStateValue || note?.trim().length > 0;
  const isDayTime = (observatoryStateValue & OBSERVATORY_STATES.DAYTIME) !== 0;

  const MenuOption = ({ label, status, disabled, title }) => {
    const isStatusActive = (newState & status) !== 0;
    const onToggleState = () => {
      let updatedState = newState ^ status;
      console.log(status);
      if (status === OBSERVATORY_STATES.OPERATIONAL) {
        // OPERATIONAL state is mutually exclusive with FAULT, DOWNTIME & IDLE states.
        updatedState =
          (newState ^ status) & ~(OBSERVATORY_STATES.FAULT | OBSERVATORY_STATES.DOWNTIME | OBSERVATORY_STATES.IDLE);
      } else if (
        status === OBSERVATORY_STATES.FAULT ||
        status === OBSERVATORY_STATES.DOWNTIME ||
        status === OBSERVATORY_STATES.IDLE
      ) {
        // FAULT, DOWNTIME & IDLE states are mutually exclusive with OPERATIONAL state.
        updatedState = (newState ^ status) & ~OBSERVATORY_STATES.OPERATIONAL;
      }
      setNewState(updatedState);
    };
    return (
      <div title={title} className={styles.toggleContainer}>
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
  const newStateIsUknown = newState === 0;
  return (
    <>
      <div className={styles.menuOptionsContainer}>
        <div>
          <MenuOption
            label="Operational"
            status={OBSERVATORY_STATES.OPERATIONAL}
            disabled={isDayTime}
            title={isDayTime ? 'Operational status cannot be set during daytime.' : undefined}
          />
          <MenuOption label="Idle" status={OBSERVATORY_STATES.IDLE} />
          <MenuOption label="Fault" status={OBSERVATORY_STATES.FAULT} />
          <MenuOption label="Weather" status={OBSERVATORY_STATES.WEATHER} />
          <MenuOption label="Downtime" status={OBSERVATORY_STATES.DOWNTIME} />
        </div>
        {newStateIsUknown && (
          <div className={styles.warningMessage}>
            <WarningIcon />
            <div>Are you missing to set OPERATIONAL or IDLE?</div>
          </div>
        )}
      </div>
      <ObserversNote note={note} setNote={setNote} />
      <div title="Create a narrative log upon observatory state transition." className={styles.toggleContainer}>
        <Toggle
          toggled={sendNarrativelog}
          onToggle={() => setSendNarrativelog(!sendNarrativelog)}
          activeColorClassName={styles.sliderActiveState}
          disabled={!hasChanged}
        />
        <span className={sendNarrativelog ? styles.highlightedSliderLabel : ''}>Create narrative log</span>
      </div>
      <Button
        status="info"
        disabled={!hasChanged}
        onClick={() => updateObservatoryState(newState, note, sendNarrativelog)}
        command={true}
      >
        Update observatory state
      </Button>
    </>
  );
};

ObservatoryStatusMenu.propTypes = {
  /** Current value of the observatory state. */
  observatoryStateValue: PropTypes.number.isRequired,
  /** Function to update the observatory state. */
  updateObservatoryState: PropTypes.func.isRequired,
};

export default memo(ObservatoryStatusMenu);
