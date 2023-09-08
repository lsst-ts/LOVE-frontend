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
import styles from './IconBadge.module.css';

export default class IconBadge extends Component {
  static propTypes = {
    /** Badge content */
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Whether to display the badge */
    display: PropTypes.bool,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    content: '',
    children: null,
  };

  render() {
    return (
      <span className={styles.iconWrapper}>
        {this.props.display && <span className={styles.badge}>{this.props.content}</span>}
        <span className={styles.content}>{this.props.children}</span>
      </span>
    );
  }
}
