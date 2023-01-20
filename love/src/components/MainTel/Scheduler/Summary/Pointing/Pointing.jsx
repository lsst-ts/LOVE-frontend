import React, { Component } from 'react';
import styles from './Pointing.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../../GeneralPurpose/SummaryPanel/Title';

export default class SchedulerSummary extends Component {

    render() {
        return (
            <div className={styles.container}>
                <SummaryPanel className={styles.summaryPanel}>
                    <Title wide className={styles.titles}>Pointing</Title>
                    <Label>Ra</Label>
                    <Value>15" 32' 38s</Value>
                    
                    <Label>Dec</Label>
                    <Value>-20° 00' 15"</Value>

                    <Label>Sky pos</Label>
                    <Value>135.00°</Value>

                    <Label>Parallactic</Label>
                    <Value>62.00°</Value>
                </SummaryPanel>
            </div>
        );
    };
}