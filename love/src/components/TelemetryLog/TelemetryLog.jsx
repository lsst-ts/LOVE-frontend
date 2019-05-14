import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import ManagerInterface from '../../Utils';
import 'react-json-pretty/themes/monikai.css';

export default class TelemetryLog extends Component {
  static propTypes = {
    category: PropTypes.string,
    csc: PropTypes.string,
    stream: PropTypes.string,
  };

  constructor(props) {
    super();
    this.state = {
      msgList: [],
      msgNumber: 0,
      category: props.category,
      csc: props.csc,
      stream: props.stream,
    };
    this.managerInterface = new ManagerInterface();
  }

  static defaultProps = {
    category: 'event',
    csc: 'ScriptQueue',
    stream: 'all',
    data: {},
  };

  updateMessageList = (msg) => {
    const newMsgList = this.state.msgList;
    if (this.state.msgList.length > 10) {
      newMsgList.shift();
      this.setState({
        msgList: [...newMsgList, msg],
        msgNumber: this.state.msgNumber + 1,
      });
    } else {
      this.setState({
        msgList: [...this.state.msgList, msg],
        msgNumber: this.state.msgNumber + 1,
      });
    }
  };

  categoryChange = (e) => {
    this.setState({
      category: e.target.value,
    });
  };

  cscChange = (e) => {
    this.setState({
      csc: e.target.value,
    });
  };

  streamChange = (e) => {
    this.setState({
      stream: e.target.value,
    });
  };

  subscribeToStream = () => {
    this.props.subscribeToStream([this.state.category, this.state.csc, this.state.stream].join('-'));
  };

  unsubscribeToStream = () => {
    this.props.unsubscribeToStream([this.state.category, this.state.csc, this.state.stream].join('-'));
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.data !== prevProps.data) {
      this.updateMessageList(this.props.data);
    }
  };

  render() {
    return (
      <div style={{ textAlign: 'left' }}>
        <h1>Telemetry log</h1>
        <div>
          <div>
            <span>Category </span>
            <input onChange={this.categoryChange} value={this.state.category} />
          </div>
          <div>
            <span>CSC </span>
            <input onChange={this.cscChange} value={this.state.csc} />
          </div>
          <div>
            <span>Stream </span>
            <input onChange={this.streamChange} value={this.state.stream} />
          </div>
          <button onClick={this.subscribeToStream}>Subscribe</button>
          <button onClick={this.unsubscribeToStream}>Unsubscribe</button>
        </div>

        {this.state.msgList
          .slice()
          .reverse()
          .map((msg, index) => (
            <JSONPretty key={this.state.msgNumber - index} data={msg} />
          ))}
      </div>
    );
  }
}
