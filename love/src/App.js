/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';
import 'styles/react-datetime.css';
import './App.css';
import ComponentIndexContainer from './components/ComponentIndex/ComponentIndex.container';
import ViewsIndexContainer from './components/UIF/ViewsIndex/ViewsIndex.container';
import HealthStatusSummaryContainer from './components/HealthStatusSummary/HealthStatusSummary.container';
import LayoutContainer from './components/Layout/Layout.container';
import LoginContainer from './components/Login/Login.container';
import PrivateRoute from './components/GeneralPurpose/PrivateRoute/PrivateRoute';
import ScriptQueueContainer from './components/ScriptQueue/ScriptQueue.container';
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
import ViewEditorContainer from './components/UIF/ViewEditor/ViewEditor.container';
import WatcherContainer from './components/Watcher/Watcher.container';
import GenericCameraView from './components/GenericCamera/GenericCameraView';
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
            <PrivateRoute token={this.props.token} path="/generic-camera" render={() => <GenericCameraView />} />
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
