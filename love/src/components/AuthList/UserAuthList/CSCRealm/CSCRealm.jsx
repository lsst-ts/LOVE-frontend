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
import PropTypes from 'prop-types';
import styles from './CSCRealm.module.css';
import CSCGroup from '../CSCGroup/CSCGroup';

export default class CSCRealm extends Component {
  static propTypes = {
    username: PropTypes.string,
    name: PropTypes.string,
    groups: PropTypes.object,
    hierarchy: PropTypes.object,
    authlist: PropTypes.object,
  };

  static defaultProps = {
    name: '',
    groups: {},
    hierarchy: {},
  };

  render() {
    const { authlist, username, groups, name, authlistRequests, reloadData } = this.props;
    return (
      <div className={styles.CSCRealmContainer}>
        <div className={styles.CSCRealmTitle}>{name}</div>
        {Object.keys(groups).map((group) => (
          <CSCGroup
            key={group}
            username={username}
            name={group}
            cscs={groups[group]}
            authlist={authlist}
            authlistRequests={authlistRequests}
            reloadData={reloadData}
          />
        ))}
      </div>
    );
  }
}
