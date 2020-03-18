import React from 'react';
import styles from './TimeWindow.module.css';

const options = {
  '10s': 10,
  '1min': 60,
  '10min': 600,
  '1d': 24 * 60 * 60,
  '10d': 240 * 60 * 60,
  '1m': 720 * 60 * 60,
  '6m': 4320 * 60 * 60,
  '1y': 8640 * 60 * 60,
  Max: Infinity,
};
const TimeWindow = ({ setTimeWindowCallback = () => null, enabledOptions = [] }) => {
  const [timeWindow, setTimeWindow] = React.useState(options['1d']);

  const handleChange = (changeEvent) => {
    console.log(changeEvent.target.value);
    let tw = changeEvent.target.value !== 'Infinity' ? parseInt(changeEvent.target.value, 10) : Infinity;
    console.log('tw',tw)
    setTimeWindow(tw);
    setTimeWindowCallback(tw);
  };
  return (
    <div className={styles['time-window']}>
      {Object.keys(options).map((key, index) => {
        return (
          (enabledOptions.length === 0 || key == 'Max' || enabledOptions.includes(key)) && (
            <label key={key} className={styles['time-window-selection-label']} htmlFor={key}>
              <input
                className={styles['time-window-selection-input']}
                id={key}
                checked={options[key] === timeWindow}
                type="radio"
                name="field"
                value={options[key]}
                onChange={handleChange}
              />
              <span className={styles['time-window-selection-span']}>{key}</span>
            </label>
          )
        );
      })}
    </div>
  );
};

export default TimeWindow;
