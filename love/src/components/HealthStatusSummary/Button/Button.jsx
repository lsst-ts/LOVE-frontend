import React, { Component } from 'react'
import styles from './Button.module.css'

export default class Button extends Component {
  render() {
    return (
      <button {...this.props} className={[styles.button, this.props.className].join(' ')}>
          {this.props.children}
      </button>
    )
  }
}
