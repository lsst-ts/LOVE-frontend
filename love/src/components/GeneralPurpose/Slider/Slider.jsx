/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

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
