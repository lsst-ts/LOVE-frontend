/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import LastTarget from './LastTarget';
import NextTarget from './NextTarget';
import PredictedTarget from './PredictedTargets';
import Surveys from './Surveys';
import Blocks from './Blocks';

export default class AccordionSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenLast: false,
      isOpenNext: false,
      isOpenPredicted: false,
      isOpenSurveys: false,
      isOpenBlocks: false,
    };
  }

  toggleContentLast() {
    this.setState((prevState) => ({ isOpenLast: !prevState.isOpenLast }));
  }

  toggleContentNext() {
    this.setState((prevState) => ({ isOpenNext: !prevState.isOpenNext }));
  }

  toggleContentPredicted() {
    this.setState((prevState) => ({ isOpenPredicted: !prevState.isOpenPredicted }));
  }

  toggleContentSurveys() {
    this.setState((prevState) => ({ isOpenSurveys: !prevState.isOpenSurveys }));
  }

  toggleContentBlocks() {
    this.setState((prevState) => ({ isOpenBlocks: !prevState.isOpenBlocks }));
  }

  render() {
    const {
      requestSALCommand,
      salindex,
      currentRequestTime,
      lastTargetId,
      lastTargetRa,
      lastTargetDecl,
      lastTargetRotSkyPos,
      lastTargetMjd,
      lastTargetExpTime,
      lastTargetFilter,
      lastTargetNexp,
      lastTargetMoreInfo,
      nextTargetCurrentTime,
      nextTimeWaitTime,
      nextTargetRa,
      nextTargetDecl,
      nextTargetRotSkyPos,
      predTargetsNumTargets,
      predTargetsRa,
      predTargetsDecl,
      predTargetsRotSkyPos,
      predTargetsMjd,
      predTargetsExpTime,
      predTargetsInstrConfig,
      predTargetsNexp,
      surveysNumGenProps,
      surveysGenProps,
      surveysNumSeqProps,
      surveysSeqProps,
      blockInvId,
      blockInvStatus,
      blockId,
      blockStatusId,
      blockStatus,
      blockExecCompl,
      blockExecTotal,
      blockHash,
      blockDef,
    } = this.props;
    return (
      <div className={styles.container}>
        <LastTarget
          showContent={() => this.toggleContentLast()}
          isOpen={this.state.isOpenLast}
          currentRequestTime={currentRequestTime}
          lastTargetId={lastTargetId}
          lastTargetRa={lastTargetRa}
          lastTargetDecl={lastTargetDecl}
          lastTargetRotSkyPos={lastTargetRotSkyPos}
          lastTargetMjd={lastTargetMjd}
          lastTargetExpTime={lastTargetExpTime}
          lastTargetFilter={lastTargetFilter}
          lastTargetNexp={lastTargetNexp}
          lastTargetMoreInfo={lastTargetMoreInfo}
        />
        <NextTarget
          showContent={() => this.toggleContentNext()}
          isOpen={this.state.isOpenNext}
          nextTargetCurrentTime={nextTargetCurrentTime}
          nextTimeWaitTime={nextTimeWaitTime}
          nextTargetRa={nextTargetRa}
          nextTargetDecl={nextTargetDecl}
          nextTargetRotSkyPos={nextTargetRotSkyPos}
        />
        <PredictedTarget
          showContent={() => this.toggleContentPredicted()}
          isOpen={this.state.isOpenPredicted}
          predTargetsNumTargets={predTargetsNumTargets}
          predTargetsRa={predTargetsRa}
          predTargetsDecl={predTargetsDecl}
          predTargetsRotSkyPos={predTargetsRotSkyPos}
          predTargetsMjd={predTargetsMjd}
          predTargetsExpTime={predTargetsExpTime}
          predTargetsInstrConfig={predTargetsInstrConfig}
          predTargetsNexp={predTargetsNexp}
        />
        <Surveys
          showContent={() => this.toggleContentSurveys()}
          isOpen={this.state.isOpenSurveys}
          surveysNumGenProps={surveysNumGenProps}
          surveysGenProps={surveysGenProps}
          surveysNumSeqProps={surveysNumSeqProps}
          surveysSeqProps={surveysSeqProps}
        />
        <Blocks
          requestSALCommand={requestSALCommand}
          salindex={salindex}
          showContent={() => this.toggleContentBlocks()}
          isOpen={this.state.isOpenBlocks}
          blockInvId={blockInvId}
          blockInvStatus={blockInvStatus}
          blockId={blockId}
          blockStatusId={blockStatusId}
          blockStatus={blockStatus}
          blockExecCompl={blockExecCompl}
          blockExecTotal={blockExecTotal}
          blockHash={blockHash}
          blockDef={blockDef}
          predTargetsRa={predTargetsRa}
          predTargetsDecl={predTargetsDecl}
          predTargetsRotSkyPos={predTargetsRotSkyPos}
        />
      </div>
    );
  }
}
