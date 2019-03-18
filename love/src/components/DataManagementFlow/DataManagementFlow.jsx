import React, { Component } from 'react';
import Process from './Process';
import styles from './DataManagementFlow.module.css';

export default class DataManagementFlow extends Component {
  render = () => (
      <div className={styles.dataManagementFlow}>
        <Process className={styles.processWrapper} name="DAQ" />
        <Process className={styles.processWrapper} name="LOCALLY" />
        <Process className={styles.processWrapper} name="BASE FACILITY" />
        <Process className={styles.processWrapper} name="NCSA" />
        <Process className={styles.processWrapper} name="NCSA ARCHIVE" />
      </div>
  );
}
