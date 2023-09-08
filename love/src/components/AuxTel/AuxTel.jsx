/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
import Panel from '../GeneralPurpose/Panel/Panel';
import styles from './AuxTel.module.css';
import Summary from './Summary/Summary';
import Skymap from './Skymap/Skymap';

export default class AuxTel extends Component {
  render() {
    return (
      <Panel title="Auxiliary Telescope" className={styles.panel} fit>
        <>
          <div className={styles.CSCSummaryContainer}>
            <Summary />
          </div>
          <div className={styles.skymapContainer}>
            <Skymap />
          </div>
        </>
      </Panel>
    );
  }
}
