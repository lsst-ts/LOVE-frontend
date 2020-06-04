import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './HSCInput.module.css';
import StatusText from '../../../../GeneralPurpose/StatusText/StatusText';
import GearIcon from '../../../../icons/GearIcon/GearIcon';
import Button from '../../../../GeneralPurpose/Button/Button';
import Input from '../../../../GeneralPurpose/Input/Input';
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
     *   item: <string> (name of the item of the topic),
     * }
     */
    input: PropTypes.shape({
      category: PropTypes.string,
      csc: PropTypes.string,
      salindex: PropTypes.number,
      topic: PropTypes.string,
      item: PropTypes.string,
    }),
    /**
     * Callback to call when making a change, should have the following arguments:
     * - input
     */
    onChange: PropTypes.func,
    /**
     * Callback to call when removing the input, should have the following arguments:
     * - index
     */
    onRemove: PropTypes.func,
    /**
     * Dictionary containing the strtucture for the options of the input
     */
    optionsTree: PropTypes.object,
  };

  static defaultProps = {
    input: null,
    onChange: (input) => {},
    onRemove: null,
  };

  onSelectChange = (value, key) => {
    const newInput = { ...this.props.input };
    newInput[key] = value;
    this.props.onChange(newInput);
  };

  render() {
    const input = this.props.input;
    return (
      <div className={styles.container}>
        <Select
          className={styles.select}
          options={['event', 'telemetry']}
          value={input?.category}
          placeholder="Select a category"
          onChange={(selection) => this.onSelectChange(selection.value, 'category')}
        />
        <Select
          className={styles.select}
          options={['ATDome', 'ATMount']}
          value={input?.csc}
          placeholder="Select a CSC"
          onChange={(selection) => this.onSelectChange(selection.value, 'csc')}
        />
        <Input
          className={styles.input}
          type="number"
          value={input?.salindex}
          placeholder="salindex"
          onChange={(ev) => this.onSelectChange(parseInt(ev.target.value), 'salindex')}
        />
        <Select
          className={styles.select}
          options={['position', 'asdasd']}
          value={input?.topic}
          placeholder="Select a topic"
          onChange={(selection) => this.onSelectChange(selection.value, 'topic')}
        />
        <Select
          className={styles.select}
          options={['position', 'asdasd']}
          value={input?.item}
          placeholder="Select an item"
          onChange={(selection) => this.onSelectChange(selection.value, 'item')}
        />
        <Button onClick={this.props.onRemove} disabled={this.props.onRemove === null}>
          -
        </Button>
      </div>
    );
  }
}
