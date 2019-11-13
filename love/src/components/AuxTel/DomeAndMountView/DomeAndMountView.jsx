import React, { Component } from 'react';
import DomeContainer from '../Dome/Dome.container';
import Panel from '../../GeneralPurpose/Panel/Panel';
import Mount from '../Mount/Mount'
import styles from './DomeAndMountView.module.css';

export default class DomeAndMountView extends Component {
  render() {
    return (
      <div className={styles.mainGrid}>
        <div className={styles.statusGrid}>
          {/* <Panel title="Status" className={styles.panel}>
            <div className={styles.statusContainer}>
              <LabeledStatusTextContainer
                label={'Azimuth state'}
                groupName="event-ATDome-azimuthState"
                accessor={(event) => event.state.value}
                stateToLabelMap={{ 0: 'STOPPED', 1: 'MOVINGCW', 2: 'MOVINGCCW' }}
                stateToStyleMap={{ 0: 'ok', 1: 'running', 2: 'running' }}
              />
              <LabeledStatusTextContainer
                label={'Azimuth state'}
                groupName="event-ATMCS-atMountState"
                accessor={(event) => event.state.value}
                stateToLabelMap={{ 0: 'TRACK_DISABLED', 1: 'TRACK_ENABLED', 2: 'STOPPING' }}
                stateToStyleMap={{ 0: 'ok', 1: 'running', 2: 'running' }}
              />
            </div>
          </Panel> */}
        </div>
        <div className={styles.domeGrid}>
          <Panel title="Dome and Mount view" className={styles.panel}>
            <div className={styles.domeContainer}>
              <DomeContainer width={400} height={400}/>
            </div>
          </Panel>
        </div>
        <div className={styles.mountGrid}>
          <Panel title="Mount detailed view" className={styles.panel}>
            <div className={styles.mountContainerWrapper}>
            <div className={styles.mountContainer}>
              <Mount />
              </div>
            </div>
          </Panel>
        </div>
      </div>
    );
  }
}
