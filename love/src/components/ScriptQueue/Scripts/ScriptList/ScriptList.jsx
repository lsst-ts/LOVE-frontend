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
import styles from './ScriptList.module.css';

export default class ScriptList extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onDragExit: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragEnter: PropTypes.func,
    noOverflow: PropTypes.bool,
  };

  static defaultProps = {
    onDragEnter: () => 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      dragCounter: 0,
    };
    this.dragCounter = 0;
  }

  onDragEnter = (e) => {
    this.props.onDragEnter(e);
  };

  onDragLeave = () => {
    this.dragCounter -= 1;
    this.setState({
      dragCounter: this.state.dragCounter - 1,
    });
  };

  render() {
    return (
      <div
        className={[styles.scriptListWrapper, this.props.noOverflow ? styles.noOverflow : ''].join(' ')}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragExit={this.props.onDragExit}
        onDragEnd={this.props.onDragEnd}
      >
        <div className={styles.scriptListContainer}>{this.props.children}</div>
      </div>
    );
  }
}
