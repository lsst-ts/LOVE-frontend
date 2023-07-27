import React, { Component } from 'react';
import styles from './AccordionSummary.module.css';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import { fixedFloat } from 'Utils';
import Info from 'components/MainTel/M2/Actuators/Info/Info';

export default class Blocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBlockData: null,
    };
  }

  addBlockCommand(params) {
    const option = 'addBlock';
    const { requestSALCommand, salindex } = this.props;
    this.setState({ showOptions: params });
    requestSALCommand({
      cmd: `cmd_${option}`,
      csc: 'Scheduler',
      salindex,
      params,
    });
  }

  HEADERS_PREDTARGETS = [
    {
      field: 'id',
      title: 'ID',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : fixedFloat(value, 2)),
    },
    {
      field: 'ra',
      title: 'Ra',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : fixedFloat(value, 2)),
    },
    {
      field: 'decl',
      title: 'Decl',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : fixedFloat(value, 2)),
    },
    {
      field: 'rotSky',
      title: 'RotSkyPos',
      className: styles.columns,
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : fixedFloat(value, 2)),
    },
  ];

  handleRowClick = (event) => {
    const rowData = event.currentTarget.cells;
    const cellData = Array.from(rowData).map((cell) => cell.textContent);

    this.setState({ selectedBlockData: cellData });
  };

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
      blockDef,
      predTargetsRa,
      predTargetsDecl,
      predTargetsRotSkyPos,
    } = this.props;

    const { selectedBlockData } = this.state;

    const listBlocksId = blockInvId ? blockInvId.split(',') : [];
    const listBlocksStatus = blockInvStatus ? blockInvStatus.split(',') : [];

    const listOfBlocks = listBlocksId.map((id, i) => ({ id: id, status: listBlocksStatus[i] }));
    const predData = predTargetsRa.map((id, i) => ({
      id: id,
      ra: predTargetsRa[i],
      decl: predTargetsDecl[i],
      rotSky: predTargetsRotSkyPos[i],
    }));
    // console.log(predData);
    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <h3 className={styles.title}>Blocks</h3>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div className={[styles.panel, isOpen ? styles.openPanel : styles.closePanel].join(' ')}>
          <SummaryPanel className={styles.currentBlock}>
            <Label>{blockId ? blockId : 'No data'}</Label>
            <Value>{blockStatus ? blockStatus : 'No data'}</Value>
          </SummaryPanel>
          <div className={styles.executionsDiv}>
            <span className={styles.executionsText}>Executions</span>
            <span></span>
            <span className={styles.predTargets}>Succesfull</span>
            <span>{blockExecCompl}</span>
            <span className={styles.predTargets}>To be completed</span>
            <span>{blockExecTotal}</span>
          </div>
          {/* <div className={styles.blocksTargetsDiv}>
            <div className={styles.predictedTargetsDiv}>
              <SimpleTable headers={this.HEADERS_PREDTARGETS} data={predData} />
            </div>
          </div> */}
          {/* <div className={styles.divButtonBlocks}>
            <Button status="info">Add Block to Scheduler queue</Button>
            <span>{blockHash ? blockHash : 'No data'}</span>
          </div>
          <div className={styles.executionsDiv}>
            <span className={styles.executionsText}>List of blocks</span>
            <span></span>
          </div> */}
          <SummaryPanel className={styles.blocksPanel}>
            {listOfBlocks.length > 0
              ? listOfBlocks.map((b) => (
                  <div className={styles.predTargets}>
                    <Label>{b.id}</Label>
                    <Value>{b.status}</Value>
                  </div>
                ))
              : 'No data'}
          </SummaryPanel>
          <Button status="info">Add Block to Scheduler queue</Button>
        </div>
      </div>
    );
  }
}
