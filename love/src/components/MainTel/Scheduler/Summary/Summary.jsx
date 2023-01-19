import React, { Component } from 'react';
import styles from './Summary.module.css';

export default class SchedulerSummary extends Component {

    render() {
        return (
            <div className={styles.container}>
                <h2>Summary component</h2>
                <span>Lorem ipsium</span>
            </div>
        );
    };
}