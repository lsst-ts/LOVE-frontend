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
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import { fixedFloat } from 'Utils';
import styles from './Pointing.module.css';

export default class Pointing extends Component {
  render() {
    const { pointingRa, pointingDecl, pointingPosAngle, pointingParallAngle } = this.props;
    return (
      <div className={styles.container}>
        <SummaryPanel className={styles.summaryPanel}>
          <Title wide className={styles.titles}>
            Pointing
          </Title>
          <Label>Ra</Label>
          <Value>{`${fixedFloat(pointingRa, 2)} °`}</Value>
          <Label>Dec</Label>
          <Value>{`${fixedFloat(pointingDecl, 2)} °`}</Value>
          <Label>Sky pos</Label>
          <Value>{`${fixedFloat(pointingPosAngle, 2)} °`}</Value>
          <Label>Parallactic</Label>
          <Value>{`${fixedFloat(pointingParallAngle, 2)} °`}</Value>
        </SummaryPanel>
      </div>
    );
  }
}
