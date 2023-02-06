import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';


export default class NextTarget extends Component {

    render() {
        const { isOpen } = this.props;
        return (
            <div className={styles.container}>
                <div onClick={this.props.showContent} className={styles.header}>
                    <h3 className={styles.title}>Next Target</h3>
                    <div className={styles.icons}>
                        {!isOpen ?
                        <AddIcon /> :
                        <MinusIcon />}
                    </div>
                </div>
                <div style={{
                        height: isOpen ? "100%" : "0%", 
                        overflow: "hidden", 
                        transition: "height 0.7s ease",
                    }}>
                    <SummaryPanel>
                        <Label>Time on target</Label>
                        <Value>00:12:42</Value>
                        <Label>Right ascension</Label>
                        <Value>15h 32m 38s</Value>
                        <Label>Declination</Label>
                        <Value>-20° 00' 15"</Value>
                        <Label>Sky rotation</Label>
                        <Value>135.00°</Value>
                    </SummaryPanel>
                </div>
            </div>
        );
    };
}