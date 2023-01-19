import React, { Component } from 'react';
import styles from './Headers.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Row from '../../../GeneralPurpose/SummaryPanel/Row';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';

export default class Headers extends Component {

    render() {
        return (
            <div className={styles.container}>
                <SummaryPanel className={styles.summaryPanel}>
                    <Title>Scheduler</Title>
                    <Value>ENABLED</Value>

                    <Title>Obs. Mode</Title>
                    <Value>Automatic</Value>

                    <Title>Obs. Type</Title>
                    <Value>Scheduler Target of Opportunity</Value>
                    
                    <Label>Night #13</Label>-<Value>03:21:52 till</Value>  <Label>Sunrise</Label>
                </SummaryPanel>
            </div>
        );
    };
}
