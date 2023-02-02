import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';

export default class LastTarget extends Component {

    render() {
        const { isOpen } = this.props;
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 onClick={this.props.showContent} className={styles.title}>Last Target</h3>
                    <div className={styles.separator}></div>
                    <div style={{height: isOpen ? "100%" : "0%", overflow: "hidden", transition: "height 2s ease-in-out"}}>
                       <SummaryPanel>
                        <Label>Time on target</Label>
                        <Value>00:00:12</Value>
                        <Label>MJD</Label>
                        <Value>59954</Value>
                        
                       </SummaryPanel>
                    </div>
                </div>
            </div>
        );
    };
}