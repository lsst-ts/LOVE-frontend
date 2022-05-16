import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './FlagIcon.module.css';


export default class FlagIcon extends Component {
  static propTypes = {
    status: PropTypes.oneOf(['ok', 'alert', 'warning', 'unknown']),
    title: PropTypes.string,
  };

  static defaultProps = {
    status: undefined,
    title: '',
    className: '',
  };

  constructor(props) {
    super(props);
  }

  getClassNameStatus() {
    const result = {
      ok: styles.ok,
      alert: styles.alert,
      warning: styles.warning,
      unknown: styles.unknown
    };
    return result[this.props.status] ? result[this.props.status] : styles.unknown;
  }

  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-2 0 17 19"
        className={[styles.flagIcon, this.props.className, this.props.status].join(' ')}
      >
        <title>{this.props.title}</title>
        <path
          d="M14,2.68C4.25,2.68,8.51,1.17,1.62,1.12v-.33c0-.43-.36-.78-.81-.78S0,.35,0,.78V17.22c0,.43,.36,.78,.81,.78s.81-.35,.81-.78v-6.77c7.12,.05,2.63,1.56,12.38,1.56V2.68Z"
          className={[this.props.className, this.getClassNameStatus()].join(' ')}
        />
      </svg>
    );
  }
}

