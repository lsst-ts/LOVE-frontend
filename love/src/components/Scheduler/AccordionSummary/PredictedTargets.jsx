import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';

export default class PredictedTarget extends Component {
  
  HEADERS_PREDTARGETS = [
    {
      field: 'id',
      title: 'ID',
      // className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(0)),
    },
    {
      field: 'ra',
      title: 'Ra',
      // className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(2)),
    },
    {
      field: 'decl',
      title: 'Decl',
      // className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(2)),
    },
    {
      field: 'rotSky',
      title: 'RotSkyPos',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(2)),
    },
  ];

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

    const predData = [];
    for (let i = 0; i < predTargetsRa.length; i++){
      const obj = {
        id: i+1,
        ra: predTargetsRa[i],
        decl: predTargetsDecl[i],
        rotSky: predTargetsRotSkyPos[i],
      };
      predData.push(obj);
    }

    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <div className={styles.targetsTitle}>
            <h3 className={styles.title}>Predicted Target</h3>
            <h5>{predTargetsNumTargets} targets predicted. Instruments: {predTargetsInstrConfig}</h5>
          </div>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div
          className={isOpen ? [styles.openPanel, styles.panel].join(' ') : [styles.closePanel, styles.panel].join(' ')}
        >
          <div className={styles.predictedTargetsDiv}>
            <SimpleTable headers={this.HEADERS_PREDTARGETS} data={predData} />
          </div>
        </div>
      </div>
    );
  }
}
