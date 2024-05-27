/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the LSST Project (https://www.lsst.org).

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ targetValue, completed, title, hideCompleted = false, height = 20 }) => {
  const [width, setWidth] = useState(0);

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  const padding = 4;
  const targetValuePixels = Math.ceil(((width - 2 * padding) * targetValue) / 100);
  const completedValue = completed.toString().padStart(3, '0');

  const titleHtml = title ?? `${Math.floor(completed)}/100`;

  return (
    <div className={styles.parentDiv}>
      {!hideCompleted ? (
        <div>
          <span className={styles.labelStyles}>{`${completedValue}%`}</span>
        </div>
      ) : (
        <></>
      )}
      <div ref={measuredRef} className={styles.containerStyles} style={{ height: `${height}px` }}>
        <svg width={width > 0 ? width - 2 * padding : 0} height={height} className={styles.progressCommandedLine}>
          <title>{titleHtml}</title>
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
        {completed ? <div className={styles.fillerStyles} style={{ width: `${completed}%` }}></div> : <></>}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  /** Expected value to reach */
  targetValue: PropTypes.number.isRequired,
  /** Value already completed */
  completed: PropTypes.number.isRequired,
  /** Title of the progress bar */
  title: PropTypes.string,
  /** Whether to hide the completed value label */
  hideCompleted: PropTypes.bool,
  /** Height of the progress bar */
  height: PropTypes.number,
};

export default ProgressBar;
