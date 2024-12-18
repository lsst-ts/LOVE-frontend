/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

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
      airmass,
      skyBrightness,
      cloud,
      seeing,
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
            <Value>{`${fixedFloat(currentSlewTime, 2)} s`}</Value>
            <Label>Offset arcsec (x,y)</Label>
            <Value>{offSet}</Value>
            <Label>skyBrightness</Label>
            <Value>{`${fixedFloat(skyBrightness, 2)}`}</Value>
            <Label>Cloud</Label>
            <Value>{`${fixedFloat(cloud, 2)}`}</Value>
            <Label>Airmass</Label>
            <Value>{`${fixedFloat(airmass, 2)}`}</Value>
            <Label>Seeing</Label>
            <Value>{`${fixedFloat(seeing, 2)} arcsec`}</Value>
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
                      <div key={i}>
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
                  ? currentProposalId.map((gp, k) => (
                      <div key={k} className={styles.surveysDivs}>
                        {gp}
                      </div>
                    ))
                  : 'No data'}
              </div>
            </div>
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
