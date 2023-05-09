import React, { Component } from 'react';
import styles from './CurrentTarget.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import { fixedFloat, formatSecondsToDigital } from 'Utils';

export default class CurrentTarget extends Component {
  render() {
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
      rotSkyPos,
    } = this.props;

    const offSet = `(${currentOffsetX}, ${currentOffsetY})`;

    return (
      <div className={styles.container}>
        <div className={styles.headers}>
          <h3 className={styles.currentTarget}>CurrentTarget - {currentTargetId}</h3>
          <span className={styles.spanRigth}>
            {currentSequenceVisits} of {currentSequenceNVisits} in current sequence
          </span>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.currentTargetDiv}>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Time on Target</Label>
            <Value>{formatSecondsToDigital(currentRequestTime)}</Value>
            <Label>Modified julian date</Label>
            <Value>{currentRequestMjd}</Value>
            <Label>Rigth ascension</Label>
            <Value>{`${fixedFloat(currentRa, 2)} °`}</Value>
            <Label>Declination</Label>
            <Value>{`${fixedFloat(currentDecl, 2)} °`}</Value>
            <Label>Sky position angle</Label>
            <Value>{`${fixedFloat(currentSkyAngle, 2)} °`}</Value>
            <Label>Slew time</Label>
            <Value>{`${currentSlewTime} s`}</Value>
            <Label>Offset arcsec (x,y)</Label>
            <Value>{offSet}</Value>
          </SummaryPanel>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Filter</Label>
            <Value>{currentFilter ? currentFilter : 'No data'}</Value>
            <Label>Seq. Duration</Label>
            <Value>{`${currentSequenceDuration} s`}</Value>
            <Label>No of exposures</Label>
            <Value>{`${fixedFloat(currentNumExposures, 0)}`}</Value>
            <Label>Exposures</Label>
            <span></span>
            <span></span>
            <div className={styles.proposals}>
              <div className={styles.exposures}>
                {currentExposureTimes.length > 0
                  ? currentExposureTimes.map((exp, i) => (
                      <div>
                        <div className={styles.expIndexes}>{i + 1}</div>
                        <div className={styles.exposuresDetail}>
                          {fixedFloat(exp, 0) == 0 ? `-` : `${fixedFloat(exp, 0)}s`}
                        </div>
                      </div>
                    ))
                  : 'No data'}
              </div>
            </div>
            <Label>Proposals</Label>
            <span></span>
            <div className={styles.proposals}>
              <div className={styles.generalDiv}>
                {currentProposalId.length > 0
                  ? currentProposalId.map((gp) => <div className={styles.surveysDivs}>{gp}</div>)
                  : 'No data'}
              </div>
            </div>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
