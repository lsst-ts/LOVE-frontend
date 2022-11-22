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

/**
 * Component to configure the Health Status Summary
 */
export default class StreamInput extends Component {
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
    streamInputId: PropTypes.string,
    variable: PropTypes.string,
    category: PropTypes.string,
    csc: PropTypes.string,
    salindex: PropTypes.number,
    topic: PropTypes.string,
    item: PropTypes.string,
    accessor: PropTypes.string,
  };

  static defaultProps = {
    streamInputId: '',
    variable: 'y',
  };

  constructor(props) {
    super(props);
    this.state = {
      categoryOptions: ['event', 'telemetry'],
      cscOptions: [],
      topicOptions: [],
      itemOptions: [],
      category: props.category ?? null,
      csc: props.csc ?? null,
      salindex: props.salindex ?? null,
      topic: props.topic ?? null,
      item: props.item ?? null,
      accessor: props.accessor ?? props.category === 'telemetry' ? '(x) => x[0]' : '(x) => x',
      optionsTree: [],
    };
  }

  componentDidMount() {
    ManagerInterface.getTopicData('event-telemetry').then((data) => {
      const { category, csc, topic } = this.state;
      const topicOptions = category && csc ? Object.keys(data[csc][`${category}_data`]) : [];
      const itemOptions = category && csc && topic ? Object.keys(data[csc][`${category}_data`][topic]) : [];
      this.setState({
        optionsTree: data,
        cscOptions: data ? Object.keys(data) : [],
        topicOptions,
        itemOptions,
       });
    });

    if (this.state.accessor !== this.props.accessor) {
      this.setState({
        accessor: this.props.accessor,
      });
    }

    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.category !== this.state.category || prevState.csc !== this.state.csc) {
      const { optionsTree } = this.state;
      const { category, csc } = this.state;
      const topicOptions = category && csc ? Object.keys(optionsTree[csc][`${category}_data`]) : [];
      this.setState({
        topicOptions,
        salindex: 0,
        topic: null,
        item: null,
      });
    }

    if (prevState.topic !== this.state.topic ) {
      const { optionsTree } = this.state;
      const { category, csc, topic } = this.state;
      const itemOptions = category && csc && topic ? Object.keys(optionsTree[csc][`${category}_data`][topic]) : [];
      this.setState({
        itemOptions,
        item: null,
      });
    }

    if (prevProps.accessor !== this.props.accessor) {
      this.setState({
        accessor: this.props.accessor
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
    const {categoryOptions, cscOptions, topicOptions, itemOptions} = this.state;
    const {category, csc, salindex, topic, item, isArray, arrayIndex, accessor} = this.state;
    const {streamInputId} = this.props;

    return (
      <>
      <div className={styles.container}>
        <Select
          className={[styles.select, styles.category].join(' ')}
          options={categoryOptions}
          option={category}
          placeholder="Select category"
          onChange={(selection) => this.setState({category: selection.value})}
        />
        <Select
          className={styles.select}
          options={cscOptions}
          option={csc}
          placeholder="Select a CSC"
          onChange={(selection) => this.setState({csc: selection.value})}
        />
        <Input
          className={styles.input}
          type="number"
          min={0}
          value={salindex}
          placeholder="salindex"
          onChange={(ev) => this.setState({salindex: parseInt(ev.target.value)})}
        />
        <Select
          className={styles.select}
          options={topicOptions}
          option={topic}
          placeholder="Select a topic"
          onChange={(selection) => this.setState({topic: selection.value})}
        />
        <Select
          className={styles.select}
          options={itemOptions}
          option={item}
          placeholder="Select an item"
          onChange={(selection) => this.setState({item: selection.value})}
        />
        <div>
          Is Array?
          <Input
            className={styles.checkboxInput}
            type="checkbox"
            checked={isArray}
            onChange={(ev) => this.setState({isArray: ev.target.checked})}
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
                onChange={(ev) => this.setState({arrayIndex: parseInt(ev.target.value)})}
              />
            </>
          )}
        </div>
      </div>
      <div className={styles.container}>
        <div>Accessor ({streamInputId}): </div>
          <AceEditor
            mode="javascript"
            className={styles.editor}
            theme="solarized_dark"
            name={`ace-editor-${streamInputId}`}
            onChange={(ev) => {
              this.setState({accessor: ev})
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
