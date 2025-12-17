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

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './ProgressBar.module.css';

const ProgressBar = ({
  targetValue,
  completed = 0,
  hideCompleted = false,
  height = 20,
  containerClassName = '',
  fillerClassName = '',
}) => {
  const ref = useRef(null);
  const padding = 4;
  const width = ref.current?.clientWidth ?? 0;
  const targetValuePixels = ((width - 2 * padding) * targetValue) / 100;
  const completedValue = completed.toString().padStart(3, '0');

  return (
    <div className={styles.parentDiv}>
      {!hideCompleted ? (
        <div>
          <span className={styles.labelStyles}>{`${completedValue}%`}</span>
        </div>
      ) : (
        <></>
      )}
      <div
        ref={ref}
        className={[styles.containerStyles, containerClassName].join(' ')}
        style={{ height: `${height}px` }}
      >
        <svg width={width > 0 ? width - 2 * padding : 0} height={height} className={styles.progressCommandedLine}>
          {targetValue ? (
            <line
              className={styles.targetValueLine}
              x1={targetValuePixels}
              y1={-padding}
              x2={targetValuePixels}
              y2={height + padding}
            />
          ) : (
            <></>
          )}
        </svg>
        {completed ? (
          <div className={[styles.fillerStyles, fillerClassName].join(' ')} style={{ width: `${completed}%` }}></div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  /** Target value */
  targetValue: PropTypes.number,
  /** Completed value */
  completed: PropTypes.number,
  /** Hide completed value */
  hideCompleted: PropTypes.bool,
  /** Height of the progress bar */
  height: PropTypes.number,
};

export default ProgressBar;
