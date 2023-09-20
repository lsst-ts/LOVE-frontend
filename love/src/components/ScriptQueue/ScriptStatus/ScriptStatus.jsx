/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ScriptStatus.module.css';

export default class ScriptStatus extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['process', 'script']),
    status: PropTypes.string,
    children: PropTypes.string,
    isCompact: PropTypes.bool,
  };

  static defaultProps = {
    type: 'script',
    isCompact: false,
  };

  render() {
    const { status } = this.props;
    let statusStyle = styles.undefined;
    if (status === 'ok') statusStyle = styles.ok;
    if (status === 'running') statusStyle = styles.running;
    if (status === 'warning') statusStyle = styles.warning;
    if (status === 'alert') statusStyle = styles.alert;
    if (status === 'invalid') statusStyle = styles.invalid;
    const backgroundStyle = this.props.type === 'process' ? styles.noBackground : '';
    const type = this.props.type === 'process' ? 'Process' : 'Script';
    const child = this.props.children;
    return (
      <>
        {!this.props.isCompact && <span>{type} state</span>}
        <span
          title={`${type} state: ${this.props.children}`}
          className={[styles.status, statusStyle, backgroundStyle].join(' ')}
        >
          {child}
        </span>
      </>
    );
  }
}
