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
          <div className={styles.legend}>
            Ok, acknowledged &nbsp; &nbsp;
            <Alarm severity={1} acknowledged />

            Ok, unacknowledged &nbsp; &nbsp;
            <Alarm severity={1} />

            Warning, acknowledged
            <Alarm severity={2} acknowledged/>

            Warning, unacknowledged
            <Alarm severity={2} />

            Alert, acknowledged
             <Alarm severity={3} acknowledged />

            Alert, unacknowledged
             <Alarm severity={3} />

            Critical, acknowledged
            <Alarm severity={4} acknowledged/>

            Critical, unacknowledged
            <Alarm severity={4} />
          </div>

          <AlarmsTableContainer></AlarmsTableContainer>
        </>
      </Panel>
    );
  }
}
