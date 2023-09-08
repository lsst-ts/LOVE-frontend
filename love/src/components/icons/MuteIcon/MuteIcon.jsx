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

import React, { Component } from 'react';
import styles from './MuteIcon.module.css';

export default class MuteIcon extends Component {
  render() {
    return (
      <svg
        className={[styles.icon, styles.color, this.props.style].join(' ')}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        {this.props.unmuted ? (
          <>
            <path
              d="M3.94,3.39H0.42C0.19,3.39,0,3.58,0,3.81v6.17c0,0.23,0.19,0.42,0.42,0.42h3.52c0.11,0,0.22,0.05,0.3,0.13l3.05,3.14
              C7.55,13.93,8,13.74,8,13.37v-2.98v-7V0.42c0-0.37-0.45-0.56-0.71-0.29L4.23,3.27C4.16,3.35,4.05,3.39,3.94,3.39z"
            />
            <path
              d="M10,9.59c-0.39,0-0.7-0.31-0.7-0.7s0.31-0.7,0.7-0.7c0.72,0,1.3-0.58,1.3-1.3s-0.58-1.3-1.3-1.3c-0.39,0-0.7-0.31-0.7-0.7
              s0.31-0.7,0.7-0.7c1.49,0,2.7,1.21,2.7,2.7S11.49,9.59,10,9.59z"
            />
            <path
              d="M10,12.59c-0.39,0-0.7-0.31-0.7-0.7s0.31-0.7,0.7-0.7c2.37,0,4.3-1.93,4.3-4.3s-1.93-4.3-4.3-4.3c-0.39,0-0.7-0.31-0.7-0.7
              s0.31-0.7,0.7-0.7c3.14,0,5.7,2.56,5.7,5.7S13.14,12.59,10,12.59z"
            />
          </>
        ) : (
          <>
            <path
              d="M13.33,14.21c-0.26,0-0.51-0.1-0.71-0.29L0.4,1.71c-0.39-0.39-0.39-1.02,0-1.41s1.02-0.39,1.41,0l12.21,12.21
              c0.39,0.39,0.39,1.02,0,1.41C13.84,14.12,13.58,14.21,13.33,14.21z"
            />
            <path
              d="M10,2.67c2.37,0,4.3,1.93,4.3,4.3c0,0.85-0.25,1.63-0.68,2.3l1.01,1.01C15.3,9.34,15.7,8.2,15.7,6.97
              c0-3.14-2.56-5.7-5.7-5.7c-0.39,0-0.7,0.31-0.7,0.7S9.61,2.67,10,2.67z"
            />
            <path
              d="M10.03,5.67c0.7,0.01,1.25,0.57,1.27,1.27l1.15,1.15c0.16-0.34,0.25-0.72,0.25-1.13c0-1.49-1.21-2.7-2.7-2.7
              c-0.38,0-0.69,0.3-0.7,0.68L10.03,5.67z"
            />
            <path d="M8,3.65V3.47V0.49C8,0.12,7.55-0.07,7.29,0.2L5.94,1.59L8,3.65z" />
            <path
              d="M0,4.13v5.92c0,0.23,0.19,0.42,0.42,0.42h3.52c0.11,0,0.22,0.05,0.3,0.13l3.05,3.14C7.55,14,8,13.82,8,13.44v-1.31L0,4.13z
              "
            />
          </>
        )}
      </svg>
    );
  }
}

MuteIcon.defaultProps = {
  style: '',
  unmuted: false,
};
