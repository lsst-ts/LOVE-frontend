import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/solarized_dark';
import styles from './HSCEntry.module.css';
import HSCInput from './HSCInput/HSCInput';
import Button from '../../../GeneralPurpose/Button/Button';
import Input from '../../../GeneralPurpose/Input/Input';
import { HEALTH_STATUS_VARIABLES_DECLARATION } from '../HealthStatusConfig';

/**
 * Component to configure the Health Status Summary
 */
export default class HSCEntry extends PureComponent {
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
    funcBody: PropTypes.string,
    /**
     * Callback to call when making a change, should have the followinf arguments:
     * - name
     * - inputs
     * - funcBody
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
    funcBody: null,
    onChange: (name, inputs, funcBody) => {},
    onRemove: null,
  };

  onNameChange = (name) => {
    this.props.onChange(name, this.props.input, this.props.funcBody);
  };

  onInputChange = (input, index) => {
    const newInputs = [...this.props.inputs];
    newInputs[index] = input;
    const { category, csc, salindex, topic, item } = input;
    const newName = `${category}-${csc}-${salindex}-${topic}-${item}`;
    this.props.onChange(newName, newInputs, this.props.funcBody);
  };

  onInputGetName = (input) => {
    const { category, csc, salindex, topic, item } = input;
    const newName = `${category}-${csc}-${salindex}-${topic}-${item}`;
    this.props.onChange(newName, this.props.inputs, this.props.funcBody);
  };

  onInputRemove = (index) => {
    const newInputs = this.props.inputs.filter((_el, i) => i !== index);
    this.props.onChange(this.props.name, newInputs, this.props.funcBody);
  };

  onEditorChange = (funcBody) => {
    this.props.onChange(this.props.name, this.props.inputs, funcBody);
  };

  getFunctionHeader = () => {
    const vars = this.props.inputs.map((input) => input.item);
    const header = `(${vars.join(', ')}) => {`;
    const preLines = HEALTH_STATUS_VARIABLES_DECLARATION.split(';').filter((line) => line.trim() !== '');
    return (
      <>
        {header}
        <p>{preLines.map((line, index) => `${line}; `)}</p>
      </>
    );
  };

  render() {
    // Delete the following 2 lines and uncomment the third when going back to multiple inputs:
    const input = this.props.inputs[0];
    const index = 0;
    // const nextIndex = this.props.inputs.length;

    return (
      <div className={styles.container}>
        <div className={styles.firstRow}>
          <Input
            className={styles.input}
            placeholder="Insert a name for the Health Status"
            value={this.props.name || ''}
            readOnly
            // DO NOT DELETE THIS COMMENTED CODE, IT WILL BE USED LATER
            // onChange={(ev) => this.onNameChange(ev.target?.value)}
          />
          <Button className={styles.button} onClick={this.props.onRemove} disabled={this.props.onRemove === null}>
            Remove
          </Button>
        </div>

        {/** DELETE THE FOLLOWING ELEMENT AND UNCOMMENT WHAT IS BELOW (when goping back to multiple inputs) */}
        <HSCInput
          key={index}
          input={input}
          onChange={(input) => this.onInputChange(input, index)}
          onRemove={null}
          onGetName={input ? () => this.onInputGetName(input) : null}
          optionsTree={this.props.optionsTree}
        />

        {/** DO NOT DELETE THIS COMMENTED CODE, IT WILL BE USED LATER */}
        {/* {this.props.inputs.map((input, index) => (
          <HSCInput
            key={index}
            input={input}
            onChange={(input) => this.onInputChange(input, index)}
            onRemove={() => this.onInputRemove(index)}
            onGetName={() => this.onInputGetName(input)}
            optionsTree={this.props.optionsTree}
          />
        ))}
        <HSCInput
          key={nextIndex}
          onChange={(input) => this.onInputChange(input, nextIndex)}
          optionsTree={this.props.optionsTree}
        /> */}

        <div>Function: </div>
        <div className={styles.funcHeader}>{this.getFunctionHeader()}</div>

        <AceEditor
          mode="javascript"
          className={styles.editor}
          theme="solarized_dark"
          name="UNIQUE_ID_OF_DIV"
          onChange={this.onEditorChange}
          debounceChangePeriod={100}
          width={'100%'}
          height={'100px'}
          value={this.props.funcBody || ''}
        />
        <div className={styles.funcHeader}>{'}'}</div>
      </div>
    );
  }
}
