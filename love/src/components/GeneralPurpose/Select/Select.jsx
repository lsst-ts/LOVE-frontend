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

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import styles from './Select.module.css';

const Select = ({
  option,
  className: propsClassName,
  controlClassName: propsControlClassName,
  menuClassName: propsMenuClassName,
  arrowClassName: propsArrowClassName,
  options = [],
  small = false,
  onChange = () => {},
  ...otherProps
}) => {
  return (
    <Dropdown
      className={[styles.dropDownClassName, propsClassName ?? ''].join(' ')}
      controlClassName={[styles.dropDownControlClassName, small ? styles.small : '', propsControlClassName ?? ''].join(
        ' ',
      )}
      menuClassName={[styles.dropDownMenuClassName, propsMenuClassName ?? ''].join(' ')}
      arrowClassName={[styles.arrowClassName, propsArrowClassName ?? ''].join(' ')}
      placeholderClassName={option ? null : styles.dropDownPlaceHolderClassName}
      placeholder="Select an option"
      options={options}
      value={option}
      onChange={onChange}
      {...otherProps}
    />
  );
};

Select.propTypes = {
  /** Currently selected option */
  option: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Additional class name for the component */
  className: PropTypes.string,
  /** Additional class name for the control */
  controlClassName: PropTypes.string,
  /** Additional class name for the menu */
  menuClassName: PropTypes.string,
  /** Additional class name for the arrow */
  arrowClassName: PropTypes.string,
  /** Options to display in the select */
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  /** Whether to use a smaller size */
  small: PropTypes.bool,
  /** Callback when an option is selected */
  onChange: PropTypes.func,
};

export default memo(Select);
