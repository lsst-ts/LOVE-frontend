/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

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

class ContextMenu extends PureComponent {
  static propTypes = {
    /** List of clickable options to be displayed */
    options: PropTypes.arrayOf(
      PropTypes.shape({
        /** Text label of the button */
        text: PropTypes.node,
        /**SVG icon to be shown at the left of the text*/
        icon: PropTypes.node,
        /** Callback passed to the onClick event of each option */
        action: PropTypes.func,
        /** Callback that returns a boolean to determine if the option should be disabled or not. */
        isDisabled: PropTypes.func,
      }),
    ),
    /** Target element which triggered the contextmenu */
    target: PropTypes.object,
    /** Children nodes to be rendered at the bottom of the options list */
    children: PropTypes.node,
  };

  static defaultProps = {
    options: [],
    target: undefined,
    children: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
    };
  }

  handleRef = (node) => {
    if (node) {
      // We set the context menu witdth in the state to be able to position it correctly on the right of the target element.
      // This runs only when the context menu is mounted for the first time.
      const { width } = node.getBoundingClientRect();
      this.setState({ width });
    }
  };

  render() {
    const { options, target, children } = this.props;
    const { width } = this.state;

    const targetBoundingRect = target ? target.getBoundingClientRect() : { right: 0, bottom: 0 };

    // We need to substract the position of the parent custom view (if any) to get the correct absolute position of the context menu.
    // This is necessary because the context menu is rendered inside the custom view, so its position is relative to it.
    // By substracting the position of the parent custom view, we can get the correct absolute position of the context menu on the screen.
    const parentCustomView = target?.closest('.react-grid-item');
    const parentBoundingRect = parentCustomView ? parentCustomView.getBoundingClientRect() : { left: 0, top: 0 };

    const absoluteTop = targetBoundingRect.bottom - parentBoundingRect.top;
    const absoluteLeft = targetBoundingRect.right - parentBoundingRect.left - width;

    return (
      <div
        ref={this.handleRef}
        className={styles.container}
        style={{
          left: absoluteLeft,
          top: `calc(${absoluteTop}px + var(--small-padding))`,
          width: children ? '20em' : 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.options}>
          {options?.map((child, index) => {
            const disabled = child.isDisabled?.();
            return (
              <div
                className={[styles.row, disabled ? '' : styles.enabled].join(' ')}
                key={index}
                onClick={!disabled ? child.action : undefined}
              >
                <div className={[styles.iconWrapper].join(' ')}>{child.icon}</div>
                <div className={[styles.buttonText].join(' ')}>{child.text}</div>
              </div>
            );
          })}
        </div>
        {children}
      </div>
    );
  }
}

export default ContextMenu;
