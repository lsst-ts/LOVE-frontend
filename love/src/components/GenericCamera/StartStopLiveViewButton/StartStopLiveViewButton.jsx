/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ResumeIcon from 'components/icons/GenericCamera/ResumeIcon/ResumeIcon';
import StopIcon from 'components/icons/GenericCamera/StopIcon/StopIcon';
import styles from './StartStopLiveViewButton.module.css';
/**
 * Handles starting and stopping the live view of the Generic camera
 */
export default function StartStopLiveViewButton({ onChange = () => {}, disabled = true }) {
  const [isLatched, setLatched] = useState(false);

  const triggerLatch = () => {
    setLatched(!isLatched);
    if (typeof onChange === 'function') {
      onChange(!isLatched);
    }
  };

  return (
    <div className={styles.buttonWrapper}>
      <button className={isLatched ? styles.buttonLatched : styles.button} onClick={triggerLatch} disabled={disabled}>
        {isLatched ? <StopIcon /> : <ResumeIcon />}
        <span className={styles.buttonLabel}>{isLatched ? 'Stop' : 'Start'} Live View</span>
      </button>
    </div>
  );
}

StartStopLiveViewButton.propTypes = {
  /**
   * Callback to get state
   */
  onChange: PropTypes.func,
  /**
   * Disable the button
   */
  disabled: PropTypes.bool,
};
