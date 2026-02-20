/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import TextField from 'components/TextField/TextField';
import styles from './TimeWindow.module.css';

const TIMEWINDOW_PRESETS = [
  ['60', '1h'],
  ['15', '15min'],
  ['1', '1min'],
];

export default class TimeWindow extends PureComponent {
  static propTypes = {
    /** Function to be called when changing the time window */
    setTimeWindow: PropTypes.func.isRequired,
    /** Time window in minutes */
    timeWindow: PropTypes.number,
  };

  static defaultProps = {
    setTimeWindow: () => 0,
  };

  constructor() {
    super();
    this.state = {
      isCustom: false,
    };
    this.timeWindowPresetIds = TIMEWINDOW_PRESETS.map(() => uniqueId('time-window-preset-'));
    this.customRadioId = uniqueId('time-window-custom-radio-');
    this.customInputId = uniqueId('time-window-custom-input-');
  }

  handleCustomInput = (e) => {
    const timeWindow = e.target.value <= 60 ? e.target.value : 60;
    this.props.setTimeWindow(timeWindow);
  };

  handleTimeWindowSelection = (timeWindow, isCustom) => {
    this.props.setTimeWindow(parseFloat(timeWindow));
    this.setState({
      isCustom,
    });
  };

  render() {
    return (
      <div className={styles.timeWindowOptionsContainer}>
        <span>Time window:</span>
        {TIMEWINDOW_PRESETS.map((preset, index) => {
          const [duration, label] = preset;
          const id = this.timeWindowPresetIds[index];
          return (
            <div className={styles.timeWindowOption} key={label}>
              <div className={styles.timeWindowOption}>
                <input
                  type="radio"
                  value={duration}
                  id={id}
                  checked={!this.state.isCustom && this.props.timeWindow == duration}
                  onChange={(e) => this.handleTimeWindowSelection(e.target.value, false)}
                />
                <label htmlFor={id} onClick={() => this.handleTimeWindowSelection(duration, false)}>
                  {label}
                </label>
              </div>
            </div>
          );
        })}
        <div className={styles.timeWindowOption}>
          <input
            type="radio"
            value={this.props.timeWindow}
            id={this.customRadioId}
            checked={this.state.isCustom}
            onChange={(e) => this.handleTimeWindowSelection(e.target.value, true)}
          />
          <>
            <label
              htmlFor={this.customInputId}
              onClick={() => this.handleTimeWindowSelection(this.props.timeWindow, true)}
            >
              Custom
            </label>
            <div
              className={[styles.customTimeWindowContainer, this.state.isCustom ? styles.customVisible : ''].join(' ')}
            >
              <label htmlFor={this.customInputId}>: </label>
              <TextField
                id={this.customInputId}
                className={styles.customTimeWindowInput}
                type="text"
                value={this.props.timeWindow}
                onChange={this.handleCustomInput}
                onFocus={(e) => {
                  e.target.select();
                }}
              />
              <label htmlFor={this.customInputId}> minutes</label>
            </div>
          </>
        </div>
      </div>
    );
  }
}
