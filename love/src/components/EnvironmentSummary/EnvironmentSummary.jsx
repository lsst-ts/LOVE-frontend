import React, { Component } from 'react';
import Panel from '../GeneralPurpose/Panel/Panel';
import Skymap from './Skymap/Skymap';

export default class EnvironmentSummary extends Component {
  render() {
    return (
      <Panel title="Environment Summary" className={styles.panel} fit>
        <>
          <div className={styles.skymapContainer}>
            <Skymap />
          </div>
        </>
      </Panel>
    );
  }
}
