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
          command={() => ManagerInterface.runMTCSCommand('stop_all')}/>
        <StopAllTSCButton
          title="ATCS Stop All"
          commandExecutePermission={commandExecutePermission}
          queueState={auxQueueState}
          command={() => ManagerInterface.runATCSCommand('stop_all')}/>
      </div>
    );
  }
}
