import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';

export default class PredictedTarget extends Component {
  render() {
    const { 
      isOpen,
      predTargetsNumTargets,
      predTargetsRa,
      predTargetsDecl,
      predTargetsRotSkyPos,
      predTargetsMjd,
      predTargetsExpTime,
      predTargetsInstrConfig,
      predTargetsNexp } = this.props;
    
    const predictedTargets = [
      {
        name: 'Target 002 856gh',
        value: '0010/002s',
      },
      {
        name: 'Target 003 Tau-43',
        value: '0234/024s',
      },
      {
        name: 'Target 003 Tau-43',
        value: '0234/024s',
      },
      {
        name: 'Target 003 Tau-43',
        value: '0234/024s',
      },
      {
        name: 'Target 003 Tau-43',
        value: '0234/024s',
      },
      {
        name: 'Target 003 Tau-43',
        value: '0234/024s',
      },
      {
        name: 'Target 003 Tau-43',
        value: '0234/024s',
      },
      {
        name: 'Target 003 Tau-43',
        value: '0234/024s',
      },
      {
        name: 'Target 003 Tau-43',
        value: '0234/024s',
      },
      {
        name: 'Target 003 Tau-43',
        value: '0234/024s',
      },
      {
        name: 'Target 003 Tau-43',
        value: '0234/024s',
      },
      {
        name: 'Target 003 Tau-43',
        value: '0234/024s',
      },
    ];

    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <div className={styles.targetsTitle}>
            <h3 className={styles.title}>Predicted Target</h3>
            <h6>{predTargetsNumTargets} targets predicted</h6>
          </div>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div
          className={isOpen ? [styles.openPanel, styles.panel].join(' ') : [styles.closePanel, styles.panel].join(' ')}
        >
          <div className={styles.predictedTargetsDiv}>
            {predictedTargets.map((pt) => (
              <div>
                <span className={styles.predTargets}>{pt.name}</span>
                <span>{pt.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
