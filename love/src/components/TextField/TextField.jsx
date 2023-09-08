/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
import styles from './TextField.module.css';
/**
 * TexField allow users to input text.
 * Supports password and normal text fields.
 *
 * The <input> element can be ref'd from props and any className
 * will be appended at the end of the default ones.
 */
export default React.forwardRef(({ className, ...props }, ref) => (
  <input
    type={props.type === 'password' ? props.type : 'text'}
    {...props}
    ref={ref}
    className={[styles.input, className].join(' ')}
  />
));
