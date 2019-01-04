import React, { Component } from 'react'
import Process from './Process';
import styles from './DataManagementFlow.module.css'

export default class DataManagementFlow extends Component {
  render() {
    return (
      <div className={styles.dataManagementFlow}>
        <Process className={styles.processWrapper} name='DAQ'></Process>
        <Process className={styles.processWrapper} name='LOCALLY'></Process>
        <Process className={styles.processWrapper} name='BASE FACILITY'></Process>
        <Process className={styles.processWrapper} name='NCSA'></Process>
        <Process className={styles.processWrapper} name='NCSA ARCHIVE'></Process>
      </div>
    )
  }
}
