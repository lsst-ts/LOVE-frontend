import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ScriptStatus.module.css';

export default class ScriptStatus extends Component {
  static propTypes = {
    status: PropTypes.string,
    children: PropTypes.string,
  };

  render() {
    const { status } = this.props;
    let statusStyle = styles.undefined;
    if (status === 'ok') statusStyle = styles.ok;
    if (status === 'warning') statusStyle = styles.warning;
    if (status === 'alert') statusStyle = styles.alert;
    if (status === 'invalid') statusStyle = styles.invalid;

    return <span className={[styles.status, statusStyle].join(' ')}>{this.props.children}</span>;
  }
}
