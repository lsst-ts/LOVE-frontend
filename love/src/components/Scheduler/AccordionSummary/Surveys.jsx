import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';
import { count } from 'd3';

export default class Surveys extends Component {
  render() {
    const { 
      isOpen,
      surveysNumGenProps,
      surveysGenProps,
      surveysNumSeqProps,
      surveysSeqProps } = this.props;

    const generalProposals = surveysGenProps?.split(",");
    const timedProposals = surveysSeqProps?.split(",");

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
            <span>{surveysNumGenProps}</span>
          </div>
          <div className={styles.generalDiv}>
            {surveysNumGenProps ? 
              (generalProposals.map((gp) => (
                <div className={styles.surveysDivs}>{gp}</div>
              ))) :
              ('No data')
            }
          </div>
          <div className={styles.surveysTextsDiv}>
            <span className={styles.surveysTexts}>TimedProposals</span>
            <span>{surveysNumSeqProps}</span>
          </div>
          <div className={styles.generalDiv}>
            {surveysNumSeqProps ? 
              (timedProposals.map((tp) => (
                <div className={styles.surveysDivs}>{tp}</div>
              ))) :
              ('No data')
            }
          </div>
        </div>
      </div>
    );
  }
}
