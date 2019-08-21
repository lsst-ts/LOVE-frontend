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
    if (status === 'ok') statusStyle = styles.ok;
    if (status === 'running') statusStyle = styles.running;
    if (status === 'warning') statusStyle = styles.warning;
    if (status === 'alert') statusStyle = styles.alert;
    if (status === 'invalid') statusStyle = styles.invalid;

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
