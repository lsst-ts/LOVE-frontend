/** 
This file is part of LOVE-frontend.

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
import React from 'react';
import PropTypes from 'prop-types';
import styles from './SegmentedProgressBar.module.css';

const TOTAL_SEGMENTS = 10;

const SegmentedProgressBar = ({ percentage = 0, fillerClassName = '' }) => {
  const safePercentage = Math.max(0, Math.min(100, Number(percentage) || 0));
  const filledSegments = Math.round((safePercentage / 100) * TOTAL_SEGMENTS);
  const filledClassName = styles.filled + ' ' + fillerClassName;

  return (
    <div className={styles.container}>
      {Array.from({ length: TOTAL_SEGMENTS }, (_, index) => (
        <div key={index} className={[styles.segment, index < filledSegments ? filledClassName : ''].join(' ')} />
      ))}
    </div>
  );
};

SegmentedProgressBar.propTypes = {
  /** The percentage of the progress bar that should be filled */
  percentage: PropTypes.number,
  /** Additional class name for the filled segments */
  fillerClassName: PropTypes.string,
};

export default SegmentedProgressBar;
