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
import styles from './PowerMonitor.module.css';

function InputPresent({ present, title }) {
  if (present == null) {
    return <span className={styles.circleInput} title="UNKNOWN" />;
  }
  return <span className={[styles.circleInput, present ? styles.ok : styles.alert].join(' ')} title={title} />;
}

InputPresent.propTypes = {
  /** Whether the input is present or not. If null, it is considered unknown. */
  present: PropTypes.bool,
  /** The title to show on hover when the input is present or not. */
  title: PropTypes.string.isRequired,
};

export default InputPresent;
