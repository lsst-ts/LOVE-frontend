import React, { Component } from 'react';
import WaitingScript from './Scripts/WaitingScript/WaitingScript';
import ScriptList from './Scripts/ScriptList/ScriptList';
import CurrentScript from './Scripts/CurrentScript/CurrentScript';
import AvailableScript from './Scripts/AvailableScript/AvailableScript';
import FinishedScript from './Scripts/FinishedScript/FinishedScript';
import styles from './ScriptQueue.module.css';
import Panel from './../Panel/Panel';
import StatusText from '../StatusText/StatusText';
import Button from '../Button/Button';

export default class ScriptQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // waitingScriptList: [1, 2, 3, 4, 5, 6],
      waitingScriptList: [1, 2],
      availableScriptList: [1, 2, 3, 4],
      finishedScriptList: [1, 2],
    };
  }

  render() {
    return (
      <Panel title="Script Queue">
        <div className={styles.scriptQueueContainer}>
          <div className={styles.currentScriptWrapper}>
            <div className={styles.currentScriptContainer}>
              <span className={styles.currentScriptTitle}>CURRENT SCRIPT</span>
              <CurrentScript />
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
          <div className={[styles.availableScriptList, styles.scriptList].join(' ')}>
            <ScriptList>
              {this.state.availableScriptList.map((script) => {
                return <AvailableScript key={script}/>;
              })}
            </ScriptList>
          </div>
          <div className={[styles.waitingScriptList, styles.scriptList].join(' ')}>
            <span className={styles.listTitle}>WAITING SCRIPTS ({this.state.waitingScriptList.length})</span>
            <ScriptList>
              {this.state.waitingScriptList.map((script) => {
                return <WaitingScript key={script}/>;
              })}
              <div className={styles.addScriptContainer}>
                <Button className={styles.addScriptButton} size={'large'}>+ Add script</Button>
              </div>
            </ScriptList>
          </div>
          <div className={[styles.finishedScriptList, styles.scriptList].join(' ')}>
            <span className={styles.listTitle}>FINISHED SCRIPTS ({this.state.finishedScriptList.length})</span>
            <ScriptList>
            {this.state.finishedScriptList.map((script) => {
                return <FinishedScript key={script}/>;
              })}
            </ScriptList>
          </div>
        </div>
      </Panel>
    );
  }
}
