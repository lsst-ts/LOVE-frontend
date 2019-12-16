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
    /** Wether to fit width to content */
    fit: PropTypes.bool,
    /** Wether to expand height to 100vh */
    expandHeight: PropTypes.bool,
  };

  static defaultProps = {
    title: '',
    className: '',
    expandHeight: false,
  };

  render() {
    const classNames = [
      styles.panel,
      this.props.className,
      this.props.fit ? styles.fit : '',
      this.props.expandHeight ? styles.expandHeight : '',
    ].join(' ');
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
