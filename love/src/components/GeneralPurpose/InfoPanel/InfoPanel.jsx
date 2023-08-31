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
import styles from './InfoPanel.module.css';

/**
 * A generic information panel, meant to be user as a floating element
 * containing information of a hovered element.
 */
export default class InfoPanel extends Component {
  static propTypes = {
    /** Text to be displayed in the title */
    title: PropTypes.string,
    children: PropTypes.object,
    className: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    className: '',
  };

  render() {
    const classNames = [styles.panel, this.props.className].join(' ');
    return (
      <div className={classNames}>
        {this.props.title && (
          <div className={styles.panelHeading}>
            <h3 className={styles.panelTitle}>{this.props.title}</h3>
          </div>
        )}
        <div className={[styles.panelBody, this.props.title ? styles.panelBodyUnderline : ''].join(' ')}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
