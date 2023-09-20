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
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';

export default class Surveys extends Component {
  render() {
    const { isOpen, surveysNumGenProps, surveysGenProps, surveysNumSeqProps, surveysSeqProps } = this.props;

    const generalProposals = surveysGenProps ? surveysGenProps.split(',') : [];
    const timedProposals = surveysSeqProps ? surveysSeqProps.split(',') : [];

    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <h3 className={styles.title}>Surveys</h3>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div className={[styles.panel, isOpen ? styles.openPanel : styles.closePanel].join(' ')}>
          <div className={styles.surveysTextsDiv}>
            <span className={styles.surveysTexts}>General Proposals</span>
            <span>{surveysNumGenProps}</span>
          </div>
          <div className={styles.generalDiv}>
            {surveysNumGenProps
              ? generalProposals.map((gp, k) => (
                  <div key={k} className={styles.surveysDivs}>
                    {gp}
                  </div>
                ))
              : 'No data'}
          </div>
          <div className={styles.surveysTextsDiv}>
            <span className={styles.surveysTexts}>TimedProposals</span>
            <span>{surveysNumSeqProps}</span>
          </div>
          <div className={styles.generalDiv}>
            {surveysNumSeqProps
              ? timedProposals.map((tp, k) => (
                  <div key={k} className={styles.surveysDivs}>
                    {tp}
                  </div>
                ))
              : 'No data'}
          </div>
        </div>
      </div>
    );
  }
}
