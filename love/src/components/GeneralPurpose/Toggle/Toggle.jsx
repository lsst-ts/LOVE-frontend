/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

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

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import styles from './Toggle.module.css';

const Toggle = ({ toggled = false, labels = [], onToggle = () => {} }) => {
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
        />
        <span className={[styles.slider, styles.round].join(' ')} />
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
};

function propsAreEqual(prevProps, nextProps) {
  return nextProps.toggled === prevProps.toggled && isEqual(nextProps.labels, prevProps.labels);
}

export default memo(Toggle, propsAreEqual);
