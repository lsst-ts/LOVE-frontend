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
import styles from './Button.module.css';
/**
 * Generic button implemented on top of the `<button>` tag
 * enabling simple manipulation of its style depending on the given props.
 * It can also receive a callback for the `onClick` event and will render
 * the child component between the `<Button>` tags.
 */
export default class Button extends Component {
  static propTypes = {
    /** Changes the color combination according to its value.
     * Possible values are:
     *
     * *default*: Indicates a default/standard button
     *
     * *primary*: Provides extra visual weight and identifies the primary action in a set of buttons
     *
     * *success*: Indicates a successful or positive action
     *
     * *info*: Contextual button for informational alert messages
     *
     * *warning*: Indicates caution should be taken with this action
     *
     * *danger*: Indicates a dangerous or potentially negative action
     *
     * *link*: Makes a button look like a link (will still have button behavior)
     *
     * *transparent*: transparent button, suitable for panels, like close button
     *
     */
    status: PropTypes.string,
    /** Changes the geometry of the button to make it look bigger/smaller according to these values:
     *
     * *large*: Makes a large button
     * *small*: Makes a small button
     * *extra-small*: Makes an extra small button
     */
    size: PropTypes.string,
    /**
     * Callback for the onClick event of the `<button>` element.
     */
    onClick: PropTypes.func,
    /**
     * Aditional names of css classes to be applied after the presets.
     */
    className: PropTypes.string,
    /**
     * Title of the button to be displayed as a tooltip.
     */
    title: PropTypes.string,
    /**
     * Type for the button.
     */
    type: PropTypes.string,
    /**
     * Define wether or not the button is disabled.
     */
    disabled: PropTypes.bool,
    /**
     * Define wether or not the button sends a command.
     */
    command: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  };

  static defaultProps = {
    status: 'default',
    size: 'default',
    onClick: () => {},
    className: '',
    title: '',
    type: 'button',
    shape: 'default',
    disabled: false,
    command: false,
  };

  statusStyleDict = {
    default: styles.btnDefault,
    primary: styles.btnPrimary,
    success: styles.btnSuccess,
    info: styles.btnInfo,
    warning: styles.btnWarning,
    danger: styles.btnDanger,
    link: styles.btnLink,
    transparent: styles.btnTransparent,
  };

  sizeStyleDict = {
    large: styles.btnLG,
    default: '',
    small: styles.btnSM,
    'extra-small': styles.btnXS,
  };

  onKeyUp = (event) => {
    if (event.keyCode === 13) {
      this.props.onClick();
    }
  };

  render() {
    const { btn } = styles;
    const statusStyle = this.statusStyleDict[this.props.status];
    const sizeStyle = this.sizeStyleDict[this.props.size];
    const style = [
      btn,
      statusStyle,
      sizeStyle,
      this.props.className,
      this.props.disabled ? styles.disabled : null,
      this.props.command ? styles.command : null,
    ].join(' ');

    return (
      <span className={styles.btnWrapper} onKeyUp={this.onKeyUp} tabIndex="0">
        <button
          tabIndex="-1"
          title={this.props.title}
          className={style}
          style={this.props.style}
          type={this.props.type}
          onClick={this.props.onClick}
          disabled={this.props.disabled}
        >
          {this.props.children}{' '}
        </button>
      </span>
    );
  }
}
