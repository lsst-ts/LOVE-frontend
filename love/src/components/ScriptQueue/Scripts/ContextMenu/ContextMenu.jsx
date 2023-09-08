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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './ContextMenu.module.css';

export default class ContextMenu extends PureComponent {
  static propTypes = {
    /**Position data for the context menu.
     * Usually from event.target.getBoundingClientRect()
     */
    contextMenuData: PropTypes.shape({
      right: PropTypes.number,
      bottom: PropTypes.number,
    }),
    isOpen: PropTypes.bool,
    /** List of clickable options to be displayed */
    options: PropTypes.arrayOf(
      PropTypes.shape({
        /** Text label of the button */
        text: PropTypes.node,
        /**SVG icon to be shown at the left of the text*/
        icon: PropTypes.node,
        /** Callback passed to the onClick event of each option */
        action: PropTypes.func,
        /** If `true` the button will be disabled*/
        disabled: PropTypes.bool,
      }),
    ),
    /** Target element which triggered the contextmenu */
    target: PropTypes.object,
  };

  static defaultProps = {
    contextMenuData: {},
    isOpen: false,
    options: [],
    target: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
    };
  }

  componentDidUpdate = (nextState, nextProps) => {
    if (this.props.target !== nextProps.target) {
      const parentCustomView = this.props.target ? this.props.target.closest('.react-grid-item') : undefined;
      const offset = parentCustomView ? parentCustomView.getBoundingClientRect().x : 0;
      this.setState({
        offset,
      });
    }
  };

  render() {
    return (
      this.props.isOpen && (
        <div
          className={styles.container}
          style={{
            left: this.props.contextMenuData.right - this.state.offset,
            top: `calc( -3.3em + ${this.props.contextMenuData.bottom}px)`,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {this.props.options.map((child, index) => {
            return (
              <div
                className={[styles.row, child.disabled ? '' : styles.enabled].join(' ')}
                key={index}
                onClick={!child.disabled ? child.action : undefined}
              >
                <div className={[styles.iconWrapper].join(' ')}>{child.icon}</div>
                <div className={[styles.buttonText].join(' ')}>{child.text}</div>
              </div>
            );
          })}
        </div>
      )
    );
  }
}
