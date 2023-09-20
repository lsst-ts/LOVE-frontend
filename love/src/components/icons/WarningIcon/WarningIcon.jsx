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

import { scale } from 'path-js';
import React, { Component } from 'react';

export default class WarningIcon extends Component {
  static defaultProps = {
    style: '',
    title: '',
  };

  render() {
    return (
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 497.472 497.472">
        <title>{this.props.title}</title>
        <g transform="matrix(1.25 0 0 -1.25 0 45)">
          <path
            style={{ fill: '#FFCC4D' }}
            d="M24.374-357.857c-20.958,0-30.197,15.223-20.548,33.826L181.421,17.928
    c9.648,18.603,25.463,18.603,35.123,0L394.14-324.031c9.671-18.603,0.421-33.826-20.548-33.826H24.374z"
          />
          <path
            style={{ fill: '#231F20' }}
            d="M173.605-80.922c0,14.814,10.934,23.984,25.395,23.984c14.12,0,25.407-9.512,25.407-23.984
    V-216.75c0-14.461-11.287-23.984-25.407-23.984c-14.461,0-25.395,9.182-25.395,23.984V-80.922z M171.489-289.056
    c0,15.167,12.345,27.511,27.511,27.511c15.167,0,27.523-12.345,27.523-27.511c0-15.178-12.356-27.523-27.523-27.523
    C183.834-316.579,171.489-304.234,171.489-289.056"
          />
        </g>
      </svg>
    );
  }
}
