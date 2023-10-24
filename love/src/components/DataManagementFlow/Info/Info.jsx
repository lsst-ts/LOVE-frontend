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
import styles from './Info.module.css';
import { dmFlowStatusMap, stateToStyleDMFlow } from 'Config';
import PlotDiv from './PlotDiv';
import ConnectionIcon from 'components/icons/DMFlowIcon/ConnectionIcon';

export default class Info extends Component {
  static propTypes = {
    /**
     * If schema exist, the component plot the connection
     */
    schema: PropTypes.string,
    /**
     * State of connection
     */
    state: PropTypes.string,
    /**
     * If schema no exist, the component render only the name
     */
    name: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.containerRef = React.createRef();
  }

  componentDidMount = () => {};

  componentDidUpdate = (prevProps) => {};

  componentWillUnmount = () => {};

  render() {
    const icon = <ConnectionIcon state={this.props.state ?? 'disabled'} />;

    return (
      <div className={styles.component}>
        <div className={styles.div}>
          <div className={[styles.divIcon, styles.borderRadiusLeft].join(' ')}>{icon}</div>
          {this.props.schema ? (
            <div ref={this.containerRef} style={{ height: '100%', width: '100%', overflow: 'auto' }}>
              <PlotDiv schema={this.props.schema} containerNode={this.containerRef} />
            </div>
          ) : (
            <div className={styles.divName}> {this.props.name}</div>
          )}
        </div>
      </div>
    );
  }
}
