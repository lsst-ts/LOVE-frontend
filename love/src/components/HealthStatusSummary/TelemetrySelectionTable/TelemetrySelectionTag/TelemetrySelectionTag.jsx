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
import styles from './TelemetrySelectionTag.module.css';

export default class TelemetrySelectionTag extends Component {
  static propTypes = {
    activeFilterDialog: PropTypes.string,
    remove: PropTypes.func,
    telemetryKey: PropTypes.string,
    telemetryName: PropTypes.string,
  };

  remove = () => {
    this.props.remove(this.props.telemetryKey);
  };

  render() {
    return (
      <span className={styles.tagContainer} title={this.props.telemetryKey}>
        {this.props.telemetryName}
        <span className={styles.remove} title={`Remove ${this.props.telemetryKey}`} onClick={this.remove}>
          X
        </span>
      </span>
    );
  }
}
