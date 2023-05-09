import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';
import { fixedFloat, isoTimestamp, formatSecondsToDigital } from 'Utils';

export default class NextTarget extends Component {
  render() {
    const {
      isOpen,
      nextTargetCurrentTime,
      nextTimeWaitTime,
      nextTargetRa,
      nextTargetDecl,
      nextTargetRotSkyPos,
    } = this.props;
    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <div className={styles.targetsTitle}>
            <h3 className={styles.title}>Next Target</h3>
            <h5>calculated at {isoTimestamp(nextTargetCurrentTime)}</h5>
          </div>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div
          className={isOpen ? [styles.openPanel, styles.panel].join(' ') : [styles.closePanel, styles.panel].join(' ')}
        >
          <SummaryPanel>
            <Label>Time on target</Label>
            <Value>{`${formatSecondsToDigital(fixedFloat(nextTimeWaitTime, 0))} s`}</Value>
            <Label>Right ascension</Label>
            <Value>{`${fixedFloat(nextTargetRa, 2)} °`}</Value>
            <Label>Declination</Label>
            <Value>{`${fixedFloat(nextTargetDecl, 2)} °`}</Value>
            <Label>Sky rotation</Label>
            <Value>{`${fixedFloat(nextTargetRotSkyPos, 2)} °`}</Value>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
