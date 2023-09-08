/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './TimeSeriesConfigure.module.css';
import Entry from './Entry/Entry';
import Button from 'components/GeneralPurpose/Button/Button';
import ManagerInterface from 'Utils';
import { defaultStyles } from 'components/GeneralPurpose/Plot/Plot.container';
import VegaTimeseriesPlot from '../VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import { COLORS } from '../VegaTimeSeriesPlot/VegaTimeSeriesPlot';
import AddIcon from 'components/icons/AddIcon/AddIcon';

/**
 * Component to configure the Health Status Summary
 */
export default class TimeSeriesConfigure extends PureComponent {
  static propTypes = {
    /** JSON string that describes the initially selected telemetries or events.
     * Must have this structure:
     *
     * {
     *   "<name_for_legend>": {
     *     "category": <telemetry or event>,
     *     "csc": <CSC name>,
     *     "salindex": <salindex>,
     *     "topic": <topic>,
     *     "item": <item of the topic>,
     *     "type": <"bar", "line" or "pointLine">,
     *     "accessor": <Access function as string>,
     *   }
     * }
     */
    initialData: PropTypes.string,
    /**
     * Function to call when clicking the save button.
     * Should receive as argument the new configuration as a dictionary with the same structure as initalData
     */
    onSave: PropTypes.func,
    /**
     * Function to call when cancel the save button
     */
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    initialData: {},
  };

  static defaultEntry = {
    name: null,
    values: [{}],
    type: 'line',
    color: COLORS[0],
    dash: defaultStyles[0].dash,
    shape: defaultStyles[0].shape,
    filled: defaultStyles[0].filled,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentConfig: [],
      changed: false,
      entries: [],
      optionsTree: null,
    };
  }

  componentDidMount = () => {
    const inputs = JSON.parse(this.props.initialData);
    const entries = Object.keys(inputs).map((key) => {
      const input = inputs[key];
      input['name'] = key;
      return input;
    });

    const refs = this.state.entries.map((item) => React.createRef());
    this.setState({ entries, refs });

    // Get the options for the dropdowns from SAL info endpoint
    ManagerInterface.getTopicData('event-telemetry').then((data) => {
      this.setState({ optionsTree: data });
    });
  };

  onEntryRemove = (index) => {
    const entries = this.state.entries.filter((_el, i) => i !== index);
    this.setState({ entries, changed: true });
  };

  onApply = (refs) => {
    const inputs = {};
    refs.map((ref, index) => {
      const entry = ref.current.getInfo();
      const name = entry.name;
      delete entry.name;
      inputs[name] = entry;
    });
    this.props.onSave(inputs);
  };

  render() {
    const { optionsTree, cscOptions } = this.state;
    const refs = this.state.entries.map((item) => React.createRef());

    return (
      <div className={styles.container}>
        <div className={styles.title}>Time Series Configuration</div>
        <div className={styles.content}>
          <div className={styles.list}>
            {this.state.entries.map((entry, index) => {
              const { name, values, type, color, dash, shape, filled } = entry;
              return (
                <Entry
                  key={index}
                  entryId={`${index}`}
                  ref={refs[index]}
                  name={name}
                  values={values}
                  type={type}
                  config={{
                    color: color ?? defaultStyles[index % (defaultStyles.length - 1)].color,
                    dash: dash ?? defaultStyles[index % (defaultStyles.length - 1)].dash,
                    shape: shape ?? defaultStyles[index % (defaultStyles.length - 1)].shape,
                    filled: filled ?? defaultStyles[index % (defaultStyles.length - 1)].filled,
                  }}
                  optionsTree={optionsTree}
                  onRemove={() => this.onEntryRemove(index)}
                />
              );
            })}
            <Button
              status="default"
              onClick={() => {
                const newEntries = [...this.state.entries, TimeSeriesConfigure.defaultEntry];
                this.setState({ entries: newEntries });
              }}
              className={styles.button}
            >
              <AddIcon className={styles.icon} />
            </Button>
          </div>
        </div>
        <div className={styles.footer}>
          <Button status="default" onClick={this.props.onCancel} className={styles.button}>
            Cancel
          </Button>
          <Button status="primary" onClick={() => this.onApply(refs)} className={styles.button}>
            Apply
          </Button>
        </div>
      </div>
    );
  }
}
