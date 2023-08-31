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

import React from 'react';
import styles from './TimeWindow.module.css';

const TimeWindow = ({
  options = {
    '10s': 10,
    '1min': 60,
    '10min': 600,
    '1d': 24 * 60 * 60,
    '10d': 240 * 60 * 60,
    '1m': 720 * 60 * 60,
    '6m': 4320 * 60 * 60,
    '1y': 8640 * 60 * 60,
    Max: Infinity,
  },
  timeWindow = '1d',
  setTimeWindow = () => null,
  enabledOptions = [],
}) => {
  const handleChange = (changeEvent) => {
    let tw = changeEvent.target.value !== 'Infinity' ? parseInt(changeEvent.target.value, 10) : Infinity;
    setTimeWindow(tw);
  };
  return (
    <div className={styles['time-window']}>
      {Object.keys(options).map((key, index) => {
        return (
          (enabledOptions.length === 0 || key === 'Max' || enabledOptions.includes(key)) && (
            <label key={key} className={styles['time-window-selection-label']} htmlFor={key}>
              <input
                className={styles['time-window-selection-input']}
                id={key}
                checked={options[key] === timeWindow}
                type="radio"
                name="field"
                value={options[key]}
                onChange={handleChange}
              />
              <span className={styles['time-window-selection-span']}>{key}</span>
            </label>
          )
        );
      })}
    </div>
  );
};

export default TimeWindow;
