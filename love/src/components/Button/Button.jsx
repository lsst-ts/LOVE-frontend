import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './Button.module.css';
/**
 * Generic button implemented on top of the `<button>` tag
 * enabling simple manipulation of its style depending on the given props.
 * It can also receive a callback for the `onClick` event and will render
 * the child component between the `<Button>` tags.
 */
export default class Button extends Component {
  static propTypes = {
    /** Changes the color combination according to its value.
     * Possible values are:
     *
      * *default*: Indicates a default/standard button
      *
      * *primary*: Provides extra visual weight and identifies the primary action in a set of buttons
      *
      * *success*: Indicates a successful or positive action
      *
      * *info*: Contextual button for informational alert messages
      *
      * *warning*: Indicates caution should be taken with this action
      *
      * *danger*: Indicates a dangerous or potentially negative action
      *
      * *link*: Makes a button look like a link (will still have button behavior)
      *
    */
    status: PropTypes.string,
    /** Changes the geometry of the button to make it look bigger/smaller according to these values:
     *
      * *large*: Makes a large button
      *
      * *small*:	Makes a small button
      *
      * *extra-small*:	Makes an extra small button
     */
    size: PropTypes.string,
    /**
     * Callback for the onClick event of the `<button>` element.
     */
    onClick: PropTypes.func,
    /**
     * Aditional names of css classes to be applied after the presets.
     */
    className: PropTypes.string,
    /**
    * Title of the button to be displayed as a tooltip.
    */
   title: PropTypes.string,
    /**
     * Type for the button.
     */
    type: PropTypes.string
  }

  static defaultProps = {
      status: 'default',
      size: 'default',
      onClick: ()=>{},
      className: '',
      title: '',
      type: 'button',
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
      large: styles.btnLG,
      default: '',
      small: styles.btnSM,
      'extra-small': styles.btnXS
    }


    let {btn} = styles;
    const statusStyle = statusStyleDict[this.props.status];
    const sizeStyle = sizeStyleDict[this.props.size];
    const style = [btn, statusStyle, sizeStyle, this.props.className].join(' ');

    return (
      <button title={this.props.title} className={style} type={this.props.type} onClick={this.props.onClick}>{this.props.children} </button>
    )
  }
}
