import React, { Component } from 'react';
import Panel from '../GeneralPurpose/Panel/Panel';
import styles from './Watcher.module.css';
import AlarmsTableContainer from './AlarmsTable/AlarmsTable.container';

export default class Watcher extends Component {
  render() {
    this.test = null;
    return (
      <Panel title="Watcher" className={styles.panel}>
        <div className={styles.tabsWrapper}>
          <div className={styles.tabsRow}>
            <div className={[styles.tab, styles.selected].join(' ')}>
              UNMUTED ALARMS
            </div>
            <div className={styles.tab}>
              MUTED ALARMS
            </div>
          </div>
          <div className={styles.alarmsTableWrapper}>
            <AlarmsTableContainer/>
          </div>
        </div>
      </Panel>
    );
  }
}
