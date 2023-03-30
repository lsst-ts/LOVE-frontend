import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';
import Button from 'components/GeneralPurpose/Button/Button';

export default class Blocks extends Component {
  render() {
    const { 
      isOpen,
      blockInvId,
      blockInvStatus,
      blockId,
      blockStatusId,
      blockStatus,
      blockExecCompl,
      blockExecTotal,
      blockHash,
      blockDef } = this.props;

    const listBlocksId = blockInvId?.split(",");
    const listBlocksStatus = blockInvStatus?.split(",");

    const listOfBlocks = [];
    for (let i = 0; i < listBlocksId.length; i++){
      const obj = {
        id: listBlocksId[i],
        status: listBlocksStatus[i],
      };
      listOfBlocks.push(obj);
    }

    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <h3 className={styles.title}>Blocks</h3>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div
          className={isOpen ? [styles.openPanel, styles.panel].join(' ') : [styles.closePanel, styles.panel].join(' ')}
        >
          <SummaryPanel className={styles.currentBlock}>
            <Label>{listOfBlocks[0].name}</Label>
            <Value>{listOfBlocks[0].status}</Value>
          </SummaryPanel>
          <div className={styles.executionsDiv}>
            <span className={styles.executionsText}>Executions</span>
            <span></span>
            <span className={styles.predTargets}>Succesfull</span>
            <span>24</span>
            <span className={styles.predTargets}>To be completed</span>
            <span>10</span>
          </div>
          <div className={styles.blocksTargetsDiv}>
            {/* {executions.map((pt) => (
              <div>
                <span className={styles.predTargets}>{pt.name}</span>
                <span>{pt.value}</span>
              </div>
            ))} */}
          </div>
          <div className={styles.divButtonBlocks}>
            <Button className={styles.buttonBlocks}>Add Block to Scheduler queue</Button>
            <span>{blockHash ? blockHash : 'No data'}</span>
          </div>
          <div className={styles.executionsDiv}>
            <span className={styles.executionsText}>List of blocks</span>
            <span></span>
          </div>
          <SummaryPanel className={styles.blocksPanel}>
            {listOfBlocks.length > 0 ?
              (listOfBlocks.map((b) => (
                <div className={styles.predTargets}>
                  <Label>{b.id}</Label>
                  <Value>{b.status}</Value>
                </div>
              ))) : 'No data'
            }
          </SummaryPanel>
        </div>
      </div>
    );
  }
}
