/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import { Multiselect as ReactMultiselect } from 'multiselect-react-dropdown';
import styles from './MultiSelect.module.css';

const MultiSelect = ({ options = [], onChange = () => {}, ...props }) => {
  const { className: propsClassName, innerRef, ...otherProps } = props;

  return (
    <ReactMultiselect
      ref={innerRef}
      isObject={false}
      className={[styles.dropDownClassName, propsClassName].join(' ')}
      options={options}
      onSelect={onChange}
      placeholder="Select an option"
      style={{
        chips: {
          backgroundColor: 'var(--second-senary-background-dimmed-color)',
        },
        multiselectContainer: {
          backgroundColor: 'var(--second-secondary-background-color)',
        },
        optionContainer: {
          backgroundColor: 'var(--second-secondary-background-color)',
        },
        option: {
          color: 'var(--highlighted-font-color)',
        },
        searchBox: {
          border: 'none',
          borderRadius: '0px',
        },
        inputField: {
          width: '100%',
          color: 'var(--base-font-color)',
        },
      }}
      {...otherProps}
    />
  );
};

export default MultiSelect;
