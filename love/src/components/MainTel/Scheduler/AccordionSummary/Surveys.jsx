import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';
import { count } from 'd3';

export default class Surveys extends Component {
  render() {
    const generalProposals = [
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
    const timedProposals = [
      '429-FV',
      '766WF',
      '90.09.09',
      '975FG',
      'Abs-01',
      'DDW',
      'DDW2',
      'fav09',
      'HI-00',
      'LO-PQQ',
      'LO-X01',
      'W749-a',
      'WF',
    ];
    const { 
      isOpen,
      surveysNumGenProps,
      surveysGenProps,
      surveysNumSeqProps,
      surveysSeqProps } = this.props;
    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <h3 className={styles.title}>Surveys</h3>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div
          className={isOpen ? [styles.openPanel, styles.panel].join(' ') : [styles.closePanel, styles.panel].join(' ')}
        >
          <div className={styles.surveysTextsDiv}>
            <span className={styles.surveysTexts}>General Proposals</span>
            <span>{generalProposals.length}</span>
          </div>
          <div className={styles.generalDiv}>
            {generalProposals.map((gp) => (
              <div className={styles.surveysDivs}>{gp}</div>
            ))}
          </div>
          <div className={styles.surveysTextsDiv}>
            <span className={styles.surveysTexts}>TimedProposals</span>
            <span>{timedProposals.length}</span>
          </div>
          <div className={styles.generalDiv}>
            {timedProposals.map((tp) => (
              <div className={styles.surveysDivs}>{tp}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
