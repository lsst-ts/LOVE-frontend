import React, { Component } from 'react';
import WaitingScript from './WaitingScript/WaitingScript';
import ScriptList from './ScriptList/ScriptList';
import styles from './ScriptQueue.module.css';
import CurrentScript from './CurrentScript/CurrentScript';
import Panel from './../Panel/Panel';

export default class ScriptQueue extends Component {
  render() {
    return (
      <Panel title="A good title">
        <div className={styles.scriptQueueContainer}>
          <div className={styles.currentScriptWrapper}>
            <div className={styles.currentScriptContainer}>
              <span className={styles.currentScriptTitle}>CURRENT SCRIPT</span>
              <CurrentScript />
            </div>
          </div>
          <div className={styles.globalStateWrapper}>
            <div className={styles.globalStateContainer}>
              CSC
              STATE
            </div>
          </div>
          <div className={[styles.availableScriptList, styles.scriptList].join(' ')}>
            <ScriptList>
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
            </ScriptList>
          </div>
          <div className={[styles.waitingScriptList, styles.scriptList].join(' ')}>
            <span className={styles.listTitle}>WAITING SCRIPTS</span>
            <ScriptList>
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
            </ScriptList>
          </div>
          <div className={[styles.finishedScriptList, styles.scriptList].join(' ')}>
            <span className={styles.listTitle}>FINISHED SCRIPTS</span>
            <ScriptList>
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
              <WaitingScript />
            </ScriptList>
          </div>
        </div>
      </Panel>
    );
  }
}
