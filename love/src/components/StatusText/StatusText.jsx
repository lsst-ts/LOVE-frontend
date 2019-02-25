import React, { Component } from 'react';
import styles from './StatusText.module.css';

export default class StatusText extends Component {
  render() {
    const status = this.props.status;
    let statusStyle = styles.undefined;
    if (status === 'ok') statusStyle = styles.ok;
    if (status === 'warning') statusStyle = styles.warning;
    if (status === 'alert') statusStyle = styles.alert;
    if (status === 'invalid') statusStyle = styles.invalid;

    return <span className={[styles.status, statusStyle].join(' ')}>{this.props.children}</span>;
  }
}
