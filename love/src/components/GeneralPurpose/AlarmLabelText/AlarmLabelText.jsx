/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

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
import styles from './AlarmLabelText.module.css';

export default class StatusText extends Component {
  static propTypes = {
    status: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.string,
    small: PropTypes.bool,
  };

  render() {
    const { status } = this.props;
    let statusStyle = styles.undefined;
    if (status === 'ok') statusStyle = styles.ok;
    if (status === 'warning') statusStyle = styles.warning;
    if (status === 'serious') statusStyle = styles.serious;
    if (status === 'critical') statusStyle = styles.critical;

    return (
      <span
        title={this.props.title}
        className={[styles.status, statusStyle, this.props.small ? styles.small : ''].join(' ')}
      >
        {this.props.children}
      </span>
    );
  }
}
