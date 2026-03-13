/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { Component } from 'react';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import AddIcon from 'components/icons/AddIcon/AddIcon';
import MinusIcon from 'components/icons/MinusIcon/MinusIcon';
import { fixedFloat } from 'Utils';
import styles from './AccordionSummary.module.css';

export default class LastTarget extends Component {
  render() {
    const {
      isOpen,
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
    } = this.props;
    return (
      <div className={styles.container}>
        <div onClick={this.props.showContent} className={styles.header}>
          <h3 className={styles.title}>Last Target-{lastTargetId}</h3>
          <div className={styles.icons}>{!isOpen ? <AddIcon /> : <MinusIcon />}</div>
        </div>
        <div className={[styles.panel, isOpen ? styles.openPanel : styles.closePanel].join(' ')}>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Time on target</Label>
            <Value>{`${fixedFloat(currentRequestTime, 0)} s`}</Value>
            <Label>MJD</Label>
            <Value>{lastTargetMjd}</Value>
            <Label>Right ascension</Label>
            <Value>{`${fixedFloat(lastTargetRa, 2)} °`}</Value>
            <Label>Declination</Label>
            <Value>{`${fixedFloat(lastTargetDecl, 2)} °`}</Value>
            <Label>Sky rotation</Label>
            <Value>{`${fixedFloat(lastTargetRotSkyPos, 2)} °`}</Value>
          </SummaryPanel>
          <SummaryPanel className={styles.summaryPanel}>
            <Label>Filter</Label>
            <Value>{lastTargetFilter}</Value>
            <Label>N° of exposures</Label>
            <Value>{`${fixedFloat(lastTargetNexp, 0)}`}</Value>
            <Label>Exposure time</Label>
            <Value>{lastTargetExpTime}</Value>
          </SummaryPanel>
          <div className={styles.infoPanel}>
            <h4 className={styles.infoLabel}>Info</h4>
            <div className={styles.infoContent}>
              {lastTargetMoreInfo ? lastTargetMoreInfo : 'There is no additional information'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
