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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DefaultFilterIcon extends Component {
  static propTypes = {
    style: PropTypes.string,
  };

  render() {
    return (
      <svg className={this.props.style} viewBox="0 0 18 18">
        <g>
          <line x1="6.29" y1="13.7" x2="11.58" y2="13.7" />
          <line x1="4.53" y1="9.29" x2="13.34" y2="9.29" />
          <line x1="1" y1="4" x2="16.87" y2="4" />
        </g>
      </svg>
    );
  }
}
