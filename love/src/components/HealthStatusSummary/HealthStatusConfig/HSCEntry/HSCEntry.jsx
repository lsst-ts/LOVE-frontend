import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './HSCEntry.module.css';
import HSCInput from './HSCInput/HSCInput';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import GearIcon from '../../../icons/GearIcon/GearIcon';
import Button from '../../../GeneralPurpose/Button/Button';
import Select from '../../../GeneralPurpose/Select/Select';
import { getFakeUnits, formatTimestamp } from '../../../../Utils';

/**
 * Component to configure the Health Status Summary
 */
export default class HSCEntry extends PureComponent {
  static propTypes = {
    /**
     * Index of the entry within the list of entries
     */
    index: PropTypes.number,
    /**
     * Name of the entry
     */
    name: PropTypes.string,
    /**
     * List of inputs for the configuration.
     * Must be a list of dictionaries with this structure:
     *
     * {
     *   category: <string> ("event" or "telemetry"),
     *   csc: <string> (name of a CS),
     *   salindex: <integer> (salindex of the CSC),
     *   topic: <string> (name of the topic),
     * }
     */
    inputs: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.string,
        csc: PropTypes.string,
        salindex: PropTypes.number,
        topic: PropTypes.string,
      }),
    ),
    /**
     * String describing the body a function
     */
    funcBody: PropTypes.string,
    /**
     * Callback to call when making a change, should have the followinf arguments:
     * - inputs
     * - funcBody
     */
    onChange: PropTypes.func,
  };

  static defaultProps = {
    index: -1,
    inputs: [],
    name: null,
    funcBody: null,
    onChange: (inputs, funcBody) => {},
  };

  onInputChange = (input, index) => {
    const newInputs = [...this.props.inputs];
    newInputs[index] = input;
    this.props.onChange(newInputs, this.props.funcBody);
  };

  render() {
    const nextIndex = this.props.inputs.length;
    return (
      <div className={styles.container}>
        {this.props.inputs.map((input, index) => (
          <HSCInput key={index} input={input} onChange={(input) => this.onInputChange(input, index)} />
        ))}
        <HSCInput key={nextIndex} onChange={(input) => this.onInputChange(input, nextIndex)} />
      </div>
    );
  }
}
