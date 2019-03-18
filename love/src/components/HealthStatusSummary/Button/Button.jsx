import React, { Component } from 'react';
import styles from './Button.module.css';

export default class Button extends Component {
  render() {
    const { secondary, props } = { ...this.props.secondary, ...this.props };
    const secondaryClass = secondary ? styles.secondary : '';
    const classnames = [styles.button, secondaryClass, this.props.className];
    return (
      <button {...props} className={classnames.join(' ')}>
          {this.props.children}
      </button>
    );
  }
}
