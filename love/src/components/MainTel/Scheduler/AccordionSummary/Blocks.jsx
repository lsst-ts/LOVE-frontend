import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';


export default class Blocks extends Component {

    render() {
        const { isOpen } = this.props;
        const executions = [
            {
                name: 'Target 002 856gh',
                id: '0.104',
                description: 'lorem ipsum',
                value: '0010/002s',
            },
            {
                name: 'Target 003 Tau-43',
                id: '0.104',
                description: 'lorem ipsum',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                id: '0.104',
                description: 'lorem ipsum',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                id: '0.104',
                description: 'lorem ipsum',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                id: '0.104',
                description: 'lorem ipsum',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                id: '0.104',
                description: 'lorem ipsum',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                id: '0.104',
                description: 'lorem ipsum',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                id: '0.104',
                description: 'lorem ipsum',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                id: '0.104',
                description: 'lorem ipsum',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                id: '0.104',
                description: 'lorem ipsum',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                id: '0.104',
                description: 'lorem ipsum',
                value: '0234/024s',
            },
            {
                name: 'Target 003 Tau-43',
                id: '0.104',
                description: 'lorem ipsum',
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
                    <SummaryPanel>
                        <Label>block</Label>
                        <Value>in progress</Value>
                    </SummaryPanel>
                    <div className={styles.predictedTargetsDiv}>
                        <h4>Executions</h4>
                        <span className={styles.predTargets}>Succesfull</span>
                        <span>24</span>
                        <span className={styles.predTargets}>To be completed</span>
                        <span>10</span>
                        {executions.map(pt => 
                            <div>
                                <span className={styles.predTargets}>{pt.name}</span>
                                <span>{pt.value}</span>
                            </div>
                        )}
                    </div>
                    <h4>List of blocks</h4>
                    <SummaryPanel>
                        
                    </SummaryPanel>
                </div>
            </div>
        );
    };
}