import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/solarized_dark';
import styles from './PPCEntry.module.css';
import PPCInput from './PPCInput/PPCInput';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import Select from 'components/GeneralPurpose/Select/Select';
import { COLORS, DASHES, SHAPES } from 'components/GeneralPurpose/Plot/VegaTimeSeriesPlot/VegaTimeSeriesPlot.jsx';

/**
 * Component to configure the Health Status Summary
 */
export default class PPCEntry extends PureComponent {
  static propTypes = {
    /**
     * Name of the entry
     */
    name: PropTypes.string,
    /**
     * List of inputs for the configuration.
     */
    inputs: PropTypes.arrayOf(
      PropTypes.shape({
        /** Category of the message obtained from salobj */
        category: PropTypes.oneOf(['event', 'telemetry']),
        /** Name of the CSC that generates the data */
        csc: PropTypes.string,
        /** SalIndex of the CSC, use 0 for unnumbered CSCs */
        salindex: PropTypes.number,
        /** Name of the topic in the xml */
        topic: PropTypes.string,
        /** (optional) Color of the mark to be used */
        color: PropTypes.string.isRequired,
      }),
    ),
    /**
     * String describing the body a function
     */
    accessor: PropTypes.string,
    /**
     * String describing the encoding, can be either "radial" or "angular"
     */
    encoding: PropTypes.string,
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
    accessor: '(x) => x',
    encoding: null,
    onChange: (name, inputs, accessor) => {},
    onRemove: null,
  };

  encodingOptions = ['radial', 'angular', 'color'];

  onNameChange = (name) => {
    this.props.onChange(name, this.props.inputs, this.props.accessor, this.props.encoding, this.props.group);
  };

  onInputChange = (input, index) => {
    const newInputs = [...this.props.inputs];
    newInputs[index] = input;
    const { category, csc, salindex, topic, item } = input;
    this.props.onChange(this.props.name, newInputs, this.props.accessor, this.props.encoding, this.props.group);
  };

  onInputGetName = (input) => {
    const { category, csc, salindex, topic, item } = input;
    const newName = `${category}-${csc}-${salindex}-${topic}-${item}`;
    this.props.onChange(newName, this.props.inputs, this.props.accessor, this.props.encoding, this.props.group);
  };

  onInputRemove = (index) => {
    const newInputs = this.props.inputs.filter((_el, i) => i !== index);
    this.props.onChange(this.props.name, newInputs, this.props.accessor, this.props.encoding, this.props.group);
  };

  onEncodingChange = (encoding) => {
    this.props.onChange(this.props.name, this.props.inputs, this.props.accessor, encoding, this.props.group);
  };

  onStyleChange = (styleName, style) => {
    this.props.onChange(this.props.name, this.props.inputs, this.props.accessor, this.props.encoding, this.props.group, {
      color: this.props.inputs[0].color,
      [styleName]: style.value,
    });
  };

  onEditorChange = (accessor) => {
    this.props.onChange(this.props.name, this.props.inputs, accessor, this.props.encoding, this.props.group);
  };

  onGroupChange = (group) => {
    this.props.onChange(this.props.name, this.props.inputs, this.props.accessor, this.props.encoding, group);
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
              options={this.encodingOptions}
              option={this.props.encoding}
              placeholder="Select encoding"
              onChange={(selection) => this.onEncodingChange(selection.value)}
            />
          </div>
          <Button
            className={styles.button}
            onClick={this.props.onRemove}
            disabled={this.props.onRemove === null}
            size="small"
            title="Remove from config"
          >
            Remove
          </Button>
        </div>

        <div className={styles.stylesContainer}>
          <Select
            className={styles.select}
            options={COLORS}
            option={input?.color}
            placeholder="Select a color"
            onChange={(selection) => this.onStyleChange('color', selection)}
          />
          <Input
            className={styles.input}
            type="number"
            placeholder="Insert a name for the legend"
            min={0}
            value={this.props.group || 0}
            onChange={(ev) => this.onGroupChange(parseInt(ev.target.value))}
          />
        </div>

        {/** DELETE THE FOLLOWING ELEMENT AND UNCOMMENT WHAT IS BELOW (when goping back to multiple inputs) */}
        <PPCInput
          key={index}
          input={input}
          onChange={(input) => this.onInputChange(input, index)}
          onRemove={null}
          onGetName={input ? () => this.onInputGetName(input) : null}
          optionsTree={this.props.optionsTree}
        />

        {/** DO NOT DELETE THIS COMMENTED CODE, IT WILL BE USED LATER */}
        {/* {this.props.inputs.map((input, index) => (
          <PPCInput
            key={index}
            input={input}
            onChange={(input) => this.onInputChange(input, index)}
            onRemove={() => this.onInputRemove(index)}
            onGetName={() => this.onInputGetName(input)}
            optionsTree={this.props.optionsTree}
          />
        ))}
        <PPCInput
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
