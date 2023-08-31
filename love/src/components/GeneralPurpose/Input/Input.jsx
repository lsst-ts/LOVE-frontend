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
import PropTypes from 'prop-types';

import styles from './Input.module.css';

const Input = ({
  defaultValue,
  value,
  type = 'text',
  className = '',
  placeholder,
  checked,
  min,
  max,
  onChange = () => {},
  onClick = () => {},
  ...props
}) => {
  return (
    <input
      defaultValue={defaultValue}
      value={value}
      type={type}
      className={[styles.input, className].join(' ')}
      placeholder={placeholder}
      checked={checked}
      min={min}
      max={max}
      onChange={onChange}
      onClick={onClick}
      {...props}
    />
  );
};

Input.propTypes = {
  /** Default value */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Type */
  type: PropTypes.string,
  /** Class name */
  className: PropTypes.string,
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Checked */
  checked: PropTypes.bool,
  /** Min */
  min: PropTypes.number,
  /** Max */
  max: PropTypes.number,
  /** On change function */
  onChange: PropTypes.func,
  /** On click function */
  onClick: PropTypes.func,
};

export default memo(Input);
