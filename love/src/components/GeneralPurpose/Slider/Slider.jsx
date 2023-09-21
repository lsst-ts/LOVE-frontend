import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import styles from './Slider.module.css';

const WAITTIME = 300;

/**
 * Generic slider input implemented on top of the `<Slider>` tag
 */
function Slider({ value = 0, min = 0, max = 1, step = 0.1, disabled = false, className = '', onChange = () => {} }) {
  const sendOnchange = (value) => {
    onChange(value);
  };

  const debouncedSendOnChange = useCallback(debounce(sendOnchange, WAITTIME), []);

  const [input, setInput] = useState(value);

  const onChangeSlider = (e) => {
    if (disabled) this.disabledFunct(e.target);
    const value = e.target.value;
    debouncedSendOnChange(value);
    setInput(value);
  };

  return (
    <input
      onChange={onChangeSlider}
      className={[className, styles.input, disabled ? styles.opacity : ''].join(' ')}
      type="range"
      id="inputRange"
      min={min}
      max={max}
      step={step}
      value={input}
    />
  );
}

Slider.propTypes = {
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
  /**
   * Define wether or not the button is disabled. If it's True, you can't interact with the input, and the value is the min.
   */
  disabled: PropTypes.bool,
  /**
   * Aditional names of css classes to be applied after the presets.
   */
  className: PropTypes.string,
  /**
   * Function for the onChange event of the `<input>` element. The actual value, of the event target, is passed as argument.
   */
  onChange: PropTypes.func,
};

export default React.memo(Slider);
