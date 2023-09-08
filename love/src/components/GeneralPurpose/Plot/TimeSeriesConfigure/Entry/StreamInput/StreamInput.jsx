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
import _ from 'lodash';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/solarized_dark';
import styles from './StreamInput.module.css';
import Input from 'components/GeneralPurpose/Input/Input.jsx';
import Select from 'components/GeneralPurpose/Select/Select.jsx';
import ManagerInterface from 'Utils';

const STREAM_CATEGORY_OPTIONS = ['event', 'telemetry'];

/**
 * Component to configure the Health Status Summary
 */
export default class StreamInput extends Component {
  static propTypes = {
    /** Input id */
    streamInputId: PropTypes.string,
    /** Variable name input */
    variable: PropTypes.string,
    /** Stream category ("event" or "telemetry") */
    category: PropTypes.string,
    /** CSC name input */
    csc: PropTypes.string,
    /** CSC salindex input */
    salindex: PropTypes.number,
    /** CSC topic name input  */
    topic: PropTypes.string,
    /** CSC item name input */
    item: PropTypes.string,
    // TODO: remove isArray parameter
    isArray: PropTypes.bool,
    // TODO: remove arrayIndex parameter
    arrayIndex: PropTypes.number,
    // TODO: update accessor parameter
    accessor: PropTypes.string,
    /** Options tree with data about cscs, topics and paramteres */
    optionsTree: PropTypes.object,
  };

  static defaultProps = {
    streamInputId: null,
    variable: 'y',
    category: 'event',
    csc: null,
    salindex: 0,
    topic: null,
    item: null,
    accessor: null,
    optionsTree: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      categoryOptions: STREAM_CATEGORY_OPTIONS,
      category: props.category,
      csc: props.csc,
      salindex: props.salindex,
      topic: props.topic,
      item: props.item,
      isArray: props.isArray ?? false, //TODO: remove param
      arrayIndex: props.arrayIndex ?? 0, //TODO: remove param
      accessor: props.accessor ?? props.category === 'telemetry' ? '(x) => x[0]' : '(x) => x',
    };
  }

  componentDidMount() {
    if (this.state.accessor !== this.props.accessor && this.props.accessor) {
      this.setState({
        accessor: this.props.accessor,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.category !== this.state.category || prevState.csc !== this.state.csc) {
      this.setState({
        salindex: 0,
        topic: null,
        item: null,
      });
    }

    if (prevState.topic !== this.state.topic) {
      this.setState({
        item: null,
      });
    }

    if (this.props.accessor && prevProps.accessor !== this.props.accessor) {
      this.setState({
        accessor: this.props.accessor,
      });
    }
  }

  getInfo() {
    return {
      variable: this.props.variable,
      category: this.state.category,
      csc: this.state.csc,
      salindex: parseInt(this.state.salindex),
      topic: this.state.topic,
      item: this.state.item,
      isArray: this.state.isArray,
      arrayIndex: this.state.arrayIndex,
      accessor: this.state.accessor,
    };
  }

  render() {
    const { streamInputId, variable, optionsTree } = this.props;
    const { category, csc, salindex, topic, item, isArray, arrayIndex, accessor } = this.state;

    const cscOptions = optionsTree ? Object.keys(optionsTree) : [];
    const topicOptions = optionsTree && category && csc ? Object.keys(optionsTree[csc][`${category}_data`]) : [];
    const itemOptions =
      optionsTree && category && csc && topic ? Object.keys(optionsTree[csc][`${category}_data`][topic]) : [];

    return (
      <>
        <div className={styles.container}>
          <span className={styles.title}>{variable} :</span>
          <Select
            className={[styles.select, styles.category].join(' ')}
            options={STREAM_CATEGORY_OPTIONS}
            option={category}
            placeholder="Select category"
            onChange={(selection) => this.setState({ category: selection.value })}
          />
          <Select
            className={styles.select}
            options={cscOptions}
            option={csc}
            placeholder="Select a CSC"
            onChange={(selection) => this.setState({ csc: selection.value })}
          />
          <Input
            className={styles.input}
            type="number"
            min={0}
            value={salindex}
            placeholder="salindex"
            onChange={(ev) => this.setState({ salindex: parseInt(ev.target.value) })}
          />
          <Select
            className={styles.select}
            options={topicOptions}
            option={topic}
            placeholder="Select a topic"
            onChange={(selection) => this.setState({ topic: selection.value })}
          />
          <Select
            className={styles.select}
            options={itemOptions}
            option={item}
            placeholder="Select an item"
            onChange={(selection) => this.setState({ item: selection.value })}
          />
          <div>
            Is Array?
            <Input
              className={styles.checkboxInput}
              type="checkbox"
              defaultChecked={isArray}
              onChange={(ev) => {
                this.setState((prevState) => ({ isArray: !prevState.isArray }));
              }}
            />
            {isArray && (
              <>
                Index &nbsp;&nbsp;
                <Input
                  className={styles.input}
                  type="number"
                  min={0}
                  value={arrayIndex}
                  placeholder="Array index"
                  onChange={(ev) => this.setState({ arrayIndex: parseInt(ev.target.value) })}
                />
              </>
            )}
          </div>
        </div>
        <div className={styles.container}>
          <div>Accessor: </div>
          <AceEditor
            mode="javascript"
            className={styles.editor}
            theme="solarized_dark"
            name={`ace-editor-${streamInputId}`}
            onChange={(ev) => {
              this.setState({ accessor: ev });
            }}
            debounceChangePeriod={100}
            width={'100%'}
            height={'50px'}
            value={accessor}
          />
        </div>
      </>
    );
  }
}
