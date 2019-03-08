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
import Button from '../Button/Button';
/**
 * Display lists of scripts from the ScriptQueue SAL object. It includes: Available scripts list, Waiting scripts list and Finished scripts list.
 *
 */
export default class ScriptQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waitingScriptList: [
        {
          state: 'unconfigured',
          id: 0,
        },
        {
          state: 'configured',
          id: 1,
        },
        {
          state: 'done',
          id: 2,
        },
        {
          state: 'stopped',
          id: 3,
        },
      ],
      availableScriptList: [
        {
          state: 'failed',
          id: 8,
        },
        {
          state: 'failed',
          id: 9,
        },
      ],
      finishedScriptList: [
        {
          state: 'done',
          id: 4,
        },
        {
          state: 'terminated',
          id: 5,
        },
        {
          state: 'failed',
          id: 6,
        },
        {
          state: 'stopped',
          id: 7,
        },
      ],
      isAvailableScriptListVisible: false,
      draggingSource: '',
    };
    this.lastId = 19;
  }

  toggleAvailableScript = () => {
    this.setState({
      isAvailableScriptListVisible: !this.state.isAvailableScriptListVisible,
    });
  };

  getScriptFromId = (id, listName) => {
    let list = this.state.waitingScriptList;
    if (listName === 'available') list = this.state.availableScriptList;
    for (let i = 0; i < list.length; i += 1) if (list[i].id === id) return list[i];
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
    const list = [...this.state.waitingScriptList];
    for (let i = 0; i < list.length; i += 1) {
      // update id of newly inserted script
      if (list[i].id === draggingId) {
        const newItem = { ...list[i] };
        newItem.id = this.lastId + 1;
        newItem.pendingConfirmation = true;
        list[i] = newItem;
        this.lastId += 1;
        break;
      }
    }
    this.setState({
      waitingScriptList: [...list],
      draggingScriptInstance: null,
    });
    return null;
  };

  removeFromWaitingList = (sourceScriptId) => {
    const waitingList = [...this.state.waitingScriptList];
    const newWaitingList = [...waitingList];
    const waitingListLength = waitingList.length;
    let waitingListSourceId = -1;

    for (let i = 0; i < waitingListLength; i += 1) {
      if (waitingList[i].id === sourceScriptId) waitingListSourceId = i;
    }
    if (waitingListSourceId !== -1) newWaitingList.splice(waitingListSourceId, 1);
    this.setState({
      waitingScriptList: newWaitingList,
    });
  };

  onDragLeave = () => {
    const sourceScriptId = this.state.draggingScriptInstance.id;
    if (this.state.draggingSource === 'available' || this.state.draggingSource === '') {
      this.removeFromWaitingList(sourceScriptId);
    }
  };

  // eslint-disable-next-line
  onDragOver = (e, targetScriptId, source) => {
    const sourceScriptId = this.state.draggingScriptInstance.id;
    if (targetScriptId === sourceScriptId) return;

    const waitingList = [...this.state.waitingScriptList];
    const newWaitingList = [...waitingList];
    const waitingListLength = waitingList.length;
    let waitingListSourceId = -1;
    let waitingListTargetId = -1;

    for (let i = 0; i < waitingListLength; i += 1) {
      if (waitingList[i].id === sourceScriptId) waitingListSourceId = i;
      if (waitingList[i].id === targetScriptId) waitingListTargetId = i;
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

  render() {
    return (
      <Panel title="Script Queue">
        <div
          className={[
            styles.scriptQueueContainer,
            this.state.isAvailableScriptListVisible ? styles.threeColumns : '',
          ].join(' ')}
        >
          <div className={styles.currentScriptWrapper}>
            <div className={styles.currentScriptContainer}>
              <span className={styles.currentScriptTitle}>CURRENT SCRIPT</span>
              <CurrentScript state={'running'} />
            </div>
          </div>
          <div className={styles.globalStateWrapper}>
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
          <div
            className={styles.listsBody}
            onDragEnter={(e) => {
              this.onDragLeave(e);
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <div className={[styles.availableScriptList, styles.scriptList].join(' ')}>
              <span className={styles.listTitle}>AVAILABLE SCRIPTS ({this.state.availableScriptList.length})</span>
              <span className={styles.listSubtitle}>&#8203;</span>
              <ScriptList>
                {this.state.availableScriptList.map((script) => {
                  if (!script) return null;
                  return (
                    <DraggableScript
                      key={`dragging-${script.id}`}
                      id={script.id}
                      onDragOver={(e, id) => this.onDragOver(e, id, 'available')}
                      onDragStart={(e, id) => this.onDragStart(e, id, 'available')}
                      onDragEnd={(e, id) => this.onDragEnd(e, id, 'available')}
                    >
                      <AvailableScript key={script.id} />
                    </DraggableScript>
                  );
                })}
              </ScriptList>
            </div>
            <div className={[styles.waitingScriptList, styles.scriptList].join(' ')}>
              <span className={styles.listTitle}>WAITING SCRIPTS ({this.state.waitingScriptList.length})</span>
              <span className={styles.listSubtitle}>Total time: 0</span>
              <ScriptList onDragLeave={this.onDragLeave}>
                {this.state.waitingScriptList.map((script) => {
                  if (!script) return null;
                  return (
                    <DraggableScript
                      key={`dragging-${script.id}`}
                      {...script}
                      onDragOver={(e, id) => this.onDragOver(e, id, 'waiting')}
                      onDragStart={(e, id) => this.onDragStart(e, id, 'waiting')}
                    >
                      <WaitingScript
                        key={script.id}
                        state={script.state}
                        isCompact={this.state.isAvailableScriptListVisible}
                      />
                    </DraggableScript>
                  );
                })}
                <div className={styles.addScriptContainer}>
                  <Button className={styles.addScriptButton} size={'large'} onClick={this.toggleAvailableScript}>
                    + Add script
                  </Button>
                </div>
              </ScriptList>
            </div>
            <div className={[styles.finishedScriptList, styles.scriptList].join(' ')}>
              <span className={styles.listTitle}>FINISHED SCRIPTS ({this.state.finishedScriptList.length})</span>
              <span className={styles.listSubtitle}>Total time: 0</span>
              <ScriptList>
                {this.state.finishedScriptList.map((script, id) => (
                  <DraggableScript key={`dragging-${script.id}`}>
                    <FinishedScript key={id} state={script.state} isCompact={this.state.isAvailableScriptListVisible} />
                  </DraggableScript>
                ))}
              </ScriptList>
            </div>
          </div>
        </div>
      </Panel>
    );
  }
}
