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
import StatusText from '../StatusText/StatusText';
import PropTypes from 'prop-types';
import styles from './LabeledStatusText.module.css';

export default class LabeledStatusText extends Component {
  static propTypes = {
    accessor: PropTypes.func,
  };

  static defaultProps = {
    accessor: (event) => event.state.value,
  };

  componentDidMount = () => {
    if (this.props.groupName) {
      this.props.subscribeToStream(this.props.groupName);
    }
  };

  componentWillUnmount = () => {
    if (this.props.groupName) {
      this.props.unsubscribeToStream(this.props.groupName);
    }
  };

  render() {
    const stateValue = this.props.streamState
      ? this.props.accessor(this.props.streamState[this.props.streamState.length - 1])
      : 0;
    const stateLabel = this.props.stateToLabelMap[stateValue];
    const stateStyle = this.props.stateToStyleMap[stateValue];
    return (
      <div className={[styles.container, this.props.stacked ? styles.stacked : ''].join(' ')}>
        <div>{this.props.label}</div>
        <StatusText title={stateLabel} status={stateStyle || 'invalid'}>
          {stateLabel || 'unknown'}
        </StatusText>
      </div>
    );
  }
}
