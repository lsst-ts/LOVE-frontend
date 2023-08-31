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
// import DomeCloseButton from './DomeCloseButton/DomeCloseButton';
import StopAllTSCButton from './StopAllTSCButton/StopAllTSCButton';
import ManagerInterface from 'Utils';
import styles from './CommandPanel.module.css';

export default class CommandPanel extends Component {
  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  render() {
    const { commandExecutePermission, mainQueueState, auxQueueState } = this.props;
    return (
      <div className={styles.container}>
        {/* <DomeCloseButton {...this.props}></DomeCloseButton> */}
        <StopAllTSCButton
          title="MTCS Stop All"
          commandExecutePermission={commandExecutePermission}
          queueState={mainQueueState}
          command={() => ManagerInterface.runMTCSCommand('stop_all')}
        />
        <StopAllTSCButton
          title="ATCS Stop All"
          commandExecutePermission={commandExecutePermission}
          queueState={auxQueueState}
          command={() => ManagerInterface.runATCSCommand('stop_all')}
        />
      </div>
    );
  }
}
