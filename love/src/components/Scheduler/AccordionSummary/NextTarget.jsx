import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';

export default class NextTarget extends Component {
  render() {
    const { 
      isOpen,
      nextTargetCurrentTime,
      nextTimeWaitTime,
      nextTargetRa,
      nextTargetDecl,
      nextTargetRotSkyPos } = this.props;
    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <div className={styles.targetsTitle}>
            <h3 className={styles.title}>Next Target</h3>
            {/* <h6>calculated at {nextTargetCurrentTime}</h6> */}
          </div>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div
          className={isOpen ? [styles.openPanel, styles.panel].join(' ') : [styles.closePanel, styles.panel].join(' ')}
        >
          <SummaryPanel>
            <Label>Time on target</Label>
            <Value>{nextTimeWaitTime}</Value>
            <Label>Right ascension</Label>
            <Value>{nextTargetRa}</Value>
            <Label>Declination</Label>
            <Value>{nextTargetDecl}</Value>
            <Label>Sky rotation</Label>
            <Value>{nextTargetRotSkyPos}</Value>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
