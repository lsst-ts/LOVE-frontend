import React, { Component } from 'react';
import styles from './CurrentTarget.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import { style } from 'd3';

export default class CurrentTarget extends Component {

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.headers}>
                    <h3 className={styles.currentTarget}>CurrentTarget - *number_targer*</h3>
                    <span className={styles.spanRigth}>03 of 10 in current sequence</span>
                </div>
                <div className={styles.separator}></div>
                <div className={styles.currentTargetDiv}>
                    <SummaryPanel className={styles.summaryPanel}>
                        <Label>Time on Target</Label>
                        <Value>00:00:12</Value>
                        <Label>Modified julian date</Label>
                        <Value>59954</Value>
                        <Label>Rigth ascension</Label>
                        <Value>15" 32' 38s</Value>
                        <Label>Declination</Label>
                        <Value>-20° 00' 15"</Value>
                        <Label>Sky position angle</Label>
                        <Value>135.00°</Value>
                        <Label>Slew time</Label>
                        <Value>60s</Value>
                        <Label>Offset arcsec (x,y)</Label>
                        <Value>23,123</Value>
                    </SummaryPanel>
                    <SummaryPanel className={styles.summaryPanel}>
                        <Label>Filter</Label>
                        <Value>r</Value>
                        <Label>Seq. Duration</Label>
                        <Value>10 min</Value>
                        <Label>No of exposures</Label>
                        <Value>10</Value>
                        <Label>Exposure time</Label>
                        <Value>2s</Value>
                        <Label>Proposals</Label>
                        <span></span>
                    </SummaryPanel>
                </div>
            </div>
        );
    };
}
