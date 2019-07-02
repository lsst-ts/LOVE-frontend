import React, { Component } from 'react';
import WaitingScript from './Scripts/WaitingScript/WaitingScript';
import ScriptList from './Scripts/ScriptList/ScriptList';
import CurrentScript from './Scripts/CurrentScript/CurrentScript';
import AvailableScript from './Scripts/AvailableScript/AvailableScript';
import FinishedScript from './Scripts/FinishedScript/FinishedScript';
import DraggableScript from './Scripts/DraggableScript/DraggableScript';
import styles from './ScriptQueue.module.css';
import Panel from '../GeneralPurpose/Panel/Panel';
import StatusText from '../GeneralPurpose/StatusText/StatusText';
import ManagerInterface from '../../Utils';
import { hasCommandPrivileges, hasFakeData } from '../../Config';

/**
 * Display lists of scripts from the ScriptQueue SAL object. It includes: Available scripts list, Waiting scripts list and Finished scripts list.
 *
 */
export default class ScriptQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heartbeats: {},
      isAvailableScriptListVisible: false,
      draggingSource: '',
      isFinishedScriptListListVisible: false,
      // summaryStateValue: 0,
    };
    this.lastId = 19;
    this.managerInterface = new ManagerInterface();
  }

  static defaultProps = {
    summaryStateValue: 0,
    availableScriptList: [],
    waitingScriptList: [],
    current: 'None',
    finishedScriptList: [],
    state: 'Unknown',
  }

  static stateStyleDict = {
    Stopped: 'warning',
    Unknown: 'invalid',
    Running: 'ok',
  };

  static summaryStates = {
    0: {
      name: 'UNKNOWN',
      statusText: 'invalid',
    },
    1: {
      name: 'DISABLED',
      statusText: 'invalid',
    },
    2: {
      name: 'ENABLED',
      statusText: 'ok',
    },
    3: {
      name: 'FAULT',
      statusText: 'alert',
    },
    4: {
      name: 'OFFLINE',
      statusText: 'invalid',
    },
    5: {
      name: 'STANDBY',
      statusText: 'warning',
    },
  };

  onReceiveMsg = (msg) => {
    let { data } = JSON.parse(msg.data);

    // if (data.ScriptQueue) {
    //   this.processSummaryState(data);
    // }

    if (data.ScriptQueueState === undefined) return;

    data = data.ScriptQueueState.stream;

    if (data.script_heartbeat) {
      this.processHeartbeat(data);
      return;
    }
  };

  // processSummaryState = (data) => {
  //   let { value } = data.ScriptQueue.summaryState[0].summaryState;
  //   if (hasFakeData) {
  //     value = Math.floor(Math.random() * 5);
  //   }
  //   this.setState({
  //     summaryStateValue: value,
  //   });
  // };

  processHeartbeat = (data) => {
    const { salindex, ...scriptData } = data.script_heartbeat;
    const currentHeartbeats = { ...this.state.heartbeats };

    currentHeartbeats[salindex] = {
      lost: scriptData.lost,
      lastHeartbeatTimestamp: scriptData.last_heartbeat_timestamp,
    };

    this.setState({
      heartbeats: currentHeartbeats,
    });
  };

  componentDidMount = () => {
    this.props.subscribeToStreams();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStreams();
  };

  displayAvailableScripts = () => {
    this.setState({
      isAvailableScriptListVisible: true,
    });
  };

  hideAvailableScripts = () => {
    this.setState({
      isAvailableScriptListVisible: false,
    });
  };

  getScriptFromId = (index, listName) => {
    let list = this.props.waitingScriptList;
    if (listName === 'available') list = this.props.availableScriptList;
    for (let i = 0; i < list.length; i += 1) if (list[i].index === index) return list[i];
    return null;
  };

  onDragStart = (e, draggingId, draggingSource) => {
    if (!hasCommandPrivileges) return;
    const draggingScriptInstance = this.getScriptFromId(draggingId, draggingSource);
    this.setState({
      draggingScriptInstance,
      draggingSource,
    });
  };

  // eslint-disable-next-line
  onDragEnd = (e, draggingId, draggingSource) => {
    if (!hasCommandPrivileges) return;
    // console.log('END', e, draggingId, draggingSource, this.state.draggingScriptInstance);
    if (draggingSource === 'available') {
      const list = [...this.props.waitingScriptList];
      for (let i = 0; i < list.length; i += 1) {
        // update id of newly inserted script
        if (list[i].index === draggingId) {
          const newItem = { ...list[i] };
          newItem.index = this.lastId + 1;
          newItem.pendingConfirmation = true;
          list[i] = newItem;
          this.lastId += 1;
          break;
        }
      }
      this.setState({
        waitingScriptList: [...list],
        draggingScriptInstance: undefined,
      });
    } else {
      this.setState({
        draggingScriptInstance: undefined,
      });
    }
  };

  removeFromWaitingList = (sourceScriptId) => {
    const waitingList = [...this.props.waitingScriptList];
    const newWaitingList = [...waitingList];
    const waitingListLength = waitingList.length;
    let waitingListSourceId = -1;

    for (let i = 0; i < waitingListLength; i += 1) {
      if (waitingList[i].index === sourceScriptId) waitingListSourceId = i;
    }
    if (waitingListSourceId !== -1) newWaitingList.splice(waitingListSourceId, 1);
    this.setState({
      waitingScriptList: newWaitingList,
    });
  };

  onDragEnter = () => {
    if (!hasCommandPrivileges) return;
    if (!this.state.draggingScriptInstance) return;
    const sourceScriptId = this.state.draggingScriptInstance.index;

    const waitingList = [...this.props.waitingScriptList];
    const waitingListLength = waitingList.length;
    let waitingListSourceId = -1;

    for (let i = 0; i < waitingListLength; i += 1) {
      if (waitingList[i].index === sourceScriptId) waitingListSourceId = i;
    }

    if (waitingListSourceId === -1) {
      waitingList.splice(0, 0, this.state.draggingScriptInstance);
      this.setState({
        waitingScriptList: [...waitingList],
      });
    }
  };

  onDragLeave = () => {
    if (!hasCommandPrivileges) return;
    const sourceScriptId = this.state.draggingScriptInstance.index;
    if (this.state.draggingSource === 'available' || this.state.draggingSource === '') {
      this.removeFromWaitingList(sourceScriptId);
    }
  };

  // eslint-disable-next-line
  onDragOver = (e, targetScriptId, source) => {
    if (!hasCommandPrivileges) return;
    if (!this.state.draggingScriptInstance) return;
    const sourceScriptId = this.state.draggingScriptInstance.index;
    if (targetScriptId === sourceScriptId) return;

    const waitingList = [...this.props.waitingScriptList];
    const newWaitingList = [...waitingList];
    const waitingListLength = waitingList.length;
    let waitingListSourceId = -1;
    let waitingListTargetId = -1;

    for (let i = 0; i < waitingListLength; i += 1) {
      if (waitingList[i].index === sourceScriptId) waitingListSourceId = i;
      if (waitingList[i].index === targetScriptId) waitingListTargetId = i;
    }

    if (this.state.draggingSource === 'available' || this.state.draggingSource === '') {
      // get available list id
      // remove script from waiting list
      if (waitingListSourceId !== -1) newWaitingList.splice(waitingListSourceId, 1);
      // reinsert it
      newWaitingList.splice(waitingListTargetId, 0, this.state.draggingScriptInstance);
      this.setState({
        waitingScriptList: newWaitingList,
        dragOverId: targetScriptId,
      });
      return;
    }

    newWaitingList.splice(waitingListSourceId, 1);
    newWaitingList.splice(waitingListTargetId, 0, waitingList[waitingListSourceId]);

    this.setState({
      waitingScriptList: newWaitingList,
    });
  };

  openFinishedList = () => {
    this.setState({
      isFinishedScriptListListVisible: true,
    });
  };

  closeFinishedList = () => {
    this.setState({
      isFinishedScriptListListVisible: false,
    });
  };

  openAvailableList = () => {
    this.setState({
      isAvailableScriptListVisible: true,
    });
  };

  closeAvailableList = () => {
    this.setState({
      isAvailableScriptListVisible: false,
    });
  };

  render() {
    const finishedScriptListClass = this.state.isFinishedScriptListListVisible ? '' : styles.collapsedScriptList;
    const availableScriptListClass = this.state.isAvailableScriptListVisible ? '' : styles.collapsedScriptList;
    const current = this.props.current === 'None' ? {} : { ...this.props.current };

    // const now = new Date();
    // Fix time zones for next line
    // const currentScriptElapsedTime =
    //   this.props.current === 'None' || current.timestampRunStart === undefined
    //     ? 0
    //     : now.getTime() / 1000.0 - current.timestampRunStart;

    const totalWaitingSeconds = this.props.waitingScriptList.reduce((previousSum, currentElement) => {
      if (!currentElement) return previousSum;
      if (typeof currentElement.expected_duration !== 'number') return previousSum;
      return currentElement.expected_duration + previousSum;
    }, 0);

    const totalFinishedSeconds = this.props.finishedScriptList.reduce((previousSum, currentElement) => {
      if (!currentElement) return previousSum;
      if (typeof currentElement.expected_duration !== 'number') return previousSum;
      return currentElement.expected_duration + previousSum;
    }, 0);

    return (
      <Panel title="Script Queue">
        <div className={[styles.scriptQueueContainer, styles.threeColumns].join(' ')}>
          <div
            onDragEnter={(e) => {
              this.onDragLeave(e);
            }}
            className={styles.currentScriptWrapper}
          >
            <div className={styles.currentScriptContainerWrapper}>
              <div className={styles.currentScriptContainer}>
                <span className={styles.currentScriptTitle}>CURRENT SCRIPT</span>
                <CurrentScript
                  {...current}
                  index={current.index}
                  scriptState={current.script_state}
                  processState={current.process_state}
                  isStandard={current.type ? current.type.toUpperCase() === 'STANDARD' : undefined}
                  estimatedTime={current.expected_duration}
                  heartbeatData={this.state.heartbeats[current.index]}
                  timestampRunStart={current.timestampRunStart}
                />
              </div>
            </div>
          </div>
          <div
            onDragEnter={(e) => {
              this.onDragLeave(e);
            }}
            className={styles.globalStateWrapper}
          >
            <div className={styles.globalStateContainer}>
              <div className={styles.stateContainer}>
                CSC STATE
                <StatusText status={ScriptQueue.summaryStates[this.props.summaryStateValue].statusText}>
                  {ScriptQueue.summaryStates[this.props.summaryStateValue].name}
                </StatusText>
              </div>
              <div className={styles.stateContainer}>
                QUEUE STATE
                <StatusText status={ScriptQueue.stateStyleDict[this.props.state]}>{this.props.state}</StatusText>
              </div>
            </div>
          </div>

          {/* LISTS BODY */}
          <div className={styles.listsBody}>
            <div className={[styles.collapsableScriptList, availableScriptListClass].join(' ')}>
              <div
                onDragEnter={(e) => {
                  this.onDragLeave(e);
                }}
                className={[styles.availableScriptList, styles.scriptList].join(' ')}
              >
                <div
                  className={[styles.collapsedScriptListLabelWrapper].join(' ')}
                  onClick={this.openAvailableList}
                  title="Open available script list"
                >
                  <div className={[styles.collapsedScriptListLabel].join(' ')}>&#8853;</div>
                </div>
                <div className={styles.collapsableScriptListContent}>
                  <div className={styles.listTitleWrapper}>
                    <div className={styles.listTitleLeft}>
                      <span className={styles.listTitle}>
                        AVAILABLE SCRIPTS ({this.props.availableScriptList.length})
                      </span>
                      <span className={styles.listSubtitle}>&#8203;</span>
                    </div>
                    <div
                      className={styles.collapseScriptListButton}
                      onClick={this.closeAvailableList}
                      title="Close available script list"
                    >
                      <span>&#8854;</span>
                    </div>
                  </div>
                  <ScriptList>
                    {this.props.availableScriptList.map((script) => {
                      if (!script) return null;
                      return (
                        <DraggableScript
                          key={`dragging-available-${script.type}-${script.path}`}
                          {...script}
                          dragSourceList="available"
                          onDragOver={(e) => this.onDragLeave(e)}
                          onDragStart={(e, id) => this.onDragStart(e, id, 'available')}
                          onDragEnd={(e, id) => this.onDragEnd(e, id, 'available')}
                          draggingScriptInstance={this.state.draggingScriptInstance}
                          disabled={!hasCommandPrivileges}
                        >
                          <AvailableScript
                            key={`${script.type}-${script.path}`}
                            path={script.path}
                            isStandard={script.type ? script.type.toLowerCase() === 'standard' : true}
                            {...script}
                          />
                        </DraggableScript>
                      );
                    })}
                  </ScriptList>
                </div>
              </div>
            </div>

            <div className={[styles.waitingScriptList, styles.scriptList].join(' ')}>
              <div className={styles.listTitleWrapper}>
                <div className={styles.listTitleLeft}>
                  <span className={styles.listTitle}>WAITING SCRIPTS ({this.props.waitingScriptList.length})</span>
                  <span className={styles.listSubtitle}>
                    Total time:{' '}
                    {Math.trunc(totalWaitingSeconds / 3600) > 0 ? `${Math.trunc(totalWaitingSeconds / 3600)}h ` : ''}
                    {Math.trunc(totalWaitingSeconds / 60) > 0
                      ? `${Math.trunc(totalWaitingSeconds / 60 - Math.trunc(totalWaitingSeconds / 3600) * 60)}m `
                      : ''}
                    {`${(totalWaitingSeconds - Math.trunc(totalWaitingSeconds / 60) * 60).toFixed(2)}s`}
                  </span>
                </div>
              </div>
              <ScriptList onDragLeave={this.onDragLeave} onDragEnter={this.onDragEnter}>
                {this.props.waitingScriptList.map((script, listIndex) => {
                  if (!script) return null;
                  const estimatedTime =
                    script.expected_duration === 'UNKNOWN' ? 0 : parseFloat(script.expected_duration);

                  const isStandard =
                    !script.type || script.type === 'UNKNOWN' ? undefined : script.type.toLowerCase() === 'standard';

                  const key = script.index ? script.index : `unknown-${listIndex}`;
                  return (
                    <DraggableScript
                      key={`dragging-waiting-${key}`}
                      {...script}
                      onDragOver={(e, id) => this.onDragOver(e, id, 'waiting')}
                      onDragStart={(e, id) => this.onDragStart(e, id, 'waiting')}
                      onDragEnd={(e, id) => this.onDragEnd(e, id, 'waiting')}
                      draggingScriptInstance={this.state.draggingScriptInstance}
                      disabled={!hasCommandPrivileges}
                    >
                      <WaitingScript
                        isCompact={
                          this.state.isAvailableScriptListVisible && this.state.isFinishedScriptListListVisible
                        }
                        path={script.path}
                        isStandard={isStandard}
                        estimatedTime={estimatedTime}
                        heartbeatData={this.state.heartbeats[script.index]}
                        {...script}
                      />
                    </DraggableScript>
                  );
                })}
              </ScriptList>
            </div>

            <div className={[styles.collapsableScriptList, finishedScriptListClass].join(' ')}>
              <div
                onDragEnter={(e) => {
                  this.onDragLeave(e);
                }}
                className={[styles.finishedScriptList, styles.scriptList].join(' ')}
              >
                <div
                  className={[styles.collapsedScriptListLabelWrapper].join(' ')}
                  onClick={this.openFinishedList}
                  title="Open finished script list"
                >
                  <div className={[styles.collapsedScriptListLabel].join(' ')}>&#8853;</div>
                </div>
                <div className={styles.collapsableScriptListContent}>
                  <div className={styles.listTitleWrapper}>
                    <div className={styles.listTitleLeft}>
                      <span className={styles.listTitle}>
                        FINISHED SCRIPTS ({this.props.finishedScriptList.length})
                      </span>
                      <span className={styles.listSubtitle}>
                        Total time:{' '}
                        {Math.trunc(totalFinishedSeconds / 3600) > 0
                          ? `${Math.trunc(totalFinishedSeconds / 3600)}h `
                          : ''}
                        {Math.trunc(totalFinishedSeconds / 60) > 0
                          ? `${Math.trunc(totalFinishedSeconds / 60 - Math.trunc(totalFinishedSeconds / 3600) * 60)}m `
                          : ''}
                        {`${(totalFinishedSeconds - Math.trunc(totalFinishedSeconds / 60) * 60).toFixed(2)}s`}
                      </span>
                    </div>
                    <div
                      className={styles.collapseScriptListButton}
                      onClick={this.closeFinishedList}
                      title="Close finished script list"
                    >
                      <span>&#8854;</span>
                    </div>
                  </div>
                  <ScriptList>
                    {this.props.finishedScriptList.map((script, listIndex) => {
                      const isStandard =
                        !script.type || script.type === 'UNKNOWN' ? true : script.type.toLowerCase() === 'standard';
                      const estimatedTime = script.expected_duration === 'UNKNOWN' ? -1 : script.expected_duration;
                      const key = script.index ? script.index : `unknown-${listIndex}`;
                      const elapsedTime =
                        script.timestampProcessEnd === 0.0 || script.timestampRunStart === 0.0
                          ? 0.0
                          : script.timestampProcessEnd - script.timestampRunStart;
                      return (
                        <DraggableScript
                          key={`dragging-finished-${key}`}
                          dragSourceList="available"
                          onDragOver={(e) => this.onDragLeave(e)}
                          disabled
                        >
                          <FinishedScript
                            {...script}
                            path={script.path}
                            isStandard={isStandard}
                            estimatedTime={estimatedTime}
                            elapsedTime={elapsedTime}
                            isCompact={
                              this.state.isAvailableScriptListVisible && this.state.isFinishedScriptListListVisible
                            }
                          />
                        </DraggableScript>
                      );
                    })}
                  </ScriptList>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    );
  }
}
