import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import sockette from 'sockette';
import TelemetryLog from './components/TelemetryLog/TelemetryLog';

class App extends Component {

  constructor() {
    super();
    const socket = sockette('ws://localhost:8000/ws/subscription/', {
      onopen: e => socket.json({ "option": "subscribe", "data": "avoidanceRegions" }),
      onmessage: this.receiveMsg,
    });
    socket.onmessage = (e => console.log('Receirewrewrweved:', e));
    window.socket = socket;
  }

  receiveMsg = (msg) => {
    console.log("msg.data")
    console.log(msg)
    this.setState({ ...JSON.parse(msg.data) });
  }

  render() {
    return (
      <div className="App">
        <TelemetryLog telemetry={{...this.state}}></TelemetryLog>
      </div>
    );
  }
}

export default App;
