import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './ContextMenu.module.css';
import RequeueIcon from '../../../icons/ScriptQueue/RequeueIcon/RequeueIcon';

export default class ContextMenu extends Component {
  static propTypes = {
    contextMenuData: PropTypes.object,
    isOpen: PropTypes.bool,
    options: PropTypes.array,
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
          style={{ left: this.props.contextMenuData.right, top: this.props.contextMenuData.bottom }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {this.props.options.map((child, index) => {
            return (
              <div className={styles.row} key={index} onClick={child.action}>
                <div>{child.icon}</div>
                <div className={styles.buttonText}>{child.text}</div>
              </div>
            );
          })}
        </div>
      )
    );
  }
}
