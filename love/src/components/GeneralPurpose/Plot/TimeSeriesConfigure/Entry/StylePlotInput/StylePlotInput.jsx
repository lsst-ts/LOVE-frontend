import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import 'brace/mode/javascript';
import 'brace/theme/solarized_dark';
import styles from './StylePlotInput.module.css';
import Button from 'components/GeneralPurpose/Button/Button';
import Input from 'components/GeneralPurpose/Input/Input';
import Select from 'components/GeneralPurpose/Select/Select';
import { COLORS, DASHES, SHAPES } from 'components/GeneralPurpose/Plot/VegaTimeSeriesPlot/VegaTimeSeriesPlot.jsx';

/**
 * Component to configure the Health Status Summary
 */
export default class StylePlotInput extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    /** String describing the type of mark, can be either "line", "bar" or "pointLine" */
    type: PropTypes.string,
   /**
    * List of inputs for the configuration.
    */
    config: PropTypes.shape({
      /** (optional) Color of the mark to be used */
      color: PropTypes.string.isRequired,
      /** (optional) Dashes pattern for line and pointline marks */
      dash: PropTypes.arrayOf(PropTypes.number).isRequired,
      /** (optional) Shape used for the mark. Used in point and pointLine marks.*/
      shape: PropTypes.string.isRequired,
      /** (optional) Whether to plot a filled or empty (contour only) point. Used in point and pointLine marks.*/
      filled: PropTypes.bool.isRequired,
    }),
    
    /**
     * Callback to call when making a change, should have the followinf arguments:
     * - config
     */
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
  };

  static itemOptions = ['line', 'pointLine', 'bar', 'arrow', 'area'];

  static defaultProps = {
    type: StylePlotInput.itemOptions[0],
    config: {},
    onChange: (config) => {},
    onRemove: null,
  };

  onNameChange = (name) => {
    this.props.onChange(name, this.props.type, this.props.config);
  };

  onTypeChange = (type) => {
    this.props.onChange(this.props.name, type, this.props.config);
  };

  onStyleChange = (styleName, style) => {
    this.props.onChange(this.props.name, this.props.type, {
      color: this.props.config.color,
      dash: this.props.config.dash,
      shape: this.props.config.shape,
      filled: this.props.config.filled,
      [styleName]: style.value,
    });
  };


  render() {
    const input = this.props.config;
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
              options={StylePlotInput.itemOptions}
              option={this.props.type}
              placeholder="Select mark"
              onChange={(selection) => this.onTypeChange(selection.value)}
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

          {['line', 'pointLine', 'arrow'].includes(this.props.type) && (
            <Select
              className={styles.select}
              options={DASHES.map((d) => JSON.stringify(d))}
              option={JSON.stringify(input?.dash)}
              placeholder="Select a dash pattern"
              onChange={(selection) => this.onStyleChange('dash', { ...selection, value: JSON.parse(selection.value) })}
            />
          )}

          {['line', 'pointLine'].includes(this.props.type) && (
            <svg viewBox="0 0 20 4" xmlns="http://www.w3.org/2000/svg">
              <line
                stroke={input?.color}
                x1="2"
                y1="2"
                x2="20"
                y2="2"
                strokeDasharray={`${input?.dash[0]} ${input?.dash[1]}`}
              />
            </svg>
          )}

          {['arrow'].includes(this.props.type) && (
            <svg viewBox="0 0 20 4" xmlns="http://www.w3.org/2000/svg">
              <line
                stroke={input?.color}
                x1="0"
                y1="2"
                x2="20"
                y2="2"
                strokeDasharray={`${input?.dash[0]} ${input?.dash[1]}`}
              />
              <text
                role="graphics-symbol"
                aria-roledescription="text mark"
                textAnchor="start"
                transform="translate(9,5) rotate(-30)"
                fontFamily="sans-serif"
                fontSize="6px"
                fontStyle="normal"
                fontWeight="normal"
                fill="white">➟</text>
            </svg>
          )}

          {['area'].includes(this.props.type) && (
            <svg viewBox="0 0 870 190" xmlns="http://www.w3.org/2000/svg">
              <path aria-label="u: 1; v: 28" role="graphics-symbol" aria-roledescription="area mark"
                d="M0,98.18181818181819L60,0L120,47.272727272727266L180,76.36363636363637L240,69.0909090909091L300,25.454545454545464L300,200L240,200L180,200L120,200L60,200L0,200Z"
                fill={input?.color}>
              </path>
            </svg>
          )}

          {['bar'].includes(this.props.type) && (
            <svg viewBox="1 0 16 4" xmlns="http://www.w3.org/2000/svg">
              <line
                stroke={input?.color}
                x1="1.5"
                y1="4"
                x2="1.5"
                y2="2"
                strokeDasharray={`${input?.dash[0]} ${input?.dash[1]}`}
              />
              <line
                stroke={input?.color}
                x1="3"
                y1="4"
                x2="3"
                y2="0"
                strokeDasharray={`${input?.dash[0]} ${input?.dash[1]}`}
              />
              <line
                stroke={input?.color}
                x1="4.5"
                y1="4"
                x2="4.5"
                y2="1"
                strokeDasharray={`${input?.dash[0]} ${input?.dash[1]}`}
              />
            </svg>
          )}

          {['pointLine'].includes(this.props.type) && (
            <Select
              className={styles.select}
              options={SHAPES}
              option={input?.shape}
              placeholder="Select a shape"
              onChange={(selection) => this.onStyleChange('shape', selection)}
            />
          )}

          {['pointLine'].includes(this.props.type) && (
            <div className={styles.labeledCheckbox}>
              <span>Filled</span>
              <input
                type="checkbox"
                defaultChecked={input?.filled}
                onChange={() => this.onStyleChange('filled', { value: !input?.filled })}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
