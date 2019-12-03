import React, { Component } from 'react';
import MuteIcon from '../icons/MuteIcon/MuteIcon';
import Panel from '../GeneralPurpose/Panel/Panel';
import AlarmsTableContainer from './AlarmsTable/AlarmsTable.container';
import styles from './Watcher.module.css';

export default class Watcher extends Component {
  render() {
    this.test = null;
    return (
      <Panel title="Watcher" className={styles.panel}>

        <div className={styles.tabsWrapper}>
          <div className={styles.tabsRow}>
            <div className={[styles.tab, styles.selected].join(' ')}>
              <div className={styles.iconWrapper}>
                <MuteIcon unmuted/>
              </div>
              UNMUTED ALARMS
            </div>
            <div className={styles.tab}>
              <div className={styles.iconWrapper}>
                <MuteIcon/>
              </div>
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
