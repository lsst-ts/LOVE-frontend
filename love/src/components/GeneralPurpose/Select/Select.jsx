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
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import styles from './Select.module.css';

const Select = ({ options = [], small = false, onChange = () => {}, option = undefined, ...props }) => {
  const {
    className: propsClassName,
    controlClassName: propsControlClassName,
    menuClassName: propsMenuClassName,
    arrowClassName: propsArrowClassName,
    // placeholderClassName: propsPlaceholderClassName,
    ...otherProps
  } = props;

  return (
    <Dropdown
      className={[styles.dropDownClassName, propsClassName].join(' ')}
      controlClassName={[styles.dropDownControlClassName, small ? styles.small : '', propsControlClassName].join(' ')}
      menuClassName={[styles.dropDownMenuClassName, propsMenuClassName].join(' ')}
      arrowClassName={[styles.arrowClassName, propsArrowClassName].join(' ')}
      placeholderClassName={option ? null : styles.dropDownPlaceHolderClassName}
      options={options}
      onChange={onChange}
      value={option}
      placeholder="Select an option"
      {...otherProps}
    />
  );
};

export default Select;
