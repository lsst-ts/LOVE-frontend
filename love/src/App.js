import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import './App.css';
import ComponentIndexContainer from './components/ComponentIndex/ComponentIndex.container';
import ViewsIndexContainer from './components/UIF/ViewsIndex/ViewsIndex.container';
import HealthStatusSummaryContainer from './components/HealthStatusSummary/HealthStatusSummary.container';
import DataManagementFlow from './components/DataManagementFlow/DataManagementFlow';
import LayoutContainer from './components/Layout/Layout.container';
import LoginContainer from './components/Login/Login.container';
import PrivateRoute from './components/GeneralPurpose/PrivateRoute/PrivateRoute';
import ScriptQueueContainer from './components/ScriptQueue/ScriptQueue.container';
import Panel from './components/GeneralPurpose/Panel/Panel';

import TelemetryLogContainer from './components/TelemetryLog/TelemetryLog.container';
import CSCSummaryContainer from './components/CSCSummary/CSCSummary.container';
import UserAuthListContainer from './components/AuthList/UserAuthList/UserAuthList.container';
import AdminAuthListContainer from './components/AuthList/AdminAuthList/AdminAuthList.container';
import AuxTel from './components/AuxTel/AuxTel';
import CameraContainer from './components/AuxTel/Camera/Camera.container';
import DomeContainer from './components/AuxTel/Dome/Dome.container';
import DomeAndMountView from './components/AuxTel/DomeAndMountView/DomeAndMountView';
import LightPath from './components/AuxTel/Mount/LightPath.container';
import Mount from './components/AuxTel/Mount/Mount';
import LATISSContainer from './components/AuxTel/LATISS/LATISS.container';
import ViewEditorContainer from './components/UIF/ViewEditor/ViewEditor.container';
import WatcherContainer from './components/Watcher/Watcher.container';
import GenericCamera from './components/GenericCamera/GenericCamera';
import CustomViewContainer from './components/UIF/CustomView.container';
import Palette from './components/Palette/Palette';

class App extends Component {
  static propTypes = {
    location: PropTypes.object,
    validateToken: PropTypes.func,
    requestWorkspaces: PropTypes.func,
    requestViews: PropTypes.func,
    token: PropTypes.string,
  };

  static defaultProps = {
    location: null,
    validateToken: () => {},
    requestWorkspaces: () => {},
    requestViews: () => {},
    token: null,
  };

  componentDidMount = () => {
    this.props.validateToken();
    this.props.requestViews();
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.token && prevProps.location.pathname !== this.props.location.pathname) {
      this.props.validateToken();
    }
  };

  render() {
    return (
      <div className="App">
        <LayoutContainer token={this.props.token}>
          <Switch>
            <Route path="/login" render={() => <LoginContainer />} />
            <PrivateRoute
              token={this.props.token}
              path="/health-status-summary"
              render={() => <HealthStatusSummaryContainer />}
            />
            <PrivateRoute token={this.props.token} path="/dm-flow" component={DataManagementFlow} />
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
              render={() => <ScriptQueueContainer salindex={1} fit embedded />}
            />
            <PrivateRoute
              token={this.props.token}
              path="/script-queue-2"
              render={() => <ScriptQueueContainer salindex={2} fit embedded />}
            />
            <PrivateRoute
              token={this.props.token}
              path="/csc-summary"
              render={() => <CSCSummaryContainer expandHeight />}
            />
            <PrivateRoute
              token={this.props.token}
              path="/auth-list"
              render={() => <UserAuthListContainer expandHeight />}
            />
            <PrivateRoute token={this.props.token} path="/auth-list-admin" render={() => <AdminAuthListContainer />} />
            <PrivateRoute token={this.props.token} path="/aux-tel" component={AuxTel} />
            <PrivateRoute token={this.props.token} path="/auxiliary-telescope" component={AuxTel} />
            <PrivateRoute token={this.props.token} path="/aux-tel-camera" render={() => <CameraContainer />} />
            <PrivateRoute token={this.props.token} path="/latiss" component={LATISSContainer} />
            <PrivateRoute token={this.props.token} path="/aux-tel-dome-and-mount" component={DomeAndMountView} />
            <PrivateRoute
              token={this.props.token}
              path="/aux-tel-dome"
              render={() => (
                <Panel title="Auxiliary Telescope Dome & Mount" className={'mediumPanel'} fit>
                  <DomeContainer />
                </Panel>
              )}
            />
            <PrivateRoute
              token={this.props.token}
              path="/aux-tel-lightpath"
              render={() => (
                <Panel title="Auxiliary Telescope Lightpath" className={'smallPanel'} fit>
                  <LightPath />
                </Panel>
              )}
            />
            <PrivateRoute
              token={this.props.token}
              path="/aux-tel-mount"
              render={() => (
                <Panel title="Auxiliary Telescope Mount" className={'mediumPanel'} fit>
                  <Mount />
                </Panel>
              )}
            />
            <PrivateRoute token={this.props.token} path="/watcher" render={() => <WatcherContainer embedded />} />
            <PrivateRoute token={this.props.token} path="/generic-camera" render={() => <GenericCamera />} />
            <PrivateRoute token={this.props.token} path="/uif/view" component={CustomViewContainer} />
            <PrivateRoute token={this.props.token} path="/uif/view-editor" component={ViewEditorContainer} />
            <PrivateRoute token={this.props.token} path="/palette" render={() => <Palette />} />
            <PrivateRoute token={this.props.token} path="/legacy-index" render={() => <ComponentIndexContainer />} />
            <PrivateRoute token={this.props.token} path="/" render={() => <ViewsIndexContainer />} />
          </Switch>
        </LayoutContainer>
      </div>
    );
  }
}

export default withRouter(App);
