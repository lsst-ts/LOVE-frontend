import React, { Component } from 'react';
import styles from './Moon.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../../GeneralPurpose/SummaryPanel/Title';

export default class Moon extends Component {

    render() {
        return (
            <div className={styles.container}>
                <SummaryPanel className={styles.summaryPanel}>
                    <div className={styles.div1}>
                        <Title wide className={styles.titles}>Moon</Title>
                        <span></span>
                    </div>
                    <div className={styles.divContainer}>
                        <div className={styles.div2}>
                            <Label>Altitude</Label>
                            <Value>8.9°</Value>
                            <Label>Azimuth</Label>
                            <Value>241.30°</Value>
                            <Label>Ra</Label>
                            <Value>14h 54m 34s</Value>
                            <Label>Dec</Label>
                            <Value>-18° 7' 43"</Value>
                            <Label>Distance</Label>
                            <Value>377.202 km</Value>
                        </div>
                        <div className={styles.div3}>
                            <span>Moon cartoon</span>
                        </div>
                    </div>
                </SummaryPanel>
            </div>
        );
    };
}