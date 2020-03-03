import React, { Component } from 'react';
import styles from './GoBackIcon.module.css';

export default class GoBackIcon extends Component {
  render() {
    return (
      <svg className={[styles.svg, this.props.className].join(' ')} {...this.props} viewBox="0 0 11.7 20.8">
        <path className={this.props.active} d="M0.8,8.6l9.4-8.5l0,4.1l-7.3,6.1l0,0.1l7.3,6.2l0,4.1l-9.4-8.5L0.8,8.6z" />
      </svg>
    );
  }
}

GoBackIcon.defaultProps = {
  className: '',
};
