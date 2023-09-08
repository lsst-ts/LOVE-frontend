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
import styles from './GoBackIcon.module.css';

export default class GoBackIcon extends Component {
  render() {
    return (
      <svg className={[styles.svg, this.props.className].join(' ')} {...this.props} viewBox="0 0 11.7 20.8">
        <title>{this.props.title}</title>
        <path className={this.props.active} d="M0.8,8.6l9.4-8.5l0,4.1l-7.3,6.1l0,0.1l7.3,6.2l0,4.1l-9.4-8.5L0.8,8.6z" />
      </svg>
    );
  }
}

GoBackIcon.defaultProps = {
  className: '',
};
