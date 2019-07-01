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
      cmdComponent: undefined,
      command: undefined,
      cmdParams: undefined
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




  cmdComponentChange = (e) => {
    console.log(e);
  }
  cmdOnChange = (e) => {
    console.log(e);
  }
  cmdParamsOnChange = (e) => {
    console.log(e);
  }

  subscribeToStream = () => {
    this.props.subscribeToStream([this.state.category, this.state.csc, this.state.stream].join('-'));
  };

  unsubscribeToStream = () => {
    this.props.unsubscribeToStream([this.state.category, this.state.csc, this.state.stream].join('-'));
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.streams !== prevProps.streams) {
      this.updateMessageList(this.props.streams);
    }
  };

  render() {
    return (
      <div style={{ textAlign: 'left' }}>
        <h1>Test log and cmd launcher</h1>
        
        <h2> Command Launcher</h2>
        <div>
          <div>
            <span>Component </span>
            <input id="id_commands_csc" onChange={this.cmdComponentChange} value={this.state.cmdComponent} />
          </div>
          <div>
            <span>cmd_ </span>
            <input id="id_commands" onChange={this.cmdOnChange} value={this.state.command} />
          </div>
          <div>
            <span>params </span>
            <input id="id_parameters" onChange={this.cmdParamsOnChange} value={this.state.cmdParams} />
          </div>
        </div>
        
        <h2>Telemetry and events</h2>
        <div>
          <div>
            <span>Category </span>
            <input id="id_category" onChange={this.categoryChange} value={this.state.category} />
          </div>
          <div>
            <span>CSC </span>
            <input id="id_csc" onChange={this.cscChange} value={this.state.csc} />
          </div>
          <div>
            <span>Stream </span>
            <input id="id_stream" onChange={this.streamChange} value={this.state.stream} />
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
