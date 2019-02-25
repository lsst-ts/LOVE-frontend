import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import './App.css';
import ComponentIndex from './components/ComponentIndex/ComponentIndex';
import HealthStatusSummary from './components/HealthStatusSummary/HealthStatusSummary';
import DataManagementFlow from './components/DataManagementFlow/DataManagementFlow';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

import TimeSeries from './components/TimeSeries/TimeSeries';

import ManagerInterface from './Utils';
import TelemetryLog from './components/TelemetryLog/TelemetryLog';

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      showSessionExpired: false,
      telemetries: {
        scheduler: {
          interestedProposal: {
            parameters: {},
            receptionTimeStamp: '2018/11/23 21:12:24.',
          },
          bulkCloud: {
            parameters: {
              bulkCloud: {
                value: 0.6713680575252166,
                dataType: 'Float',
              },
              timestamp: {
                value: 0.5309269973966433,
                dataType: 'Float',
              },
            },
            receptionTimeStamp: '2018/11/25 12:21:12',
          },
        },
        ScriptQueue: {
          stream1: {
            parameters: {
              exists: {
                value: 1,
                dataType: 'Boolean',
              },
            },
          },
        },
      },
    };
    this.managerInterface = new ManagerInterface();
  }

  componentDidMount = () => {
    const token = ManagerInterface.getToken();
    this.setTokenState(token);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.token && prevProps.location.pathname !== this.props.location.pathname) {
      ManagerInterface.validateToken().then((response) => {
        if (response === false) {
          this.setTokenState(null);
        }
      });
    }
    if (!this.state.token && prevState.token) {
      this.setState({ showSessionExpired: true });
    }
  }

  hideSessionExpired = () => {
    this.setState({ showSessionExpired: false })
  }

  setTokenState = (token) => {
    this.setState({ token: token });
    if (token) {
      this.managerInterface.subscribeToTelemetry('all', 'all', this.receiveAllMsg);
    }
  }

  receiveAllMsg = (msg) => {
    const data = JSON.parse(msg.data);

    if (typeof data.data === 'object') {
      let newTelemetries = Object.assign({}, this.state.telemetries);
      let timestamp = new Date();
      timestamp = timestamp
        .toISOString()
        .slice(0, 19)
        .replace(/-/g, '/')
        .replace('T', ' ');
      Object.entries(data.data).forEach((entry) => {
        const [csc, cscDataString] = entry;
        const cscData = JSON.parse(cscDataString);
        const telemetry = {};
        const stream = {};
        Object.entries(cscData).forEach((cscStream) => {
          const [streamName, parameters] = cscStream;
          stream[streamName] = {};
          stream[streamName].parameters = parameters;
          stream[streamName].receptionTimestamp = timestamp;
        });
        telemetry[csc] = {
          ...stream,
        };
        Object.assign(newTelemetries, telemetry);
      }, this);

      newTelemetries = JSON.parse(JSON.stringify(newTelemetries));
      this.setState({ telemetries: newTelemetries });
      this.managerInterface.unsubscribeToTelemetry('all', 'all', () => 0);
    }
  };

  render() {
    return (
      <div className="App">
        <Switch>
          <Route
            path='/login'
            render={() => (
              <Login
                token={this.state.token}
                setTokenState={this.setTokenState}
                showSessionExpired={this.state.showSessionExpired}
                hideSessionExpired={this.hideSessionExpired}
              ></Login>
            )}
          />
          <PrivateRoute
            token={this.state.token}
            path="/health-status-summary"
            render={() => (
              <div className="hs-container">
                <HealthStatusSummary telemetries={this.state.telemetries}> </HealthStatusSummary>
              </div>
            )}
          />
          <PrivateRoute
            token={this.state.token}
            path="/dm-flow"
            component={DataManagementFlow}
          />
          <PrivateRoute
            token={this.state.token}
            path="/time-series"
            render={() => (
              <div className="hs-container">
                <TimeSeries telemetries={this.state.telemetries}> </TimeSeries>
              </div>
            )}
          />
          <Route path="/test" render={() => (
              <div className="hs-container">
                <TelemetryLog category="event" csc="ScriptQueue" stream="all"> </TelemetryLog>
              </div>
            )}
          />
          <PrivateRoute
            token={this.state.token}
            path="/"
            component={ComponentIndex} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
