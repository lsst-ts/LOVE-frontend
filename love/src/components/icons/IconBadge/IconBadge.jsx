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
