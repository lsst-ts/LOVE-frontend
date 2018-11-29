import React, { Component } from 'react'
import styles from './Button.module.css'

export default class Button extends Component {
  render() {
    let {secondary, props} = {...this.props.secondary, ...this.props}
    let secondaryClass = secondary ? styles.secondary : '';
    let classnames = [styles.button, secondaryClass, this.props.className];
    return (
      <button {...props} className={classnames.join(' ')}>
          {this.props.children}
      </button>
    )
  }
}
