import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import Input from 'components/GeneralPurpose/Input/Input';
import styles from './DualSlider.module.css';

const WAITTIME = 300;

/** Generic dual rangeslider input */
function DualSlider({
  defaultX1 = 0,
  defaultX2 = 100,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
  onChangeX1 = () => {},
  onChangeX2 = () => {},
}) {
  const [x1, setX1] = useState(defaultX1);
  const [x2, setX2] = useState(defaultX2);

  const debouncedOnChangeX1 = useCallback(debounce(onChangeX1, WAITTIME), []);
  const debouncedOnChangeX2 = useCallback(debounce(onChangeX2, WAITTIME), []);

  const handleChangeX1 = (e) => {
    const value = Math.min(e.target.value, x2 - step);
    debouncedOnChangeX1(value);
    setX1(value);
  };

  const handleChangeX2 = (e) => {
    const value = Math.max(e.target.value, x1 + step);
    debouncedOnChangeX2(value);
    setX2(value);
  };

  return (
    <div className={[styles.container, disabled ? styles.disabled : ''].join(' ')}>
      <div className={styles.slidersControl}>
        <input
          onChange={handleChangeX1}
          className={[className, styles.input, styles.fromSlider].join(' ')}
          type="range"
          min={min}
          max={max}
          step={step}
          value={x1}
          disabled={disabled}
        />
        <input
          onChange={handleChangeX2}
          className={[className, styles.input, styles.toSlider].join(' ')}
          type="range"
          min={min}
          max={max}
          step={step}
          value={x2}
          disabled={disabled}
        />
      </div>
      <div className={styles.formControl}>
        <label>
          Min:
          <Input onChange={handleChangeX1} type="number" value={x1} min={min} max={max} disabled={disabled} />
        </label>
        <label>
          Max:
          <Input onChange={handleChangeX2} type="number" value={x2} min={min} max={max} disabled={disabled} />
        </label>
      </div>
    </div>
  );
}

DualSlider.propTypes = {
  /** Define the initial value of the range x1. */
  defaultX1: PropTypes.number,
  /** Define the initial value of the range x2. */
  defaultX2: PropTypes.number,
  /** Define the min value of the range. */
  min: PropTypes.number,
  /** Define the max value of the range. */
  max: PropTypes.number,
  /** Define the step of the range. */
  step: PropTypes.number,
  /** Define wether or not the button is disabled.
   * If it's True, you can't interact with the input, and the value is the min. */
  disabled: PropTypes.bool,
  /** Aditional names of css classes to be applied after the presets. */
  className: PropTypes.string,
  /** onChange callback for changes of x1 */
  onChangeX1: PropTypes.func,
  /** onChange callback for changes of x2 */
  onChangeX2: PropTypes.func,
};

export default React.memo(DualSlider);
