import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
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
      salindex: 0,
      csc: props.csc,
      stream: props.stream,
      cmdComponent: 'Watcher',
      command: 'acknowledge',
      cmdParams: '{"name": "test.ConfiguredSeverities.Rule1", "severity": 1, "acknowledgedBy":"test"}',
      cmdSalindex: 0,
    };
  }

  static defaultProps = {
    category: 'event',
    csc: 'Watcher',
    stream: 'alarm',
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

  salindexChange = (e) => {
    this.setState({
      salindex: e.target.value,
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
    this.props.subscribeToStream([this.state.category, this.state.csc, this.state.salindex, this.state.stream].join('-'));
  };

  unsubscribeToStream = () => {
    this.props.unsubscribeToStream([this.state.category, this.state.csc, this.state.salindex, this.state.stream].join('-'));
  };

  cmdComponentChange = (e) => {
    this.setState({ cmdComponent: e.target.value });
  };
  cmdOnChange = (e) => {
    this.setState({ command: e.target.value });
  };
  cmdParamsOnChange = (e) => {
    this.setState({ cmdParams: e.target.value });
  };
  cmdSalindexChange = (e) => {
    this.setState({ cmdSalindex: e.target.value });
  };

  launchCommand = () => {
    this.props.requestSALCommand({
      cmd: `cmd_${this.state.command}`,
      params: JSON.parse(this.state.cmdParams),
      component: this.state.cmdComponent,
      salindex: this.state.cmdSalindex
    });
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
            <span>salindex </span>
            <input id="id_cmd_salindex" onChange={this.cmdSalindexChange} value={this.state.cmdSalindex} />
          </div>
          <div>
            <span>cmd_ </span>
            <input id="id_commands" onChange={this.cmdOnChange} value={this.state.command} />
          </div>
          <div>
            <span>params </span>
            <input id="id_parameters" onChange={this.cmdParamsOnChange} value={this.state.cmdParams} />
          </div>

          <button onClick={this.launchCommand}>Launch</button>
        </div>

        <h2>Telemetry and events</h2>
        <div>
          <div>
            <span>Category </span>
            <input id="id_category" onChange={this.categoryChange} value={this.state.category} />
          </div>
          <div>
            <span>salindex </span>
            <input id="id_salindex" onChange={this.salindexChange} value={this.state.salindex} />
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
