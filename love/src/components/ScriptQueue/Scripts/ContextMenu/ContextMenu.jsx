import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './ContextMenu.module.css';

export default class ContextMenu extends Component {
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
  };

  static defaultProps = {
    contextMenuData: {},
    isOpen: false,
    options: [],
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      this.props.isOpen && (
        <div
          className={styles.container}
          style={{
            left: this.props.contextMenuData.right,
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
