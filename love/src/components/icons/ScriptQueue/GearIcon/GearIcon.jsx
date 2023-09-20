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
import styles from './GearIcon.module.css';

export default function GearIcon(props) {
  const className = [styles.gearIcon, props.className].join(' ');
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.16 38.16" className={className} {...props}>
      <path
        className={styles['cls-1']}
        d="M19.21,15.23a3.93,3.93,0,1,0,3.93,3.93A3.93,3.93,0,0,0,19.21,15.23Z"
        transform="translate(-0.13 -0.2)"
      />
      <path
        className={styles['cls-2']}
        d="M20.93,8.68H17.5a1.24,1.24,0,0,0-1.24,1.24v2.3a7.8,7.8,0,0,0-1.59.91l-2-1.15a1.22,1.22,0,0,0-.93-.12,1.2,1.2,0,0,0-.76.58l-1.71,3a1.24,1.24,0,0,0,.45,1.69l2,1.15a9.07,9.07,0,0,0-.06.91,9.07,9.07,0,0,0,.06.92l-2,1.15a1.25,1.25,0,0,0-.45,1.69l1.71,3a1.22,1.22,0,0,0,.76.57,1.12,1.12,0,0,0,.31.05,1.23,1.23,0,0,0,.62-.17l2-1.15a7.36,7.36,0,0,0,1.59.91v2.31a1.24,1.24,0,0,0,1.24,1.23h3.43a1.23,1.23,0,0,0,1.23-1.23V26.1a7.36,7.36,0,0,0,1.59-.91l2,1.15a1.21,1.21,0,0,0,.61.16,1.22,1.22,0,0,0,1.07-.61l1.72-3a1.24,1.24,0,0,0-.45-1.68l-2-1.15a7,7,0,0,0,0-1.83l2-1.15a1.25,1.25,0,0,0,.45-1.7l-1.72-3a1.18,1.18,0,0,0-.75-.58,1.21,1.21,0,0,0-.93.12l-2,1.15a7.8,7.8,0,0,0-1.59-.91V9.92A1.23,1.23,0,0,0,20.93,8.68ZM.13,19.28A19.08,19.08,0,1,1,19.21,38.36,19.08,19.08,0,0,1,.13,19.28Z"
        transform="translate(-0.13 -0.2)"
      />
    </svg>
  );
}
