import React, { Component } from 'react';
import styles from './CurrentTarget.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';

export default class CurrentTarget extends Component {
  render() {
    const proposals = [
      '63-EFD',
      '95ONES',
      'AB987',
      'DR-2345',
      'GP-0002',
      'GP-0167',
      'OC124',
      'TP0001',
      'Q24',
      'Z_DD01',
    ];
    const { 
      currentTargetId,
      currentRequestTime,
      currentRequestMjd,
      currentRa,
      currentDecl,
      currentSkyAngle,
      currentFilter,
      currentNumExposures,
      currentExposureTimes,
      currentSlewTime,
      currentOffsetX,
      currentOffsetY,
      currentNumProposals,
      currentProposalId,
      currentSequenceDuration,
      currentSequenceNVisits,
      currentSequenceVisits,
      rotSkyPos} = this.props;
      
    return (
      <div className={styles.container}>
        <div className={styles.headers}>
          <h3 className={styles.currentTarget}>CurrentTarget - {currentTargetId}</h3>
          <span className={styles.spanRigth}>{currentSequenceVisits} of {currentSequenceNVisits} in current sequence</span>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.currentTargetDiv}>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Time on Target</Label>
            <Value>{currentRequestTime}</Value>
            <Label>Modified julian date</Label>
            <Value>{currentRequestMjd}</Value>
            <Label>Rigth ascension</Label>
            <Value>{currentRa}</Value>
            <Label>Declination</Label>
            <Value>{currentDecl}</Value>
            <Label>Sky position angle</Label>
            <Value>{currentSkyAngle}</Value>
            <Label>Slew time</Label>
            <Value>{currentSlewTime}</Value>
            <Label>Offset arcsec (x,y)</Label>
            <Value>{(currentOffsetX, currentOffsetY)}</Value>
          </SummaryPanel>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Filter</Label>
            <Value>{currentFilter}</Value>
            <Label>Seq. Duration</Label>
            <Value>{currentSequenceDuration}</Value>
            <Label>No of exposures</Label>
            <Value>{currentNumExposures}</Value>
            <Label>Exposure time</Label>
            <Value>{currentExposureTimes}</Value>
            <Label>Proposals</Label>
            <span></span>
            <div className={styles.proposals}>
              <div className={styles.generalDiv}>
                {currentProposalId.map((gp) => (
                  <div className={styles.surveysDivs}>{gp}</div>
                ))}
              </div>
            </div>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
