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
import styles from './Badge.module.css';
/**
 * Generic circular badge implemented on a div
 * enabling simple manipulation of its style depending on the given props.
 */
export default class Badge extends Component {
  static propTypes = {
    /** Changes the color combination according to its value.
     * Possible values are:
     *
     * *default*: Indicates a default/standard badge
     *
     * *primary*: Provides extra visual weight and identifies the primary action in a set of badges
     *
     * *success*: Indicates a successful or positive action
     *
     * *info*: Contextual badge for informational alert messages
     *
     * *warning*: Indicates caution should be taken with this action
     *
     * *danger*: Indicates a dangerous or potentially negative action
     *
     * *link*: Makes a badge look like a link (will still have badge behavior)
     *
     */
    status: PropTypes.string,
    /** Changes the geometry of the badge to make it look bigger/smaller according to these values:
     *
     * *large*: Makes a large badge
     * *small*: Makes a small badge
     */
    size: PropTypes.string,
    /**
     * Aditional names of css classes to be applied after the presets.
     */
    className: PropTypes.string,
    /**
     * Title of the badge to be displayed as a tooltip.
     */
    title: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
  };

  static defaultProps = {
    status: 'default',
    size: 'default',
    className: '',
    title: '',
  };

  render() {
    const statusStyleDict = {
      default: styles.badgeDefault,
      primary: styles.badgePrimary,
      success: styles.badgeSuccess,
      info: styles.badgeInfo,
      warning: styles.badgeWarning,
      danger: styles.badgeDanger,
      link: styles.badgeLink,
    };

    const sizeStyleDict = {
      large: styles.badgeLG,
      default: '',
      small: styles.badgeSM,
    };

    const { badge } = styles;
    const statusStyle = statusStyleDict[this.props.status];
    const sizeStyle = sizeStyleDict[this.props.size];

    const style = [badge, statusStyle, sizeStyle, this.props.className].join(' ');

    return (
      <div className={style} title={this.props.title}>
        {this.props.children}{' '}
      </div>
    );
  }
}
