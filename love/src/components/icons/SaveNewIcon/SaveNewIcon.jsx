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
import styles from './SaveNewIcon.module.css';

function SaveNewIcon(props) {
  return (
    <svg viewBox="0 0 25.5 25.5" x="0px" y="0px" className={styles.svg}>
      <path
        className={styles.st0}
        d="M17.9,1c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S21.2,1,17.9,1z M21.1,7.9h-2.5v2.5h-1.5V7.9h-2.5V6.5h2.5V4.1
        h1.5v2.4h2.5V7.9z"
      />
      <path
        className={styles.st0}
        d="M10.9,7c0-0.2,0-0.3,0-0.5c-0.2,0-0.4,0.2-0.4,0.4v2.7c0,0.2,0.2,0.4,0.4,0.4h0.6C11.2,9.2,10.9,8.1,10.9,7z"
      />
      <path
        className={styles.st0}
        d="M17.9,14c-2,0-3.7-0.8-5-2.1H7.4c0,0,0,0,0,0c-0.2,0-0.4-0.2-0.4-0.5V6.9c0-0.2-0.2-0.5-0.5-0.5H3.4
        c-1,0-1.8,0.8-1.8,1.8v14.4c0,0,0,0,0,0c0,1,0.8,1.8,1.8,1.8h14.4c0,0,0,0,0,0c1,0,1.8-0.8,1.8-1.8v-8.9C19.1,13.9,18.5,14,17.9,14
        z M10.6,21.3C10.6,21.3,10.6,21.3,10.6,21.3c-1.7,0-3.2-1.4-3.2-3.1v0c0,0,0,0,0,0c0-1.7,1.4-3.1,3.2-3.1c1.7,0,3.1,1.4,3.2,3.1
        C13.7,19.9,12.3,21.3,10.6,21.3z"
      />
    </svg>
  );
}

export default SaveNewIcon;
