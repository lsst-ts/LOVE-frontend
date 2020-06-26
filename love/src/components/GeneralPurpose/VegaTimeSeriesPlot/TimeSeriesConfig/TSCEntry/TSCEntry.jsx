import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/solarized_dark';
import styles from './TSCEntry.module.css';
import TSCInput from './TSCInput/TSCInput';
import Button from '../../../Button/Button';
import Input from '../../../Input/Input';
import Select from '../../../Select/Select';

/**
 * Component to configure the Health Status Summary
 */
export default class TSCEntry extends PureComponent {
  static propTypes = {
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
    accessor: PropTypes.string,
    /**
     * String describing the type of mark, can be either "line", "bar" or "pointLine"
     */
    type: PropTypes.string,
    /**
     * Callback to call when making a change, should have the followinf arguments:
     * - name
     * - inputs
     * - accessor
     */
    onChange: PropTypes.func,
    /**
     * Callback to call when removing the input, should have the following arguments:
     * - index
     */
    onRemove: PropTypes.func,
    /**
     * Dictionary containing the strtucture for the options of the dropdown inputs
     */
    optionsTree: PropTypes.object,
  };

  static defaultProps = {
    inputs: [],
    name: null,
    accessor: null,
    type: null,
    onChange: (name, inputs, accessor) => {},
    onRemove: null,
  };

  itemOptions = ['line', 'pointLine', 'bar'];

  onNameChange = (name) => {
    this.props.onChange(name, this.props.inputs, this.props.accessor, this.props.type);
  };

  onInputChange = (input, index) => {
    const newInputs = [...this.props.inputs];
    newInputs[index] = input;
    const { category, csc, salindex, topic, item } = input;
    this.props.onChange(this.props.name, newInputs, this.props.accessor, this.props.type);
  };

  onInputGetName = (input) => {
    const { category, csc, salindex, topic, item } = input;
    const newName = `${category}-${csc}-${salindex}-${topic}-${item}`;
    this.props.onChange(newName, this.props.inputs, this.props.accessor, this.props.type);
  };

  onInputRemove = (index) => {
    const newInputs = this.props.inputs.filter((_el, i) => i !== index);
    this.props.onChange(this.props.name, newInputs, this.props.accessor, this.props.type);
  };

  onTypeChange = (type) => {
    this.props.onChange(this.props.name, this.props.inputs, this.props.accessor, type);
  };

  onEditorChange = (accessor) => {
    this.props.onChange(this.props.name, this.props.inputs, accessor, this.props.type);
  };

  render() {
    // Delete the following 2 lines and uncomment the third when going back to multiple inputs:
    const input = this.props.inputs[0];
    const index = 0;
    // const nextIndex = this.props.inputs.length;

    return (
      <div className={styles.container}>
        <div className={styles.firstRow}>
          <div className={styles.nameMark}>
            <Input
              className={styles.input}
              placeholder="Insert a name for the legend"
              value={this.props.name || ''}
              // readOnly
              // DO NOT DELETE THIS COMMENTED CODE, IT WILL BE USED LATER
              onChange={(ev) => this.onNameChange(ev.target?.value)}
            />
            <Select
              className={styles.select}
              options={this.itemOptions}
              value={this.props.type}
              placeholder="Select mark"
              onChange={(selection) => this.onTypeChange(selection.value)}
            />
          </div>
          <Button className={styles.button} onClick={this.props.onRemove} disabled={this.props.onRemove === null}>
            Remove
          </Button>
        </div>

        {/** DELETE THE FOLLOWING ELEMENT AND UNCOMMENT WHAT IS BELOW (when goping back to multiple inputs) */}
        <TSCInput
          key={index}
          input={input}
          onChange={(input) => this.onInputChange(input, index)}
          onRemove={null}
          onGetName={input ? () => this.onInputGetName(input) : null}
          optionsTree={this.props.optionsTree}
        />

        {/** DO NOT DELETE THIS COMMENTED CODE, IT WILL BE USED LATER */}
        {/* {this.props.inputs.map((input, index) => (
          <TSCInput
            key={index}
            input={input}
            onChange={(input) => this.onInputChange(input, index)}
            onRemove={() => this.onInputRemove(index)}
            onGetName={() => this.onInputGetName(input)}
            optionsTree={this.props.optionsTree}
          />
        ))}
        <TSCInput
          key={nextIndex}
          onChange={(input) => this.onInputChange(input, nextIndex)}
          optionsTree={this.props.optionsTree}
        /> */}

        <div>Accessor: </div>
        <AceEditor
          mode="javascript"
          className={styles.editor}
          theme="solarized_dark"
          name="UNIQUE_ID_OF_DIV"
          onChange={this.onEditorChange}
          debounceChangePeriod={100}
          width={'100%'}
          height={'50px'}
          value={this.props.accessor || ''}
        />
      </div>
    );
  }
}
