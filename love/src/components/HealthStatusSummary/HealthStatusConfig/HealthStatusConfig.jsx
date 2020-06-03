import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './HealthStatusConfig.module.css';
import HSCEntry from './HSCEntry/HSCEntry';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import GearIcon from '../../icons/GearIcon/GearIcon';
import Button from '../../GeneralPurpose/Button/Button';
import { getFakeUnits, formatTimestamp } from '../../../Utils';

const HEALTH_STATUS_CODES = {
  0: 'Undefined',
  1: 'OK',
  2: 'Warning',
  3: 'Alert',
  4: 'Invalid',
};

export const HEALTH_STATUS_VARIABLES_DECLARATION = Object.entries(HEALTH_STATUS_CODES)
  .map(([key, label]) => {
    return `const ${label.toUpperCase()}=${key};`;
  })
  .join('\n');

/**
 * Component to configure the Health Status Summary
 */
export default class HealthStatusConfig extends PureComponent {
  static propTypes = {
    /** JSON string that describes the initially selected telemetries and their health functions.
     * Must have his structure:
     *
     * {
     *   "<component.salindex.topic>": {
     *     <parameter_name>: healthfunction,
     *     ...
     *   }
     * }
     */
    initialData: PropTypes.string,
  };

  static defaultProps = {
    initialData: {},
  };

  constructor() {
    super();
    this.state = {
      currentConfig: [],
    };
  }

  componentDidMount = () => {
    console.log('initialData: ', this.props.initialData);
  };

  onEntryChange = (inputs, funcBody, index) => {
    const newConfig = [...this.state.currentConfig];
    newConfig[index] = { inputs, funcBody };
    this.setState({
      currentConfig: newConfig,
    });
  };

  render() {
    const nextIndex = this.state.currentConfig.length;
    return (
      <div className={styles.container}>
        <div className={styles.list}>
          {this.state.currentConfig.map((entry, index) => {
            return (
              <HSCEntry
                key={index}
                name={entry.name}
                index={index}
                inputs={entry.inputs}
                funcBody={entry.funcBody}
                onChange={(inputs, funcBody) => this.onEntryChange(inputs, funcBody, index)}
              />
            );
          })}
          <HSCEntry onChange={(inputs, funcBody) => this.onEntryChange(inputs, funcBody, nextIndex)} />
        </div>
      </div>
    );
  }
}
