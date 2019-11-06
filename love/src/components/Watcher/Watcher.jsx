import React, { Component } from 'react';
import Panel from '../GeneralPurpose/Panel/Panel';
import styles from './Watcher.module.css';
import Alarm from './Alarm/Alarm';
import AlarmsTableContainer from './AlarmsTable/AlarmsTable.container';

export default class Watcher extends Component {
  render() {
    this.test = null;
    const alarms = [
      {
        severity: 1,
        maxSeverity: 3,
        name: 'test.ConfiguredSeverities.Rule1',
        reason: `Lorem Ipsum is simply dummy text of the printing and typesetting 
                  industry. Lorem Ipsum has been the industry's standard dummy text 
                  ever since the 1500s, when an unknown printer took a galley of type 
                  and scrambled it to make a type specimen book. It has survived not 
                  only five centuries, but also the leap into electronic typesetting, 
                  remaining essentially unchanged. It was popularised in the 1960s 
                  with the release of Letraset sheets containing Lorem Ipsum passages, 
                  and more recently with desktop publishing software like Aldus 
                  PageMaker including versions of Lorem Ipsum.`,
        timestampSeverityNewest: new Date().getTime(),
      },
      {
        severity: 2,
        maxSeverity: 2,
        name: 'test.ConfiguredSeverities.Rule2',
        reason: `Lorem Ipsum is simply dummy text of the printing and typesetting 
industry. Lorem Ipsum has been the industry's standard dummy text 
ever since the 1500s, when an unknown printer took a galley of type 
and scrambled it to make a type specimen book. It has survived not 
only five centuries, but also the leap into electronic typesetting, 
remaining essentially unchanged. It was popularised in the 1960s 
with the release of Letraset sheets containing Lorem Ipsum passages, 
and more recently with desktop publishing software like Aldus 
PageMaker including versions of Lorem Ipsum.`,
        timestampSeverityNewest: new Date().getTime(),
      },
    ];
    return (
      <Panel title="Auxiliary Telescope" className={styles.panel}>
        <>
          <Alarm severity={1} acknowledged snoozed />
          <Alarm severity={2} sevIncrease acknowledged />
          <Alarm severity={3} sevDecrease snoozed />
          <Alarm severity={4} />
          <AlarmsTableContainer></AlarmsTableContainer>
        </>
      </Panel>
    );
  }
}
