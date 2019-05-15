import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import './App.css';
import ComponentIndexContainer from './components/ComponentIndex/ComponentIndex.container';
import HealthStatusSummary from './components/HealthStatusSummary/HealthStatusSummary';
import DataManagementFlow from './components/DataManagementFlow/DataManagementFlow';
import LoginContainer from './components/Login/Login.container';
import PrivateRoute from './components/GeneralPurpose/PrivateRoute/PrivateRoute';
import ScriptQueue from './components/ScriptQueue/ScriptQueue';
import TimeSeries from './components/TimeSeries/TimeSeries';
import Panel from './components/GeneralPurpose/Panel/Panel';

import ManagerInterface from './Utils';
import TelemetryLog from './components/TelemetryLog/TelemetryLog';
import TelemetryLogContainer from './components/TelemetryLog/TelemetryLog.container';
import CSCSummary from './components/CSCSummary/CSCSummary';
import AuxTel from './components/AuxTel/AuxTel';
import Camera from './components/AuxTel/Camera/Camera';
import LATISS from './components/AuxTel/LATISS/LATISS';

import { connect } from 'react-redux';
import { getToken } from './redux/selectors';

class App extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  constructor() {
    super();
    this.state = {
      showSessionExpired: false,
    };
    // this.managerInterface = new ManagerInterface();
    this.justLoggedOut = false;
  }

  // componentDidMount = () => {
  //   const token = ManagerInterface.getToken();
  //   this.setTokenState(token);
  //   ManagerInterface.validateToken().then((response) => {
  //     if (response === false) {
  //       this.logout();
  //     }
  //   });
  // };

  // componentDidUpdate = (prevProps, prevState) => {
  //   if (this.props.token && prevProps.location.pathname !== this.props.location.pathname) {
  //     ManagerInterface.validateToken().then((response) => {
  //       if (response === false) {
  //         this.logout();
  //       }
  //     });
  //   }
  //   if (!this.props.token && prevState.token) {
  //     if (this.justLoggedOut) {
  //       this.justLoggedOut = false;
  //     } else {
  //       this.setState({ showSessionExpired: true });
  //     }
  //   }
  // };

  hideSessionExpired = () => {
    // this.setState({ showSessionExpired: false });
  };

  logout = () => {
    // this.setTokenState(null);
    // ManagerInterface.removeToken();
    // if (this.managerInterface) this.managerInterface.logout();
    // this.justLoggedOut = true;
  };

  // setTokenState = (token) => {
  //   this.setState({ token });
  // };
  render() {
    return (
      <div className="App">
        <Switch>
          <Route
            path="/login"
            render={() => (
              <LoginContainer
              // token={this.props.token}
              // setTokenState={this.setTokenState}
              // showSessionExpired={this.state.showSessionExpired}e.te.token
              // hideSessionExpired={this.hideSessionExpired}
              />
            )}
          />
          <PrivateRoute
            token={this.props.token}
            path="/health-status-summary"
            render={() => (
              <div className="hs-container">
                <HealthStatusSummary telemetries={this.state.telemetries}> </HealthStatusSummary>
              </div>
            )}
          />
          <PrivateRoute token={this.props.token} path="/dm-flow" component={DataManagementFlow} />
          <PrivateRoute
            token={this.props.token}
            path="/time-series"
            render={() => (
              <div className="hs-container">
                <TimeSeries telemetries={this.state.telemetries}> </TimeSeries>
              </div>
            )}
          />
          <Route
            path="/test"
            render={() => (
              <div className="hs-container">
                {/* <TelemetryLog category="event" csc="ScriptQueue" stream="all">
                  {' '}
                </TelemetryLog> */}
                <TelemetryLogContainer />
              </div>
            )}
          />
          <PrivateRoute token={this.props.token} path="/script-queue" component={ScriptQueue} />
          <PrivateRoute token={this.props.token} path="/csc-summary" component={CSCSummary} />
          <PrivateRoute token={this.props.token} path="/aux-tel" component={AuxTel} />
          <PrivateRoute token={this.props.token} path="/auxiliary-telescope" component={AuxTel} />
          <PrivateRoute
            token={this.props.token}
            path="/aux-tel-camera"
            render={() => (
              <Panel title="Auxiliary Telescope Camera" className={'smallPanel'}>
                <Camera />
              </Panel>
            )}
          />
          <PrivateRoute token={this.props.token} path="/latiss" component={LATISS} />
          <PrivateRoute token={this.props.token} path="/" render={() => <ComponentIndexContainer />} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: getToken(state),
});
export default connect(mapStateToProps)(withRouter(App));
