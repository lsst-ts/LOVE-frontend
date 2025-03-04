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
import styles from './CSCRealm.module.css';
import CSCGroupContainer from '../CSCGroup/CSCGroup.container';

export default class CSCRealm extends Component {
  static propTypes = {
    name: PropTypes.string,
    groups: PropTypes.object,
    hierarchy: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    groups: {},
    hierarchy: {},
  };

  render() {
    return (
      <div className={styles.CSCRealmContainer}>
        <div className={styles.CSCRealmTitle}>{this.props.name}</div>
        {Object.keys(this.props.groups).map((group) => {
          return (
            <div key={group} className={styles.CSCGroupContainer}>
              <CSCGroupContainer
                name={group}
                cscs={this.props.groups[group]}
                embedded={true}
                subscribeToStreamCallback={this.props.subscribeToStreamCallback}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
