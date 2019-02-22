import React, { Component } from 'react';
import styles from './Panel.module.css';
import PropTypes from 'prop-types';

/**
 * A generic placeholder with a title that can be used
 * as a window or frame.
 */
export default class Panel extends Component {

	static propTypes = {
		/** Text to be displayed in the title */
		title : PropTypes.string,
	}

	static defaultProps = {
		title: ''
	}
  render() {
    return (
        <div className={styles.panel}>
            <div className={styles.panelHeading}>
            <h3 className={styles.panelTitle}>{this.props.title}</h3>
            </div>
            <div className={styles.panelBody}>{this.props.children}</div>
        </div>
    );
  }
}
