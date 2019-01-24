import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Button.module.css';

export default class Button extends Component {
  static propTypes = {
    status: PropTypes.string
  }

  static defaultProps = {
      status: 'default',
      size: 'default'
  }

  render() {
    const statusStyleDict = {
      default: styles['btnDefault'],
      primary: styles['btnPrimary'],
      success: styles['btnSuccess'],
      info: styles['btnInfo'],
      warning: styles['btnWarning'],
      danger: styles['btnDanger'],
      link: styles['btnLink']
    }

    const sizeStyleDict = {
      large: styles.btnLg,
      default: ''
    }


    let {btn} = styles;
    const statusStyle = statusStyleDict[this.props.status];
    const sizeStyle = sizeStyleDict[this.props.size];

    const style = [btn, statusStyle, sizeStyle].join(' ');
    
    return (
      <button className={style} type="button">{this.props.children}</button>
    )
  }
}
