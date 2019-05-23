import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Panel.module.css';

/**
 * A generic placeholder with a title that can be used
 * as a window or frame.
 */
export default class Panel extends Component {
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
        <div className={styles.panelHeading}>
          <h3 className={styles.panelTitle}>{this.props.title}</h3>
        </div>
        <div className={styles.panelBody}>{this.props.children}</div>
      </div>
    );
  }
}
