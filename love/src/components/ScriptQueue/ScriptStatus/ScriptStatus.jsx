import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ScriptStatus.module.css';

export default class ScriptStatus extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['process', 'script']),
    status: PropTypes.string,
    children: PropTypes.string,
    isCompact: PropTypes.bool,
  };

  static defaultProps = {
    type: 'script',
    isCompact: false,
  };

  render() {
    const { status } = this.props;
    let statusStyle = styles.undefined;
    if (status === 'ok') statusStyle = styles.ok;
    if (status === 'running') statusStyle = styles.running;
    if (status === 'warning') statusStyle = styles.warning;
    if (status === 'alert') statusStyle = styles.alert;
    if (status === 'invalid') statusStyle = styles.invalid;
    const backgroundStyle = this.props.type === 'process' ? styles.noBackground : '';
    const type = this.props.type === 'process' ? 'Process' : 'Script';
    const child = this.props.isCompact ? this.props.children : this.props.children;
    return (
      <>
        {!this.props.isCompact && <span>{type} state</span>}
        <span
          title={`${type} state: ${this.props.children}`}
          className={[styles.status, statusStyle, backgroundStyle].join(' ')}
        >
          {child}
        </span>
      </>
    );
  }
}
