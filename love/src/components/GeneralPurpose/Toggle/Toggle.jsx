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

import { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './Toggle.module.css';

const Toggle = ({ toggled = false, labels = [], onToggle = () => {}, activeColorClassName = '', disabled = false }) => {
  const handleChangeChk = () => {
    onToggle(!toggled);
  };

  return (
    <div className={styles.switchContainer}>
      <span
        className={[styles.modeSelection, !toggled ? styles.highlightText : ''].join(' ')}
        onClick={() => onToggle(false)}
      >
        {labels[0]}
      </span>

      <label className={styles.switch}>
        <input
          type="checkbox"
          alt={labels.lenght >= 2 ? `${labels[0] - labels[1]}` : ''}
          checked={toggled}
          onChange={handleChangeChk}
          disabled={disabled}
        />
        <span
          className={[styles.slider, styles.round, activeColorClassName, disabled ? styles.disabled : ''].join(' ')}
        />
      </label>

      <span
        className={[styles.modeSelection, toggled ? styles.highlightText : ''].join(' ')}
        onClick={() => onToggle(true)}
      >
        {labels[1]}
      </span>
    </div>
  );
};

Toggle.propTypes = {
  /** The toggle is toggled or not  */
  toggled: PropTypes.bool,
  /** The labels for the toggle */
  labels: PropTypes.arrayOf(PropTypes.string),
  /** The function to set the live mode */
  onToggle: PropTypes.func,
  /** The class name for the active color of the slider */
  activeColorClassName: PropTypes.string,
  /** Whether the toggle is disabled */
  disabled: PropTypes.bool,
};

export default memo(Toggle);
