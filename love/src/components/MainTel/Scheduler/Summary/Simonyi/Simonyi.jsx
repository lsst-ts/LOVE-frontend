import React, { Component } from 'react';
import styles from './Simonyi.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../../GeneralPurpose/SummaryPanel/Title';

export default class Simonyi extends Component {

    render() {
        return (
            <div className={styles.container}>
                <SummaryPanel className={styles.summaryPanel}>
                    <div className={styles.div1}>
                        <Title wide className={styles.titles}>Simonyi</Title>
                        <Value>TRACKING</Value>
                    </div>
                    <div className={styles.divContainer}>
                        <div className={styles.div2}>
                            <Title>Mount</Title>
                            <Label>Altitude</Label>
                            <Value>45.00°</Value>
                            <Label>Azimuth</Label>
                            <Value>273.00°</Value>
                            <Label>Rotator</Label>
                            <Value>64.91°</Value>
                        </div>
                        <div className={styles.div3}>
                            <Title>Dome</Title>
                            <Label>Altitude</Label>
                            <Value>45.00°</Value>
                            <Label>Azimuth</Label>
                            <Value>273.00°</Value>
                        </div>
                    </div>
                </SummaryPanel>
            </div>
        );
    };
}