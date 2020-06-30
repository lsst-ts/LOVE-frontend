import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './TimeSeriesConfig.module.css';
import TSCEntry from './TSCEntry/TSCEntry';
import Button from 'components/GeneralPurpose/Button/Button';
import ManagerInterface from 'Utils';


/**
 * Component to configure the Health Status Summary
 */
export default class TimeSeriesConfig extends PureComponent {
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

  constructor() {
    super();
    this.state = {
      currentConfig: [],
      optionsTree: null,
      changed: false,
      entries: [],
    };
  }

  componentDidMount = () => {
    const inputs = JSON.parse(this.props.initialData);
    const entries = Object.keys(inputs).map((key) => {
      const input = inputs[key];
      input['name'] = key;
      return input;
    });
    this.setState({ entries });
    ManagerInterface.getTopicData('event-telemetry').then((data) => {
      this.setState({ optionsTree: data });
    });
  };

  onEntryChange = (name, inputs, accessor, type, index) => {
    const newEntries = [...this.state.entries];
    newEntries[index] = {
      name,
      accessor,
      type,
      category: inputs?.[0]?.category,
      csc: inputs?.[0]?.csc,
      salindex: inputs?.[0]?.salindex,
      topic: inputs?.[0]?.topic,
      item: inputs?.[0]?.item,
    };
    this.setState({ entries: newEntries, changed: true });
  };

  onEntryRemove = (index) => {
    const entries = this.state.entries.filter((_el, i) => i !== index);
    this.setState({ entries, changed: true });
  };

  onApply = () => {
    if (this.state.changed) {
      const inputs = {};
      this.state.entries.forEach((entry) => {
        const name = entry.name;
        delete entry.name;
        inputs[name] = entry;
      });
      this.props.onSave(inputs);
    }
  };

  render() {
    const nextIndex = this.state.entries.length;
    return (
      <div className={styles.container}>
        <div className={styles.title}>Time Series Configuration</div>
        <div className={styles.content}>
          <div className={styles.list}>
            {this.state.entries.map((entry, index) => {
              const { name, category, csc, salindex, topic, item, type, accessor } = entry;
              return (
                <TSCEntry
                  key={index}
                  name={name}
                  inputs={[
                    {
                      category,
                      csc,
                      salindex: parseInt(salindex),
                      topic,
                      item,
                    },
                  ]}
                  accessor={accessor}
                  type={type}
                  optionsTree={this.state.optionsTree}
                  onChange={(name, inputs, accessor, type) => this.onEntryChange(name, inputs, accessor, type, index)}
                  onRemove={() => this.onEntryRemove(index)}
                />
              );
            })}
            <TSCEntry
              key={nextIndex}
              className={styles.empty}
              optionsTree={this.state.optionsTree}
              onChange={(name, inputs, accessor, type) => this.onEntryChange(name, inputs, accessor, type, nextIndex)}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <Button status="default" onClick={this.props.onCancel} className={styles.button}>
            Cancel
          </Button>
          <Button
            status="primary"
            onClick={() => this.onApply()}
            className={styles.button}
            disabled={!this.state.changed}
          >
            Apply
          </Button>
        </div>
      </div>
    );
  }
}
