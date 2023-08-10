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
import styles from './SpinnerIcon.module.css';

function SpinnerIcon(props) {
  const { className: propsClassName, ...otherProps } = props;
  return (
    <svg className={[styles.spinner, propsClassName].join(' ')} viewBox="0 0 50 50" {...otherProps}>
      <title>{props.title}</title>
      <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </svg>
  );
}

export default SpinnerIcon;
