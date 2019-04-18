import React, { Component } from 'react';
import Panel from '../Panel/Panel';
import styles from './AuxTel.module.css';
import Summary from './Summary/Summary';

export default class AuxTel extends Component {
  render() {
    return (
      <Panel title="Auxiliary Telescope" className={styles.panel}>
        <div className={styles.CSCSummaryContainer}>
          <Summary />
        </div>
      </Panel>
    );
  }
}
