/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React from 'react';
import styles from './UnknownLocationIcon.module.css';

export default function UnknownLocationIcon(props) {
  const status = props.active ? styles.active : styles.inactive;
  const className = [styles.icon, props.className, props.style].join(' ');
  return (
    <svg viewBox="0 0 14 19" className={className}>
      <path
        className={status}
        d="m7,0C3.13,0,0,3.13,0,7s7,12,7,12c0,0,7-8.13,7-12S10.87,0,7,0Zm0,12c-2.76,0-5-2.24-5-5S4.24,2,7,2s5,2.24,5,5-2.24,5-5,5Z"
      />
      <path
        className={status}
        d="m7,9.52c-.28,0-.5-.22-.5-.5v-1.68c0-.28.22-.5.5-.5.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5,1.5c0,.28-.22.5-.5.5s-.5-.22-.5-.5c0-1.38,1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5c0,1.21-.86,2.22-2,2.45v1.23c0,.28-.22.5-.5.5Z"
      />
      <circle className={status} cx="7" cy="10.6" r=".5" />
    </svg>
  );
}
