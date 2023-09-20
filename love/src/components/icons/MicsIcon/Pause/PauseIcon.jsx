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
import styles from './PauseIcon.module.css';

function PauseIcon(props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.6 23.6">
      <path
        className={styles.cls1}
        d="m11.8,0C5.28,0,0,5.28,0,11.8s5.28,11.8,11.8,11.8,11.8-5.28,11.8-11.8S18.32,0,11.8,0Zm-1.28,18.23h-1.71V5.38h1.71v12.85Zm4.27,0h-1.71V5.38h1.71v12.85Z"
      />
    </svg>
  );
}

export default PauseIcon;
