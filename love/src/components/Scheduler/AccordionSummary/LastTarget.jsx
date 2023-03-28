import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';
import { fixedFloat } from 'Utils';

export default class LastTarget extends Component {
  render() {
    const { 
      isOpen,
      currentRequestTime,
      lastTargetId,
      lastTargetRa,
      lastTargetDecl,
      lastTargetRotSkyPos,
      lastTargetMjd,
      lastTargetExpTime,
      lastTargetFilter,
      lastTargetNexp,
      lastTargetMoreInfo
    } = this.props;
    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <h3 className={styles.title}>Last Target-{lastTargetId}</h3>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div
          className={isOpen ? [styles.openPanel, styles.panel].join(' ') : [styles.closePanel, styles.panel].join(' ')}
        >
          <SummaryPanel>
            <Label>Time on target</Label>
            <Value>{`${fixedFloat(currentRequestTime, 0)} s`}</Value>
            <Label>MJD</Label>
            <Value>{lastTargetMjd}</Value>
            <Label>Right ascension</Label>
            <Value>{`${fixedFloat(lastTargetRa, 2)} °`}</Value>
            <Label>Declination</Label>
            <Value>{`${fixedFloat(lastTargetDecl, 2)} °`}</Value>
            <Label>Sky rotation</Label>
            <Value>{`${fixedFloat(lastTargetRotSkyPos, 2)} °`}</Value>
          </SummaryPanel>
          <SummaryPanel>
            <Label>Filter</Label>
            <Value>{lastTargetFilter}</Value>
            <Label>N° of exposures</Label>
            <Value>{`${fixedFloat(lastTargetNexp, 0)}`}</Value>
            <Label>Exposure time</Label>
            <Value>{lastTargetExpTime}</Value>
          </SummaryPanel>
          <div className={styles.infoPanel}>
            <h4 className={styles.infoLabel}>Info</h4>
            <div className={styles.infoContent}>
              {lastTargetMoreInfo ? lastTargetMoreInfo : 'There is no additional information'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
