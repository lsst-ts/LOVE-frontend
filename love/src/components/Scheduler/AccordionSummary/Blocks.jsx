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
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import { schedulerBlocksStateToStyle } from 'Config';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';

export default class Blocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBlockId: null,
      isButtonDisabled: true,
      clickOverBlock: false,
    };

    this.handleRowClick = this.handleRowClick.bind(this);
  }

  handleRowClick = (value) => {
    this.setState({ selectedBlockId: value, clickOverBlock: true, isButtonDisabled: false });
  };

  addBlockCommand() {
    const { requestSALCommand, salindex } = this.props;
    const { selectedBlockId } = this.state;
    requestSALCommand({
      cmd: 'addBlock',
      csc: 'Scheduler',
      salindex,
      params: {
        id: selectedBlockId,
      },
    });

    this.setState({ isButtonDisabled: true, selectedBlockId: null, clickOverBlock: false });
  }

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

    const { selectedBlockId, clickOverBlock } = this.state;

    const listBlocksId = blockInvId ? blockInvId.split(',') : [];
    const listBlocksStatus = blockInvStatus ? blockInvStatus.split(',') : [];

    const listOfBlocks = listBlocksId.map((id, i) => ({ id: id, status: listBlocksStatus[i] }));

    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <h3 className={styles.title}>Blocks</h3>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div className={[styles.panel, isOpen ? styles.openPanel : styles.closePanel].join(' ')}>
          <SummaryPanel className={styles.currentBlock}>
            <Label>{blockId ? blockId : 'No data'}</Label>
            <Value>
              <StatusText status={schedulerBlocksStateToStyle[blockStatus]}>
                {blockStatus ? blockStatus : 'No data'}
              </StatusText>
            </Value>
          </SummaryPanel>
          <div className={styles.executionsDiv}>
            <span className={styles.executionsText}>Executions</span>
            <span></span>
            <span className={styles.predTargets}>Succesfull</span>
            <span>{blockExecCompl}</span>
            <span className={styles.predTargets}>To be completed</span>
            <span>{blockExecTotal}</span>
          </div>
          <SummaryPanel className={styles.blocksPanel}>
            {listOfBlocks.length > 0
              ? listOfBlocks.map((b, i) => (
                  <div className={styles.listOfBlocks} key={i}>
                    <div
                      onClick={() => this.handleRowClick(b.id)}
                      className={clickOverBlock && selectedBlockId === b.id ? styles.selected : styles.blocksLabel}
                    >
                      <Label>{b.id}</Label>
                    </div>
                    <Value>
                      <StatusText status={schedulerBlocksStateToStyle[b.status]}>{b.status}</StatusText>
                    </Value>
                  </div>
                ))
              : 'No data'}
          </SummaryPanel>
          <Button status="info" disabled={this.state.isButtonDisabled} onClick={() => this.addBlockCommand()}>
            Add Block to Scheduler queue
          </Button>
        </div>
      </div>
    );
  }
}
