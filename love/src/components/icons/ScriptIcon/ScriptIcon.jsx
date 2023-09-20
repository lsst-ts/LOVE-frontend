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

import React, { Component } from 'react';
import styles from './ScriptIcon.module.css';

export default class ScriptIcon extends Component {
  render() {
    const className = [styles.svg, this.props.className].join(' ');
    const status = this.props.active !== undefined && this.props.active === false ? styles.inactive : styles.active;
    return (
      <svg className={className} viewBox="0 0 42.4 53.54">
        <title>{'XML version'}</title>
        <path
          d="M28.2,0H3.8C1.7,0,0,1.7,0,3.8v46c0,2.1,1.7,3.8,3.8,3.8h34.8c2.1,0,3.8-1.7,3.8-3.8V14.2L28.2,0z M9.6,27.3l6.2,3.3v4
  C11,32.2,4.9,28.9,4.9,28.9v-3.2c0,0,6.1-3.3,10.9-5.6V24l0,0v0.1V24L9.6,27.3z M20.2,36.5h-3.9l6-18.5h3.9L20.2,36.5z M37.5,28.9
  c0,0-6.1,3.3-10.9,5.7v-4l6.2-3.3L26.7,24v0.1v-4c4.8,2.4,10.9,5.6,10.9,5.6v3.2H37.5z"
        />
      </svg>
    );
  }
}
