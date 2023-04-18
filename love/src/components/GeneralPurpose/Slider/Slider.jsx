import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Slider.module.css';
/**
 * Generic slider input implemented on top of the `<Slider>` tag
 */
export default class Slider extends Component {
  static propTypes = {
    /**
     * Function for the onChange event of the `<input>` element. The actual value, of the event target, is passed as argument.
     */
    onChange: PropTypes.func,
    /**
     * Aditional names of css classes to be applied after the presets.
     */
    className: PropTypes.string,
    /**
     * Define wether or not the button is disabled. If it's True, you can't interact with the input, and the value is the min.
     */
    disabled: PropTypes.bool,
    /**
     * Define the initial value of the range.
     */
    value: PropTypes.number,
    /**
     * Define the min value of the range.
     */
    min: PropTypes.number,
    /**
     * Define the max value of the range.
     */
    max: PropTypes.number,
    /**
     * Define the step of the range.
     */
    step: PropTypes.number,
  };

  static defaultProps = {
    onChange: (value) => {},
    className: '',
    disabled: false,
    min: 0,
    max: 1,
    step: 0.1,
  };

  disabledFunct = (target) => {
    target.value = 0;
  };

  render() {
    const { min, max, value, step, className, onChange, disabled } = this.props;
    return (
      <input
        onChange={(event) => (disabled ? this.disabledFunct(event.target) : onChange(event.target.value))}
        className={[className, styles.input, disabled ? styles.opacity : ''].join(' ')}
        type="range"
        id="inputRange"
        min={min}
        max={max}
        step={step}
        value={disabled ? min : value}
      />
    );
  }
}
