import React, { Component } from 'react';
import MuteIcon from '../icons/MuteIcon/MuteIcon';
import Panel from '../GeneralPurpose/Panel/Panel';
import AlarmsTableContainer from './AlarmsTable/AlarmsTable.container';
import styles from './Watcher.module.css';

export default class Watcher extends Component {

  constructor() {
    super();
    this.state = {
      selectedTab: 'unmuted',
    };
  }

  changeTab(tab) {
    this.setState({selectedTab: tab});
  }

  render() {
    this.test = null;
    return (
      <Panel title="Watcher" className={styles.panel}>

        <div className={styles.tabsWrapper}>
          <div className={styles.tabsRow}>

            <div
              className={[styles.tab, this.state.selectedTab === "unmuted" ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('unmuted')}
            >
              <div className={styles.iconWrapper}>
                <MuteIcon unmuted style={this.state.selectedTab === "unmuted" ? styles.selectedIcon : ''}/>
              </div>
              UNMUTED ALARMS
            </div>

            <div
              className={[styles.tab, this.state.selectedTab === "muted" ? styles.selected : ''].join(' ')}
              onClick={() => this.changeTab('muted')}
            >
              <div className={styles.iconWrapper}>
                <MuteIcon style={this.state.selectedTab === "muted" ? styles.selectedIcon : ''}/>
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
