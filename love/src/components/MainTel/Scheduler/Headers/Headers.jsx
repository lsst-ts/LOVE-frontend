import React, { Component } from 'react';
import styles from './Headers.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import GearIcon from 'components/icons/ScriptQueue/GearIcon/GearIcon.jsx';
import Sun from '../SkyElements/SunCartoon/SunCartoon';
import Stars from '../SkyElements/Stars/Stars';

export default class Headers extends Component {

    render() {
        const isNigth = true;
        return (
            <div className={styles.container}>
                <div className={styles.leftDivs}>
                    <div className={styles.headersLeft}>
                        <SummaryPanel className={styles.summaryPanel1}>
                            <Title>Summary State</Title>
                            <Value>ENABLED</Value>
                            <GearIcon className={styles.gearIcon}/>
                            <Value>RUNNING</Value>
                        </SummaryPanel>
                    </div>
                    <div className={styles.headersCenter}>
                        <SummaryPanel className={styles.summaryPanel2}>
                            <Label>Obs. Mode</Label>
                            <Value>Automatic</Value>
                            <Label>Obs. Type</Label>
                            <Value>Scheduler Target of Opportunity</Value>
                        </SummaryPanel>
                    </div>
                </div>
                <div>
                    {isNigth ? 
                     (<div className={styles.headersRigth}>
                        <div className={styles.icon}>
                            <Stars/>
                        </div>
                        <div>
                            Night #13
                            -
                            <span>03:21:52 till</span>
                            <span>Sunrise</span>
                        </div>
                    </div>
                    ) :
                    (<div>
                        <div>
                            <Sun className={styles.icon}/> 
                            Day
                        </div>-
                        <span>03:21:52 till</span>
                        <span>Sunset</span>
                    </div>)}
                </div>
            </div>
        );
    };
}
