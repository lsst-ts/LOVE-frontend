/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import LightPathContainer from './LightPath.container';
import SummaryPanelContainer from './SummaryPanel/SummaryPanel.container';
import styles from './Mount.module.css';
import MotorTableContainer from './MotorTable/MotorTable.container';

export default class Mount extends Component {
  render() {
    return (
      <div className={styles.container}>
        <LightPathContainer></LightPathContainer>
        <SummaryPanelContainer></SummaryPanelContainer>
        <MotorTableContainer></MotorTableContainer>
      </div>
    );
  }
}
