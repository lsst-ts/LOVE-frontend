import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './TSCInput.module.css';
import Input from 'components/GeneralPurpose/Input/Input.jsx';
import Select from 'components/GeneralPurpose/Select/Select.jsx';

/**
 * Component to configure the Health Status Summary
 */
export default class TSCInput extends PureComponent {
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
     * Callback to call when clicking the "Get Name" button, should have the following arguments:
     * - name: <string>
     */
    onGetName: PropTypes.func,
    /**
     * Dictionary containing the strtucture for the options of the  dropdown inputs
     */
    optionsTree: PropTypes.object,
  };

  static defaultProps = {
    input: null,
    onChange: (input) => {},
    onRemove: null,
    onGetName: null,
  };

  onSelectChange = (value, key) => {
    if (this.props.input && this.props.input[key] === value) {
      return;
    }
    const newInput = { ...this.props.input };
    newInput[key] = value;
    if (key === 'csc' || key === 'category') {
      newInput['topic'] = null;
      newInput['item'] = null;
    } else if (key === 'topic') {
      newInput['item'] = null;
    }
    this.props.onChange(newInput);
  };

  render() {
    const input = this.props.input;
    const optionsTree = this.props.optionsTree;
    const categoryOptions = ['event', 'telemetry'];
    let cscOptions = [];
    let topicOptions = [];
    let itemOptions = [];
    if (this.props.optionsTree) {
      cscOptions = Object.keys(optionsTree);
      if (this.props.input) {
        const { category, csc, topic } = this.props.input;
        topicOptions = csc && category ? Object.keys(optionsTree[csc][`${category}_data`]) : [];
        itemOptions = topic ? Object.keys(optionsTree[csc][`${category}_data`][topic]) : [];
      }
    }
    return (
      <div className={styles.container}>
        <Select
          className={[styles.select, styles.category].join(' ')}
          options={categoryOptions}
          option={input?.category}
          placeholder="Select category"
          onChange={(selection) => this.onSelectChange(selection.value, 'category')}
        />
        <Select
          className={styles.select}
          options={cscOptions}
          option={input?.csc}
          placeholder="Select a CSC"
          onChange={(selection) => this.onSelectChange(selection.value, 'csc')}
        />
        <Input
          className={styles.input}
          type="number"
          min={0}
          value={input?.salindex || input?.salindex === 0 ? input.salindex : ''}
          placeholder="salindex"
          onChange={(ev) => this.onSelectChange(parseInt(ev.target.value), 'salindex')}
        />
        <Select
          className={styles.select}
          options={topicOptions}
          option={input?.topic}
          placeholder="Select a topic"
          onChange={(selection) => this.onSelectChange(selection.value, 'topic')}
        />
        <Select
          className={styles.select}
          options={itemOptions}
          option={input?.item}
          placeholder="Select an item"
          onChange={(selection) => this.onSelectChange(selection.value, 'item')}
        />
        {/** DO NOT DELETE THIS COMMENTED CODE, IT WILL BE USED LATER */}
        {/* <Button className={styles.button} onClick={this.props.onGetName} disabled={this.props.onGetName === null}>
          Use as Name
        </Button>
        <Button className={styles.button} onClick={this.props.onRemove} disabled={this.props.onRemove === null}>
          Remove
        </Button> */}
      </div>
    );
  }
}
