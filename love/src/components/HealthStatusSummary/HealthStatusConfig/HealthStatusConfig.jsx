import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './HealthStatusConfig.module.css';
import HSCEntry from './HSCEntry/HSCEntry';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import GearIcon from '../../icons/GearIcon/GearIcon';
import Button from '../../GeneralPurpose/Button/Button';
import ManagerInterface, { getFakeUnits, formatTimestamp } from '../../../Utils';

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
      optionsTree: null,
    };
  }

  componentDidMount = () => {
    const conf = this.dataToConf(this.props.initialData);
    console.log('initialData: ', this.props.initialData);
    console.log('conf: ', conf);
    this.setState({ currentConfig: conf });
    ManagerInterface.getTopicData('event-telemetry').then((data) => {
      this.setState({ optionsTree: data });
    });
  };

  dataToConf = (data) => {
    const dict = JSON.parse(data);
    const conf = [];
    for (const topicKey of Object.keys(dict)) {
      const topicData = dict[topicKey];
      let [category, csc, salindex, topic] = topicKey.split('-');
      if (salindex !== null && salindex !== undefined) {
        salindex = parseInt(salindex);
      }
      for (const item of Object.keys(topicData)) {
        const funcBody = topicData[item];
        const name = `${topicKey}-${item}`;
        conf.push({
          name,
          inputs: [
            {
              category,
              csc,
              salindex,
              topic,
              item,
            },
          ],
          funcBody,
        });
      }
    }
    return conf;
  };

  onEntryChange = (name, inputs, funcBody, index) => {
    const newConfig = [...this.state.currentConfig];
    newConfig[index] = { name, inputs, funcBody };
    this.setState({ currentConfig: newConfig });
  };

  onEntryRemove = (index) => {
    const newConfig = this.state.currentConfig.filter((_el, i) => i !== index);
    this.setState({ currentConfig: newConfig });
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
                inputs={entry.inputs}
                funcBody={entry.funcBody}
                optionsTree={this.state.optionsTree}
                onChange={(name, inputs, funcBody) => this.onEntryChange(name, inputs, funcBody, index)}
                onRemove={() => this.onEntryRemove(index)}
              />
            );
          })}
          <HSCEntry
            key={nextIndex}
            className={styles.empty}
            optionsTree={this.state.optionsTree}
            onChange={(name, inputs, funcBody) => this.onEntryChange(name, inputs, funcBody, nextIndex)}
          />
        </div>
      </div>
    );
  }
}
