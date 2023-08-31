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
import styles from './ProgressBar.module.css';

const ProgressBar = (props) => {
  const ref = useRef(null);
  const { targetValue, completed, hideCompleted = false, height = 20 } = props;
  const padding = 4;

  const parentDiv = {
    display: 'flex',
  };

  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: '#455a64',
    marginBottom: '5px',
    float: 'rigth',
    position: 'relative',
    padding: `${padding}px`,
  };

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: 'var(--second-tertiary-background-color)',
    textAlign: 'right',
  };

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
  };

  const targetValueLine = {
    stroke: 'white',
    strokeWidth: 2,
    strokeDasharray: 1.8,
    strokeOpacity: 0.5,
  };

  const progressCommandedLine = {
    position: 'absolute',
    top: padding,
    right: padding,
    bottom: padding,
    left: padding,
    overflow: 'visible',
  };

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
      <div ref={ref} className={styles.containerStyles} style={{ height: `${height}px` }}>
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
        {completed ? <div className={styles.fillerStyles} style={{ width: `${completed}%` }}></div> : <></>}
      </div>
    </div>
  );
};

export default ProgressBar;
