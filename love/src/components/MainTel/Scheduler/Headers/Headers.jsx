import React, { Component } from 'react';
import styles from './Headers.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import GearIcon from 'components/icons/ScriptQueue/GearIcon/GearIcon.jsx';

export default class Headers extends Component {

    render() {
        return (
            <div className={styles.container}>
                <SummaryPanel className={styles.summaryPanel}>
                    <div className={styles.headersLeft}>
                        <Label>Summary State</Label>
                        <Value>ENABLED</Value>
                        <GearIcon className={styles.gearIcon}/>
                        <Value>RUNNING</Value>
                    </div>
                    <div className={styles.headersCenter}>
                        <Label>Obs. Mode</Label>
                        <Value>Automatic</Value>
                        <Label>Obs. Type</Label>
                        <Value>Scheduler Target of Opportunity</Value>
                    </div>
                    <div className={styles.headersRigth}>
                        <Label>Night #13</Label>-<Value>03:21:52 till</Value>  <Label>Sunrise</Label>
                    </div>
                </SummaryPanel>
            </div>
        );
    };
}
