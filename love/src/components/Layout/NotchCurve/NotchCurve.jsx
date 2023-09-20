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
import styles from './NotchCurve.module.css';

function NotchCurve(props) {
  const style = [styles, props.className].join(' ');
  return (
    <svg viewBox="0 0 60.5 60.5" {...props} style={{ transform: props.flip ? 'scale(-1,1)' : '' }}>
      <path className={style.path} d="M0,60.5c9.4,0,18.3-4.3,24.2-11.6L60.5,0H0V60.5z" />
    </svg>
  );
}

export default NotchCurve;
