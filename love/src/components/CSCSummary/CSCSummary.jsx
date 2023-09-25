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
import styles from './CSCSummary.module.css';
import CSCRealm from './CSCRealm/CSCRealm';

export default class CSCSummary extends Component {
  static propTypes = {
    hierarchy: PropTypes.object,
    expandHeight: PropTypes.bool,
  };

  render() {
    return (
      <div className={styles.CSCSummaryContainer}>
        {Object.keys(this.props.hierarchy).map((realm) => {
          return (
            <div key={realm} className={styles.CSCRealmContainer}>
              <CSCRealm
                name={realm}
                groups={this.props.hierarchy[realm]}
                hierarchy={this.props.hierarchy}
                subscribeToStreamCallback={this.props.subscribeToStreamCallback}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
