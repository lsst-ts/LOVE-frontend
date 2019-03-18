import React, { Component } from 'react';
import WaitingScript from './Scripts/WaitingScript/WaitingScript';
import ScriptList from './Scripts/ScriptList/ScriptList';
import CurrentScript from './Scripts/CurrentScript/CurrentScript';
import AvailableScript from './Scripts/AvailableScript/AvailableScript';
import FinishedScript from './Scripts/FinishedScript/FinishedScript';
import DraggableScript from './Scripts/DraggableScript/DraggableScript';
import styles from './ScriptQueue.module.css';
import Panel from '../Panel/Panel';
import StatusText from '../StatusText/StatusText';
import { hasCommandPrivileges } from '../../Utils';
/**
 * Display lists of scripts from the ScriptQueue SAL object. It includes: Available scripts list, Waiting scripts list and Finished scripts list.
 *
 */
export default class ScriptQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: {},
      waitingScriptList: [
        {
          state: 'unconfigured',
          index: 0,
        },
        {
          state: 'configured',
          index: 1,
        },
        {
          state: 'done',
          index: 2,
        },
        {
          state: 'stopped',
          index: 3,
        },
      ],
      availableScriptList: [
        {
          state: 'failed',
          index: 8,
        },
        {
          state: 'failed',
          index: 9,
        },
      ],
      finishedScriptList: [
        {
          state: 'done',
          index: 4,
        },
        {
          state: 'terminated',
          index: 5,
        },
        {
          state: 'failed',
          index: 6,
        },
        {
          state: 'stopped',
          index: 7,
        },
      ],
      isAvailableScriptListVisible: false,
      draggingSource: '',
      isFinishedScriptListListVisible: false,
    };
    this.lastId = 19;
  }

  onReceiveMsg(data) {
    const { current } = data;
    const { state } = data;
    const finishedScriptList = data.finished_scripts;
    const availableScriptList = data.available_scripts;
    const waitingScriptList = data.waiting_scripts;
    this.setState({
      current,
      finishedScriptList,
      availableScriptList,
      waitingScriptList,
      state,
    });
  }

  componentDidMount = () => {
    const data = {
      // current: 'None',
      current: {
        elapsed_time: 0.0,
        index: 100000,
        path: 'script1',
        process_state: 'RUNNING',
        script_state: 'RUNNING',
        timestamp: 1552071360.648183,
        type: 'Standard',
      },
      finished_scripts: [
        {
          elapsed_time: 0.0,
          index: 100004,
          path: 'script1',
          process_state: 'CONFIGURED',
          script_state: 'CONFIGURED',
          timestamp: 1552071362.581268,
          type: 'Standard',
        },
      ],
      state: 'Running',
      waiting_scripts: [
        {
          elapsed_time: 0.0,
          index: 100008,
          path: 'script1',
          process_state: 'CONFIGURED',
          script_state: 'CONFIGURED',
          timestamp: 1552071362.581268,
          type: 'Standard',
        },
      ],
      available_scripts: [
        {
          elapsed_time: 0.0,
          index: 100002,
          path: 'script1',
          process_state: 'CONFIGURED',
          script_state: 'CONFIGURED',
          timestamp: 1552071362.581268,
          type: 'Standard',
        },
        {
          elapsed_time: 0.0,
          index: 100005,
          path: 'script1',
          process_state: 'FAILED',
          script_state: 'FAILED',
          timestamp: 1552071362.581268,
          type: 'Standard',
        },
        {
          elapsed_time: 0.0,
          index: 100006,
          path: 'script1',
          process_state: 'UNCONFIGURED',
          script_state: 'UNCONFIGURED',
          timestamp: 1552071362.581268,
          type: 'Standard',
        },
      ],
    };
    this.onReceiveMsg(data);
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
    let list = this.state.waitingScriptList;
    if (listName === 'available') list = this.state.availableScriptList;
    for (let i = 0; i < list.length; i += 1) if (list[i].index === index) return list[i];
    return null;
  };

  onDragStart = (e, draggingId, draggingSource) => {
    // console.log('onDragStart', this.state);
    const draggingScriptInstance = this.getScriptFromId(draggingId, draggingSource);
    this.setState({
      draggingScriptInstance,
      draggingSource,
    });
  };

  // eslint-disable-next-line
  onDragEnd = (e, draggingId, draggingSource) => {
    // console.log('END', e, draggingId, draggingSource, this.state.draggingScriptInstance);
    if (draggingSource === 'available') {
      const list = [...this.state.waitingScriptList];
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
    return null;
  };

  removeFromWaitingList = (sourceScriptId) => {
    const waitingList = [...this.state.waitingScriptList];
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
    if (!this.state.draggingScriptInstance) return;
    const sourceScriptId = this.state.draggingScriptInstance.index;

    const waitingList = [...this.state.waitingScriptList];
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
    const sourceScriptId = this.state.draggingScriptInstance.index;
    if (this.state.draggingSource === 'available' || this.state.draggingSource === '') {
      this.removeFromWaitingList(sourceScriptId);
    }
  };

  // eslint-disable-next-line
  onDragOver = (e, targetScriptId, source) => {
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
      isAvailableScriptListListVisible: true,
    });
  };

  closeAvailableList = () => {
    this.setState({
      isAvailableScriptListListVisible: false,
    });
  };

  render() {
    const finishedScriptListClass = this.state.isFinishedScriptListListVisible ? '' : styles.collapsedScriptList;
    const availableScriptListClass = this.state.isAvailableScriptListListVisible ? '' : styles.collapsedScriptList;
    return (
      <Panel title="Script Queue">
        <div className={[styles.scriptQueueContainer, styles.threeColumns].join(' ')}>
          <div
            onDragEnter={(e) => {
              this.onDragLeave(e);
            }}
            className={styles.currentScriptWrapper}
          >
            <div className={styles.currentScriptContainer}>
              <span className={styles.currentScriptTitle}>CURRENT SCRIPT</span>
              <CurrentScript {...this.state.current} />
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
                <StatusText status="ok">OK</StatusText>
              </div>
              <div className={styles.stateContainer}>
                QUEUE STATE
                <StatusText status="alert">DOWN</StatusText>
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
                <div className={[styles.collapsedScriptListLabelWrapper].join(' ')} onClick={this.openAvailableList}>
                  <div className={[styles.collapsedScriptListLabel].join(' ')}>&#8853;</div>
                </div>
                <div className={styles.collapsableScriptListContent}>
                  <div className={styles.listTitleWrapper}>
                    <div className={styles.listTitleLeft}>
                      <span className={styles.listTitle}>
                        AVAILABLE SCRIPTS ({this.state.availableScriptList.length})
                      </span>
                      <span className={styles.listSubtitle}>&#8203;</span>
                    </div>
                    <div className={styles.collapseScriptListButton} onClick={this.closeAvailableList}>
                      <span>&#8854;</span>
                    </div>
                  </div>
                  <ScriptList>
                    {this.state.availableScriptList.map((script) => {
                      if (!script) return null;
                      return (
                        <DraggableScript
                          key={`dragging-${script.index}`}
                          {...script}
                          dragSourceList="available"
                          onDragOver={(e) => this.onDragLeave(e)}
                          onDragStart={(e, id) => this.onDragStart(e, id, 'available')}
                          onDragEnd={(e, id) => this.onDragEnd(e, id, 'available')}
                          draggingScriptInstance={this.state.draggingScriptInstance}
                          disabled={!hasCommandPrivileges}
                        >
                          <AvailableScript key={script.index} />
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
                  <span className={styles.listTitle}>WAITING SCRIPTS ({this.state.waitingScriptList.length})</span>
                  <span className={styles.listSubtitle}>Total time: 0</span>
                </div>
              </div>
              <ScriptList onDragLeave={this.onDragLeave} onDragEnter={this.onDragEnter}>
                {this.state.waitingScriptList.map((script) => {
                  if (!script) return null;
                  return (
                    <DraggableScript
                      key={`dragging-${script.index}`}
                      {...script}
                      onDragOver={(e, id) => this.onDragOver(e, id, 'waiting')}
                      onDragStart={(e, id) => this.onDragStart(e, id, 'waiting')}
                      onDragEnd={(e, id) => this.onDragEnd(e, id, 'waiting')}
                      draggingScriptInstance={this.state.draggingScriptInstance}
                      disabled={!hasCommandPrivileges}
                    >
                      <WaitingScript
                        key={script.index}
                        isCompact={this.state.isAvailableScriptListVisible}
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
                <div className={[styles.collapsedScriptListLabelWrapper].join(' ')} onClick={this.openFinishedList}>
                  <div className={[styles.collapsedScriptListLabel].join(' ')}>&#8853;</div>
                </div>
                <div className={styles.collapsableScriptListContent}>
                  <div className={styles.listTitleWrapper}>
                    <div className={styles.listTitleLeft}>
                      <span className={styles.listTitle}>
                        FINISHED SCRIPTS ({this.state.finishedScriptList.length})
                      </span>
                      <span className={styles.listSubtitle}>Total time: 0</span>
                    </div>
                    <div className={styles.collapseScriptListButton} onClick={this.closeFinishedList}>
                      <span>&#8854;</span>
                    </div>
                  </div>
                  <ScriptList>
                    {this.state.finishedScriptList.map((script, id) => (
                      <DraggableScript
                        key={`dragging-${script.index}`}
                        dragSourceList="available"
                        onDragOver={(e) => this.onDragLeave(e)}
                        disabled
                      >
                        <FinishedScript key={id} {...script} isCompact={this.state.isAvailableScriptListVisible} />
                      </DraggableScript>
                    ))}
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
