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
import styles from './LoadInfoIcon.module.css';

export default function LoadInfoIcon(props) {
  const className = [styles.loadInfoIcon, props.className].join(' ');
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className={className} {...props}>
      <path
        d="m10,0C4.48,0,0,4.48,0,10s4.48,10,10,10,10-4.48,10-10S15.52,0,10,0Zm-2.53,7.54h1.45v-2.87c0-.21.17-.37.37-.37h1.4c.21,0,.37.17.37.37v2.87h1.45c.33,0,.54.36.37.65l-2.52,4.37c-.17.29-.58.29-.75,0l-2.52-4.37c-.17-.29.04-.65.37-.65Zm7.89,8.16H4.64v-4.63c0-.21.17-.37.37-.37h1.4c.21,0,.37.17.37.37v2.48h6.43v-2.48c0-.21.17-.37.37-.37h1.4c.21,0,.37.17.37.37v4.63Z"
        className={styles['cls-1']}
      />
    </svg>
  );
}
