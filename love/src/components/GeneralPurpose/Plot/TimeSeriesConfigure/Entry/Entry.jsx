/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Entry.module.css';
import StylePlotInput from './StylePlotInput/StylePlotInput';
import StreamInput from './StreamInput/StreamInput';

export default class Entry extends Component {
  static propTypes = {
    /** Name of the entry */
    name: PropTypes.string,
    /** List of inputs for the configuration. */
    values: PropTypes.arrayOf(
      PropTypes.shape({
        /** Category of the message obtained from salobj */
        category: PropTypes.oneOf(['event', 'telemetry']),
        /** Name of the CSC that generates the data */
        csc: PropTypes.string,
        /** SalIndex of the CSC, use 0 for unnumbered CSCs */
        salindex: PropTypes.number,
        /** Name of the topic in the xml */
        topic: PropTypes.string,
        /** String describing the body a function */
        accessor: PropTypes.string,
      }),
    ),
    /** String describing the type of mark,
     * can be either "line", "bar" or "pointLine" */
    type: PropTypes.string,
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
    /** Id of the entry */
    entryId: PropTypes.string,
    /** Options tree with data about cscs, topics and paramteres */
    optionsTree: PropTypes.object,
    /** Callback to call when removing the input, should have the following arguments:
     * - index
     */
    onRemove: PropTypes.func,
  };

  static defaultProps = {
    name: null,
    values: [{}],
    type: 'line',
    config: {},
    entryId: null,
    optionsTree: {},
    onRemove: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      type: props.type,
      config: props.config,
      values: props.values,
      inputsRef: props.values.map(() => React.createRef()),
    };
  }

  getInfo() {
    let name;
    const values = [...this.state.inputsRef.map((ref) => ref.current.getInfo())];
    if (this.state.name === null) {
      name = values
        .map((value) => {
          const { category, csc, salindex, topic, item } = value;
          return `${category}-${csc}-${salindex}-${topic}-${item}`;
        })
        .join('_');
    } else {
      name = this.state.name;
    }

    const info = {
      name: name,
      type: this.state.type,
      ...this.state.config,
      values: values,
    };
    return info;
  }

  getStreamInput(values) {
    const { inputsRef } = this.state;
    const { optionsTree } = this.props;
    return values.map((value, index) => {
      return (
        <StreamInput
          key={index}
          streamInputId={`${this.props.entryId}_${index}`}
          ref={inputsRef[index]}
          variable={value?.variable}
          category={value?.category}
          csc={value?.csc}
          salindex={parseInt(value?.salindex)}
          topic={value?.topic}
          item={value?.item}
          isArray={value?.isArray}
          arrayIndex={value?.arrayIndex}
          accessor={value?.accessor}
          optionsTree={optionsTree}
        />
      );
    });
  }

  onChangeStylePlot(name, type, config) {
    this.setState({ name, type, config });
    const { values } = this.state;
    let newValues = [];
    if (type === 'area') {
      newValues = [{ ...values[0], variable: 'y' }, { variable: 'y2' }];
    } else if (type === 'arrow') {
      newValues = [{ ...values[0], variable: 'y' }, { variable: 'angle' }];
    } else {
      newValues = [{ ...values[0], variable: 'y' }];
    }

    if (type === 'area' || type === 'arrow') {
      this.setState({ values: newValues, inputsRef: [this.state.inputsRef[0], React.createRef()] });
    } else {
      this.setState({ values: newValues, inputsRef: [this.state.inputsRef[0]] });
    }
  }

  render() {
    const { values } = this.state;
    return (
      <div className={styles.container}>
        <StylePlotInput
          name={this.state.name}
          type={this.state.type}
          config={this.state.config}
          onChange={(name, type, config) => this.onChangeStylePlot(name, type, config)}
          onRemove={() => this.props.onRemove()}
        />
        <div className={styles.container}>{values ? this.getStreamInput(values) : <></>}</div>
      </div>
    );
  }
}
