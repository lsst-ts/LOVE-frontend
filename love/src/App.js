import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import './App.css';
import ComponentIndexContainer from './components/ComponentIndex/ComponentIndex.container';
import HealthStatusSummary from './components/HealthStatusSummary/HealthStatusSummary';
import DataManagementFlow from './components/DataManagementFlow/DataManagementFlow';
import LoginContainer from './components/Login/Login.container';
import PrivateRoute from './components/GeneralPurpose/PrivateRoute/PrivateRoute';
import ScriptQueueContainer from './components/ScriptQueue/ScriptQueue.container';
import TimeSeries from './components/TimeSeries/TimeSeries';
import Panel from './components/GeneralPurpose/Panel/Panel';

import TelemetryLogContainer from './components/TelemetryLog/TelemetryLog.container';
import CSCSummaryContainer from './components/CSCSummary/CSCSummary.container';
import AuxTel from './components/AuxTel/AuxTel';
import CameraContainer from './components/AuxTel/Camera/Camera.container';
import DomeContainer from './components/AuxTel/Dome/Dome.container';
import DomeAndMountView from './components/AuxTel/DomeAndMountView/DomeAndMountView';
import LightPath from './components/AuxTel/Mount/LightPath.container';
import Mount from './components/AuxTel/Mount/Mount';
import LATISSContainer from './components/AuxTel/LATISS/LATISS.container';
import Watcher from './components/Watcher/Watcher';
import CustomViewSample from './components/GeneralPurpose/UIF/CustomViewSample';
import CustomViewEditor from './components/GeneralPurpose/UIF/CustomViewEditor/CustomViewEditor';

class App extends Component {
  static propTypes = {
    location: PropTypes.object,
    validateToken: PropTypes.func,
    token: PropTypes.string,
  };

  static defaultProps = {
    location: null,
    validateToken: () => {},
    token: null,
  };

  componentDidMount = () => {
    this.props.validateToken();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.token && prevProps.location.pathname !== this.props.location.pathname) {
      this.props.validateToken();
    }
  };
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/login" render={() => <LoginContainer />} />
          <PrivateRoute
            token={this.props.token}
            path="/health-status-summary"
            render={() => <HealthStatusSummary> </HealthStatusSummary>}
          />
          <PrivateRoute token={this.props.token} path="/dm-flow" component={DataManagementFlow} />
          <PrivateRoute
            token={this.props.token}
            path="/time-series"
            render={() => (
              <div className="hs-container">
                <TimeSeries> </TimeSeries>
              </div>
            )}
          />
          <Route
            path="/test"
            render={() => (
              <div className="hs-container">
                <TelemetryLogContainer />
              </div>
            )}
          />
          <PrivateRoute
            token={this.props.token}
            path="/script-queue-1"
            render={() => <ScriptQueueContainer salindex={1} />}
          />
          <PrivateRoute
            token={this.props.token}
            path="/script-queue-2"
            render={() => <ScriptQueueContainer salindex={2} />}
          />
          <PrivateRoute token={this.props.token} path="/csc-summary" component={CSCSummaryContainer} />
          <PrivateRoute token={this.props.token} path="/aux-tel" component={AuxTel} />
          <PrivateRoute token={this.props.token} path="/auxiliary-telescope" component={AuxTel} />
          <PrivateRoute
            token={this.props.token}
            path="/aux-tel-camera"
            render={() => (
              <Panel title="Auxiliary Telescope Camera" className={'smallPanel'}>
                <CameraContainer />
              </Panel>
            )}
          />
          <PrivateRoute token={this.props.token} path="/latiss" component={LATISSContainer} />
          <PrivateRoute token={this.props.token} path="/aux-tel-dome-and-mount" component={DomeAndMountView} />
          <PrivateRoute
            token={this.props.token}
            path="/aux-tel-dome"
            render={() => (
              <Panel title="Auxiliary Telescope Dome & Mount" className={'mediumPanel'}>
                <DomeContainer />
              </Panel>
            )}
          />
          <PrivateRoute
            token={this.props.token}
            path="/aux-tel-lightpath"
            render={() => (
              <Panel title="Auxiliary Telescope Lightpath" className={'smallPanel'}>
                <LightPath />
              </Panel>
            )}
          />
          <PrivateRoute
            token={this.props.token}
            path="/aux-tel-mount"
            render={() => (
              <Panel title="Auxiliary Telescope Mount" className={'mediumPanel'}>
                <Mount />
              </Panel>
            )}
          />
          <PrivateRoute
            token={this.props.token}
            path="/custom-view"
            component={CustomViewSample}
          />
          <PrivateRoute
            token={this.props.token}
            path="/custom-view-editor"
            component={CustomViewEditor}
          />
          <PrivateRoute token={this.props.token} path="/watcher" component={Watcher} />
          <PrivateRoute token={this.props.token} path="/" render={() => <ComponentIndexContainer />} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
