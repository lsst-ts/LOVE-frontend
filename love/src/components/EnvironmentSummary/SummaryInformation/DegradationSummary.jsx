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

import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import styles from './SummaryInformation.module.css';

class DegradationSummary extends Component {
  static propTypes = {
    /** Environmental degradation. */
    degradation: PropTypes.any,
  };

  static defaultProps = {
    degradation: 'Unknown',
  };

  render() {
    const { degradation } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.textTitle}>Env. Degradation</div>
        <div>{degradation}</div>
      </div>
    );
  }
}

export default memo(DegradationSummary);