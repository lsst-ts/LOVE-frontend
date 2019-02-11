import React, { Component } from 'react';
import './App.css';
import sockette from 'sockette';
import ComponentIndex from './components/ComponentIndex/ComponentIndex';
import HealthStatusSummary from './components/HealthStatusSummary/HealthStatusSummary';
import DataManagementFlow from './components/DataManagementFlow/DataManagementFlow';
import Login from './components/Login/Login';

import { BrowserRouter } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom'

class App extends Component {

  constructor() {
    super();
    this.state = {
      telemetries: {
        'interestedProposal': {
          parameters: {},
          receptionTimeStamp: "2018/11/23 21:12:24."
        },
        "bulkCloud": {
          parameters: {
            "bulkCloud": 0.6713680575252166,
            "timestamp": 0.5309269973966433
          },
          receptionTimeStamp: "2018/11/25 12:21:12"
        }
      }
    }

    this.subscribeToTelemetry('all', this.receiveAllMsg);
  }

  subscribeToTelemetry = (name, callback) => {
    const socket = sockette('ws://' + process.env.REACT_APP_WEBSOCKET_HOST + '/manager/ws/subscription/', {
      onopen: e => socket.json({ "option": "subscribe", "data": name }),
      onmessage: callback,
    });
  }

  receiveAllMsg = (msg) => {
    let data = JSON.parse(msg.data);
    if (typeof data.data === 'object') {

      let newTelemetries = Object.assign({}, this.state.telemetries);
      let timestamp = new Date();
      timestamp = timestamp.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
      Object.entries(data.data).forEach((entry) => {
        let [telemetryName, parameters] = entry;
        let telemetry = {};
        telemetry[telemetryName] = {
          parameters: parameters,
          receptionTimestamp: timestamp
        }
        Object.assign(newTelemetries, telemetry);
      }, this);

      newTelemetries = JSON.parse(JSON.stringify(newTelemetries));
      this.setState({ telemetries: newTelemetries });
    }
  }

  receiveMsg = (msg) => {
    let data = JSON.parse(msg.data);
    if (typeof data.data === 'object') {
      let timestamp = new Date();
      timestamp = timestamp.toISOString().slice(0, 20).replace("-", "/").replace("T", " ");
      let telemetry = {
        "interestedProposal": {
          parameters: { ...data.data },
          receptionTimestamp: timestamp
        }
      }
      let newTelemetries = Object.assign({}, this.state.telemetries, telemetry);
      newTelemetries = JSON.parse(JSON.stringify(newTelemetries));
      this.setState({ telemetries: newTelemetries });
    }
  }

  render() {

    return (
      <div className="App">


        <BrowserRouter>
          <Switch>
            <Route path='/health-status-summary'
              render={() => <div className="hs-container"><HealthStatusSummary telemetries={this.state.telemetries}> </HealthStatusSummary></div>} />
            <Route path='/dm-flow'
              component={DataManagementFlow} />
            <Route path='/login'
              component={Login} />
            <Route path='/'
              component={ComponentIndex} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
