import React, { Component } from 'react';
import Panel from '../GeneralPurpose/Panel/Panel';
import styles from './Watcher.module.css';
import Alarm from './Alarm/Alarm';

export default class Watcher extends Component {
  render() {
    return (
      <Panel title="Auxiliary Telescope" className={styles.panel}>
        <>
          <Alarm severity="ok" ack snoozed/>
          <Alarm severity="warning" ack/>
          <Alarm severity="serious" snoozed/>
          <Alarm severity="critical" />
        </>
      </Panel>
    );
  }
}
