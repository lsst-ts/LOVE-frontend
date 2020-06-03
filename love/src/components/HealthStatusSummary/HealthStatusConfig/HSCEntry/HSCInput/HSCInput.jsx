import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './HSCInput.module.css';
import StatusText from '../../../../GeneralPurpose/StatusText/StatusText';
import GearIcon from '../../../../icons/GearIcon/GearIcon';
import Button from '../../../../GeneralPurpose/Button/Button';
import Select from '../../../../GeneralPurpose/Select/Select';
import { getFakeUnits, formatTimestamp } from '../../../../../Utils';

/**
 * Component to configure the Health Status Summary
 */
export default class HSCInput extends PureComponent {
  static propTypes = {
    /**
     * Dictionary describing an input to the function, must have this structure:
     *
     * {
     *   category: <string> ("event" or "telemetry"),
     *   csc: <string> (name of a CS),
     *   salindex: <integer> (salindex of the CSC),
     *   topic: <string> (name of the topic),
     * }
     */
    input: PropTypes.shape({
      category: PropTypes.string,
      csc: PropTypes.string,
      salindex: PropTypes.number,
      topic: PropTypes.string,
    }),
    /**
     * Callback to call when making a change, should have the following arguments:
     * - input
     */
    onChange: PropTypes.func,
    /**
     * Dictionary containing the strtucture for the options of the input
     */
    optionsTree: PropTypes.object,
  };

  static defaultProps = {
    input: null,
    onChange: (input) => {},
  };

  onSelectChange = (value, key) => {
    const newInput = { ...input, value };
    newInput[key] = value;
    this.props.onChange(newInput);
  };

  render() {
    const { index, inputs, name, funcBody } = this.props;
    return (
      <div className={styles.container}>
        <Select
          options={['event', 'telemetry']}
          value={inputs[0]}
          placeholder="Select a category"
          onChange={(selection) => this.onSelectChange(selection.value, 'category')}
        />
        <Select
          options={['event', 'telemetry']}
          value={inputs[0]}
          placeholder="Select a category"
          onChange={(selection) => this.onSelectChange(selection.value, 'category')}
        />
      </div>
    );
  }
}
