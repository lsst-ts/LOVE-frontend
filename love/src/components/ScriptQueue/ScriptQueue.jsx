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
          index: 0,
        },
        {
          state: 'configured',
          index: 1,
        },
        {
          state: 'failed',
          index: 2,
        },
        {
          state: 'stopped',
          index: 3,
        },
      ],
      availableScriptList: [],
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
      draggingIndex: -1,
    };
  }

  toggleAvailableScript = () => {
    this.setState({
      isAvailableScriptListVisible: !this.state.isAvailableScriptListVisible,
    });
  };

  onDragStart = (e, index) => {
    this.setState({
      draggingIndex: index,
    });
  };

  onDragOver = (e, targetScriptIndex) => {
    const sourceScriptIndex = this.state.draggingIndex;
    if (targetScriptIndex === sourceScriptIndex) return;

    const waitingList = [...this.state.waitingScriptList];
    const waitingListLength = waitingList.length;
    let sourceListIndex = -1;
    let targetListIndex = -1;

    for (let i = 0; i < waitingListLength; i += 1) {
      if (waitingList[i].index === sourceScriptIndex) sourceListIndex = i;
      if (waitingList[i].index === targetScriptIndex) targetListIndex = i;
    }

    if (sourceListIndex !== -1 && targetListIndex !== -1) {
      [waitingList[sourceListIndex], waitingList[targetListIndex]] = [
        waitingList[targetListIndex],
        waitingList[sourceListIndex],
      ];
    }

    // for (let i = 0; i < waitingListLength; i += 1) {
    //   if (waitingList[i].index === targetScriptIndex) {
    //     waitingList.splice(targetScriptIndex);
    //     i -= 1;
    //   }
    //   if (waitingList[i].index === sourceScriptIndex) {
    //     waitingList.splice(targetScriptIndex, 0);
    //   }
    // }
    // waitingList = waitingList.sort(function() {
    //   return 0.5 - Math.random();
    // });
    this.setState({
      waitingScriptList: waitingList,
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
          <div className={styles.listsBody}>
            <div className={[styles.availableScriptList, styles.scriptList].join(' ')}>
              <span className={styles.listTitle}>AVAILABLE SCRIPTS ({this.state.availableScriptList.length})</span>
              <span className={styles.listSubtitle}>&#8203;</span>
              <ScriptList>
                {this.state.availableScriptList.map((script) => {
                  if (!script) return null;
                  return (
                    <DraggableScript key={`${'dragging-'}script.index`}>
                      <AvailableScript key={script.index} />
                    </DraggableScript>
                  );
                })}
              </ScriptList>
            </div>
            <div className={[styles.waitingScriptList, styles.scriptList].join(' ')}>
              <span className={styles.listTitle}>WAITING SCRIPTS ({this.state.waitingScriptList.length})</span>
              <span className={styles.listSubtitle}>Total time: 0</span>
              <ScriptList>
                {this.state.waitingScriptList.map((script) => {
                  if (!script) return null;
                  return (
                    <DraggableScript
                      key={`${'dragging-'}script.index`}
                      index={script.index}
                      onDragOver={this.onDragOver}
                      onDragStart={this.onDragStart}
                    >
                      <WaitingScript
                        key={script.index}
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
                {this.state.finishedScriptList.map((script, index) => (
                  <FinishedScript
                    key={index}
                    state={script.state}
                    isCompact={this.state.isAvailableScriptListVisible}
                  />
                ))}
              </ScriptList>
            </div>
          </div>
        </div>
      </Panel>
    );
  }
}
