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
