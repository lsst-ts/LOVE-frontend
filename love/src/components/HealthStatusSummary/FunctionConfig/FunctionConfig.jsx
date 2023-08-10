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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './FunctionConfig.module.css';

/**
 * Configurable table displaying an arbitrary subset
 * of telemetries provided in the component props. It has an optional selection column
 * to be used as a telemetry selection feature. along with the filtering and sorting methods.
 * By pressing the Set button, the list of telemetries is passed to a callback function in the component props.
 *
 */
export default class FunctionConfig extends PureComponent {
  static propTypes = {
    /** Dictionary of telemetries and events to be configured */
    topics: PropTypes.object,
    /** Function called when changes in a configuration are applied */
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
    topics: {},
  };

  render() {
    return (
      <div className={styles.container}>
        {Object.entries(this.props.topics).map(([topic, data], _) => (
          <div className={styles.topic}>
            <div className={styles.topicName}>{topic}</div>
          </div>
        ))}
      </div>
    );
  }
}
