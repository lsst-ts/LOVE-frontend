import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './StatusText.module.css';

export default class StatusText extends Component {
  static propTypes = {
    status: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.string,
    small: PropTypes.bool,
  };

  render() {
    const { status } = this.props;
    let statusStyle = styles.undefined;
    if (status === 'ok' || status === 'running') statusStyle = styles.ok;
    if (status === 'warning') statusStyle = styles.warning;
    if (status === 'alert' || status === 'serious' || status === 'critical') statusStyle = styles.alert;
    if (status === 'invalid' || status === 'unknown' || status === 'undefined') statusStyle = styles.invalid;

    return (
      <span
        title={this.props.title}
        className={[styles.status, statusStyle, this.props.small ? styles.small : ''].join(' ')}
      >
        {this.props.children}
      </span>
    );
  }
}
