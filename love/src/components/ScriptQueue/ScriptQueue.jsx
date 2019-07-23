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
import ConfigPanel from './ConfigPanel/ConfigPanel';
import PauseIcon from './../icons/ScriptQueue/PauseIcon/PauseIcon';
import ResumeIcon from './../icons/ScriptQueue/ResumeIcon/ResumeIcon';
import ContextMenu from './Scripts/ContextMenu/ContextMenu';
import RequeueIcon from '../icons/ScriptQueue/RequeueIcon/RequeueIcon';
import TerminateIcon from '../icons/ScriptQueue/TerminateIcon/TerminateIcon';
import MoveToTopIcon from '../icons/ScriptQueue/MoveToTopIcon/MoveToTopIcon';
import MoveToBottomIcon from '../icons/ScriptQueue/MoveToBottomIcon/MoveToBottomIcon';

/**
 * Display lists of scripts from the ScriptQueue SAL object. It includes: Available scripts list, Waiting scripts list and Finished scripts list.
 *
 */
export default class ScriptQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexedHeartbeats: {},
      isAvailableScriptListVisible: true,
      isFinishedScriptListListVisible: false,
      configPanel: {
        show: false,
        x: 0,
        y: 0,
      },
      state: 'Unknown',
      summaryStateValue: 0,
      useLocalWaitingList: false,
      waitingScriptList: this.props.waitingScriptList,
      isContextMenuOpen: false,
      contextMenuData: {},
      currentMenuSelected: false,
    };
    this.lastId = 19;
    this.managerInterface = new ManagerInterface();
  }

  static defaultProps = {
    summaryStateValue: 0,
    heartbeats: {},
    availableScriptList: [],
    waitingScriptList: [],
    current: 'None',
    finishedScriptList: [],
    state: 'Unknown',
  };

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

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.heartbeats !== prevProps.heartbeats) {
      this.setState({
        indexedHeartbeats: this.props.heartbeats.reduce((map, heartbeat) => {
          map[heartbeat.salindex] = heartbeat;
          return map;
        }, {}),
      });
    }
    if (
      this.props.waitingScriptList !== prevProps.waitingScriptList &&
      this.state.draggingScriptInstance === undefined
    ) {
      this.setState({
        useLocalWaitingList: false,
        waitingScriptList: this.props.waitingScriptList,
      });
    }
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

  getScriptFromId = (index) => {
    let list = this.props.waitingScriptList;
    for (let i = 0; i < list.length; i += 1) if (list[i].index === index) return list[i];
    return null;
  };

  onDragStart = (e, draggingId) => {
    if (!hasCommandPrivileges) return;
    const draggingScriptInstance = this.getScriptFromId(draggingId);
    this.setState({
      draggingScriptInstance,
      waitingScriptList: this.props.waitingScriptList,
    });
  };

  // eslint-disable-next-line
  onDragEnd = (e, draggingId) => {
    if (!hasCommandPrivileges) return;
    this.setState({
      draggingScriptInstance: undefined,
    });
    let i = 0;
    for (; i < this.state.waitingScriptList.length; ++i)
      if (this.state.waitingScriptList[i].index === draggingId) break;
    this.moveScript(draggingId, i);
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
  };

  // eslint-disable-next-line
  onDragOver = (e, targetScriptId, source) => {
    if (!hasCommandPrivileges) return;
    if (!this.state.draggingScriptInstance) return;
    const sourceScriptId = this.state.draggingScriptInstance.index;
    if (targetScriptId === sourceScriptId) return;

    const waitingList = [...this.state.waitingScriptList];
    const newWaitingList = [...waitingList];
    const waitingListLength = waitingList.length;
    let waitingListSourceId = -1;
    let waitingListTargetId = -1;

    for (let i = 0; i < waitingListLength; i += 1) {
      if (waitingList[i].index === sourceScriptId) waitingListSourceId = i;
      if (waitingList[i].index === targetScriptId) waitingListTargetId = i;
    }

    newWaitingList.splice(waitingListSourceId, 1);
    newWaitingList.splice(waitingListTargetId, 0, waitingList[waitingListSourceId]);

    this.setState({
      waitingScriptList: newWaitingList,
      useLocalWaitingList: true,
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

  launchScriptConfig = (e, script) => {
    let { x, y, height } = e.target.getBoundingClientRect();
    this.setState({
      configPanel: {
        script: script,
        name: script.name,
        show: true,
        x: x,
        y: y - height,
      },
    });
  };

  launchScript = (isStandard, path, config, descr, location) => {
    this.props.requestSALCommand({
      cmd: 'cmd_add',
      params: {
        isStandard,
        path,
        config,
        descr,
        location,
      },
      component: 'ScriptQueue',
    });
    this.closeConfigPanel();
  };

  closeConfigPanel = () => {
    this.setState({
      configPanel: {
        show: false,
        x: 0,
        y: 0,
      },
    });
  };

  stopScript = (scriptIndex) => {
    console.log('Stopping script', scriptIndex);
    const array = new Array(400).fill(0);
    array[0] = scriptIndex;
    this.props.requestSALCommand({
      cmd: 'cmd_stopScripts',
      params: {
        length: 1,
        salIndices: array,
        terminate: false,
      },
      component: 'ScriptQueue',
    });
  };

  requeueScript = (scriptIndex) => {
    console.log('Requeueing script', scriptIndex);
    this.props.requestSALCommand({
      cmd: 'cmd_requeue',
      params: {
        salIndex: scriptIndex,
        location: 2,
      },
      component: 'ScriptQueue',
    });
  };

  moveScript = (scriptIndex, position, offset = true) => {
    console.log(`Move script ${scriptIndex} to ${position}`);
    let location = 3; //Before reference script
    let locationSalIndex = 0;
    if (position === 0) location = 1; //Location: first
    //Location: last
    if (position >= this.state.waitingScriptList.length - 1) location = 2;
    else {
      const offsetValue = offset ? 1 : 0;
      locationSalIndex = this.state.waitingScriptList[position + offsetValue].index;
    }
    this.props.requestSALCommand({
      cmd: 'cmd_move',
      params: {
        salIndex: scriptIndex,
        location: location,
        locationSalIndex: locationSalIndex,
      },
      component: 'ScriptQueue',
    });
  };

  pauseScriptQueue = () => {
    console.log('Pausing queue');
    this.props.requestSALCommand({
      cmd: 'cmd_pause',
      params: {},
      component: 'ScriptQueue',
    });
  };

  resumeScriptQueue = () => {
    console.log('Resuming queue');
    this.props.requestSALCommand({
      cmd: 'cmd_resume',
      params: {},
      component: 'ScriptQueue',
    });
  };

  onClickContextMenu = (event, index, currentMenuSelected = false) => {
    event.stopPropagation();
    this.setState({ isContextMenuOpen: !this.state.isContextMenuOpen });
    this.setState({
      contextMenuData: event.target.getBoundingClientRect(),
      selectedScriptIndex: index,
      currentMenuSelected: currentMenuSelected,
    });
  };

  requeueSelectedScript = () => {
    this.requeueScript(this.state.selectedScriptIndex);
  };

  stopSelectedScript = () => {
    this.stopScript(this.state.selectedScriptIndex);
    this.setState({ isContextMenuOpen: false });
  };

  moveScriptUp = (scriptIndex) => {
    let i = 0;
    for (; i < this.props.waitingScriptList.length; i++)
      if (this.props.waitingScriptList[i].index === scriptIndex) break;
    this.moveScript(scriptIndex, i - 1, false);
  };

  moveScriptDown = (scriptIndex) => {
    let i = 0;
    for (; i < this.props.waitingScriptList.length; i++)
      if (this.props.waitingScriptList[i].index === scriptIndex) break;
    this.moveScript(scriptIndex, i + 1, true);
  };

  moveSelectedScriptToTop = () => {
    this.moveScript(this.state.selectedScriptIndex, 0);
    this.setState({ isContextMenuOpen: false });
  };

  moveSelectedScriptToBottom = () => {
    this.moveScript(this.state.selectedScriptIndex, Infinity);
    this.setState({ isContextMenuOpen: false });
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
    const waitingList = this.state.useLocalWaitingList ? this.state.waitingScriptList : this.props.waitingScriptList;

    const totalWaitingSeconds = waitingList.reduce((previousSum, currentElement) => {
      if (!currentElement) return previousSum;
      if (typeof currentElement.expected_duration !== 'number') return previousSum;
      return currentElement.expected_duration + previousSum;
    }, 0);

    const totalFinishedSeconds = this.props.finishedScriptList.reduce((previousSum, currentElement) => {
      if (!currentElement) return previousSum;
      if (typeof currentElement.expected_duration !== 'number') return previousSum;
      return currentElement.expected_duration + previousSum;
    }, 0);
    const currentContextMenu = [
      { icon: <TerminateIcon />, text: 'Terminate', action: this.stopSelectedScript },
      { icon: <RequeueIcon />, text: 'Requeue', action: this.requeueSelectedScript },
    ];
    const waitingContextMenu = [
      { icon: <MoveToTopIcon />, text: 'Move to top', action: this.moveSelectedScriptToTop },
      { icon: <MoveToBottomIcon />, text: 'Move to bottom', action: this.moveSelectedScriptToBottom },
      { icon: <RequeueIcon />, text: 'Requeue', action: this.requeueSelectedScript },
    ];

    const contextMenuOption = this.state.currentMenuSelected ? currentContextMenu : waitingContextMenu;

    return (
      <Panel title="Script Queue">
        <div
          onClick={() => {
            this.setState({ isContextMenuOpen: false });
          }}
          className={[styles.scriptQueueContainer, styles.threeColumns].join(' ')}
        >
          <ConfigPanel
            launchScript={this.launchScript}
            closeConfigPanel={this.closeConfigPanel}
            configPanel={this.state.configPanel}
          />
          <ContextMenu
            isOpen={this.state.isContextMenuOpen}
            contextMenuData={this.state.contextMenuData}
            options={contextMenuOption}
          />
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
                  heartbeatData={this.state.indexedHeartbeats[current.index]}
                  timestampRunStart={current.timestampRunStart}
                  stopScript={this.stopScript}
                  onClickContextMenu={this.onClickContextMenu}
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
                          disabled={true}
                        >
                          <AvailableScript
                            key={`${script.type}-${script.path}`}
                            path={script.path}
                            isStandard={script.type ? script.type.toLowerCase() === 'standard' : true}
                            launchScriptConfig={this.launchScriptConfig}
                            script={script}
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
                  <span className={styles.listTitle}>WAITING SCRIPTS ({waitingList.length})</span>
                  <span className={styles.listSubtitle}>
                    Total time:{' '}
                    {Math.trunc(totalWaitingSeconds / 3600) > 0 ? `${Math.trunc(totalWaitingSeconds / 3600)}h ` : ''}
                    {Math.trunc(totalWaitingSeconds / 60) > 0
                      ? `${Math.trunc(totalWaitingSeconds / 60 - Math.trunc(totalWaitingSeconds / 3600) * 60)}m `
                      : ''}
                    {`${(totalWaitingSeconds - Math.trunc(totalWaitingSeconds / 60) * 60).toFixed(2)}s`}
                  </span>
                </div>
                {this.props.state === 'Stopped' && (
                  <>
                    <div className={styles.pauseIconContainer} onClick={this.resumeScriptQueue}>
                      <span>Resume</span>
                      <div className={styles.pauseIconWrapper} title="Resume Script Queue">
                        <ResumeIcon />
                      </div>
                    </div>
                  </>
                )}
                {this.props.state === 'Running' && (
                  <>
                    <div className={styles.pauseIconContainer} onClick={this.pauseScriptQueue}>
                      <span>Pause</span>
                      <div className={styles.pauseIconWrapper} title="Pause Script Queue">
                        <PauseIcon />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <ScriptList onDragLeave={this.onDragLeave} onDragEnter={this.onDragEnter}>
                {waitingList.map((script, listIndex) => {
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
                        heartbeatData={this.state.indexedHeartbeats[script.index]}
                        stopScript={this.stopScript}
                        moveScript={this.moveScript}
                        onClickContextMenu={this.onClickContextMenu}
                        moveScriptUp={this.moveScriptUp}
                        moveScriptDown={this.moveScriptDown}
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
                            requeueScript={this.requeueScript}
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
