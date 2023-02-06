import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
// import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
// import Label from 'components/GeneralPurpose/SummaryPanel/Label';
// import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';


export default class PredictedTarget extends Component {

    render() {
        const { isOpen } = this.props;
        const predictedTargets = [
            {
                name: 'Target 002 856gh',
                value: '0010/002s',
            },
            {
                name: 'Target 003 Tau-43',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                value: '0234/024s',
            },
        ];
        return (
            <div className={styles.container}>
                <div onClick={this.props.showContent} className={styles.header}>
                    <h3 className={styles.title}>Predicted Target</h3>
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
                    <div className={styles.predictedTargetsDiv}>
                        {predictedTargets.map(pt => 
                            <div>
                                <span className={styles.predTargets}>{pt.name}</span>
                                <span>{pt.value}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };
}