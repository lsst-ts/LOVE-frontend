import React, { Component } from 'react';
import ManagerInterface from '../../Utils';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

export default class TelemetryLog extends Component {
  constructor() {
    super();
    this.state = {
      msg: '',
      msgList: [],
    };
    this.managerInterface = new ManagerInterface();
    // this.managerInterface.subscribeToTelemetry('all', 'all', this.receiveMessage);
  }

  componentDidMount = () => {
    this.managerInterface.subscribeToTelemetry(this.props.csc, this.props.stream, this.receiveMessage);
  };

  receiveMessage = (msg) => {
    console.log('subscribed', msg);
    this.setState({
      msg: msg.data,
    });
    this.updateMessageList(msg.data);
  };

  updateMessageList = (msg) => {
    let newMsgList = this.state.msgList;
    if(this.state.msgList.length > 10) {
        newMsgList.shift();
        this.setState({
            msgList: [...newMsgList, msg]
        });
    }
    else {
        this.setState({
            msgList: [...this.state.msgList, msg]
        });
    }
  }

  render() {
    return (
      <div style={{textAlign: 'left'}}>
        <h1>Telemetry log</h1>
        {
            this.state.msgList.slice().reverse().map((msg) => {
                return <JSONPretty data={msg}></JSONPretty>
            })
        }
      </div>
    );
  }
}
