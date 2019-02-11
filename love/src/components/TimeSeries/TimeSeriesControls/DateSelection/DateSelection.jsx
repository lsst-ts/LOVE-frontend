import React, { Component } from 'react'
import Datetime from 'react-datetime'
import styles from './DateSelection.module.css'
import './react-datetime.css'

export default class DateSelection extends Component {
    render() {
        return (
            <div className={styles.datesContainer}>
                <div className={styles.fromDateContainer}>
                    <span className={styles.datetimeDescription}>From:</span>
                    <div className={styles.datetimeContainer}>
                        <Datetime onBlur={(momentDate) => console.log(momentDate, 'from')}></Datetime>
                    </div>
                </div>
                <div className={styles.toDateContainer}>
                    <span className={styles.datetimeDescription}>To:</span>
                    <div className={styles.datetimeContainer}>
                        <Datetime onBlur={(momentDate) => console.log(momentDate, 'to')}></Datetime>
                    </div>
                </div>
            </div>
        )
    }
}
